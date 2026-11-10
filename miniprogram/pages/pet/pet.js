const { dogs, dogPortraitAtlas } = require("../../data/pets")
const { getState } = require("../../utils/store")
const { manageBreed } = require("../../utils/pet-management")
const { syncNest } = require("../../utils/pk-client")
const { backToTab } = require("../../utils/navigation")

Page({
  data: {
    breeds: [],
    atlas: dogPortraitAtlas,
    breedChoices: ["请选择狗狗", ...dogs.map(dog => dog.name)],
    state: null
  },

  onLoad() {
    this.setData({ breeds: dogs })
  },

  onShow() {
    this.setData({ state: getState() })
  },

  selectBreed(e) {
    const { breedid } = e.currentTarget.dataset
    this.confirmBreed(dogs.find(dog => dog.id === breedid))
  },

  pickBreed(e) {
    this.confirmBreed(dogs[Number(e.detail.value) - 1])
  },

  confirmBreed(breed) {
    if (!breed || this.confirming) return
    const state = getState()
    if (state.pet.breedId === breed.id) {
      return wx.showToast({ title: "已经是这只啦", icon: "none" })
    }
    const owned = !!state.ownedPets[breed.id]
    this.confirming = true
    wx.showModal({
      title: owned ? "切换陪伴萌宠" : "领养并更换",
      content: owned ? "免费切换为" + breed.name + "？" : "花费 " + breed.price + " 积分领养" + breed.name + "并设为陪伴？",
      confirmText: owned ? "确认切换" : "确认领养",
      success: ({ confirm }) => {
        if (confirm) this.buyAndSwitch(breed.id)
      },
      complete: () => { this.confirming = false }
    })
  },

  buyAndSwitch(breedId) {
    const { code, state } = manageBreed(breedId, { switchTo: true })
    this.setData({ state })
    if (code === "insufficient") return wx.showToast({ title: "积分不足", icon: "none" })
    if (code === "current") return wx.showToast({ title: "已经是这只啦", icon: "none" })
    if (code !== "switched" && code !== "unlocked") return
    wx.showToast({ title: "更换成功", icon: "success" })
    if (state.user.nestOpen) syncNest().catch(() => {})
  },

  goBack() {
    backToTab("/pages/profile/profile")
  }
})

