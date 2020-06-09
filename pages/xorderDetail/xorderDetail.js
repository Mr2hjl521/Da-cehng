
import Toast from '../../miniprogram_npm/@vant/weapp/toast/toast';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    oType: '',//判断是自提 或者配送  0是送货 1是自提
    orderList:'',//所有信息 
    storePhone:'' ,
    xid:'' ,//订单Id
    status: '',
    addtype: "",//从商家跳过来带的参数
    value:"",//运费
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.setData({
      xid:options.id,
      addtype: options.addtype
    })
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
    var that = this
    wx.request({
      url: 'https://trd.dachan.com.cn/dacheng/order/findFightOrderById?orderId='+this.data.xid,
      data:{},
      method:"GET",
      header: {
        'content-type': 'application/json'
      },
      success(res){
        console.log(res)
          if (res.data.oStatus == 0) {
            res.data['newstatus'] = '已提交'
          } else if (res.data.oStatus == 6) {
            res.data['newstatus'] = '已提交'
          } else if (res.data.oStatus == 1) {
            res.data['newstatus']= '待收货'
          } else if (res.data.oStatus == 2) {
            res.data['newstatus']= '待自提'
          } else if (res.data.oStatus == 3) {
            res.data['newstatus'] = '已完成'
          } else if (res.data.oStatus == 5) {
            res.data['newstatus'] = '已取消'
          } else if (res.data.oStatus == 7) {
            res.data['newstatus'] = '已完成'
          }
        that.setData({
          orderList:res.data,
          storePhone: res.data.agent.phone
        })
      }
    })
  },
  //  点击客服图标
  cellPhone: function () {
    var phone = this.data.storePhone;
    wx.showModal({
      title: '提示',
      content: '是否拨打电话' + phone,
      confirmText: '打电话',
      success: function (res) {
        if (res.confirm) {
          wx.makePhoneCall({
            phoneNumber: phone,
          })
        } else {
          wx.showToast({
            title: '取消拨打电话',
            duration: 500,
            icon: 'none',
            success: function () { }
          })
        }
      }
    })
  },
  //取消订单函数
  refuse(e) {
    var that = this
    wx.request({
      url: 'https://trd.dachan.com.cn/dacheng/order',
      method: 'put',
      data: {
        "oStatus": 5,
        "id": that.data.xid
      },
      header: {
        'content-type': 'application/json'
      },
      success(res) { }
    })
  },
  //确认下单函数
  sure(e) {
    console.log(e)
    var that = this
    wx.request({
      url: 'https://trd.dachan.com.cn/dacheng/order/confirmOrder?orderId=' + that.data.xid,
      method: 'put',
      data: {
        "orderId": that.data.xid
      },
      header: {
        'content-type': 'application/json'
      },
      success(res) { 
        wx.navigateTo({
          url: '../orderMessage/orderMessage?type='+1,
        })
      }
    })
  },
  //确认收货函数
  delivery(e) {
    var that = this
    wx.request({
      url: 'https://trd.dachan.com.cn/dacheng/order/updateOrderStatus?orderId=' + that.data.xid,
      method: 'PUT',
      data: {
        "orderId": that.data.xid
      },
      header: {
        'content-type': 'application/json'
      },
      success(res) { }
    })
    wx.request({
      url: 'https://trd.dachan.com.cn/dacheng/order',
      method: 'PUT',
      data: {
        "orderId": that.data.xid,
        'leaveMessage': that.data.message
      },
      header: {
        'content-type': 'application/json'
      },
      success(res) {
        wx.navigateTo({
          url: '../orderMessage/orderMessage?type=' + 3,
        })
      }
    })
  },
  //确认自提
  myself(e) {
    var that = this
    wx.request({
      url: 'https://trd.dachan.com.cn/dacheng/order/updateOrderStatus?orderId=' + that.data.xid,
      method: 'PUT',
      data: {
        "orderId": that.data.xid
      },
      header: {
        'content-type': 'application/json'
      },
      success(res) { }
    })
    wx.request({
      url: 'https://trd.dachan.com.cn/dacheng/order',
      method: 'PUT',
      data: {
        "orderId": that.data.oid,
        'leaveMessage': that.data.message
      },
      header: {
        'content-type': 'application/json'
      },
      success(res) {
        wx.navigateTo({
          url: '../orderMessage/orderMessage?type=' + 3,
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    
  },
  //设置运费
  onChangeA(event){
    console.log(event)
      this.setData({
        value: event.detail
      })
  },
  //点击设置运费
  setrefuse(){
    if (this.data.value==""){
      Toast.fail('请设置运费');
    }else{
      wx.request({
        url: 'https://trd.dachan.com.cn/dacheng/order/settingsCourierFee',
        method: 'GET',
        data: {
          "courierFee": this.data.value,
          'orderId': this.data.xid
        },
        header: {
          'content-type': 'application/json'
        },
        success(res) {
          console.log(res)
          Toast.success('设置成功');
        }
      })
    }
    
  }
})