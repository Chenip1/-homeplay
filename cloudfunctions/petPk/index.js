const cloud = require('wx-server-sdk')
const { createHash } = require('crypto')
const rules = require('./rules')
cloud.init({env: cloud.DYNAMIC_CURRENT_ENV})
const db = cloud.database(), _ = db.command
const NESTS = 'pet_pk_nests', ROOMS = 'pet_pk_rooms'
const ONLINE = 45000, INVITE = 180000, ACTIVE = 7200000
const text = (v, max) => typeof v === 'string' ? v.trim().slice(0,max) : ''
const id = v => typeof v === 'string' && /^[a-f0-9]{32}$/.test(v)
const roomId = v => typeof v === 'string' && /^[a-zA-Z0-9_-]{1,64}$/.test(v)
const { insist } = rules
const member = me => _.or([0,1,2,3].map(i => ({['p'+i]:me})))
function publicNest(n) {
  return { key:n._id, name:n.name, pet:n.pet, province:n.province, city:n.city }
}
async function findNests(keys, now) {
  if (!keys.length) return []
  const res = await db.collection(NESTS).where({ _id:_.in(keys), open:true, seen:_.gt(now - ONLINE) }).get()
  return res.data
}
function view(room, me, now) {
  const seat = room.players.findIndex(p => p.key === me)
  insist(seat >= 0, '你不在这场 PK 中')
  const status = room.status === 'waiting' && room.updated < now - INVITE ? 'expired' :
    room.status === 'playing' && room.updated < now - ACTIVE ? 'expired' : room.status
  return { id:room._id, mode:room.mode, modeName:rules.MODES[room.mode].name, mapName:rules.maps[room.map]?.name || '',
    maps:rules.maps.map(m => m.name), seat, now, status, version:room.version,
    players:room.players.map(({name,accepted,pet})=>({name,accepted,pet})),
    game:rules.publicGame(room,seat) }
}
async function change(event, me, action) {
  insist(roomId(event.id), '房间不存在')
  if (action === 'room') {
    const {data:room} = await db.collection(ROOMS).doc(event.id).get()
    const now = Date.now(), current = view(room, me, now)
    if (current.status !== 'playing' || room.mode !== 'quiz' || now < room.game.deadline) return current
  }
  return db.runTransaction(async tx => {
    const ref = tx.collection(ROOMS).doc(event.id)
    const { data:room } = await ref.get()
    const now = Date.now()
    const before = view(room, me, now)
    let dirty = false
    if (action === 'room') dirty = before.status === 'playing' && rules.finishQuiz(room, now)
    if (action === 'respond') {
      insist(before.status === 'waiting' && before.seat !== 0 && !room.players[before.seat].accepted, '邀请已处理或已过期')
      insist(typeof event.accept === 'boolean', '请选择是否接受')
      if (!event.accept) room.status = 'declined'
      else {
        room.players[before.seat].accepted = true
        if (room.players.every(p => p.accepted) && room.mode !== 'race') rules.start(room, now)
      }
      dirty = true
    }
    if (action === 'setup') {
      insist(before.status === 'waiting' && room.mode === 'race' && room.players[before.seat].accepted, '请先同意参赛')
      if (before.seat === 0 && Number.isInteger(event.map) && rules.maps[event.map]) room.map = event.map
      const pet = text(event.pet, 16)
      if (pet) room.players[before.seat].pet = pet
      if (event.start === true) {
        insist(before.seat === 0 && room.players.every(p => p.accepted && p.pet), '所有玩家选好萌宠后才能开始')
        rules.start(room, now)
      }
      dirty = true
    }
    if (action === 'cancel') {
      insist(before.status === 'waiting' && (before.seat === 0 || room.players[before.seat].accepted), '邀请已结束')
      room.status = 'cancelled'
      dirty = true
    }
    if (action === 'move') {
      insist(before.status === 'playing', '对局已结束或已过期')
      if (room.mode !== 'quiz' && room.mode !== 'race' && event.kind !== 'leave') insist(event.version === room.version, '棋局已更新，请重试')
      rules.move(room, before.seat, event, now)
      dirty = true
    }
    if (dirty) {
      room.updated = now
      room.version++
      const {_id, ...data} = room
      await ref.set({ data })
    }
    return view(room, me, now)
  })
}
async function handle(event, me) {
  const now = Date.now()
  const nests = db.collection(NESTS)
  const rooms = db.collection(ROOMS)
  switch (event.action) {
    case 'presence': {
      const name = text(event.name,16) || '宠物玩家'
      const province = text(event.region?.province,20)
      const city = text(event.region?.city,20)
      await nests.doc(me).set({data:{name, province, city, pet:text(event.pet,16) || '萌宠', open:event.open === true, seen:event.offline === true ? 0 : now}})
      if (event.open !== true || event.offline === true) return 0
      const invitations = await rooms.where(_.and([member(me),{status:'waiting',updated:_.gt(now-INVITE)}])).limit(30).get()
      return invitations.data.filter(r => r.players.some(p => p.key === me && !p.accepted)).length
    }
    case 'lobby': {
      const [players, invitations] = await Promise.all([
        nests.where({_id:_.neq(me),open:true,seen:_.gt(now-ONLINE)}).orderBy('seen','desc').limit(60).get(),
        rooms.where(_.and([
          member(me),
          {updated:_.gt(now-ACTIVE),status:_.in(['waiting','playing'])}
        ])).orderBy('updated','desc').limit(30).get()
      ])
      return {
        modes:Object.keys(rules.MODES).map(key => ({ key,...rules.MODES[key] })),
        nests:players.data.map(publicNest),
        rooms:invitations.data.map(r => view(r, me, now)).filter(r => r.status !== 'expired').map(({game, maps, ...r}) => r)
      }
    }
    case 'visit': {
      insist(id(event.target) && me !== event.target, '找不到这个小窝')
      const [nest] = await findNests([event.target], now)
      insist(nest, '主人已离线或小窝已关闭')
      return publicNest(nest)
    }
    case 'invite': {
      const { mode, targets } = event
      insist(rules.own(rules.MODES, mode), '请选择玩法')
      insist(Array.isArray(targets) && targets.length === rules.MODES[mode].size - 1 &&
        new Set(targets).size === targets.length && targets.every(v => id(v) && v !== me), '请选齐不同的玩家')
      const [guests, myNest] = await Promise.all([findNests(targets, now), nests.where({_id:me}).limit(1).get()])
      insist(guests.length === targets.length, '有玩家已离线或关闭了小窝')
      const host = myNest.data[0]
      insist(host && host.seen > now - ONLINE, '请先刷新在线状态')
      const players = [host, ...targets.map(key => guests.find(p => p._id === key))].map((p,i) => ({
        key:p._id, name:p.name, pet:mode === 'race' ? '' : p.pet, accepted:i === 0
      }))
      const data = {mode,players,status:'waiting',updated:now,version:0,map:0}
      players.forEach((p,i) => { data['p'+i] = p.key })
      const result = await rooms.add({data})
      return view({...data, _id:result._id}, me, now)
    }
    case 'room': case 'respond': case 'setup': case 'cancel': case 'move':
      return change(event, me, event.action)
    default: insist(false, '未知操作')
  }
}
exports.main = async event => {
  try {
    const { OPENID } = cloud.getWXContext()
    insist(OPENID, '请在微信中打开小程序')
    const me = createHash('sha256').update(OPENID).digest('hex').slice(0,32)
    return {ok:true,data:await handle(event, me)}
  } catch (e) {
    if (!e.game) console.error(e)
    return {ok:false,message:e.game ? e.message : 'PK 服务暂不可用，请稍后再试'}
  }
}
