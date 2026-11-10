let profileEntryFromRegion = false

function backToTab(fallback) {
  wx.navigateBack({
    delta: 1,
    fail: () => wx.switchTab({ url: fallback })
  })
}

function openProfileFromRegion() {
  profileEntryFromRegion = true
  wx.switchTab({
    url: '/pages/profile/profile',
    fail: () => { profileEntryFromRegion = false }
  })
}

function takeProfileEntryFromRegion() {
  const fromRegion = profileEntryFromRegion
  profileEntryFromRegion = false
  return fromRegion
}

module.exports = { backToTab, openProfileFromRegion, takeProfileEntryFromRegion }
