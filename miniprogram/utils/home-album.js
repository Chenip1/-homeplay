const KEY = 'home_album_v1'

function listPhotos() {
  return wx.getStorageSync(KEY) || []
}

function savePhoto(tempFilePath, identity) {
  const fs = wx.getFileSystemManager()
  return new Promise((resolve, reject) => {
    fs.saveFile({
      tempFilePath,
      success: ({ savedFilePath }) => {
        const now = Date.now()
        const photo = { ...identity, id: now + '_' + Math.random().toString(36).slice(2, 8), path: savedFilePath, at: now }
        try {
          wx.setStorageSync(KEY, [photo, ...listPhotos()])
          resolve(photo)
        } catch (error) {
          fs.unlink({ filePath: savedFilePath })
          reject(error)
        }
      },
      fail: reject
    })
  })
}

function groupPhotos(photos) {
  const groups = new Map()
  for (const photo of photos) {
    const key = JSON.stringify([photo.breedId, photo.nickname])
    if (!groups.has(key)) {
      groups.set(key, {
        id: key,
        name: photo.nickname + ' · ' + photo.breedName,
        photos: []
      })
    }
    groups.get(key).photos.push(photo)
  }
  return Array.from(groups.values())
}

module.exports = { listPhotos, savePhoto, groupPhotos }
