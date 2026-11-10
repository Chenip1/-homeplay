const link = require('../../utils/link')
const quiz = require('../../data/quiz')
const { getState, update } = require('../../utils/store')
Page({
  data: { mode: '', total: 0, board: [], selected: -1, hints: [], pairs: 0, result: '', correct: 0, index: 0, question: null, feedback: '', notice: '' },
  onShow() { this.setData({ total: getState().user.score }) },
  choose(e) {
    const mode = e.currentTarget.dataset.mode
    if (mode === 'catch') return wx.navigateTo({ url: '/pages/catch/catch' })
    this.setData({ mode, result: '', notice: '' })
    this.restart()
  },
  menu() { this.setData({ mode: '', result: '' }) },
  restart() {
    if (this.data.mode === 'link') this.setData({ board: link.create(), selected: -1, hints: [], pairs: 18, result: '', notice: '' })
    if (this.data.mode === 'quiz') {
      this.questions = quiz.map((_,i) => i)
      for (let i = this.questions.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[this.questions[i], this.questions[j]] = [this.questions[j], this.questions[i]]
      }
      this.setData({ index: 0, correct: 0, result: '', question: quiz[this.questions[0]], feedback: '' })
    }
  },
  pick(e) {
    const i = Number(e.currentTarget.dataset.i)
    const { board, selected, result } = this.data
    if (result || !board[i]) return
    if (selected < 0 || selected === i) return this.setData({ selected: selected === i ? -1 : i, hints: [], notice: '' })
    if (!link.connects(board, selected, i)) return this.setData({ selected: i, hints: [], notice: '这两块暂时连不上，再试试。' })
    let next = board.slice()
    next[selected] = next[i] = ''
    const pairs = this.data.pairs - 1
    let notice = ''
    if (pairs && !link.hint(next).length) {
      next = link.shuffle(next)
      notice = '没有可连接的配对，已重新排列。'
    }
    this.setData({ board: next, pairs, selected: -1, hints: [], notice })
    if (!pairs) this.finish('全部配对成功', 30)
  },
  showHint() { this.setData({ hints: link.hint(this.data.board), selected: -1, notice: '试试高亮的两块。' }) },
  reshuffle() { this.setData({ board: link.shuffle(this.data.board), selected: -1, hints: [], notice: '已重新排列。' }) },
  answer(e) {
    if (this.data.feedback || this.data.result) return
    const answer = this.data.question[2]
    const right = Number(e.currentTarget.dataset.i) === answer
    this.setData({ correct: this.data.correct + Number(right), feedback: right ? '答对啦！' : '正确答案：' + this.data.question[1][answer] })
  },
  advance() {
    if (!this.data.feedback || this.data.result) return
    const index = this.data.index + 1
    if (index === 5) return this.finish('答对 ' + this.data.correct + ' / 5 题', this.data.correct * 5)
    this.setData({ index, question: quiz[this.questions[index]], feedback: '' })
  },
  finish(label, reward) {
    if (this.data.result) return
    const s = update(s => { s.user.score += reward; return s })
    this.setData({ result: label + ' · +' + reward + ' 积分', total: s.user.score })
  }
})
