const { call, syncNest } = require('../../utils/pk-client')
const { getState } = require('../../utils/store')
const { openProfileFromRegion } = require('../../utils/navigation')
Page({
  data: { nests: [], visible: [], rooms: [], modes: [], visit: null, mode: null, selected: [], need: 1, local: false, city: '', error: '', busy: false, loaded: false },
  onShow() {
    this.active = true
    const region = getState().user.region
    const city = region?.city === '未选择' ? '' : (region?.city || '')
    this.setData({city, province:region?.province || '', local:!!city && this.data.local})
    this.refresh(true)
    this.timer = setInterval(() => this.refresh(), 5000)
  },
  onHide() { this.active = false; clearInterval(this.timer) },
  onUnload() { this.onHide() },
  async refresh(force = false) {
    if (this.loading) return
    this.loading = true
    try {
      if (force === true) await syncNest()
      const { nests, rooms, modes } = await call('lobby')
      if (!this.active) return
      const count = rooms.filter(r => r.status === 'waiting' && !r.players[r.seat].accepted).length
      if (count) wx.setTabBarBadge({index:3, text:String(count)})
      else wx.removeTabBarBadge({index:3})
      const visit = nests.find(n => n.key === this.data.visit?.key) || null
      const selected = visit ? this.data.selected.filter(key => nests.some(n => n.key === key)) : []
      this.setData({ nests, rooms, modes, visit, selected, loaded: true, error: '' })
      this.filter()
    } catch(e) { if (this.active) this.setData({ error: e.message }) }
    finally { this.loading = false }
  },
  retry() { this.refresh(true) },
  toggleLocal() {
    if (!this.data.city) return wx.showToast({title:'先在「我的」设置地区', icon:'none'})
    this.setData({local: !this.data.local}); this.filter()
  },
  filter() {
    const { nests, local, city, province } = this.data
    this.setData({visible:nests.filter(n => !local || (n.city === city && n.province === province))})
  },
  async visitNest(e) {
    try {
      const visit = await call('visit', {target:e.currentTarget.dataset.key})
      this.setData({visit, selected:[visit.key], mode:this.data.modes[0], need:1})
      this.filter()
    } catch(e) { wx.showToast({title:e.message,icon:'none'}) }
  },
  back() { this.setData({visit:null, selected:[]}); this.filter() },
  choose(e) {
    const mode = this.data.modes[Number(e.currentTarget.dataset.i)]
    this.setData({mode, need:mode.size-1, selected:[this.data.visit.key]})
    this.filter()
  },
  toggleGuest(e) {
    const key = e.currentTarget.dataset.key, selected = this.data.selected
    if (selected.includes(key)) this.setData({selected:selected.filter(k=>k!==key)})
    else if (selected.length < this.data.need) this.setData({selected:[...selected,key]})
    this.filter()
  },
  async invite() {
    if (this.data.busy || this.data.selected.length !== this.data.need) return
    this.setData({busy:true})
    try {
      await syncNest()
      const room = await call('invite',{mode:this.data.mode.key,targets:this.data.selected})
      this.back()
      this.open(room.id)
    } catch(e) { wx.showToast({title:e.message,icon:'none'}) }
    finally { this.setData({busy:false}) }
  },
  openRoom(e) { this.open(e.currentTarget.dataset.id) },
  open(id) { wx.navigateTo({url:'/pages/pk/pk?id=' + encodeURIComponent(id)}) },
  profile() { openProfileFromRegion() }
})
