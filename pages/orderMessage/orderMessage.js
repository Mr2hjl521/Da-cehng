// pages/orderMessage/orderMessage.js
import Dialog from '../../miniprogram_npm/@vant/weapp/dialog/dialog';
Page({

    /**
     * 页面的初始数据
     */
    data: {
        type: '',
        address: "天津市河东区哈哈哈",
        getlist: [],
        nvg:"",
        addtype:"",
        active:""
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
      console.log(options.type)
        this.setData({
            type: options.type,
            nvg: options.nvg,
            active: options.type
        })
    },

    //生命周期函数--监听页面初次渲染完成

    onReady: function() {

    },

    //生命周期函数--监听页面显示

    onShow: function(event) {
      // 获取当前小程序的页面栈
      let pages = getCurrentPages();
      // 数组中索引最大的页面--当前页面
      let currentPage = pages[pages.length - 1];
      // 打印出当前页面中的 options
      console.log(currentPage.options)
    var that=this
     
        if (that.data.nvg){
          if (that.data.nvg == 1) {
            that.setData({
              addtype: 2,
              active: 2
            })
            setTimeout(function(){
              var uhid = wx.getStorageSync('uhId');
              wx.request({
                url: 'https://trd.dachan.com.cn/dacheng/order/findOrderByUhId',
                data: {
                  oStatus: that.data.addtype,
                  uhId: wx.getStorageSync("uhId")
                },
                method: 'get',
                header: {
                  'content-type': 'application/json'
                },
                success(res) {
                  console.log("huoqu", res)
                  for (var i = 0; i < res.data.length; i++) {
                    if (res.data[i].oStatus == 0) {
                      res.data[i]['newstatus'] = '已提交'
                    } else if (res.data[i].oStatus == 6) {
                      res.data[i]['newstatus'] = '已提交'
                    } else if (res.data[i].oStatus == 1) {
                      res.data[i]['newstatus'] = '待收货'
                    } else if (res.data[i].oStatus == 2) {
                      res.data[i]['newstatus'] = '待自提'
                    } else if (res.data[i].oStatus == 3) {
                      res.data[i]['newstatus'] = '已完成'
                    } else if (res.data[i].oStatus == 5) {
                      res.data[i]['newstatus'] = '已取消'
                    } else if (res.data[i].oStatus == 7) {
                      res.data[i]['newstatus'] = '已完成'
                    }
                  }
                  that.setData({
                    getlist: res.data
                  })

                }
              })
            },300)
            that.getorderlist()
          } else {
            that.setData({
              addtype: 0,
              active: 0
            })
             setTimeout(function(){
               var uhid = wx.getStorageSync('uhId');
               wx.request({
                 url: 'https://trd.dachan.com.cn/dacheng/order/findOrderByUhId',
                 data: {
                   oStatus: that.data.addtype,
                   uhId: wx.getStorageSync("uhId")
                 },
                 method: 'get',
                 header: {
                   'content-type': 'application/json'
                 },
                 success(res) {
                   console.log("huoqu", res)
                   for (var i = 0; i < res.data.length; i++) {
                     if (res.data[i].oStatus == 0) {
                       res.data[i]['newstatus'] = '已提交'
                     } else if (res.data[i].oStatus == 6) {
                       res.data[i]['newstatus'] = '已提交'
                     } else if (res.data[i].oStatus == 1) {
                       res.data[i]['newstatus'] = '待收货'
                     } else if (res.data[i].oStatus == 2) {
                       res.data[i]['newstatus'] = '待自提'
                     } else if (res.data[i].oStatus == 3) {
                       res.data[i]['newstatus'] = '已完成'
                     } else if (res.data[i].oStatus == 5) {
                       res.data[i]['newstatus'] = '已取消'
                     } else if (res.data[i].oStatus == 7) {
                       res.data[i]['newstatus'] = '已完成'
                     }
                   }
                   that.setData({
                     getlist: res.data
                   })

                 }
               })
             },300)
           
            that.getorderlist()
          }
        }else{
       
        
        var uhid = wx.getStorageSync('uhId');
        wx.request({
          url: 'https://trd.dachan.com.cn/dacheng/order/findOrderByUhId',
          data: {
            oStatus: that.data.addtype,
            uhId: wx.getStorageSync("uhId")
          },
          method: 'get',
          header: {
            'content-type': 'application/json'
          },
          success(res) {
            console.log("huoqu", res)
            for (var i = 0; i < res.data.length; i++) {
              if (res.data[i].oStatus == 0) {
                res.data[i]['newstatus'] = '已提交'
              } else if (res.data[i].oStatus == 6) {
                res.data[i]['newstatus'] = '已提交'
              } else if (res.data[i].oStatus == 1) {
                res.data[i]['newstatus'] = '待收货'
              } else if (res.data[i].oStatus == 2) {
                res.data[i]['newstatus'] = '待自提'
              } else if (res.data[i].oStatus == 3) {
                res.data[i]['newstatus'] = '已完成'
              } else if (res.data[i].oStatus == 5) {
                res.data[i]['newstatus'] = '已取消'
              } else if (res.data[i].oStatus == 7) {
                res.data[i]['newstatus'] = '已完成'
              }
            }
            that.setData({
              getlist: res.data
            })
          
          }
        })
          that.getorderlist()
        }





      
      
        switch (parseInt(this.data.type)) {
            case 0:
                this.setData({
                    active: 0
                })
                break;
            case 1:
                this.setData({
                    active: 1
                })
                break;
            case 2:
                this.setData({
                    active: 2
                })
                break;
            case 3:
                this.setData({
                    active: 3
                })
                break;
            case 5:
                this.setData({
                    active: 4
                })
                break;
        }
    },

    // 生命周期函数--监听页面隐藏

    onHide: function() {

    },


    //生命周期函数--监听页面卸载

    onUnload: function() {

    },

    //列表切换函数
    onChange(event) {
        var that = this
        switch (event.detail.name) {
            case 0:
                that.setData({
                    type: 0
                })
                break;
            case 1:
                that.setData({
                    type: 1
                })
                break;
            case 2:
                that.setData({
                    type: 2
                })
                break;
            case 3:
                that.setData({
                    type: 3
                })
                break;
            case 4:
                that.setData({
                    type: 5
                })
                break;
        }
        this.getorderlist()
    },
    //进入详情页
    goinfo(e) {
      console.log(e,"点击进入详情页")
        console.log(e.currentTarget.dataset.id)
        //如果是0 则进入 普通  1是接龙 
      if (e.currentTarget.dataset.style == 1){
          wx.navigateTo({
            url: '../xorderDetail/xorderDetail?id=' + e.currentTarget.dataset.id,
          })
        }
        wx.navigateTo({
            url: '../orderDetail/orderDetail?id=' + e.currentTarget.dataset.id,
        })
    },
    //取消订单函数
    refuse(e) {
        var that = this
      Dialog.confirm({
        title: '订单',
        message: '您确定取消订单吗'
      }).then(() => {
        wx.request({
          url: 'https://trd.dachan.com.cn/dacheng/order',
          method: 'put',
          data: {
            "oStatus": 5,
            "id": e.currentTarget.dataset.id
          },
          header: {
            'content-type': 'application/json'
          },
          success(res) {
            that.getorderlist()
          }
        })
      }).catch(() => {
       
      });
    
    },
    //确认下单函数
    sure(e) {
      var that = this
      Dialog.confirm({
        title: '确认订单',
        message: '您是否确认订单'
      }).then(() => {
        wx.request({
          url: 'https://trd.dachan.com.cn/dacheng/order/confirmOrder?orderId=' + e.currentTarget.dataset.id,
          method: 'put',
          data: {
            "orderId": e.currentTarget.dataset.id
          },
          header: {
            'content-type': 'application/json'
          },
          success(res) {
            that.getorderlist()
          }
        })
      }).catch(() => {
        // on cancel
      });
      
     
    },
    //确认收货函数
    delivery(e) {
        var that = this
        wx.request({
          url: 'https://trd.dachan.com.cn/dacheng/order/updateOrderStatus?orderId=' + e.currentTarget.dataset.id,
            method: 'PUT',
            data: {
                "orderId": e.currentTarget.dataset.id
            },
            header: {
                'content-type': 'application/json'
            },
            success(res) {
                that.getorderlist()
            }
        })
    },
    //确认自提
    myself(e) {
        var that = this
        wx.request({
          url: 'https://trd.dachan.com.cn/dacheng/order/updateOrderStatus?orderId=' + e.currentTarget.dataset.id,
            method: 'PUT',
            data: {
                "orderId": e.currentTarget.dataset.id
            },
            header: {
                'content-type': 'application/json'
            },
            success(res) {
                that.getorderlist()
            }
        })
    },
    //前往评价
    evaluate(e) {
        console.log('我要去评价' + e.currentTarget.dataset.id)
        wx.navigateTo({
            url: '../evaluate/evaluate?id=' + e.currentTarget.dataset.id,
        })
    },
    //删除订单
    dele(e) {
        console.log(e.currentTarget.dataset.id)
        var that = this
        wx.request({
          url: 'https://trd.dachan.com.cn/dacheng/order?id=' + e.currentTarget.dataset.id,
            method: 'DELETE',
            data: {
                "id": e.currentTarget.dataset.id
            },
            header: {
                'content-type': 'application/json'
            },
            success(res) {
                that.getorderlist()
            }
        })
    },
    //获取订单
    getorderlist() {
        console.log("456")
        var that = this
        var uhid = wx.getStorageSync('uhId');
        wx.request({
          url: 'https://trd.dachan.com.cn/dacheng/order/findOrderByUhId',
            data: {
                oStatus: that.data.type,
                uhId: wx.getStorageSync("uhId")
            },
            method: 'get',
            header: {
                'content-type': 'application/json'
            },
            success(res) {
                console.log("huoqu", res)
                for (var i = 0; i < res.data.length; i++) {
                    if (res.data[i].oStatus == 0) {
                        res.data[i]['newstatus'] = '已提交'
                    } else if (res.data[i].oStatus == 6) {
                        res.data[i]['newstatus'] = '已提交'
                    } else if (res.data[i].oStatus == 1) {
                        res.data[i]['newstatus'] = '待收货'
                    } else if (res.data[i].oStatus == 2) {
                        res.data[i]['newstatus'] = '待自提'
                    } else if (res.data[i].oStatus == 3) {
                        res.data[i]['newstatus'] = '已完成'
                    } else if (res.data[i].oStatus == 5) {
                        res.data[i]['newstatus'] = '已取消'
                    } else if (res.data[i].oStatus == 7) {
                        res.data[i]['newstatus'] = '已完成'
                    }
                }
                that.setData({
                    getlist: res.data
                })
               
            }
        })
    },
  onClickLeft(){
    wx.switchTab({
      url: '../person/person',
    })
  }
})