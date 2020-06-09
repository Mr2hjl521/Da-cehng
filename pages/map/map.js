
Page({

  /**
   * 页面的初始数据
   */
  data: {
     id:""
  },
  onLoad(options){
    this.setData({
      id: options.id
    })
  }, 
  onShow(){
    var that=this
    setTimeout(function(){
      wx.request({
        url: 'https://trd.dachan.com.cn/dacheng/agent',
        method: "get",
        data: {
          id: wx.getStorageSync("id")
        },
        success: function (res) {
          console.log(res)
          let plugin = requirePlugin('routePlan');
          let key = '67SBZ-ATLCP-DVJDK-VWVKB-GKY7Q-TRFCO';  //使用在腾讯位置服务申请的key
          let referer = '大成优+';   //调用插件的app的名称
          let navigation=1
          let endPoint = JSON.stringify({  //终点
            'name': res.data.address,
            'latitude': res.data.latitude,
            'longitude': res.data.longitude
          });
          if (that.data.id == 12) {
            wx.navigateTo({
              url: 'plugin://routePlan/index?key=' + key + '&referer=' + referer + '&endPoint=' + endPoint + "&navigation=" + navigation
            });
          } else {
            wx.switchTab({
              url: '../index/index',
            })
          }
        }
      })
    },200)
  },
  onHide(){

    this.setData({
      id:""
    })
  }
})