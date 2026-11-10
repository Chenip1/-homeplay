const { listPhotos, groupPhotos } = require('../../utils/home-album')
const { backToTab } = require('../../utils/navigation')

Page({
  data: { groups: [], total: 0 },

  onShow() {
    const photos = listPhotos().map(photo => ({
      ...photo, date: new Date(photo.at).toLocaleDateString()
    }))
    this.setData({ groups: groupPhotos(photos), total: photos.length })
  },

  preview(e) {
    const { group, path } = e.currentTarget.dataset
    const album = this.data.groups[group]
    if (album) wx.previewImage({ current: path, urls: album.photos.map(photo => photo.path) })
  },

  goBack() { backToTab('/pages/index/index') }
})
