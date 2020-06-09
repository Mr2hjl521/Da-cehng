// pages/freight/freight.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
     list:[]
  },

  onShow(){
    var that = this
    wx.request({
      url: 'https://trd.dachan.com.cn/dacheng/order/findOrderByAgentIdAndStatus',
      method: "GET",
      header: {
        'Content-Type': 'application/json',
      },
      data: {
        agentId: wx.getStorageSync("agentId"),
        oStatus:"0",
        oType:"0"
      },
      success: function (res) {
        for(var i=0;i<res.data.length;i++){
          if (res.data[i].courierFee == null) {
            res.data[i].courierFee = "待确认"
          } 
        }
        console.log(res,"获取所有")
        that.setData({
          list:res.data
        })
      },
    })
  },
  //点击订单 跳转详情
  addfire(event){
    console.log(event)
    var add = event.currentTarget.dataset
    if (add.ostyle==0){
        wx.redirectTo({
          url: '../orderDetail/orderDetail?id='+add.id + "&addtype=1",
        })
    } else{
      wx.redirectTo({
        url: '../xorderDetail/xorderDetail?id='+add.id+"&addtype=1",
      })
    }
  }
})