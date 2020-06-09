// pages/addcenter/addcenter.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    active:2,
    name:"",
    address:"",
    img:""
  },
  onChange(event) {
    // event.detail 的值为当前选中项的索引
    this.setData({ active: event.detail });
    if (event.detail == 0) {
      wx.navigateTo({
        url: '../merchantName/merchantName',
      })
    } else if (event.detail == 1) {
      wx.navigateTo({
        url: '../shopgo/shopgo',
      })
    } else {
      wx.navigateTo({
        url: '../addcenter/addcenter',
      })
    }
  },
  onLoad(){
    var  that=this
    wx.request({
      url: 'https://trd.dachan.com.cn/dacheng/agent',
      method: "GET",
      data: {
        id: wx.getStorageSync("id")
      },
      success: function (res) {
        console.log(res)
        that.setData({
          name: res.data.name,
          address: res.data.address,
          img: res.data.shopImage
        })
      }
    })
  },
  password(){
    wx.redirectTo({
      url: '../amendpassword/amendpassword',
    })
  },
  addserive(){
    console.log("454")
    wx.redirectTo({
      url: '../service/service',
    })
  },
  //服务商协议
  addimage(){
    wx.redirectTo({
      url: '../dageimage/dageimage',
    })
  }
})