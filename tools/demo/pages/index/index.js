Page({
  data: {
    solar: '',
    lunar: '2016-09-01',
  },
  bindSolarChange(e) {
    this.setData({
      solar: e.detail.value,
    })
  },
  bindLunarChange(e) {
    this.setData({
      lunar: e.detail.value,
    })
  },
})
