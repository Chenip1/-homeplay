const { update } = require("../../utils/store")

Page({
  start() {
    wx.showModal({
      title: "\u5fae\u4fe1\u6388\u6743",
      content: "\u6388\u6743\u540e\u5373\u53ef\u8fdb\u5165\u840c\u5ba0 play\u3002\u5f53\u524d\u4e3a\u6f14\u793a\u7248\uff0c\u70b9\u51fb\u201c\u53bb\u6388\u6743\u201d\u4f1a\u76f4\u63a5\u8fdb\u5165\u9996\u9875\u3002",
      cancelText: "\u4e0d\u4e86",
      confirmText: "\u53bb\u6388\u6743",
      success: ({ confirm }) => {
        if (!confirm) return
        this.finishFakeAuth()
      }
    })
  },

  finishFakeAuth() {
    update((s) => {
      s.user.loggedIn = true

      if (!s.user.userInfo) {
        s.user.userInfo = {
          nickName: "\u5ba0\u7269\u73a9\u5bb6",
          avatarUrl: "/assets/icon_message.png"
        }
      }

      const first = !s._firstLoginDone
      if (first) {
        s._firstLoginDone = true
        if (!s.messages) s.messages = { unread: 0, list: [] }
        s.messages.list.unshift({
          id: String(Date.now()),
          title: "\u6b22\u8fce\u65b0\u4e3b\u4eba",
          content: "\u9996\u6b21\u767b\u5f55\uff0c\u606d\u559c\u83b7\u5f97\u4e00\u53ea\u4e2d\u534e\u7530\u56ed\u72ac\u3002",
          time: new Date().toLocaleString(),
          read: false
        })
        s.messages.unread = (s.messages.unread || 0) + 1
      }

      return s
    })

    wx.switchTab({ url: "/pages/index/index" })
  }
})
