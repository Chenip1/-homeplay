const { dogs, tiers, breedById, dogPortraitAtlas } = require('../../data/pets')
const { getState } = require('../../utils/store')
const { manageBreed } = require('../../utils/pet-management')
const { syncNest } = require('../../utils/pk-client')
const { backToTab } = require('../../utils/navigation')

Page({
  data: { score: 0, count: 0, total: dogs.length, groups: [], atlas: dogPortraitAtlas },

  onShow() { this.refresh(getState()) },

  goBack() { backToTab('/pages/mall/mall') },

  refresh(state) {
    const entries = dogs.map(dog => ({
      ...dog,
      owned: !!state.ownedPets[dog.id],
      current: state.pet.breedId === dog.id,
      affordable: state.user.score >= dog.price
    }))
    this.setData({
      score: state.user.score,
      count: entries.filter(dog => dog.owned).length,
      groups: tiers.map(tier => {
        const dogs = entries.filter(dog => dog.tier === tier.id)
        return { ...tier, dogs, count: dogs.filter(dog => dog.owned).length }
      })
    })
  },

  unlock(e) {
    const breed = breedById[e.currentTarget.dataset.id]
    if (!breed || breed.type !== 'dog' || !breed.price || this.confirming) return
    this.confirming = true
    wx.showModal({
      title: '解锁' + breed.name + '？',
      content: '花费 ' + breed.price + ' 积分，解锁后可在「我的」查看并免费切换陪伴。',
      confirmText: '确认解锁',
      success: ({ confirm }) => {
        if (!confirm) return
        const { code, state } = manageBreed(breed.id, { acquisition: '解锁' })
        this.refresh(state)
        const message = { unlocked: '图鉴已点亮', owned: '已经解锁啦', insufficient: '积分不足' }[code]
        if (message) wx.showToast({ title: message, icon: code === 'unlocked' ? 'success' : 'none' })
      },
      complete: () => { this.confirming = false }
    })
  },

  switchPet(e) {
    const { code, state } = manageBreed(e.currentTarget.dataset.id, { switchTo: true, ownedOnly: true })
    this.refresh(state)
    if (code !== 'switched') return
    wx.showToast({ title: '已设为陪伴' })
    if (state.user.nestOpen) syncNest().catch(() => {})
  }
})
