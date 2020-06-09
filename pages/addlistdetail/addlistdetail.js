// pages/solitairelist/solitairelist.js
import Toast from '../../miniprogram_npm/@vant/weapp/toast/toast';
import Dialog from '../../miniprogram_npm/@vant/weapp/dialog/dialog';
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    ids: "",//拿着订单 id查询
    uPhone:"",//手机号
    upDateaddlist:[],
    time: "",
    getuserkey:false,
    show: false,
    timeData: {},
    addlist: [],
    value: "",//手机号
    allmoney: "",//总价
    list: [],
    upDatashow:false,
    arr:[],
    addids: "",//分享好友进来判断有没有addids
    addvalue: 0,
    personnumber:"",//接龙人数
    addId: 0,//用来 判断按钮是否显示
    addTost:"",//用来判断满足不满足接龙架
    diaout:false,//弹出层
    addersA:"",//判断有没有 openID  1是有  0是没有
    orderOpenId:""
  },
  onLoad(option) {
    console.log(option)
    console.log(option.addids)
    this.setData({
      ids: option.order,
      addids: option.addids,
      orderOpenId: option.orderOpenId
    })
  },
  onShow() {
    if (wx.getStorageSync("openId") && wx.getStorageSync("openId")!=undefined){
        this.setData({
          getuserkey:false
        })
    } else{
      this.setData({
        getuserkey: true
      })
    }
    //获取数据
    var that = this
    
    setTimeout(function () {
      //我是邀请过来的
      if (that.data.addids != undefined || that.data.addids) {
        //我是分享进来的   addId用来判断下边所有按钮是否显示  分享进来全都不显示    addId=0
        console.log("我有addids")
        console.log(that.data.addids,"我是addids")
        //微信小程序获取授权
        if (wx.getStorageSync("openId")) {
          that.setData({
            addersA: 1
          })
          console.log(that.data.addids)
          wx.request({
            url: 'https://trd.dachan.com.cn/dacheng/fightOrder/updatess?openid=' + wx.getStorageSync("openId") + '&orderId=' + that.data.addids,
            method: 'post',
            header: {
              'Content-Type': 'application/json',
            },
            success: function (res) {
              console.log(res.data, "查询是发起者还是参与者")
              wx.setStorageSync("judegeId", res.data)
            }
          })
        } else {
          thst.setData({
            addersA: 0
          })
        }
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
            console.log(wx.getStorageSync("judegeId"),"74845")
            if (wx.getStorageSync("judegeId")=="展示全部"){
              for (var i = 0; i < res.data.fightUserOrderBos.length;i++){
                res.data.fightUserOrderBos[i]["judegeId"]="展示全部"
                }
            } else if (wx.getStorageSync("judegeId") == "null"){
              for (var i = 0; i < res.data.fightUserOrderBos.length; i++) {
                res.data.fightUserOrderBos[i]["judegeId"] = "参与者"
              }
            }
            else{
              for (var i = 0; i < res.data.fightUserOrderBos.length; i++){
                if (res.data.fightUserOrderBos[i].uOpenid == wx.getStorageSync("judegeId")){
                  res.data.fightUserOrderBos[i]["judegeId"] = "展示全部"
                }else{
                  res.data.fightUserOrderBos[i]["judegeId"] = "参与者"
                }
              }
            }
            console.log("我是邀请进来的",res)
            var myDate = new Date().valueOf();
            console.log(myDate, "本地时间")

            var timestamp = res.data.fightTime
            //  console.log(timestamp)
            var olddata2 = timestamp.replace(/-/g, '/');
            var timestamp2 = Date.parse(new Date(olddata2))
            console.log(timestamp2, "接龙结束时间")

            var newaddData = Number(timestamp2) - Number(myDate)
            console.log(newaddData, "时间差")

            //判断是自己还是分享进来的   1是自己  0是分享进来的
            if (Number(newaddData) > 0) {
              that.setData({
                addvalue: 1
              })
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
            //手机号来计算
            for (var i = 0; i < res.data.fightUserOrderBos.length; i++) {
              res.data.fightUserOrderBos[i].uPhone = that.addphone(res.data.fightUserOrderBos[i].uPhone)
            }
            console.log(res, "获取所有数据")
            // console.log(wx.getStorageSync("judegeId"), "74845")
            that.setData({
              list: res.data,
              time: newaddData,
              addlist: res.data.orderProductDtoList,
              allmoney: allmoney,
              addId: 0
            })
          }
        })
      } else {
        // 我是本人
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
            if (wx.getStorageSync("judegeId") == "展示全部") {
              for (var i = 0; i < res.data.fightUserOrderBos.length; i++) {
                res.data.fightUserOrderBos[i]["judegeId"] = "展示全部"
              }
            } else {
              for (var i = 0; i < res.data.fightUserOrderBos.length; i++) {
                if (res.data.fightUserOrderBos[i].uOpenid == wx.getStorageSync("judegeId")) {
                  res.data.fightUserOrderBos[i]["judegeId"] = "展示全部"
                } else {
                  res.data.fightUserOrderBos[i]["judegeId"] = "参与者"
                }
              }
            }
            var myDate = new Date().valueOf();
            console.log(myDate, "本地时间")

            var timestamp = res.data.fightTime
            //  console.log(timestamp)
            var olddata2 = timestamp.replace(/-/g, '/');
            var timestamp2 = Date.parse(new Date(olddata2))
            console.log(timestamp2, "接龙结束时间")

            var newaddData = Number(timestamp2) - Number(myDate)
            console.log(newaddData, "时间差")

            //判断是自己还是分享进来的   1是自己  0是分享进来的
            if (Number(newaddData) > 0) {
              that.setData({
                addvalue: 1
              })
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
            //总价
            var allmoney = 0
            for (var i = 0; i < res.data.fightUserOrderBos.length; i++) {
              for (var a = 0; a < res.data.fightUserOrderBos[i].fightProductBos.length; a++) {
                allmoney += res.data.fightUserOrderBos[i].fightProductBos[a].productAmount *
                  res.data.fightUserOrderBos[i].fightProductBos[a].uhPrice
              }
            }
            console.log(allmoney)
            //接龙人数
            console.log(res, "获取所有数据")
            that.setData({
              list: res.data,
              time: newaddData,
              addlist: res.data.orderProductDtoList,
              allmoney: allmoney,
              personnumber: res.data.fightUserOrderBos.length,
              addId: 1
            })
          }
        })
        //获取到打折区间
        wx.request({
          url: "https://trd.dachan.com.cn/dacheng/discount/findAll?pageNum=1&pageSize=10",
          method: 'GET',
          header: {
            'Content-Type': 'application/json',
          },

          success: function (res) {
            that.setData({
              arr: res.data.list
            })
            console.log(res.data.list)
          },
        })
      }
    }, 100)
  },
  adder() {
    this.onShareAppMessage()
  },
  onShareAppMessage: function () {
    // console.log(this.data.ids)
    if (this.data.addids != undefined && this.data.addids){
      return {
        title: '大成食品 享受安心美食” ',
        desc: "大成优+",
        path: 'pages/addlistdetail/addlistdetail?addids=' + this.data.addids + "&orderOpenId=" + wx.getStorageSync("openId"),
      };
    }else{
      console.log(this.data.addids)
      return {
        title: '大成食品 享受安心美食” ',
        desc: "大成优+",
        path: 'pages/addlistdetail/addlistdetail?addids=' + this.data.ids + "&orderOpenId=" + wx.getStorageSync("openId"),
      };
    }
    
  },
  onChange(e) {
    this.setData({
      timeData: e.detail
    });
  },
  //取消接龙订单
  addcancel() {
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
        console.log(res, "取消接龙订单")
        Toast.success('取消成功');
        wx.navigateTo({
          url: '../storeSolitairePage/storeSolitairePage',
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
  //修改的输入框
  onChangeB(event) {
    console.log(event.currentTarget.dataset.id)
    var add = this.data.upDateaddlist
    console.log(add)
    add[event.currentTarget.dataset.id].amount = event.detail
    this.setData({
      upDateaddlist: add
    })
  },
  //参与接龙
  addserveA() {
    var that = this
    if(that.data.value==""){
      Toast.fail("请输入手机号");
    }else(
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
    )
  },
  //手机号
  onChangeC(event) {
    this.setData({
      value: event.detail
    })
  },
  //帮自己或者好友购买
  onGotUserInfo() {
    var that = this
    //微信授权  获取code
    if (wx.getStorageInfo("openId")) {
      this.setData({
        show: true
      })
    } else {
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
  onClickLeft() {
    if (this.data.addids) {
      wx.navigateTo({
        url: '../selectPoint/selectPoint',
      })
    } else {
      wx.switchTab({
        url: '../shopingCart/shopingCart',
      })
    }
  },
  //提交订单
  addcancelA() {
    wx.setStorageSync("addnameer", 5)
    var numberser=0
    var arr = this.data.list.fightUserOrderBos
    for (var a = 0; a < arr.length;a++){
      for (var b = 0; b < arr[a].fightProductBos.length;b++){
        numberser += (arr[a].fightProductBos[b].pSpecialPrice * arr[a].fightProductBos[b].productAmount)
      }
    }
    console.log(numberser)
    console.log(this.data.arr[0].lowPrice)
    if (numberser >= this.data.arr[0].lowPrice){
      wx.navigateTo({
        url: '../orderPage/orderPage?order=' + this.data.ids + "&xshow=1",
      })
      console.log("走这里")
    }else {
      Dialog.alert({
        message: `${this.data.arr[0].lowPrice}起订`
      }).then(() => {
      });
      console.log("走这里")
    }
  },
  //删除按钮
deletas(event) {
  console.log(event)
  var that = this
  Dialog.confirm({
    message: '确认删除'
  }).then(() => {
    if (that.data.addids != undefined || that.data.addids){
      var number = event.currentTarget.dataset.indexa

      wx.request({
        url: 'https://trd.dachan.com.cn/dacheng/fightOrder/deleteUser?openid=' + that.data.list.fightUserOrderBos[number].uOpenid + "&orderId=" + this.data.addids,
        method: 'delete',
        header: {
          'Content-Type': 'application/json',
        },
        success: function (res) {
          console.log(res, "删除成功")
          Toast.success('删除成功');
          that.onShow()
        }
      })
    }else{
    var number = event.currentTarget.dataset.indexa
  
    wx.request({
      url: 'https://trd.dachan.com.cn/dacheng/fightOrder/deleteUser?openid=' + that.data.list.fightUserOrderBos[number].uOpenid + "&orderId=" + this.data.ids,
      method: 'delete',
      header: {
        'Content-Type': 'application/json',
      },
      success: function (res) {
        console.log(res, "删除成功")
        Toast.success('删除成功');
        that.onShow()
      }
    })
    }
  }).catch(() => {
    // on cancel
  });
  },
  //手机号
  addphone(addphone){
    var tel = addphone;
    tel = "" + tel;
    return tel.replace(tel.substring(3, 7), "****")
  },
  //点击 叉号
  addwrong(){
    this.setData({
      show:false
    })
  },
  //修改的叉号
  addwrongup() {
    this.setData({
      upDatashow: false
    })
  },
  //修改
  upDate(event){
    if (this.data.addids != undefined || this.data.addids){
      console.log("454")
      var number = event.currentTarget.dataset.indexa
      var that = this
      wx.request({
        url: 'https://trd.dachan.com.cn/dacheng/fightOrder/selectByoIdAndopenId?openid=' + that.data.list.fightUserOrderBos[number].uOpenid + "&orderId=" + that.data.addids,
        method: 'POST',
        header: {
          'Content-Type': 'application/json',
        },
        success: function (res) {
          that.setData({
            upDateaddlist: res.data,
            uPhone: res.data[0].uPhone,
            upDatashow: true,
          })
          console.log(res, "获取要修改的东西")
          // Toast.success('删除成功');
          that.onShow()
        }
      })
    }else{
      console.log("454")
      var number = event.currentTarget.dataset.indexa
      var that = this
      wx.request({
        url: 'https://trd.dachan.com.cn/dacheng/fightOrder/selectByoIdAndopenId?openid=' + that.data.list.fightUserOrderBos[number].uOpenid + "&orderId=" + this.data.ids,
        method: 'POST',
        header: {
          'Content-Type': 'application/json',
        },
        success: function (res) {
          that.setData({
            upDateaddlist: res.data,
            uPhone: res.data[0].uPhone,
            upDatashow: true,
          })
          console.log(res, "获取要修改的东西")
          // Toast.success('删除成功');
          that.onShow()
        }
      })
    }
  },
  //确认修改
  addserveYes(){
    var  that=this
    wx.request({
      url: 'https://trd.dachan.com.cn/dacheng/fightOrder/updateAmount',
      method: 'put',
      header: {
        'Content-Type': 'application/json',
      },
      data: {
        "fightOrderProductDtos": this.data.upDateaddlist
      },
      success: function (res) {
        console.log(res, "修改成功")
        Toast.success('修改成功');
        that.onShow()
        that.setData({
          upDatashow: false
        })
      }
    })
  },
  bindGetUserInfo() {
    var that = this;
    wx.getUserInfo({
      success: function (res) {
        var iv = res.iv;
        var encryptedData = res.encryptedData
        console.log(res)
        wx.login({
          success:function(res){
            console.log(res)
            wx.request({
              url: 'https://trd.dachan.com.cn/dacheng/weChat/wxLogin',
              data: {
                "encryptedData": encryptedData,
                "iv": iv,
                "code": res.code,
                "headOpenId": that.data.orderOpenId
              },
              method: "POST",
              success: function (res) {
                console.log(res)
                wx.setStorageSync("openId", res.data.userInfo.openId)
                that.setData({
                  getuserkey: false
                })
                that.onShow()
              },
            })
          }
          
        })
        
      },
    })

  },
  addser() {
    this.setData({
      getuserkey: false
    })
  },
  //点击取消
  giveup() {
    this.setData({
      getuserkey: false
    })
  }
})