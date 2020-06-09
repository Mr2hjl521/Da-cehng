import Dialog from '../../miniprogram_npm/@vant/weapp/dialog/dialog';
import Toast from '../../miniprogram_npm/@vant/weapp/toast/toast';
Page({
    data: { 
        orderDetail: {},
        oid: '',
        message: "",
        status:'',
        addtype:"",
        value:""

    },
    // 生命周期函数--监听页面加载
    onLoad: function(options) {
      console.log(options)
        this.setData({
            oid: options.id,
            addtype: options.addtype
        })
        this.getlist()
    },
    // 生命周期函数--监听页面初次渲染完成
    //取消订单函数
    refuse(e) {
        var that = this
        wx.request({
          url: 'https://trd.dachan.com.cn/dacheng/order',
            method: 'put',
            data: {
                "oStatus": 5,
                "id": that.data.oid
            },
            header: {
                'content-type': 'application/json'
            },
            success(res) {}
        })
    },
    //确认下单函数
    sure(e) {
        var that = this
        wx.request({
          url: 'https://trd.dachan.com.cn/dacheng/order/confirmOrder?orderId=' + that.data.oid,
            method: 'put',
            data: {
                "orderId": that.data.oid
            },
            header: {
                'content-type': 'application/json'
            },
            success(res) {}
        })
    },
    //确认收货函数
    delivery(e) {
        var that = this
        wx.request({
          url: 'https://trd.dachan.com.cn/dacheng/order/updateOrderStatus?orderId=' + that.data.oid,
            method: 'PUT',
            data: {
                "orderId": that.data.oid
            },
            header: {
                'content-type': 'application/json'
            },
            success(res) {}
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
                    url: '../orderMessage/orderMessage?type=' + that.data.oStatus,
                })
            }
        })
    },
    //确认自提
    myself(e) {
        var that = this
        wx.request({
          url: 'https://trd.dachan.com.cn/dacheng/order/updateOrderStatus?orderId=' + that.data.oid,
            method: 'PUT',
            data: {
                "orderId": that.data.oid
            },
            header: {
                'content-type': 'application/json'
            },
            success(res) {}
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
                    url: '../orderMessage/orderMessage?type=' + that.data.orderDetail.oStatus,
                })
            }
        })
    },
    //根据订单id获取信息
    getlist() {
        var that = this
        wx.request({
          url: 'https://trd.dachan.com.cn/dacheng/order',
            method: 'GET',
            data: {
                "orderId": that.data.oid
            },
            header: {
                'content-type': 'application/json'
            },
            success(res) {
                if (res.data.oStatus == 0) {
                    res.data['newstatus'] = '待确认'
                } else if (res.data.oStatus == 6) {
                    res.data['newstatus'] = '待确认'
                } else if (res.data.oStatus == 1) {
                    res.data['newstatus'] = '待收货'
                } else if (res.data.oStatus == 2) {
                    res.data['newstatus'] = '待自提'
                } else if (res.data.oStatus == 3) {
                    res.data['newstatus'] = '已完成'
                } else if (res.data.oStatus == 5) {
                    res.data['newstatus'] = '已取件'
                } else if (res.data.oStatus == 7) {
                    res.data['newstatus'] = '已完成'
                }
              console.log(res)
              if (res.data.courierFee==null){
                res.data.courierFee = '待商户确认'
              }
                that.setData({
                    orderDetail: res.data,
                    status: res.data.oStatus 
                })
              console.log(that.data.status)
              console.log(that.data.orderDetail)
            }
        })
    },
  myselfA(event) {
    console.log(event)
    Dialog.confirm({
      message: `是否拨打${event.currentTarget.dataset.id.agentPhone}`
    }).then(() => {
      wx.makePhoneCall({
        phoneNumber: event.currentTarget.dataset.id.agentPhone,
      })
    }).catch(() => {
      // on cancel
    });
  },
  onChangeA(event) {
    console.log(event)
    this.setData({
      value: event.detail
    })
  },
  //点击设置运费
  setrefuse() {
    if (this.data.value == "") {
      Toast.fail('请设置运费');
    } else {
      wx.request({
        url: 'https://trd.dachan.com.cn/dacheng/order/settingsCourierFee',
        method: 'GET',
        data: {
          "courierFee": this.data.value,
          'orderId': this.data.oid
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