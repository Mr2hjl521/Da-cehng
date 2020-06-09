// pages/aboutUs/aboutUs.js
Page({
  data: {
    windowHeight: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    // 获取屏幕方高度
    wx.getSystemInfo({
      success: (res) => {
        console.log(res)
        that.setData({
          windowHeight: res.windowHeight- 10,
        })
      },
    })
  },

})