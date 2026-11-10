const { update } = require("./store")

function addScore(delta) {
  return update(s => {
    s.user.score = Math.max(0, s.user.score + delta)
    return s
  })
}

function applyEffect(effect) {
  return update(s => {
    if (effect.hunger) s.pet.hunger = clamp(s.pet.hunger + effect.hunger)
    if (effect.mood) s.pet.mood = clamp(s.pet.mood + effect.mood)
    if (effect.health) s.pet.health = clamp(s.pet.health + effect.health)
    return s
  })
}

function clamp(v) {
  return Math.max(0, Math.min(100, v))
}

module.exports = { addScore, applyEffect }