const { categories, goods } = require('../../data/goods')
const { getState, update } = require('../../utils/store')
const { dogs, dogPortraitAtlas } = require('../../data/pets')

function effectText(item) {
  if (item.effect?.hunger) return '饱食度 +' + item.effect.hunger + (item.forCats ? ' · 狗狗和猫猫可用' : ' · 狗狗可用')
  if (item.effect?.mood) return '心情 +' + item.effect.mood + ' · 可在首页使用'
  return '兑换后存入背包'
}

Page({
  data: {
    categories,
    active: categories[0],
    items: [],
    score: 0,
    total: goods.length,
    dogCount: 0,
    dogTotal: dogs.length,
    atlas: dogPortraitAtlas
  },

  onShow() {
    this.refresh(getState())
  },

  selectCategory(e) {
    const active = categories.find(category => category.id === e.currentTarget.dataset.id)
    if (active) this.refresh(getState(), active)
  },

  openDogDex() {
    wx.navigateTo({ url: '/pages/dogdex/dogdex' })
  },

  refresh(state, active = this.data.active) {
    const outfits = [
      state.pet.outfit,
      ...Object.values(state.ownedPets).filter(pet => pet.breedId !== state.pet.breedId).map(pet => pet.stats?.outfit)
    ]
    const worn = outfits.flatMap(outfit => Object.values(outfit || {}))
    const items = goods.filter(item => item.type === active.id).map(item => ({
      ...item,
      owned: (state.inventory[item.id] || 0) +
        state.yardItems.filter(placement => placement.itemId === item.id).length +
        worn.filter(id => id === item.id).length,
      effectText: effectText(item)
    }))
    this.setData({ active, items, score: state.user.score, dogCount: dogs.filter(dog => state.ownedPets[dog.id]).length })
  },

  buy(e) {
    const item = goods.find(good => good.id === e.currentTarget.dataset.id)
    if (!item) return
    let bought = false
    const next = update(state => {
      if (state.user.score < item.price) return state
      state.user.score -= item.price
      state.inventory[item.id] = (state.inventory[item.id] || 0) + 1
      bought = true
      return state
    })
    this.refresh(next)
    wx.showToast({ title: bought ? '已兑换' : '积分不足', icon: bought ? 'success' : 'none' })
  }
})
