const { getState, update } = require('../../utils/store')
const { syncNest } = require('../../utils/pk-client')
const { takeProfileEntryFromRegion } = require('../../utils/navigation')
Page({
  data: { score: 0, current: '', dogs: [], dogCount: 0, others: [], history: [], region: '未设置', open: false, nickname: '', returnToRegion: false },
  onShow() {
    if (takeProfileEntryFromRegion()) this.setData({ returnToRegion: true })
    const s = getState()
    const pets = Object.values(s.ownedPets).map(p => ({
      ...p, date: p.acquiredAt ? new Date(p.acquiredAt).toLocaleDateString() : '早期记录',
      current: s.pet.breedId === p.breedId
    }))
    const dogs = pets.filter(p => p.type === 'dog')
    const history = s.petHistory.map(p => ({ ...p, date: new Date(p.at).toLocaleString() }))
    const r = s.user.region
    this.setData({
      score: s.user.score, current: s.pet.breedName, dogs, dogCount: dogs.length,
      others: pets.filter(p => p.type !== 'dog'), history, region: r.city === '未选择' ? '未设置' : [r.province, r.city, r.district].filter(Boolean).join(' · '),
      open: !!s.user.nestOpen, nickname: s.user.userInfo?.nickName || '宠物玩家'
    })
  },
  onTabItemTap() {
    this.setData({ returnToRegion: false })
  },
  backToRegion() {
    wx.switchTab({
      url: '/pages/region/region',
      success: () => this.setData({ returnToRegion: false })
    })
  },
  nicknameInput(e) { this.pendingNickname = e.detail.value },
  saveName() {
    const name = (this.pendingNickname || '').trim()
    if (!name) return wx.showToast({ title: '请输入昵称', icon: 'none' })
    update(s => { s.user.userInfo = { ...s.user.userInfo, nickName: name.slice(0, 16) }; return s })
    this.onShow()
    syncNest().catch(() => {})
    wx.showToast({ title: '昵称已保存' })
  },
  setRegion(e) {
    const [province, city, district] = e.detail.value
    update(s => { s.user.region = { province, city, district }; return s })
    this.onShow()
    syncNest().catch(() => {})
  },
  setOpen(e) {
    const value = e.detail.value
    update(s => { s.user.nestOpen = value; return s })
    this.onShow()
    syncNest().catch(() => wx.showToast({ title: '设置已保存，暂未同步', icon: 'none' }))
  },
  manage() { wx.navigateTo({ url: '/pages/pet/pet' }) }
})
