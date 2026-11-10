const { test } = require('node:test')
const assert = require('node:assert/strict')
const link = require('../miniprogram/utils/link')
const rules = require('../cloudfunctions/petPk/rules')
const quiz = require('../cloudfunctions/petPk/quiz')
const players = n => Array.from({length:n},(_,i)=>({name:'玩家'+i}))
const start = mode => {
  const room = {mode,map:0,players:players(rules.MODES[mode].size)}
  rules.start(room, 1000)
  return room
}
test('连连看支持外圈，拒绝被包围的配对，重排后可清空',()=>{
  const board = Array(36).fill('X')
  board[0]=board[5]='A'
  board[14]=board[22]='B'
  assert.equal(link.connects(board,0,5),true)
  assert.equal(link.connects(board,14,22),false)
  for (let k = 0; k < 12; k++) {
    let tiles = link.create()
    for(let n=0;n<18;n++){
      let [a,b]=link.hint(tiles)
      if(a===undefined){tiles=link.shuffle(tiles);[a,b]=link.hint(tiles)}
      assert.equal(link.connects(tiles,a,b),true)
      tiles[a]=tiles[b]=''
    }
    assert.equal(tiles.some(Boolean),false)
  }
})
test('五子棋检查轮次、重复落子和胜负',()=>{
  const r=start('gomoku')
  assert.throws(()=>rules.move(r,1,{value:0},2000),/还没轮到/)
  for(let i=0;i<4;i++) {
    rules.move(r,0,{value:i},2000)
    assert.throws(()=>rules.move(r,1,{value:i},2000),/空位/)
    rules.move(r,1,{value:i+15},2000)
  }
  rules.move(r,0,{value:4},2000)
  assert.equal(r.game.winner,0)
  assert.equal(r.status,'done')
})
test('PK 答题不暴露答案、禁止重复作答，先比正确率再比速度',()=>{
  const r=start('quiz')
  assert.equal(rules.publicGame(r,0).question.options.length,3)
  assert.deepEqual(Object.keys(rules.publicGame(r,0).question).sort(),['options','text'])
  const answers=r.game.questions.map(i=>quiz[i][2])
  rules.move(r,0,{question:0,value:answers[0]},2000)
  assert.throws(()=>rules.move(r,0,{question:0,value:answers[0]},2100),/已作答/)
  for(let i=1;i<5;i++) rules.move(r,0,{question:i,value:answers[i]},2000+i)
  for(let i=0;i<5;i++) rules.move(r,1,{question:i,value:answers[i]},3000+i)
  assert.equal(r.game.winner,0)
  const expired=start('quiz')
  assert.equal(rules.finishQuiz(expired,92000),true)
  assert.equal(expired.game.winner,-1)
})
test('三张地图可以完赛，服务器阻止提前出发及穿墙',()=>{
  for(let m=0;m<rules.maps.length;m++){
    const r=start('race');r.map=m
    assert.throws(()=>rules.move(r,0,{value:3},2000),/发令/)
    const grid=rules.maps[m].grid, dirs=[[0,-1],[-1,0],[0,1],[1,0]]
    const q=[[0,0,[]]], seen=new Set(['0,0'])
    for(let i=0;i<q.length;i++){
      const [x,y,path]=q[i]
      if(grid[y][x]==='F'){
        path.forEach((value,i)=>rules.move(r,0,{value},4100+200*i))
        break
      }
      dirs.forEach(([dx,dy],d)=>{
        const a=x+dx,b=y+dy,key=a+','+b
        if(grid[b]?.[a] && grid[b][a]!=='#' && !seen.has(key)){seen.add(key);q.push([a,b,[...path,d]])}
      })
    }
    assert.equal(r.game.winner,0)
  }
  const r=start('race')
  rules.move(r,0,{value:3},4200)
  rules.move(r,0,{value:2},4500)
  assert.deepEqual([r.game.positions[0].x,r.game.positions[0].y],[1,0])
})
test('斗地主不暴露底牌与对手手牌，验证叫分、过牌和胜负',()=>{
  const r=start('cards')
  assert.deepEqual(rules.publicGame(r,0).bottom,[])
  assert.equal(rules.publicGame(r,0).hand.length,17)
  assert.equal(rules.publicGame(r,0).hands,undefined)
  rules.move(r,0,{kind:'bid',value:3},2000)
  assert.equal(r.game.hands[0].length,20)
  assert.throws(()=>rules.move(r,0,{kind:'pass'},2000),/必须先出牌/)
  const hand=r.game.hands[0]
  rules.move(r,0,{kind:'play',value:[hand[0]]},2000)
  rules.move(r,1,{kind:'pass'},2000)
  rules.move(r,2,{kind:'pass'},2000)
  assert.equal(r.game.last,null)
  assert.equal(r.game.turn,0)
  assert.equal(rules.beats(rules.cardCombo([52,53]),rules.cardCombo([0,1,2,3])),true)
  assert.equal(rules.cardCombo([0,4,8,12,16]).type,'straight')
  assert.equal(rules.cardCombo([0,1,2,4,5,6,8,12]).type,'plane-one')
})
test('麻将自摸手牌、摸打轮次及牌墙保持私有',()=>{
  const r=start('mahjong')
  assert.deepEqual(rules.publicGame(r,0).counts,[14,13,13,13])
  assert.equal(rules.publicGame(r,0).wall,undefined)
  rules.move(r,0,{kind:'discard',value:r.game.hands[0][0]},2000)
  assert.deepEqual(rules.publicGame(r,1).counts,[13,14,13,13])
  const winning=[0,4,8,12,16,20,24,28,32,108,109,110,112,113]
  assert.equal(rules.mahjongWin(winning),true)
  assert.equal(rules.mahjongWin([...winning.slice(0,-1),124]),false)
  r.game.hands[1]=winning
  rules.move(r,1,{kind:'hu'},2000)
  assert.equal(r.game.winner,1)
})
test('旧存档可迁移，已领养的宠物可以免积分切回',()=>{
  let stored, modal
  global.wx={
    getStorageSync:()=>stored,
    setStorageSync:(_,s)=>{stored=s},
    showToast:()=>{},
    showModal:options=>{modal=options}
  }
  global.Page=opts=>{global.petPage={...opts,setData(values){Object.assign(this.data,values)}}}
  const store=require('../miniprogram/utils/store')
  const initial=store.getState()
  delete initial.ownedPets; delete initial.petHistory
  initial.user.score=1500
  stored=initial
  require('../miniprogram/pages/pet/pet')
  const page=global.petPage
  page.onLoad();page.onShow()
  function selectBreed(id, confirm) {
    page.selectBreed({currentTarget:{dataset:{breedid:id}}})
    modal.success({confirm})
    modal.complete()
  }
  selectBreed('dog_bichon',false)
  assert.match(modal.content,/600 积分/)
  assert.equal(store.getState().user.score,1500)
  assert.equal(store.getState().pet.breedId,'dog_tianyuan')
  selectBreed('dog_bichon',true)
  assert.equal(store.getState().user.score,900)
  page.pickBreed({detail:{value:'1'}})
  assert.match(modal.content,/中华田园犬/)
  modal.success({confirm:true})
  modal.complete()
  selectBreed('dog_bichon',true)
  assert.match(modal.content,/免费/)
  const final=store.getState()
  assert.equal(final.user.score,900)
  assert.deepEqual(Object.keys(final.ownedPets).sort(),['dog_bichon','dog_tianyuan'])
  assert.deepEqual(final.petHistory.map(p=>p.action),['切换','切换','领养'])
})

