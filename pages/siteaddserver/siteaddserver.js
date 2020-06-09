// pages/siteaddserver/siteaddserver.js
var QQMapWX = require('../../utils/qqmap-wx-jssdk.js');
import Dialog from '../../miniprogram_npm/@vant/weapp/dialog/dialog';
var qqmapsdk;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    sive:"",
    username:"",
    agentsList:""
  },

  onShow: function () {
    var that=this
    wx.getLocation({
      type: 'wgs84',
      success: function (res) {
        console.log(res)
        qqmapsdk = new QQMapWX({
          key: '67SBZ-ATLCP-DVJDK-VWVKB-GKY7Q-TRFCO' // 必填
        })
        qqmapsdk.reverseGeocoder({
          location: {
            latitude: res.latitude,
            longitude: res.longitude
          },
          success: function (addressRes) {
            console.log(addressRes)
            var province = addressRes.result.address_component.province;
            console.log(province)
            if (province=="天津市"){
              province="天津天津市"
            } else if (province == "北京市"){
              province = "北京北京市"
            } else if (province == "上海市") {
              province = "上海上海市"
            }
            else if (province == "重庆市") {
              province = "重庆重庆市"
            }
            that.setData({
              sive: province
            })
          }
        })
      }
    })
  },
  //输入框
  onChange(event){
    this.setData({
      username: event.detail
    })
  },
  //点击搜索按钮
  onClickIcon(){
    var that=this
    wx.request({
      url: 'https://trd.dachan.com.cn/dacheng/agent/findAgentByAddressShopName',
      method:"GET",
      data:{
        address: this.data.sive,
        shopName: this.data.username
      },
      success:function(res){
        console.log(res)
        if (res.data.code==1){
          Dialog.alert({
            message: '此地区暂无该商铺'
          }).then(() => {
            
          });
        }
        else{
           that.setData({
             agentsList:res.data.data
           }) 
        }
      }
    })
  },
  //点击代理商
  toDetails(event) {
    var id = Number(event.currentTarget.id);
    console.log(id);
    // 把代理商ID存缓存
    wx.setStorageSync('id', id);
    wx.request({
      url: 'https://trd.dachan.com.cn/dacheng/DataAnalysis',
      method: "POST",
      data: {
        "aId": wx.getStorageSync("id"),
        "status": 0
      },
      success: function (res) {
        console.log(res, "成功")
      }
    })
    // switchTab页面不能传值哈
    wx.switchTab({
      url: '/pages/index/index',
    })
  },
})