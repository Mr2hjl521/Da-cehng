Page({

  /**
   * 页面的初始数据
   */
  xOrderList:'',//数据列表
  headImage:'',//头像

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

    //获取头像信息 
    var head = wx.getStorageSync('avatarUrl')
    console.log(head)
    this.setData({
      headImage: head
    })
    var that = this
    //获取团长接龙列表 
    wx.request({
      url: 'https://trd.dachan.com.cn/dacheng/order/findFightOrderByUhId?agentId=' + wx.getStorageSync("id") + "&uhId=" + wx.getStorageSync("uhId"),
      method:'get',
      header: {
        'Content-Type': 'application/json',
      },
      success:function(res){
        console.log(res.data,"接龙订单页")
        for (var i = 0; i < res.data.length; i++) {
          // 把时间转为2020/03/03 格式
          var olddata2 = res.data[i].creatTime.replace(/-/g, '/');
          var olddata3 = res.data[i].fightEndTime.replace(/-/g, '/');

          res.data[i].creatTime = that.adderws(olddata2)
          res.data[i].fightEndTime = that.adderws(olddata3)
          if (res.data[i].fightStatus == 0) {
            res.data[i]['newstatus'] = '正在进行'
          } else if (res.data[i].fightStatus == 1 || res.data[i].fightStatus == 2) {
            res.data[i]['newstatus'] = '已结束'
          } else if (res.data[i].fightStatus == 3) {
            res.data[i]['newstatus'] = '已取消订单'
          } 
        }
        // console.log(addsers)
        that.setData({
          xOrderList: res.data.reverse()
        })
      }
    })
  },
  // 点击进入详情
  addserve(e){
    console.log(e)
    console.log(e.currentTarget.dataset.index)
    console.log(this.data.xOrderList)
    wx.request({
      url: 'https://trd.dachan.com.cn/dacheng/fightOrder/updatess?openid=' + wx.getStorageSync("openId") + '&orderId=' + e.currentTarget.dataset.orderid,
      method: 'post',
      header: {
        'Content-Type': 'application/json',
      },
      success: function (res) {
        console.log(res.data, "查询是发起者还是参与者")
        wx.setStorageSync("judegeId",res.data)
      }
    })
    wx.navigateTo({
      url: '../addlistdetail/addlistdetail?order=' + this.data.xOrderList[e.currentTarget.dataset.index].orderId,
    })
  },
  adderws(timeA){
    var myDate = new Date(timeA);
    var a=myDate.getMonth()+1;
    var b= myDate.getDate(); //获取当前日(1-31)//获取当前月份(0-11,0代表1月)
    var c = myDate.getHours(); 
    var d = myDate.getMinutes(); 
    return a+"月"+ b + "日 "+c+":"+d
  }
})