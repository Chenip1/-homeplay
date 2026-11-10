const { categories, goods } = require('../../data/goods')
const { getState } = require('../../utils/store')
const { placeItem, collectItem, undressDog, wearableSlots } = require('../../utils/yard-items')
const { backToTab } = require('../../utils/navigation')

Page({
  data: { items: [], placedCount: 0 },

  onShow() { this.refresh(getState()) },

  refresh(state) {
    const placedCounts = {}
    for (const item of state.yardItems) {
      placedCounts[item.itemId] = (placedCounts[item.itemId] || 0) + 1
    }
    const worn = Object.values(state.pet.outfit || {})
    const items = goods.map(item => ({
      ...item,
      category: categories.find(category => category.id === item.type).name,
      count: state.inventory[item.id] || 0,
      placed: placedCounts[item.id] || 0,
      wearable: !!wearableSlots[item.id],
      wearing: worn.includes(item.id)
    })).filter(item => item.count || item.placed || item.wearing)
    this.setData({ items, placedCount: state.yardItems.length })
  },

  useItem(e) {
    const { state, placed } = placeItem(e.currentTarget.dataset.id)
    this.refresh(state)
    wx.showToast({ title: placed ? '已摆放到首页' : '背包里没有这件道具', icon: placed ? 'success' : 'none' })
  },

  collect(e) {
    const { state, collected } = collectItem(e.currentTarget.dataset.id)
    this.refresh(state)
    if (collected) wx.showToast({ title: '已收回背包' })
  },

  undress(e) {
    const { state, removed } = undressDog(e.currentTarget.dataset.id)
    this.refresh(state)
    if (removed) wx.showToast({ title: '已脱下并放回背包' })
  },

  goBack() { backToTab('/pages/index/index') },
  goShop() { wx.switchTab({ url: '/pages/mall/mall' }) }
})
