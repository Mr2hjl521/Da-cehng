// pages/solitairelist/solitairelist.js
import Toast from '../../miniprogram_npm/@vant/weapp/toast/toast';
// import Dialog from '../../miniprogram_npm/@vant/weapp/dialog/dialog';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    arr:"",//打折区间
    ids:"",//拿着订单 id查询
    time: "",
    show:false,
    timeData: {},
    addlist:[],
    value:"",//手机号
    allmoney:"",//总价
    list:[],
    addids: "",//分享好友进来判断有没有addids
    addvalue:0,
    addId:0,//用来 判断按钮是否显示
    // addTost:""//用来判断满足不满足接龙架
  },
  onLoad(option){
    console.log(option)
    console.log(option.addids)
    this.setData({
      ids: option.ids,
      addids: option.addids
    })
  },
  onShow(){
    //微信小程序获取授权
    wx.getLocation({
      success(res) {
        that.setData({
          currentLon: res.longitude,
          currentLat: res.latitude,
        });
      },
      fail: function () {
        wx.getSetting({
          success: function (res) {
            var statu = res.authSetting;
            if (!statu['scope.userLocation']) {
              wx.showModal({
                title: '是否授权当前位置',
                content: '需要获取您的地理位置，请确认授权，否则地图功能将无法使用',
                success: function (tip) {
                  console.log(1)
                  if (tip.confirm) {
                    console.log(1)
                    wx.openSetting({
                      success: function (data) {
                        if (data.authSetting["scope.userLocation"] === true) {
                          wx.showToast({
                            title: '授权成功',
                            icon: 'success',
                            duration: 1000
                          })
                          wx.getLocation({
                            success(res) {
                              that.setData({
                                currentLon: res.longitude,
                                currentLat: res.latitude,
                              });
                            },
                          });
                        } else {
                          wx.showToast({
                            title: '授权失败',
                            icon: 'success',
                            duration: 1000
                          })
                          wx.navigateBack({
                            delta: -1
                          });
                        }
                      }
                    })
                  } else {
                    wx.navigateBack({
                      delta: -1
                    });
                  }
                }
              })
            }
          },
          fail: function (res) {
            wx.showToast({
              title: '调用授权窗口失败',
              icon: 'success',
              duration: 1000
            })
            wx.navigateBack({
              delta: -1
            });
          }
        })
      }
    })
    //获取数据
    var that = this
     setTimeout(function(){
       //我是分享进来的   addId用来判断下边所有按钮是否显示  分享进来全都不显示    addId=0
       if (that.data.addids){
         console.log("我有addids")
         wx.request({
           url: 'https://trd.dachan.com.cn/dacheng/shoppingCar/findByOId',
           method: 'get',
           header: {
             'Content-Type': 'application/json',
           },
           data: {
             orderId: that.data.addids
           },
           success: function (res) {
             console.log(res,"454545")
             var myDate = new Date().valueOf();
             console.log(myDate, "本地时间")

             var timestamp = res.data.fightTime
             //  console.log(timestamp)
             var olddata2 = timestamp.replace(/-/g, '/');
             var timestamp2 = Date.parse(new Date(olddata2))
             console.log(timestamp2, "接龙结束时间")

             var newaddData = Number(timestamp2) - Number(myDate)
             console.log(newaddData, "时间差")
             
             //判断是自己还是分享进来的   1是自己  2是分享进来的
             if (Number(newaddData)>0){
               that.setData({
                 addvalue: 1
               })
               console.log("1111111111111111111111111")
             }else{
                if (that.addids){
                   wx.navigateTo({
                     url: '../uncancel/uncancel',
                   })
              }else{
                  that.setData({
                    addvalue: 0
                  })
              }
             }
            

             for (var i = 0; i < res.data.orderProductDtoList.length; i++) {
               res.data.orderProductDtoList[i]["amount"] = ""
             }
             //手机号
             for (var i = 0; i < res.data.fightUserOrderBos.length; i++) {
               res.data.fightUserOrderBos[i].uPhone = that.addphone(res.data.fightUserOrderBos[i].uPhone)
             }
             var allmoney = 0
             for (var i = 0; i < res.data.fightUserOrderBos.length; i++) {
               for (var a = 0; a < res.data.fightUserOrderBos[i].fightProductBos.length; a++) {
                 allmoney += res.data.fightUserOrderBos[i].fightProductBos[a].productAmount *
                   res.data.fightUserOrderBos[i].fightProductBos[a].uhPrice
               }
             }
             console.log(allmoney)

             console.log(res, "获取所有数据")
             that.setData({
               list: res.data,
               time: newaddData,
               addlist: res.data.orderProductDtoList,
               allmoney: allmoney,
               addId:0
             })
           }
         })
        }else{
        console.log("我没有")

         wx.request({
           url: 'https://trd.dachan.com.cn/dacheng/shoppingCar/findByOId',
           method: 'get',
           header: {
             'Content-Type': 'application/json',
           },
           data: {
             orderId: that.data.ids
           },
           success: function (res) {
             var myDate = new Date().valueOf();
             console.log(myDate, "本地时间")
             
             var timestamp = res.data.fightTime
             //  console.log(timestamp)
             var olddata2 = timestamp.replace(/-/g, '/');
             var timestamp2 = Date.parse(new Date(olddata2))
             console.log(timestamp2, "接龙结束时间")

             var newaddData = Number(timestamp2) - Number(myDate)
             console.log(newaddData, "时间差")

             //判断是自己还是分享进来的   1是自己  2是分享进来的
             if (Number(newaddData) > 0) {
               that.setData({
                 addvalue:1
               })
               console.log("1111111111111111111111111")
             } else {
               if (that.addids) {
                 wx.navigateTo({
                   url: '../uncancel/uncancel',
                 })
               } else {
                 that.setData({
                   addvalue: 0
                 })
               }
             }
             for (var i = 0; i < res.data.orderProductDtoList.length; i++) {
               res.data.orderProductDtoList[i]["amount"] = ""
             }
            
             var allmoney = 0
             for (var i = 0; i < res.data.fightUserOrderBos.length; i++) {
               for (var a = 0; a < res.data.fightUserOrderBos[i].fightProductBos.length; a++) {
                 allmoney += res.data.fightUserOrderBos[i].fightProductBos[a].productAmount *
                   res.data.fightUserOrderBos[i].fightProductBos[a].uhPrice
               }
             }
             console.log(allmoney)

             console.log(res, "获取所有数据")
             that.setData({
               list: res.data,
               time: newaddData,
               addlist: res.data.orderProductDtoList,
               allmoney: allmoney,
               addId: 1
             })
           }
         })

        //  //获取到打折区间
        //  wx.request({
        //    url: "https://trd.dachan.com.cn/dacheng/discount/findAll?pageNum=1&pageSize=10",
        //    method: 'GET',
        //    header: {
        //      'Content-Type': 'application/json',
        //    },

        //    success: function (res) {
      
        //      that.setData({
        //        arr: res.data.list
        //      })
        //      console.log(res.data.list)
        //      var addseer = 0
        //      for (var i = 0; i < res.data.list.length; i++) {
        //        //判断总价在哪个区间  进行打折
        //        if (that.data.allmoney > res.data.list[i].lowPrice && that.data.allmoney < res.data.list[i].highPrice) {
        //           that.setData({
        //               addTost:"提交订单"
        //           })
        //          return
        //        } else if (that.data.allmoney <= that.data.arr[1].lowPrice) {
        //          that.setData({
        //              addTost: `满￥${that.data.arr[1].lowPrice}接龙`
        //          })
        //          return
        //        }
        //      }

        //    },
        //  })

        }
     },30)
  },
  adder(){
    this.onShareAppMessage()
  },
  onShareAppMessage: function () {
    console.log(this.data.ids)
    console.log("123")
    return {
      title: '大成食品 享受安心美食” ',
      desc: "大成优+",
      path: 'pages/addlistdetail/addlistdetail?addids=' + this.data.ids + "&orderOpenId=" + wx.getStorageSync("openId"),
    
    };
  },
  onChange(e) {
    this.setData({
      timeData: e.detail
    });
  },
  //取消接龙订单
  addcancel(){
    wx.request({
      url: 'https://trd.dachan.com.cn/dacheng/order/cancelFightOrder',
      method: 'get',
      header: {
        'Content-Type': 'application/json',
      },
      data: {
        orderId: this.data.ids
      },
      success: function (res) {
        Toast.success('取消成功');
        console.log(res, "取消接龙订单")
        wx.switchTab({
          url: '../shopingCart/shopingCart',
        })
      }
    })
  },
  // input输入框
  onChangeA(event) {
    console.log(event.currentTarget.dataset.id)
    var add = this.data.addlist
    console.log(add)
    add[event.currentTarget.dataset.id].amount = event.detail
    this.setData({
      addlist: add
    })
  },
  onChangeC(){
      console.log("1523")
  },
  //参与接龙
  addserveA(){
    var that=this
    if(that.data.value==""){
      Toast.fail('请输入手机号');
    }else{
      wx.request({
        url: 'https://trd.dachan.com.cn/dacheng/fightOrder',
        method: 'post',
        header: {
          'Content-Type': 'application/json',
        },
        data: {
          "openid": wx.getStorageSync("openId"),
          "uPhone": this.data.value,
          "opDtoList": this.data.addlist
        },
        success: function (res) {
          console.log(res, "成功接龙")
          that.onShow()
          that.setData({
            show: false
          })
        }
      })
    }
  },
  //手机号
  onChangeC(event){
    this.setData({
      value:event.detail
    })
  },
  //帮自己或者好友购买
  onGotUserInfo(){
    var that=this
    //微信授权  获取code
    if (wx.getStorageInfo("openId")){
      this.setData({
        show: true
      })
    }else{
      wx.login({
        success(res) {
          console.log(res, "微信登录")
          var code = res.code
          wx.getUserInfo({
            success(res) {
              console.log(res)
              //授权成功去获取openid
              wx.request({
                url: 'https://trd.dachan.com.cn/dacheng/weChat/wxLogin',
                data: {
                  code: code,
                  encryptedData: res.encryptedData,
                  iv: res.iv,
                  headOpenId: ""
                },
                method: 'POST',
                header: {
                  'content-type': 'application/json'
                },
                success(res) {
                  console.log(res, "获取openId")
                  wx.setStorageSync("openId", res.data.session_key)
                  that.setData({
                    show: true
                  })
                }
              })
            }
          })
        }
      })
    }
  },
  //点击遮罩层
  // onClickHide(){
  //     this.setData({
  //       show:false
  //     })
  // },
  //点击返回按钮
  onClickLeft(){
    if (this.data.addids){
        wx.navigateTo({
          url: '../selectPoint/selectPoint',
        })
     }else{
       wx.switchTab({
         url: '../shopingCart/shopingCart',
       })
     }
  },
  //提交订单
  addcancelA(){
      wx.navigateTo({
        url: '../orderPage/orderPage?order=' + this.data.ids + "&xshow=1",
      })
  },
  //手机号
  addphone(addphone) {
    var tel = addphone;
    tel = "" + tel;
    return tel.replace(tel.substring(3, 7), "****")
  },
  addwrong(){
      this.setData({
        show:false
      })
  }
})