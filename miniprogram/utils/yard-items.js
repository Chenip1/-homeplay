const { goods } = require('../data/goods')
const { update } = require('./store')

const goodsById = Object.fromEntries(goods.map(item => [item.id, item]))
const wearableSlots = {
  home_clothes: 'body',
  home_raincoat: 'body',
  travel_harness: 'neck',
  special_skin: 'neck'
}
// Keep the whole icon inside the yard, including when the user drags to an edge.
const limits = { left: 0.08, right: 0.92, top: 0.135, bottom: 0.865 }

function boundedPosition(x, y) {
  return {
    x: Math.max(limits.left, Math.min(limits.right, x)),
    y: Math.max(limits.top, Math.min(limits.bottom, y))
  }
}

function nextPosition(placements) {
  let best, bestDistance = -1
  for (const y of [0.5, 0.79, 0.21]) {
    for (const x of [0.5, 0.32, 0.68, 0.14, 0.86]) {
      const distance = Math.min(...placements.map(item => Math.hypot(item.x - x, (item.y - y) * 0.6)))
      if (distance > bestDistance) {
        best = { x, y }
        bestDistance = distance
      }
    }
  }
  return best
}

function placeItem(itemId) {
  let placed = false
  const state = update(s => {
    if (!Object.prototype.hasOwnProperty.call(goodsById, itemId) || !(s.inventory[itemId] > 0)) return s
    const id = Date.now() + '_' + Math.random().toString(36).slice(2, 10)
    s.inventory[itemId] -= 1
    s.yardItems = [...s.yardItems, { id, itemId, ...nextPosition(s.yardItems) }]
    placed = true
    return s
  })
  return { state, placed }
}

function collectItem(itemId) {
  let collected = false
  const state = update(s => {
    const placement = s.yardItems.slice().reverse().find(item => item.itemId === itemId)
    if (!placement) return s
    s.yardItems = s.yardItems.filter(item => item.id !== placement.id)
    s.inventory[itemId] = (s.inventory[itemId] || 0) + 1
    collected = true
    return s
  })
  return { state, collected }
}

function moveItem(id, x, y) {
  return update(s => {
    const item = s.yardItems.find(item => item.id === id)
    if (!item || !Number.isFinite(x) || !Number.isFinite(y)) return s
    s.yardItems = [...s.yardItems.filter(item => item.id !== id), { ...item, ...boundedPosition(x, y) }]
    return s
  })
}

function dressDog(id, breedId) {
  let equipped = false
  const state = update(s => {
    const placement = s.yardItems.find(item => item.id === id)
    const slot = placement && wearableSlots[placement.itemId]
    if (!slot || s.pet.type !== 'dog' || s.pet.breedId !== breedId) return s
    const previous = s.pet.outfit?.[slot]
    if (previous) s.inventory[previous] = (s.inventory[previous] || 0) + 1
    s.pet.outfit = { ...s.pet.outfit, [slot]: placement.itemId }
    s.yardItems = s.yardItems.filter(item => item.id !== id)
    equipped = true
    return s
  })
  return { state, equipped }
}

function undressDog(itemId) {
  let removed = false
  const state = update(s => {
    const slot = wearableSlots[itemId]
    if (!slot || s.pet.outfit?.[slot] !== itemId) return s
    const outfit = { ...s.pet.outfit }
    delete outfit[slot]
    s.pet.outfit = outfit
    s.inventory[itemId] = (s.inventory[itemId] || 0) + 1
    removed = true
    return s
  })
  return { state, removed }
}

function yardItemsForDisplay(state) {
  return state.yardItems.filter(item => goodsById[item.itemId]?.image).map(item => ({
    ...item,
    name: goodsById[item.itemId].name,
    image: goodsById[item.itemId].image,
    wearable: !!wearableSlots[item.itemId],
    left: item.x * 100,
    top: item.y * 100
  }))
}

module.exports = { placeItem, collectItem, moveItem, boundedPosition, yardItemsForDisplay, dressDog, undressDog, wearableSlots }
