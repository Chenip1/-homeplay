const { getState, update } = require("../../utils/store")
const { goods } = require("../../data/goods")
const { breedById, dogPortraitAtlas } = require("../../data/pets")
const { captureHome } = require("../../utils/home-capture")
const { savePhoto } = require("../../utils/home-album")
const { boundedPosition, moveItem, yardItemsForDisplay, dressDog } = require("../../utils/yard-items")
const { createDogRenderer } = require("../../utils/dog-renderer")

const toolGroups = [
  { side: "left", tools: [
    { id: "bag", label: "背包", handler: "goBag" },
    { id: "diary", label: "日记", handler: "goDiary" },
    { id: "album", label: "相册", handler: "goAlbum" },
    { id: "partner", label: "伙伴", handler: "goPartner" }
  ] },
  { side: "right", tools: [
    { id: "music", label: "音乐", handler: "toggleMusic" },
    { id: "messages", label: "消息", handler: "goMessages" },
    { id: "camera", label: "截图", handler: "takePhoto" }
  ] }
].map(group => ({
  ...group,
  tools: group.tools.map(tool => ({ ...tool, src: "/assets/home/tool-" + tool.id + ".png" }))
}))
const legacyItems = [
  { id: "food_cat", name: "猫粮", effect: { hunger: 20 }, forCats: true, catOnly: true },
  { id: "toy_teaser", name: "逗猫棒", effect: { mood: 20 } }
]
const supplies = [...legacyItems, ...goods]

function availableSupplies(state, stat) {
  return supplies.filter(item => {
    if (!(state.inventory[item.id] > 0) || !item.effect?.[stat]) return false
    if (stat !== "hunger") return true
    return state.pet.type === "cat" ? item.forCats : !item.catOnly
  })
}

