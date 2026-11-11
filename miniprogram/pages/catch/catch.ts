const { getState, update } = require("../../utils/store")
const { backToTab } = require("../../utils/navigation")

Page({
  data: {
    ready: false,
    running: false,
    timeLeft: 10,
    score: 0,
    totalScore: 0,
    labels: {
      title: "\u63a5\u72d7\u7cae",
      time: "\u5269\u4f59\u65f6\u95f4",
      score: "\u672c\u5c40\u79ef\u5206",
      totalScore: "\u603b\u79ef\u5206",
      tips: "\u73a9\u6cd5\uff1a\u62d6\u52a8\u5e95\u90e8\u7bee\u5b50\u53bb\u63a5\u843d\u4e0b\u7684\u72d7\u7cae\u300210s \u5185\u6bcf\u63a5\u4f4f\u4e00\u4e2a\u72d7\u7cae\uff0c+5 \u79ef\u5206\u3002"
    },
    buttonLabels: {
      start: "\u5f00\u59cb\u6e38\u620f",
      loading: "Canvas Loading...",
      stop: "\u63d0\u524d\u7ed3\u675f"
    }
  },

  canvas: null as any,
  ctx: null as any,
  rafId: null as any,
  timerId: null as any,

  W: 0,
  H: 0,

  basket: null as any,
  foods: [] as any[],

  onShow() {
    const s = getState()
    this.setData({ totalScore: s.user.score })
  },

  onReady() {
    this.resizeCanvas()
  },

  onResize() {
    if (this.data.ready) this.resizeCanvas()
  },

  resizeCanvas() {
    const q = wx.createSelectorQuery().in(this)
    q.select("#gameCanvas")
      .fields({ node: true, size: true })
      .exec((res: any) => {
        const info = res && res[0]
        if (!info || !info.node || info.width <= 0 || info.height <= 0) {
          wx.showToast({ title: "\u521d\u59cb\u5316\u753B\u5E03\u5931\u8D25", icon: "none" })
          return
        }

        const canvas = info.node
        const ctx = canvas.getContext("2d")
        if (!ctx) {
          wx.showToast({ title: "\u521D\u59CB\u5316 ctx \u5931\u8D25", icon: "none" })
          return
        }

        const dpr = wx.getSystemInfoSync().pixelRatio
        const previousWidth = this.W
        const previousHeight = this.H
        const basketCenter = this.basket ? this.basket.x + this.basket.w / 2 : previousWidth / 2
        this.W = info.width
        this.H = info.height

        canvas.width = this.W * dpr
        canvas.height = this.H * dpr
        ctx.scale(dpr, dpr)

        this.canvas = canvas
        this.ctx = ctx
        this.resetBasket()
        if (previousWidth > 0) {
          const horizontalScale = this.W / previousWidth
          const verticalScale = this.H / previousHeight
          this.basket.x = clamp(basketCenter * horizontalScale - this.basket.w / 2, 0, this.W - this.basket.w)
          for (const food of this.foods) {
            food.x *= horizontalScale
            food.y *= verticalScale
          }
        }
        if (!this.data.ready) this.setData({ ready: true })
        if (this.data.running) this.drawFrame()
        else this.drawSplash()
      })
  },

  resetBasket() {
    const width = Math.min(112, this.W)
    this.basket = {
      x: (this.W - width) / 2,
      y: this.H - 46,
      w: width,
      h: 18
    }
  },

  drawSplash() {
    if (!this.ctx) return
    this.drawFrame()
    const ctx = this.ctx
    ctx.fillStyle = "rgba(61, 45, 27, 0.85)"
    ctx.font = "bold 18px sans-serif"
    ctx.fillText("\u70B9\u51FB\u300C\u5F00\u59CB\u6E38\u620F\u300D", 20, 36, this.W - 40)
    ctx.font = "14px sans-serif"
    ctx.fillText("10s \u5185\u6BCF\u63A5\u4F4F\u4E00\u4E2A\u72D7\u7CAE +5 \u79EF\u5206", 20, 60, this.W - 40)
  },

  startGame() {
    if (!this.data.ready) {
      wx.showToast({ title: "\u753B\u5E03\u8FD8\u6CA1\u51C6\u5907\u597D", icon: "none" })
      return
    }
    if (this.data.running) return

    this.foods = []
    this.resetBasket()
    this.setData({ running: true, timeLeft: 10, score: 0 })

    this.timerId = setInterval(() => {
      const nextTime = this.data.timeLeft - 1
      this.setData({ timeLeft: nextTime })
      if (nextTime <= 0) this.stopGame()
    }, 1000)

    const loop = () => {
      if (!this.data.running) return
      this.updateFrame()
      this.drawFrame()
      this.rafId = this.canvas.requestAnimationFrame(loop)
    }

    loop()
  },

  stopGame() {
    const result = this.settleGame()
    if (!result) return
    const { gained, total } = result

    wx.showModal({
      title: "结算完成",
      content: `本局获得 ${gained} 积分\n当前总积分 ${total}`,
      showCancel: false
    })
  },

  returnToLobby() {
    this.settleGame()
    backToTab("/pages/game/game")
  },

  settleGame(): { gained: number; total: number } | null {
    if (!this.data.running) return null

    this.setData({ running: false })

    if (this.timerId) {
      clearInterval(this.timerId)
      this.timerId = null
    }

    if (this.rafId && this.canvas) {
      this.canvas.cancelAnimationFrame(this.rafId)
      this.rafId = null
    }

    const gained = this.data.score
    const next = update((s: any) => {
      s.user.score += gained
      return s
    })

    this.setData({ totalScore: next.user.score })
    this.foods = []
    this.drawSplash()
    return { gained, total: next.user.score }
  },

  onTouch(e: any) {
    if (!this.basket || !this.data.running) return
    const x = e.touches?.[0]?.x
    if (typeof x !== "number") return
    this.basket.x = clamp(x - this.basket.w / 2, 0, this.W - this.basket.w)
  },

  updateFrame() {
    if (!this.basket) return

    if (Math.random() < 0.08) {
      this.foods.push({
        x: Math.random() * (this.W - 32) + 16,
        y: -18,
        r: 10 + Math.random() * 2,
        vy: 3 + Math.random() * 2.4
      })
    }

    const basket = this.basket
    const remain = []
    let gainedThisFrame = 0

    for (const food of this.foods) {
      food.y += food.vy

      const hit =
        food.x >= basket.x &&
        food.x <= basket.x + basket.w &&
        food.y + food.r >= basket.y &&
        food.y - food.r <= basket.y + basket.h

      if (hit) {
        gainedThisFrame += 5
        continue
      }

      if (food.y - food.r <= this.H + 20) {
        remain.push(food)
      }
    }

    this.foods = remain

    if (gainedThisFrame > 0) {
      this.setData({ score: this.data.score + gainedThisFrame })
    }
  },

  drawFrame() {
    if (!this.ctx) return
    const ctx = this.ctx

    ctx.clearRect(0, 0, this.W, this.H)

    const bg = ctx.createLinearGradient(0, 0, 0, this.H)
    bg.addColorStop(0, "#fff8ec")
    bg.addColorStop(1, "#ffe7bf")
    ctx.fillStyle = bg
    ctx.fillRect(0, 0, this.W, this.H)

    ctx.fillStyle = "rgba(142, 96, 52, 0.18)"
    ctx.fillRect(0, this.H - 56, this.W, 56)

    for (const food of this.foods) {
      this.drawFood(food)
    }

    this.drawBasket()
  },

  drawFood(food: any) {
    if (!this.ctx) return
    const ctx = this.ctx

    ctx.fillStyle = "#8b5a2b"
    ctx.beginPath()
    ctx.ellipse(food.x, food.y, food.r, food.r * 0.72, 0, 0, Math.PI * 2)
    ctx.fill()

    ctx.fillStyle = "rgba(255,255,255,0.25)"
    ctx.beginPath()
    ctx.arc(food.x - food.r * 0.2, food.y - food.r * 0.2, food.r * 0.22, 0, Math.PI * 2)
    ctx.fill()
  },

  drawBasket() {
    if (!this.ctx || !this.basket) return
    const ctx = this.ctx
    const basket = this.basket

    ctx.fillStyle = "#b97a3d"
    ctx.fillRect(basket.x, basket.y, basket.w, basket.h)

    ctx.strokeStyle = "#8b5a2b"
    ctx.lineWidth = 2
    ctx.strokeRect(basket.x, basket.y, basket.w, basket.h)

    ctx.beginPath()
    ctx.arc(basket.x + basket.w / 2, basket.y, basket.w / 3.2, Math.PI, 0)
    ctx.stroke()
  },

  onHide() {
    if (this.timerId) {
      clearInterval(this.timerId)
      this.timerId = null
    }

    if (this.rafId && this.canvas) {
      this.canvas.cancelAnimationFrame(this.rafId)
      this.rafId = null
    }
    if (this.data.running) {
      this.setData({ running: false, timeLeft: 10, score: 0 })
      this.foods = []
      this.drawSplash()
    }
  },

  onUnload() {
    this.onHide()
  }
})

function clamp(v: number, min: number, max: number) {
  return Math.max(min, Math.min(max, v))
}
