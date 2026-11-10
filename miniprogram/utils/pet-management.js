const { breedById } = require('../data/pets')
const { getState, update } = require('./store')

function manageBreed(id, { switchTo = false, ownedOnly = false, acquisition = '领养' } = {}) {
  const breed = Object.prototype.hasOwnProperty.call(breedById, id) ? breedById[id] : null
  if (!breed) return { code: 'missing', state: getState() }

  let code
  const state = update(s => {
    const owned = s.ownedPets[id]
    if (!owned && ownedOnly) { code = 'locked'; return s }
    if (switchTo && s.pet.breedId === id) { code = 'current'; return s }
    if (owned && !switchTo) { code = 'owned'; return s }
    if (!owned && s.user.score < breed.price) { code = 'insufficient'; return s }

    const now = Date.now()
    const record = { type: breed.type, breedId: id, breedName: breed.name }
    if (!owned) {
      s.user.score -= breed.price
      s.ownedPets[id] = { ...record, acquiredAt: now }
    }
    if (switchTo) {
      const { breedId, ...stats } = s.pet
      s.ownedPets[breedId] = { ...s.ownedPets[breedId], stats }
      s.lastDecayAt = now
      s.pet = { level: 1, exp: 0, mood: 100, hunger: 80, health: 100, ...owned?.stats, ...record }
    }

    const action = owned ? '切换' : acquisition
    s.petHistory.unshift({
      id: now + '_' + action + '_' + id,
      at: now, breedName: breed.name, action
    })
    s.petHistory = s.petHistory.slice(0, 50)
    code = owned ? 'switched' : 'unlocked'
    return s
  })
  return { code, state }
}

module.exports = { manageBreed }