Page({
  data: {
    state: null,
    yard: "/assets/home/yard-cropped.jpg",
    starterArt: "/assets/home/dog_tianyuan.png",
    atlas: dogPortraitAtlas,
    portrait: null,
    petName: "",
    unread: "",
    statusRows: [],
    yardItems: [],
    draggingId: "",
    dressingTarget: false,
    dog3D: false,
    toolGroups,
    musicOn: true,
    petAlerts: {
      moodLow: false,
      hungerLow: false,
      message: ""
    }
  },

  onShow() {
    this.visible = true
    const s = getState()

    if (!s?.user?.loggedIn) {
      wx.reLaunch({ url: "/pages/login/login" })
      return
    }

    if (!s.user.userInfo) {
      const next = update((st) => {
        st.user.userInfo = {
          nickName: "\u5ba0\u7269\u73a9\u5bb6",
          avatarUrl: "/assets/icon_message.png"
        }
        return st
      })
      this.renderState(next)
      return
    }

    this.renderState(s)
  },

  renderState(state) {
    const stock = stat => availableSupplies(state, stat).reduce((n, item) => n + state.inventory[item.id], 0)
    const petAlerts = this.getPetAlerts(state)
    const unread = state.messages.unread
    this.setData({
      state,
      petAlerts,
      yardItems: yardItemsForDisplay(state),
      petName: state.pet.nickname || state.pet.breedName,
      portrait: state.pet.breedId === "dog_tianyuan" ? null : breedById[state.pet.breedId] || null,
      unread: unread > 99 ? "99+" : unread || "",
      statusRows: [
        { id: "mood", label: "心情", value: state.pet.mood, low: petAlerts.moodLow, summary: state.pet.mood + "/100 · 玩具 " + stock("mood") },
        { id: "hunger", label: "饱食度", value: state.pet.hunger, low: petAlerts.hungerLow, summary: state.pet.hunger + "/100 · 食物 " + stock("hunger") }
      ]
    }, () => this.measureYard())
  },

  onHide() {
    this.visible = false
    this.dogRenderer?.pause()
    this.drag = null
    this.yardBounds = null
    this.setData({ draggingId: "", dressingTarget: false })
  },

  onUnload() { this.dogRenderer?.dispose() },

  onResize() {
    this.cancelItemDrag()
    this.measureYard()
  },

  measureYard() {
    const query = wx.createSelectorQuery().in(this)
    query.select(".yardDropZone").boundingClientRect()
    query.select(".dogTarget").boundingClientRect()
    query.select("#dogCanvas").fields({ node: true, size: true })
    query.exec(results => {
      if (!this.visible) return
      const [yard, target, canvas] = results || []
      if (yard?.width && yard?.height) this.yardBounds = yard
      this.dogBounds = target
      this.renderDog(canvas)
    })
  },

  renderDog(canvas) {
    const pet = this.data.state?.pet
    if (!canvas?.node || !canvas.width || !canvas.height || pet?.type !== "dog") {
      this.dogRenderer?.pause()
      if (this.data.dog3D) this.setData({ dog3D: false })
      return
    }
    try {
      if (!this.dogRenderer) this.dogRenderer = createDogRenderer(canvas.node)
      const size = canvas.width + "x" + canvas.height
      if (this.modelSize !== size) {
        this.dogRenderer.resize(canvas.width, canvas.height, Math.min(wx.getSystemInfoSync().pixelRatio || 1, 2))
        this.modelSize = size
      }
      this.dogRenderer.setDog(pet.breedId, pet.outfit)
      this.dogRenderer.start()
      if (!this.data.dog3D) this.setData({ dog3D: true })
    } catch (error) {
      this.dogRenderer?.dispose()
      this.dogRenderer = null
      this.modelSize = null
      this.setData({ dog3D: false })
      console.warn("Dog 3D unavailable", error)
    }
  },

  goBag() { wx.navigateTo({ url: "/pages/bag/bag" }) },

  startItemDrag(e) {
    if (this.drag || !this.yardBounds) return
    const index = this.data.yardItems.findIndex(item => item.id === e.currentTarget.dataset.id)
    const touch = e.changedTouches[0]
    if (index < 0 || !touch) return
    const { id, x, y, wearable } = this.data.yardItems[index]
    this.drag = {
      id, index, wearable, breedId: this.data.state.pet.breedId,
      finger: touch.identifier, startX: touch.clientX, startY: touch.clientY, x, y, position: null
    }
    this.setData({ draggingId: id })
  },

  dragItem(e) {
    const drag = this.drag
    const touch = drag && e.changedTouches.find(touch => touch.identifier === drag.finger)
    if (!touch || !this.yardBounds) return
    const { width, height } = this.yardBounds
    const dx = touch.clientX - drag.startX
    const dy = touch.clientY - drag.startY
    if (!drag.position && Math.abs(dx) + Math.abs(dy) < 3) return
    const x = drag.x + dx / width, y = drag.y + dy / height
    const canDress = drag.wearable && this.data.state.pet.type === "dog"
    const position = canDress ? { x, y } : boundedPosition(x, y)
    const centerX = this.yardBounds.left + position.x * width
    const centerY = this.yardBounds.top + position.y * height
    const target = this.dogBounds
    drag.onDog = !!(canDress && target &&
      centerX >= target.left && centerX <= target.right &&
      centerY >= target.top && centerY <= target.bottom)
    drag.position = position
    this.setData({
      ["yardItems[" + drag.index + "].left"]: position.x * 100,
      ["yardItems[" + drag.index + "].top"]: position.y * 100,
      dressingTarget: drag.onDog
    })
  },

  finishItemDrag(e) {
    const drag = this.drag
    if (!drag || !e.changedTouches.some(touch => touch.identifier === drag.finger)) return
    this.dragItem(e)
    this.drag = null
    this.setData({ draggingId: "", dressingTarget: false })
    if (drag.position) {
      if (drag.onDog) {
        const { state, equipped } = dressDog(drag.id, drag.breedId)
        if (equipped) {
          this.renderState(state)
          wx.showToast({ title: "穿戴成功" })
          return
        }
      }
      const { x, y } = drag.position
      const state = moveItem(drag.id, x, y)
      this.setData({ yardItems: yardItemsForDisplay(state) })
    }
  },

  cancelItemDrag() {
    if (!this.drag) return
    this.drag = null
    this.setData({ draggingId: "", dressingTarget: false, yardItems: yardItemsForDisplay(getState()) })
  },

  renamePet() {
    const { breedId, breedName, nickname } = getState().pet
    wx.showModal({
      title: "给狗狗起个名字",
      editable: true,
      content: nickname || breedName,
      placeholderText: "输入昵称，留空恢复品种名",
      confirmText: "保存",
      success: ({ confirm, content }) => {
        if (!confirm || typeof content !== "string") return
        const name = Array.from(content.trim()).slice(0, 16).join("")
        const next = update(state => {
          if (state.pet.breedId === breedId) state.pet.nickname = name === breedName ? "" : name
          return state
        })
        this.renderState(next)
      }
    })
  },

  getPetAlerts(state) {
    const mood = Number(state?.pet?.mood || 0)
    const hunger = Number(state?.pet?.hunger || 0)
    const moodLow = mood <= 30
    const hungerLow = hunger <= 30

    let message = ""
    if (moodLow && hungerLow) message = "\u5BA0\u7269\u5FC3\u60C5\u548C\u9965\u997F\u5EA6\u90FD\u504F\u4F4E\uff0c\u9700\u8981\u5FEB\u70B9\u7167\u987E"
    else if (moodLow) message = "\u5BA0\u7269\u5FC3\u60C5\u504F\u4F4E\uff0c\u53EF\u4EE5\u7528\u73A9\u5177\u54C4\u54C4\u5B83"
    else if (hungerLow) message = "\u5BA0\u7269\u6709\u70B9\u997F\u4E86\uff0C\u8BB0\u5F97\u5582\u5B83\u5403\u4E1C\u897F"

    return { moodLow, hungerLow, message }
  },

  useStatusSupply(e) {
    const { stat } = e.currentTarget.dataset
    if (stat === "mood" || stat === "hunger") this.useSupply(stat)
  },

  useSupply(stat) {
    const label = stat === "mood" ? "心情" : "饱食度"
    let message = ""
    let used = false
    const next = update(state => {
      if (state.pet[stat] >= 100) {
        message = label + "已满"
        return state
      }
      const [item] = availableSupplies(state, stat)
      if (!item) {
        message = stat === "mood" ? "没有玩具了，去商店兑换" : "没有可用食物，去商店兑换"
        return state
      }
      const delta = Math.min(100 - state.pet[stat], item.effect[stat])
      state.inventory[item.id] -= 1
      state.pet[stat] += delta
      message = item.name + " · " + label + " +" + delta
      used = true
      return state
    })
    this.renderState(next)
    wx.showToast({ title: message, icon: used ? "success" : "none" })
  },

  goDiary() {
    wx.showToast({ title: "\u6210\u957F\u65E5\u8BB0\u5F00\u53D1\u4E2D", icon: "none" })
  },

  goAlbum() {
    wx.navigateTo({ url: "/pages/album/album" })
  },

  async takePhoto() {
    if (this.capturing || !this.data.state) return
    this.capturing = true
    const { breedId, breedName } = this.data.state.pet
    const nickname = this.data.petName
    try {
      const path = await captureHome(this)
      await savePhoto(path, { breedId, breedName, nickname })
      wx.showToast({ title: "已存入萌宠相册" })
    } catch (error) {
      console.warn("Home capture failed", error)
      wx.showToast({ title: "截图保存失败，请重试", icon: "none" })
    } finally {
      this.capturing = false
    }
  },

  goPartner() {
    wx.showToast({ title: "\u4F19\u4F34\u7CFB\u7EDF\u5F00\u53D1\u4E2D", icon: "none" })
  },

  toggleMusic() {
    const next = !this.data.musicOn
    this.setData({ musicOn: next })
    wx.showToast({
      title: next ? "\u97F3\u4E50\u5DF2\u5F00\u542F" : "\u97F3\u4E50\u5DF2\u5173\u95ED",
      icon: "none"
    })
  },

  goMessages() {
    wx.navigateTo({ url: "/pages/messages/messages" })
  }
})
