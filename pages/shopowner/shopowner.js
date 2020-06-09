// pages/shopowner/shopowner.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
     addlist:[],
     value:"",
    goodId:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  onShow(){
    var  shopname=wx.getStorageSync("shopname")
    if (shopname==""){
      shopname=null
    }
    var that=this
    wx.request({
      url: 'https://trd.dachan.com.cn/dacheng/product/findProductByAgentIdName',
      method:"GET",
      data:{
        agentId:wx.getStorageSync("id"),
        name: shopname
      },
      success(res){
        console.log(res,"获取上一次搜索的内容")
         that.setData({
           addlist:res.data
         })
      }
    })
  },
  onSearch(event){
    //点击搜索
    console.log(event)
    wx.setStorageSync("shopname", event.detail)
    this.onShow()
  },
  addblur(event){
    this.onShow()
  },
  onChange(event){
    wx.setStorageSync("shopname", event.detail)
  },
  //点击商品
  toDetails(e) {
    var that = this;
    console.log(e.currentTarget.dataset.id)
    var id = e.currentTarget.dataset.id;
    that.setData({
      goodId: id
    })
    var flag = wx.getStorageSync('myFlag')
    var infoShow = wx.getStorageSync('infoShow')

    // myFlag = 1  授权了地理位置  9 未授权
    if (flag == 1) {
      if (infoShow == true) {
        wx.navigateTo({
          url: '../commodityDetails/commodityDetails?id=' + id,
        })
        wx.setStorageSync("addtypea", "1")
      } else {
        // 未授权基本信息
        console.log("未授权")
        that.setData({
          getuserkey: true
        });
      }

    } else if (flag == 9) {
      // 未授权
      // console.log("未授权地理位置")；
      wx.navigateTo({
        url: '../selectPoint/selectPoint',
      })
    }

  },
})