import Dialog from '../../miniprogram_npm/@vant/weapp/dialog/dialog';
Page({
  data: {
    list:[],
    addlist:[]
  },
  onLoad(){
   
  },
  onShow(){
    //获取带过来的数据
    this.setData({
      list:wx.getStorageSync("shopcard")
    })
    var that = this
    wx.request({
      url: 'https://trd.dachan.com.cn/dacheng/order/findOrderByAgentIdAndStatus',
      method: "GET",
      header: {
        'Content-Type': 'application/json',
      },
      data: {
        agentId: wx.getStorageSync("agentId"),
        oStatus: "0",
        oType: "0"
      },
      success: function (res) {
      },
    })
    // if(this.data.list.on){

    // }
    
  }
})