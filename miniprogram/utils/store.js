const KEY = "pet_app_state_v1"
const { breedById } = require('../data/pets')
const DECAY_INTERVAL_MS = 60 * 1000
const DECAY_AMOUNT = 5
const ALERT_THRESHOLD = 30

function getState() {
  const stored = wx.getStorageSync(KEY)
  if (stored) {
    const normalized = normalizeState(stored)
    wx.setStorageSync(KEY, normalized)
    return normalized
  }

  const now = Date.now()
  const init = {
    user: {
      score: 500,
      region: { province: "未选择", city: "未选择" },
      loggedIn: false,
      userInfo: null
    },
    pet: {
      type: "dog",
      breedId: "dog_tianyuan",
      breedName: "中华田园犬",
      level: 1,
      exp: 0,
      mood: 100,
      hunger: 80,
      health: 100
    },
    inventory: {
      food_dog: 1,
      food_cat: 0
    },
    messages: {
      unread: 0,
      list: []
    },
    alertFlags: {
      moodLowNotified: false,
      hungerLowNotified: false
    },
    lastDecayAt: now
  }
  return setState(init)
}

function setState(next) {
  const normalized = normalizeState(next)
  wx.setStorageSync(KEY, normalized)
  return normalized
}

function update(mutator) {
  const s = getState()
  const next = mutator({
    ...s,
    user: { ...s.user },
    pet: { ...s.pet },
    inventory: { ...s.inventory },
    messages: { unread: s.messages?.unread || 0, list: [...(s.messages?.list || [])] },
    alertFlags: {
      moodLowNotified: !!s.alertFlags?.moodLowNotified,
      hungerLowNotified: !!s.alertFlags?.hungerLowNotified
    }
  })
  return setState(next)
}

function normalizeState(state) {
  const now = Date.now()
  const next = {
    ...state,
    user: { ...(state.user || {}) },
    pet: { ...(state.pet || {}) },
    inventory: { ...(state.inventory || {}) },
    messages: {
      unread: state.messages?.unread || 0,
      list: [...(state.messages?.list || [])]
    },
    alertFlags: {
      moodLowNotified: !!state.alertFlags?.moodLowNotified,
      hungerLowNotified: !!state.alertFlags?.hungerLowNotified
    }
  }

  const starter = { type: "dog", breedId: "dog_tianyuan", breedName: "中华田园犬", acquiredAt: 0 }
  next.ownedPets = { [starter.breedId]: starter, ...(state.ownedPets || {}) }
  next.petHistory = [...(state.petHistory || [])]
  next.yardItems = [...(state.yardItems || [])]
  if (next.pet.breedId && !next.ownedPets[next.pet.breedId]) {
    const { type, breedId, breedName } = next.pet
    next.ownedPets[breedId] = { type, breedId, breedName, acquiredAt: 0 }
  }
  const currentBreed = breedById[next.pet.breedId]
  if (currentBreed) next.pet.breedName = currentBreed.name
  for (const id of Object.keys(next.ownedPets)) {
    const breed = breedById[id]
    if (breed && next.ownedPets[id].breedName !== breed.name) {
      next.ownedPets[id] = { ...next.ownedPets[id], breedName: breed.name }
    }
  }

  const lastDecayAt = Number(state.lastDecayAt || now)
  const elapsed = now - lastDecayAt
  const passedSteps = Math.max(0, Math.floor(elapsed / DECAY_INTERVAL_MS))

  if (passedSteps > 0) {
    const decay = passedSteps * DECAY_AMOUNT
    next.pet.mood = Math.max(0, Number(next.pet.mood || 0) - decay)
    next.pet.hunger = Math.max(0, Number(next.pet.hunger || 0) - decay)
    next.lastDecayAt = lastDecayAt + passedSteps * DECAY_INTERVAL_MS
  } else {
    next.lastDecayAt = lastDecayAt
  }

  ensurePetAlerts(next)
  return next
}

function ensurePetAlerts(state) {
  const mood = Number(state.pet?.mood || 0)
  const hunger = Number(state.pet?.hunger || 0)

  if (mood <= ALERT_THRESHOLD) {
    if (!state.alertFlags.moodLowNotified) {
      pushSystemMessage(
        state,
        "宠物心情偏低",
        "你的宠物现在心情不太好，记得用玩具陪它玩一会儿。"
      )
      state.alertFlags.moodLowNotified = true
    }
  } else {
    state.alertFlags.moodLowNotified = false
  }

  if (hunger <= ALERT_THRESHOLD) {
    if (!state.alertFlags.hungerLowNotified) {
      pushSystemMessage(
        state,
        "宠物有点饿了",
        "你的宠物饥饿度已经偏低，记得去商店买点食物并及时喂它。"
      )
      state.alertFlags.hungerLowNotified = true
    }
  } else {
    state.alertFlags.hungerLowNotified = false
  }
}

function pushSystemMessage(state, title, content) {
  if (!state.messages) {
    state.messages = { unread: 0, list: [] }
  }

  state.messages.list.unshift({
    id: `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    title,
    content,
    time: new Date().toLocaleString(),
    read: false
  })
  state.messages.unread = (state.messages.unread || 0) + 1
}

module.exports = { getState, setState, update }
