// pages/freight/freight.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    active: 0,
    oStatus: "6"
  },

  onShow() {
    var that = this
    wx.request({
      url: 'https://trd.dachan.com.cn/dacheng/order/findOrderByAgentIdAndStatus',
      method: "GET",
      header: {
        'Content-Type': 'application/json',
      },
      data: {
        agentId: wx.getStorageSync("agentId"),
        oStatus: this.data.oStatus,
        oType: "0"
      },
      success: function (res) {
        console.log(res, "获取所有")
        that.setData({
          list: res.data
        })
      },
    })
  },
  //点击订单 跳转详情
  addfire(event) {
    console.log(event)
    var add = event.currentTarget.dataset
    if (add.ostyle == 0) {
      wx.redirectTo({
        url: '../orderDetail/orderDetail?id=' + add.id + "&addtype=2",
      })
    } else {
      wx.redirectTo({
        url: '../xorderDetail/xorderDetail?id=' + add.id + "&addtype=2",
      })
    }
  },
  onChange(event) {
    console.log(event)
    if (event.detail.index == 0) {
      this.setData({
        oStatus: 6
      })
    } else if (event.detail.index == 1) {
      this.setData({
        oStatus: 1
      })
    } else if (event.detail.index == 2){
      this.setData({
        oStatus: 3
      })
    }else{
      this.setData({
        oStatus: 5
      })
    }
    this.onShow()
  }
})