const quiz = require('./quiz')
const maps = require('./maps')
const MODES = { gomoku: {name:'五子棋', size:2}, quiz:{name:'狗狗知识竞速',size:2}, race:{name:'萌宠跑步闯关',size:2}, cards:{name:'斗地主',size:3}, mahjong:{name:'麻将',size:4} }
const own = (object, key) => Object.prototype.hasOwnProperty.call(object, key)
function insist(condition, message) { if (!condition) { const e = new Error(message); e.game = true; throw e } }
function shuffled(values) {
  const a = values.slice()
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i],a[j]] = [a[j],a[i]]
  }
  return a
}
const range = n => Array.from({length:n},(_,i) => i)
const rank = card => card >= 52 ? card - 39 : Math.floor(card / 4)
const sortedCards = hand => hand.sort((a,b) => a - b)
function cardCombo(cards) {
  const n = cards.length, counts = Array(15).fill(0)
  for (const card of cards) counts[rank(card)]++
  const groups = range(15).filter(i => counts[i])
  const max = groups[groups.length - 1]
  const combo = (type, high = max) => ({ type, n, high })
  if (n === 2 && counts[13] && counts[14]) return combo('rocket')
  if (groups.length === 1) return combo(['','single','pair','triple','bomb'][n])
  if (n === 4 && groups.some(i => counts[i] === 3)) return combo('triple-one', groups.find(i => counts[i] === 3))
  if (n === 5 && groups.some(i => counts[i] === 3) && groups.some(i => counts[i] === 2)) return combo('triple-pair', groups.find(i => counts[i] === 3))
  const straight = groups.every((r,i) => r === groups[0] + i) && max < 12
  if (straight && n >= 5 && groups.every(i => counts[i] === 1)) return combo('straight')
  if (straight && n >= 6 && groups.every(i => counts[i] === 2)) return combo('pairs')
  for (const [type, width] of [['plane',3],['plane-one',4],['plane-pair',5]]) {
    const size = n / width
    if (!Number.isInteger(size) || size < 2) continue
    for (let lo = 0; lo + size <= 12; lo++) {
      const core = range(size).map(i => lo + i)
      if (!core.every(i => counts[i] === 3)) continue
      const wings = groups.filter(i => !core.includes(i))
      if (width === 3 && !wings.length || width === 4 && wings.every(i => counts[i] <= 2) || width === 5 && wings.length === size && wings.every(i => counts[i] === 2)) return combo(type, lo + size - 1)
    }
  }
  const four = groups.find(i => counts[i] === 4)
  if (four !== undefined && n === 6) return combo('four-two', four)
  if (four !== undefined && n === 8 && groups.filter(i => counts[i] === 2).length === 2) return combo('four-pairs', four)
  return null
}
function beats(a,b) {
  if (!b) return true
  if (b.type === 'rocket') return false
  if (a.type === 'rocket') return true
  if (a.type === 'bomb' && b.type !== 'bomb') return true
  return a.type === b.type && a.n === b.n && a.high > b.high
}
const tile = id => Math.floor(id / 4)
function mahjongWin(hand) {
  if (hand.length !== 14) return false
  const counts = Array(34).fill(0)
  hand.forEach(i => counts[tile(i)]++)
  function melds() {
    const i = counts.findIndex(x => x > 0)
    if (i < 0) return true
    if (counts[i] >= 3) {
      counts[i] -= 3
      const win = melds()
      counts[i] += 3
      if (win) return true
    }
    if (i < 27 && i % 9 < 7 && counts[i+1] && counts[i+2]) {
      counts[i]--; counts[i+1]--; counts[i+2]--
      const win = melds()
      counts[i]++; counts[i+1]++; counts[i+2]++
      if (win) return true
    }
    return false
  }
  for (let i = 0; i < 34; i++) {
    if (counts[i] < 2) continue
    counts[i] -= 2
    const win = melds()
    counts[i] += 2
    if (win) return true
  }
  return false
}
function start(room, now) {
  const n = room.players.length
  room.status = 'playing'
  room.game = { turn:0, winner:-1, result:'', started:now }
  const g = room.game
  if (room.mode === 'gomoku') g.board = Array(225).fill(0)
  if (room.mode === 'quiz') {
    g.questions = shuffled(range(quiz.length)).slice(0, 5)
    g.progress = range(n).map(() => ({i:0, correct:0, finished:0}))
    g.deadline = now + 90000
  }
  if (room.mode === 'race') {
    g.positions = range(n).map(() => ({x:0,y:0,at:0}))
    g.started = now + 3000
  }
  if (room.mode === 'cards') {
    const deck = shuffled(range(54))
    g.hands = range(3).map(i => sortedCards(deck.slice(i*17, i*17+17)))
    g.bottom = deck.slice(51)
    g.bid = 0; g.bidder = -1; g.bids = 0; g.landlord = -1
    g.last = null; g.passes = 0
  }
  if (room.mode === 'mahjong') {
    const deck = shuffled(range(136))
    g.hands = range(4).map(i => sortedCards(deck.slice(i*13,i*13+13)))
    g.wall = deck.slice(52)
    g.discards = range(4).map(() => [])
    g.hands[0].push(g.wall.pop())
    sortedCards(g.hands[0])
  }
}
function finish(room, winner, result) {
  room.status = 'done'
  room.game.winner = winner
  room.game.result = result
}
function finishQuiz(room, now) {
  if (room.mode !== 'quiz' || room.status !== 'playing') return false
  const g = room.game
  if (now < g.deadline && g.progress.some(p => !p.finished)) return false
  const order = g.progress.map((_,i) => i).sort((a,b) => g.progress[b].correct - g.progress[a].correct || (g.progress[a].finished || Infinity) - (g.progress[b].finished || Infinity))
  const [a,b] = order
  const tied = g.progress[a].correct === g.progress[b].correct && g.progress[a].finished === g.progress[b].finished
  finish(room, tied ? -1 : a, tied ? '平局' : room.players[a].name + ' 赢得知识挑战')
  return true
}
function move(room, seat, data, now) {
  insist(room.status === 'playing', '对局尚未开始或已经结束')
  const g = room.game
  if (data.kind === 'leave') return finish(room, -1, room.players[seat].name + ' 离开，对局结束')
  if (room.mode === 'quiz') {
    if (finishQuiz(room, now)) return
    const p = g.progress[seat]
    insist(!p.finished && data.question === p.i && Number.isInteger(data.value) && data.value >= 0 && data.value < 3, '这道题已作答')
    p.correct += Number(quiz[g.questions[p.i]][2] === data.value)
    p.i++
    if (p.i === g.questions.length) p.finished = now
    finishQuiz(room, now)
    return
  }
  if (room.mode === 'race') {
    insist(now >= g.started, '等待发令')
    const p = g.positions[seat]
    const dirs = [[0,-1],[-1,0],[0,1],[1,0]]
    const d = dirs[data.value]
    insist(Array.isArray(d) && Number.isInteger(data.value) && now - p.at >= 160, '请稍后移动')
    const x = p.x + d[0], y = p.y + d[1]
    const cell = maps[room.map].grid[y]?.[x]
    if (!cell || cell === '#') return
    Object.assign(p,{x,y,at:now})
    if (cell === 'F') finish(room, seat, room.players[seat].name + ' 率先冲线')
    return
  }
  insist(g.turn === seat, '还没轮到你')
  if (room.mode === 'gomoku') {
    const i = data.value
    insist(Number.isInteger(i) && g.board[i] === 0, '请选择空位')
    const x = i % 15, y = Math.floor(i / 15), piece = seat + 1
    g.board[i] = piece
    for (const [dx,dy] of [[1,0],[0,1],[1,1],[1,-1]]) {
      let total = 1
      for (const sign of [-1,1]) for (let k = 1; k < 5; k++) {
        const xx = x + sign*k*dx, yy = y + sign*k*dy
        if (xx < 0 || xx >= 15 || yy < 0 || yy >= 15 || g.board[yy*15+xx] !== piece) break
        total++
      }
      if (total >= 5) return finish(room, seat, room.players[seat].name + ' 五子连珠')
    }
    if (!g.board.includes(0)) return finish(room,-1,'棋盘已满，平局')
  }
  if (room.mode === 'cards') {
    if (g.landlord < 0) {
      const bid = data.value
      insist(data.kind === 'bid' && Number.isInteger(bid) && (bid === 0 || bid > g.bid && bid <= 3), '请选择更高的叫分或不叫')
      if (bid > 0) { g.bid = bid; g.bidder = seat }
      g.bids++
      if (g.bids >= 3 || bid === 3) {
        if (g.bidder < 0) return finish(room, -1, '无人叫地主，本局流局')
        g.landlord = g.bidder
        g.turn = g.landlord
        g.hands[g.landlord] = sortedCards(g.hands[g.landlord].concat(g.bottom))
        return
      }
    } else if (data.kind === 'pass') {
      insist(g.last, '这一轮你必须先出牌')
      if (++g.passes === 2) { g.last = null; g.passes = 0 }
    } else {
      const cards = data.value
      insist(data.kind === 'play' && Array.isArray(cards) && cards.length && cards.length <= 20 && new Set(cards).size === cards.length && cards.every(c => g.hands[seat].includes(c)), '请选择手牌')
      const combo = cardCombo(cards)
      insist(combo && beats(combo,g.last?.combo), '这组牌型不成立或压不过上一手')
      g.last = { cards: sortedCards(cards), combo, seat }
      g.passes = 0
      g.hands[seat] = g.hands[seat].filter(c => !cards.includes(c))
      if (!g.hands[seat].length) return finish(room,seat,seat === g.landlord ? '地主获胜' : '农民获胜')
    }
  }
  if (room.mode === 'mahjong') {
    if (data.kind === 'hu') {
      insist(mahjongWin(g.hands[seat]), '还没有组成四组顺子或刻子加一对')
      return finish(room,seat,room.players[seat].name + ' 自摸胡牌')
    }
    const id = data.value
    insist(data.kind === 'discard' && g.hands[seat].includes(id), '请选择一张手牌打出')
    g.hands[seat] = g.hands[seat].filter(c => c !== id)
    g.discards[seat].push(id)
    if (!g.wall.length) return finish(room,-1,'牌墙已空，流局')
    const next = (seat + 1) % 4
    g.hands[next].push(g.wall.pop())
    sortedCards(g.hands[next])
  }
  g.turn = (seat + 1) % room.players.length
}
function publicGame(room, seat) {
  const g = room.game
  if (!g) return null
  const { turn, winner, result, started } = g
  const common = { turn, winner, result, started }
  if (room.mode === 'gomoku') return {...common,board:g.board}
  if (room.mode === 'race') return {...common,positions:g.positions.map(({x,y})=>({x,y})),grid:maps[room.map].grid.map(row => row.split(''))}
  if (room.mode === 'quiz') {
    const p = g.progress[seat], q = quiz[g.questions[p.i]]
    return {...common, index:p.i, deadline:g.deadline, question:q ? {text:q[0], options:q[1]} : null,
      progress:g.progress.map(p=>({count:p.i, correct:room.status === 'done' ? p.correct : null}))}
  }
  if (room.mode === 'cards') return {...common,hand:g.hands[seat],counts:g.hands.map(h=>h.length),last:g.last,bid:g.bid,landlord:g.landlord,bottom:g.landlord >= 0 ? g.bottom : []}
  return {...common, hand:g.hands[seat], counts:g.hands.map(h=>h.length), discards:g.discards, remaining:g.wall.length, canHu:mahjongWin(g.hands[seat])}
}
module.exports = { MODES, maps, own, insist, start, move, finishQuiz, publicGame, mahjongWin, cardCombo, beats }
