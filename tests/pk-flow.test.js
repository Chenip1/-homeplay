const { test } = require('node:test')
const assert = require('node:assert/strict')
const Module = require('node:module')

// Exercise the cloud function with its database boundary replaced in memory.
const tables = new Map()
const copy = value => structuredClone(value)
let actor
let next = 0
function match(data, predicate) {
  return typeof predicate === 'function' ? predicate(data) : Object.entries(predicate).every(([k,v]) => typeof v === 'function' ? v(data[k]) : v === data[k])
}
const db = {
  command:{
    in:list=>v=>list.includes(v), neq:expected=>v=>v!==expected, gt:n=>v=>v>n,
    and:list=>v=>list.every(p=>match(v,p)), or:list=>v=>list.some(p=>match(v,p))
  },
  collection(name) {
    if (!tables.has(name)) tables.set(name,new Map())
    const table=tables.get(name)
    return {
      doc:id=>({
        async get(){return {data:copy(table.get(id))}},
        async set({data}){table.set(id,copy({...data,_id:id}))}
      }),
      async add({data}) {
        const _id='room_'+ ++next
        table.set(_id,copy({...data,_id}))
        return {_id}
      },
      where(predicate){
        let sorted, limit=100
        return {
          orderBy(key){sorted=key;return this},
          limit(n){limit=n;return this},
          async get(){
            const rows=[...table.values()].filter(row=>match(row,predicate))
            if(sorted) rows.sort((a,b)=>b[sorted]-a[sorted])
            return {data:copy(rows.slice(0,limit))}
          }
        }
      }
    }
  },
  async runTransaction(fn){return fn(db)}
}
const original=Module._load
Module._load=function(name,...args){
  if(name==='wx-server-sdk')return {init(){},database:()=>db,getWXContext:()=>({OPENID:actor})}
  return original.call(this,name,...args)
}
const {main}=require('../cloudfunctions/petPk')
Module._load=original
async function request(user,action,data={}){actor=user;return main({action,...data})}
async function ok(user,action,fields){
  const r=await request(user,action,fields)
  assert.equal(r.ok,true,r.message)
  return r.data
}
test('只访问公开在线小窝，三人都同意才开局，拒绝未授权查看及落子',async()=>{
  for(const [name,open] of [['甲',true],['乙',true],['丙',true],['丁',false]]) await ok(name,'presence',{name,open,pet:'比熊'})
  const lobby=await ok('甲','lobby')
  assert.deepEqual(lobby.nests.map(n=>n.name).sort(),['丙','乙'])
  const guests=lobby.nests.map(n=>n.key)
  await ok('甲','visit',{target:guests[0]})
  assert.equal((await request('甲','invite',{mode:'cards',targets:guests.slice(0,1)})).ok,false)
  const room=await ok('甲','invite',{mode:'cards',targets:guests})
  const fields={id:room.id}
  assert.equal((await request('丁','room',fields)).ok,false)
  assert.equal((await request('甲','move',{...fields,kind:'bid',value:3})).ok,false)
  assert.equal((await ok('乙','lobby')).rooms[0].id,room.id)
  assert.equal((await ok('乙','respond',{...fields,accept:true})).status,'waiting')
  assert.equal((await ok('丙','respond',{...fields,accept:true})).status,'playing')
  const loaded=await ok('甲','room',fields)
  assert.equal((await request('甲','move',{...fields,kind:'bid',value:3,version:0})).ok,false)
  const result=await ok('甲','move',{...fields,kind:'bid',value:3,version:loaded.version})
  assert.equal(result.game.hand.length,20)
  assert.equal((await ok('丙','room',fields)).game.hand.length,17)
  const other=await ok('甲','invite',{mode:'quiz',targets:[guests[0]]})
  const guest=lobby.nests[0].name
  assert.equal((await ok(guest,'respond',{id:other.id,accept:false})).status,'declined')
  await ok(guest,'presence',{open:true,offline:true})
  assert.equal((await request('甲','visit',{target:guests[0]})).ok,false)
})

