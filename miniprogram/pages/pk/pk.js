const { call } = require('../../utils/pk-client')
const { getState } = require('../../utils/store')
const { backToTab } = require('../../utils/navigation')
const ranks = ['3','4','5','6','7','8','9','10','J','Q','K','A','2']
const suits = ['♠','♥','♣','♦']
const honors = ['东','南','西','北','中','发','白']
function face(id, mode) {
  if (mode === 'cards') return id === 52 ? '小王' : id === 53 ? '大王' : ranks[Math.floor(id/4)] + suits[id%4]
  const k = Math.floor(id/4)
  return k < 27 ? (k%9+1) + ['万','筒','条'][Math.floor(k/9)] : honors[k-27]
}
const modeRules = {
  gomoku:'黑棋先手，横、竖或斜向连成五子即获胜。',
  quiz:'90 秒内完成同一组题。先比答对数，答对数相同则比完成时间。',
  race:'拖动方向盘，绕开深色障碍。先到旗帜处获胜。',
  cards:'三人叫分定地主，地主单独对抗两位农民。一方先出完牌即获胜。',
  mahjong:'四人自摸场：轮流摸打，凑齐四组顺子或刻子加一对即可自摸。此场无吃、碰、杠或点炮。'
}
Page({
  data:{room:null, pending:false, error:'', picked:[], hand:[], last:'', bottom:'', discards:[], grid:[], bids:[], seconds:0, ready:false, myTurn:false, pets:[], racePet:'', mapIndex:0, rule:'', joyX:0, joyY:0},
  onLoad(query) {
    this.id = query.id
    this.setData({pets:Object.values(getState().ownedPets).map(p => p.breedName)})
  },
  onShow() {
    this.active = true
    this.refresh()
    this.poll = setInterval(() => this.refresh(), 1400)
    this.clock = setInterval(() => this.tick(), 250)
  },
  onHide() { this.active = false; clearInterval(this.poll); clearInterval(this.clock); this.stopJoystick() },
  onUnload() { this.onHide() },
  tick() {
    const r = this.data.room
    if (!r?.game || r.status !== 'playing') return
    const now = Date.now() + this.clockDelta
    if (r.mode === 'race') {
      const seconds = Math.max(0, Math.ceil((r.game.started-now)/1000))
      if (seconds !== this.data.seconds) this.setData({seconds})
    }
    if (r.mode === 'quiz') {
      const seconds = Math.max(0,Math.ceil((r.game.deadline-now)/1000))
      if (seconds !== this.data.seconds) this.setData({seconds})
    }
  },
  async refresh() {
    if (this.refreshing || this.data.pending || !this.id) return
    this.refreshing = true
    try {
      const room = await call('room',{id:this.id})
      this.renderRoom(room)
    } catch(e) { if (this.active) this.setData({error:e.message}) }
    finally { this.refreshing = false }
  },
  renderRoom(room) {
    if (!this.active || (this.data.room && room.version < this.data.room.version)) return
    this.clockDelta = room.now - Date.now()
    const { game:g, mode, seat, players } = room
    const picked = this.data.picked.filter(id => g?.hand?.includes(id))
    const hand = (g?.hand || []).map(id => ({id, label:face(id,mode), selected:picked.includes(id)}))
    const last = g?.last ? players[g.last.seat].name + '：' + g.last.cards.map(id=>face(id,mode)).join(' ') : ''
    const bottom = (g?.bottom || []).map(id=>face(id,mode)).join(' ')
    const discards = (g?.discards || []).map((row,i)=>({i,name:players[i].name,tiles:row.map(id=>face(id,mode)).join(' ')}))
    const grid = (g?.grid || []).flatMap((row,y)=>row.map((cell,x)=>{
      const seats = g.positions.map((p,i)=>p.x===x && p.y===y ? i : -1).filter(i=>i>=0)
      return { id:y*8+x, wall:cell==='#', label:seats.length > 1 ? '🐾' : seats.length ? (seats[0]===seat ? '🐶' : '🐕') : cell==='F' ? '🏁' : cell==='S' ? '起' : '' }
    }))
    const bids = [0,1,2,3].filter(v => !v || v > (g?.bid || 0))
    this.setData({
      room, picked, hand, last, bottom, discards, grid, bids, error:'',
      rule:modeRules[mode], myTurn:room.status === 'playing' && g?.turn === seat,
      ready:players.every(p=>p.accepted && p.pet),
      mapIndex:Math.max(0,room.maps.indexOf(room.mapName)),
      racePet:players[seat].pet
    })
    if (room.status !== 'playing' && this.joyTimer) this.stopJoystick()
    this.tick()
  },
  async send(action, params, silent = false) {
    if (this.data.pending) return
    this.setData({pending:true})
    try {
      const room = await call(action,{...params,id:this.id,version:this.data.room?.version})
      this.renderRoom(room)
    } catch(e) { if (!silent && this.active) wx.showToast({title:e.message,icon:'none'}) }
    finally { if (this.active) this.setData({pending:false}); else this.data.pending = false }
  },
  accept() { this.send('respond',{accept:true}) },
  decline() { this.send('respond',{accept:false}) },
  cancel() { this.send('cancel',{}) },
  setMap(e) { this.send('setup',{map:Number(e.detail.value)}) },
  setPet(e) { this.send('setup',{pet:this.data.pets[Number(e.detail.value)]}) },
  start() { this.send('setup',{start:true}) },
  answer(e) { this.send('move',{kind:'answer',value:Number(e.currentTarget.dataset.i),question:this.data.room.game.index}) },
  place(e) { if (this.data.myTurn) this.send('move',{kind:'place',value:Number(e.currentTarget.dataset.i)}) },
  bid(e) { this.send('move',{kind:'bid',value:Number(e.currentTarget.dataset.i)}) },
  pass() { this.send('move',{kind:'pass'}) },
  playCards() { this.send('move',{kind:'play',value:this.data.picked}) },
  discard() { this.send('move',{kind:'discard',value:this.data.picked[0]}) },
  hu() { this.send('move',{kind:'hu'}) },
  pickCard(e) {
    if (!this.data.myTurn) return
    const id = Number(e.currentTarget.dataset.i), {picked, room, hand} = this.data
    const next = picked.includes(id) ? picked.filter(v=>v!==id) : room.mode === 'mahjong' ? [id] : [...picked,id]
    this.setData({picked:next,hand:hand.map(c=>({...c,selected:next.includes(c.id)}))})
  },
  leave() {
    wx.showModal({title:'结束对局？',content:'退出会结束当前这场 PK。',success:res=>{if(res.confirm) this.send('move',{kind:'leave'})}})
  },
  lobby() { backToTab('/pages/region/region') },
  joystickStart(e) {
    if (this.data.seconds || this.data.room?.status !== 'playing') return
    const p = e.touches[0]
    const version = (this.touchVersion || 0) + 1
    this.touchVersion = version
    this.createSelectorQuery().select('#joystick').boundingClientRect(rect => {
      if (!rect || !this.active || version !== this.touchVersion) return
      this.center = { x:rect.left+rect.width/2, y:rect.top+rect.height/2, radius:rect.width*0.27 }
      this.direction(p)
      this.step()
      if (!this.joyTimer) this.joyTimer = setInterval(() => this.step(), 240)
    }).exec()
  },
  joystickMove(e) { this.direction(e.touches[0]) },
  direction(p) {
    if (!this.center || !p) return
    const dx = p.clientX-this.center.x, dy = p.clientY-this.center.y
    const length = Math.hypot(dx,dy)
    const scale = Math.min(1,this.center.radius/Math.max(length,1))
    this.dir = length < this.center.radius*0.26 ? null : Math.abs(dx)>Math.abs(dy) ? (dx>0 ? 3:1) : (dy>0 ? 2:0)
    this.setData({joyX:Math.round(dx*scale),joyY:Math.round(dy*scale)})
  },
  step() {
    if (this.dir != null && this.data.room?.status === 'playing' && !this.data.seconds) this.send('move',{kind:'run',value:this.dir},true)
  },
  stopJoystick() {
    this.touchVersion = (this.touchVersion || 0) + 1
    clearInterval(this.joyTimer)
    this.joyTimer = null; this.dir = null; this.center = null
    if (this.active) this.setData({joyX:0,joyY:0})
  }
})
