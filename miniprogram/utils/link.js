const icons = ['🦴','🥣','🍗','🥩','🧀','🥕','🍪','🍠']
const width = 6, height = 6
// The outside border is open, so connections can run around the board.
function connects(board, a, b) {
  if (a === b || !board[a] || board[a] !== board[b]) return false
  const targetX = b % width + 1, targetY = Math.floor(b / width) + 1
  const queue = [[a % width + 1, Math.floor(a / width) + 1, -1, 0]]
  const seen = new Set()
  const dirs = [[1,0],[-1,0],[0,1],[0,-1]]
  for (let i = 0; i < queue.length; i++) {
    const [x,y,dir,turns] = queue[i]
    for (let d = 0; d < 4; d++) {
      const nx = x + dirs[d][0], ny = y + dirs[d][1]
      const t = turns + Number(dir !== -1 && dir !== d)
      if (t > 2 || nx < 0 || ny < 0 || nx > width + 1 || ny > height + 1) continue
      if (nx === targetX && ny === targetY) return true
      if (nx > 0 && nx <= width && ny > 0 && ny <= height && board[(ny - 1) * width + nx - 1]) continue
      const key = [nx,ny,d,t].join(',')
      if (!seen.has(key)) { seen.add(key); queue.push([nx,ny,d,t]) }
    }
  }
  return false
}
function hint(board) {
  for (let i = 0; i < board.length; i++) {
    if (!board[i]) continue
    for (let j = i + 1; j < board.length; j++) if (connects(board, i, j)) return [i,j]
  }
  return []
}
// Assign pairs in an order that is itself a valid complete solution.
function shuffle(board) {
  const left = board.map((v,i) => v ? i : -1).filter(i => i >= 0)
  const pairs = board.filter(Boolean).sort().filter((_,i) => i % 2 === 0)
  for (let i = pairs.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[pairs[i], pairs[j]] = [pairs[j], pairs[i]]
  }
  return board.map((v,i) => v ? pairs[Math.floor(left.indexOf(i) / 2)] : '')
}
function create() {
  return shuffle(Array.from({length: 36}, (_,i) => icons[Math.floor(i / 2) % icons.length]))
}
module.exports = { connects, create, shuffle, hint }
