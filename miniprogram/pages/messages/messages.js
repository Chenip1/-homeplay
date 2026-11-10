const { getState, update } = require("../../utils/store")
const { backToTab } = require("../../utils/navigation")

Page({
  data: { state: null },

  onShow() {
    const next = update((s) => {
      if (!s.messages) s.messages = { unread: 0, list: [] }
      s.messages.list = s.messages.list.map((m) => ({ ...m, read: true }))
      s.messages.unread = 0
      return s
    })
    this.setData({ state: next || getState() })
  },

  goBack() {
    backToTab("/pages/index/index")
  }
})
