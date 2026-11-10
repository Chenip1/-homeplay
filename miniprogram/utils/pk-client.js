const { getState } = require('./store')
// Leave empty to use the default environment configured for this mini program.
const ENV_ID = ''
let initialized = false
let heartbeat = null
let presenceQueue = Promise.resolve()
async function call(action, fields = {}) {
  if (!wx.cloud) throw new Error('当前微信版本不支持在线 PK')
  if (!initialized) {
    wx.cloud.init(ENV_ID ? { env: ENV_ID } : {})
    initialized = true
  }
  let response
  try { response = await wx.cloud.callFunction({ name: 'petPk', data: { ...fields, action } }) }
  catch (_) { throw new Error('暂时连不上 PK 大厅，请稍后再试') }
  const result = response.result
  if (!result || !result.ok) throw new Error(result?.message || '暂时无法完成操作')
  return result.data
}
function syncNest(offline = false) {
  const s = getState()
  if (!s.user.loggedIn) return Promise.resolve()
  const data = { open: !!s.user.nestOpen, offline, name: s.user.userInfo?.nickName, region: s.user.region, pet: s.pet.breedName }
  const request = presenceQueue.then(async () => {
    const count = await call('presence', data)
    if (count) wx.setTabBarBadge({index:3, text:String(count)})
    else wx.removeTabBarBadge({index:3})
  })
  presenceQueue = request.catch(() => {})
  return request
}
function startPresence() {
  if (heartbeat) return
  if (getState().user.nestOpen) syncNest().catch(() => {})
  heartbeat = setInterval(() => {
    if (getState().user.nestOpen) syncNest().catch(() => {})
  }, 15000)
}
function stopPresence() {
  if (heartbeat) clearInterval(heartbeat)
  heartbeat = null
  if (getState().user.nestOpen) syncNest(true).catch(() => {})
}
module.exports = { call, syncNest, startPresence, stopPresence }
