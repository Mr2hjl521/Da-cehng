// pages/orderPage.js
import Toast from '../../miniprogram_npm/@vant/weapp/toast/toast';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    nvg: 0, //1代表到店自提 0代表同城配送
    orderList: '', //列表
    allNum: '', //金额总和
    discountPrice: '', //折扣价
    reallyPrice: '', //实付价格
    companyAdress: '', //代理商地址
    defalutAddress: [], //默认地址
    delivery: '0', //判断是否支持同城配送
    pickup: '0', //判断是否支持自提
    storePhone: '', //商家联系电话
    uhid: '', //团长ID
    range: '', //配送范围
    pickupTime: '', //自提时间
    pickupTimeA: '', //配送时间
    phone: '', 
    name: '', //地址列表传过来的姓名
    address: '', //地址列表传过来的地址
    id: '', //地址列表传过来的Id
    sayText: '', //备注
    newphone: '',//地址列表传过来的电话
    addnameer: "",
    showwer:"",
    //接龙的数据
    xshow:'', //  1代表接龙 
    xid:'',//接龙ID
    xorderlist:'',//接龙数据
    xleaveMessage:'',//接龙留言
    numA:'', //接龙团长价格
    xshifu:'',//接龙实付价格
    xzhekou:'',//折扣金额
    shiprice:'',
    zzz:'',
    packaging:'',//封装费
    addersTwo:""
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onLoad: function(options) {
 
    console.log("下订单页面options", options)
      this.setData({
        xshow: options.xshow,
        xid: options.order,//从接龙下订单页面传过来的Id
        addersTwo: wx.getStorageSync("addersTwo")
      })
    
    //从默认地址页面 拿过来的数据
    if (this.data.addersTwo!=""){
        this.setData({
          newphone: this.data.addersTwo.phone,
          name: this.data.addersTwo.userName,
          address: this.data.addersTwo.address, 
        })
    }
    if (options.address){
      console.log("我有数据")
      this.setData({
        newphone: options.phone,
        name: options.name,
        address: options.address,
        addressA: options.address,
        id: options.id,
        xshow:options.xshow,
        xid:options.xid
      })
    }else{
       console.log("我没有")
    }
    if (options.xLeftId) {
      console.log("添加...............", options.xLeftId)
      this.setData({
        xid: options.xLeftId
      })
    }
   
    // console.log(this.data.address)
  },
  onShow: function() {
    if(this.data.nvg==0){
      this.data.delivery=1
    }else{
      this.data.pickup=1
    }
    this.setData({
      addnameer: wx.getStorageSync("addnameer")
    })

    var that = this
    setTimeout(function () {
      var orderList = wx.getStorageSync('shop')
      that.setData({
        orderList: orderList
      })
      console.log(that.data.orderList)
      var allnum = 0;
      for (var i = 0; i < orderList.length; i++) {
        var num = orderList[i].num * orderList[i].price
        allnum += num
      }
      that.setData({
        allNum: allnum.toFixed(1)
      })
      //查询所有折扣 
      wx.request({
        url: 'https://trd.dachan.com.cn/dacheng/discount/findAll?pageNum=1&pageSize=10',
        data: {},
        header: {
          'content-type': 'application/json'
        },
        success(res) {
          console.log("查询所有折扣", res)
          //计算对应的折扣价
          console.log("总价",that.data.allNum)
          for (var i = 0; i < res.data.list.length; i++) {
            if (that.data.allNum >= res.data.list[i].lowPrice && that.data.allNum<=res.data.list[i].highPrice) {
              var discountPrice = Number(that.data.allNum) * (1 - Number(res.data.list[i].discountRate))
              var reallyPrice = Number(that.data.allNum) * Number(res.data.list[i].discountRate)
              // console.log("折扣价", discountPrice)
              // console.log(Number(1) - Number(res.data.list[i].discountRate))
              // console.log(Number(res.data.list[i].discountRate))
            }
            if (that.data.allNum > res.data.list[i].highPrice){
              var discountPrice = Number(that.data.allNum) * (1 - Number(res.data.list[i].discountRate))
              var reallyPrice = Number(that.data.allNum) * Number(res.data.list[i].discountRate)
            }
          }
          console.log("折扣价", discountPrice)
          console.log("实付价", reallyPrice)
          console.log(num, num1)
          var num = discountPrice.toFixed(1)
          var num1 = reallyPrice.toFixed(1)
          that.setData({
            discountPrice: num,
            reallyPrice: num1 
          })
          if (that.data.showwer != "") {
            if (that.data.showwer == 1) {
              that.setData({
                nvg: 0
              })
              console.log("同城")
            } else {
              that.setData({
                nvg: 1
              })
              console.log("自提")
            }
          }
        }
      })
    }, 200)
    // 通过openid 去获取团长的ID 通过团长ID区查询 用户的地址 
    var opid = wx.getStorageSync('openId') || ''
    wx.request({
      url: 'https://trd.dachan.com.cn/dacheng/userHead/findByOpenid',
      data: {
        openid: opid
      },
      method: 'GET',
      header: {
        'content-type': 'application/json'
      },
      success(res) {
        that.setData({
          uhid: res.data.uhId,
          phone: res.data.phone
        })
        wx.request({
          url: 'https://trd.dachan.com.cn/dacheng/uhAddress/findByuhId?uhId=' + res.data.uhId,
          success(res) {
            //判断默认值
            for (var i = 0; i < res.data.length; i++) {
              if (res.data[i].isDefault == 1) {
                var defaultAdd = res.data[i]
              }
            }
            console.log(defaultAdd)
            that.setData({
              defalutAddress: defaultAdd,
              delivery: res.data.delivery,
              pickup: res.data.pickup
            })
          }
        })
        //获取电话 uhid用户手机号
      }
    })
    //获取购物车种类数量 
    wx.request({
      url: "https://trd.dachan.com.cn/dacheng/discount/findAll?pageNum=1&pageSize=100",
      method: 'get',
      header: {
        'content-type': 'application/json'
      },
      success(res) {
        console.log(res)
      }
    })


    //通过ID去查代理商地址
    var did = wx.getStorageSync('id')
    if (did) {
      wx.request({
        url: 'https://trd.dachan.com.cn/dacheng/agent?id=' + did,
        data: {},
        header: {
          'content-type': 'application/json'
        },
        success(res) {
          console.log("代n理地址", res)
          //获取代理商是否支持到店自提 或者同城配送

          if (res.data.delivery == 1 && res.data.pickup == 1) {
            var num = 1
          } else if (res.data.delivery == 0 && res.data.pickup == 1) {
            var num = 1
          } else if (res.data.delivery == 1 && res.data.pickup == 0) {
            var num = 0
          } else {
            var num = 1
          }
          console.log(num)
          that.setData({
              range: res.data.range,
              pickupTime: res.data.pickupTime,
              companyAdress: res.data,
              delivery: res.data.delivery,
              pickup: res.data.pickup,
            pickupTimeA: res.data.deliveryTime,
              nvg: num,
              storePhone: res.data.phone
            },
            function() {
              console.log(this.data.address, "地址")
              if (this.data.address) {
                this.setData({
                  nvg: 0
                })
              } else {
                 
              }
            }
          )
        }
      })
    }

    //接龙数据 

    wx.request({
      url: 'https://trd.dachan.com.cn/dacheng/order/findFightOrderById?orderId=' + that.data.xid,
      method:'GET',
      data: {},
      header: {
        'content-type': 'application/json'
      },
      success:function(res){
        var aaaaa=res
        that.setData({
          xorderlist:res.data
        })
        //获取接龙的总价格
        var numData = res.data.fightUserOrderBos
        var numA = 0;//团长价格 
        for (var i = 0; i < numData.length; i++) {
          for (var y = 0; y < numData[i].fightProductBos.length; y++) {
            numA += numData[i].fightProductBos[y].productAmount * numData[i].fightProductBos[y].specialPrice.toFixed(2)
          }
        }
          //numA 总价格 
           that.setData({
              numA:numA
         })
        //查询所有折扣 

        wx.request({
          url: 'https://trd.dachan.com.cn/dacheng/discount/findAll?pageNum=1&pageSize=10',
          data: {},
          header: {
            'content-type': 'application/json'
          },
          success(res) {
            console.log("查询所有折扣", res.data.list)
            //计算对应的折扣价
            for (var i = 0; i < res.data.list.length; i++) {
              if (that.data.numA >= res.data.list[i].lowPrice && that.data.allNum <= res.data.list[i].highPrice) {
                var xzhekou = that.data.numA * (1 - res.data.list[i].discountRate)
                var xshifu = that.data.numA * res.data.list[i].discountRate
                console.log("获取折扣价格" + xzhekou)
                console.log("实际价格"+xshifu)
              }else {
                  var aq = Number(that.data.numA) + Number(aaaaa.data.fightUserOrderBos.length * 2)
                var packaginga = Number(aaaaa.data.fightUserOrderBos.length * 2)
                that.setData({
                  numA:that.data.numA,
                  xzhekou:0,
                  xshifu:that.data.numA,
                  zzz: aq,
                  packaging: packaginga
                })
              }
          
            }

            if (xzhekou >0){
              var numz = xzhekou.toFixed(1)
              var nums = xshifu.toFixed(1)

              var ss = Number(aaaaa.data.fightUserOrderBos.length * 2)
              var numaaaaaaa = Number(nums) + Number(aaaaa.data.fightUserOrderBos.length * 2)

              that.setData({
                xzhekou: numz,
                xshifu: nums,
                zzz: numaaaaaaa,
                packaging: ss
              })
            }  
           
          }
           
        })
      }
    })
  },
    //获取留言
  onChangeA(event) {
    // event.detail 为当前输入的值
    console.log(event.detail);
    this.setData({
      xleaveMessage: event.detail
    })
  },
  //获取收货地址
  goAddress: function() {
    //先获取本地地址 
    var phoneB = this.data.newphone
    var nameB = this.data.name
    var addressB = this.data.address
    var idB = this.data.id
    var xid =this.data.xid //订单Id
    if(xid != ''){
      wx.navigateTo({
        url: '../selectAddress/selectAddress?name=' + nameB + "&phone=" + phoneB + "&address=" + addressB + "&id=" + idB +"&xid="+xid,
      })
    }else {
      wx.navigateTo({
        url: '../selectAddress/selectAddress?name=' + nameB + "&phone=" + phoneB + "&address=" + addressB + "&id=" + idB,
      })
    }
  },
  //提交接龙订单
  xSubmitorder:function(){
    //留言
    var leaveMessage = this.data.xleaveMessage
    //总价格  折扣价格+封装
    var allPrice = this.data.numA
    //团长价格
    var tuanPrice = this.data.xshifu
    //订单Id
    var xid = this.data.xid
    //订单类型
    var dtype = this.data.nvg
    //封装价
    var pakingFee = this.data.packaging
    //地址ID
    var addresId = this.data.id
    console.log('总价',allPrice)
    console.log('类型',dtype)
    console.log('封装价',pakingFee)
    var that = this
    wx.request({
      url: 'https://trd.dachan.com.cn/dacheng/order/updateFightOrder',
      method:"POST",
      header: {
        'content-type': 'application/json'
      },
      data:{
        leaveMessage: leaveMessage,
        oPrice: allPrice,
        oSpecialPrice: tuanPrice,
        orderId: xid,
        orderType: dtype,
        pakingFee: pakingFee,
        uhAddId: addresId
      },
      success:function(res){
        console.log(res)
        wx.navigateTo({
          url: '../orderSuccess/orderSuccess?nvg=' + that.data.nvg
        })
      }
    })
  },
  //提交订单 添加订单
  submitOrder: function() {
    //到店自提
    // if (!this.data.address){
    //   Toast.fail('请选择地址');
    // }else{
      var that = this
      if (that.data.addnameer == "0") {
        if(that.data.nvg==0){
          if (!that.data.address){
            Toast.fail('请选择地址');
           }else{
            var arrry = wx.getStorageSync('shop')
            var list = []
            for (var i = 0; i < arrry.length; i++) {
              list.push(arrry[i].id)
            }
            console.log(list)
            var aid = wx.getStorageSync('id')
            if (that.data.nvg == 1) {
              var address = null
            } else {
              var address = that.data.address
            }
            wx.request({
              url: 'https://trd.dachan.com.cn/dacheng/shoppingCar/addOrderByCar',
              method: 'post',
              data: {
                aId: aid,
                ids: list,
                oPrice: that.data.allNum,
                orderType: that.data.nvg,
                uhId: that.data.uhid,
                uhAddressId: that.data.id,
                oSpecialPrice: that.data.reallyPrice,
                leaveMessage: that.data.sayText
              },
              header: {
                'content-type': 'application/json'
              },
              success(res) {
                wx.setStorageSync('shop', [])
                wx.request({
                  url: 'https://trd.dachan.com.cn/dacheng/shoppingCar/deleteCarByList',
                  method: 'delete',
                  data: {
                    ids: list,
                  },
                  header: {
                    'content-type': 'application/json'
                  },
                  success(res) {
                    wx.navigateTo({
                      url: '../orderSuccess/orderSuccess?nvg=' + that.data.nvg,
                    })
                  }
                })
              }
            })
           }
        }else{
          var arrry = wx.getStorageSync('shop')
          var list = []
          for (var i = 0; i < arrry.length; i++) {
            list.push(arrry[i].id)
          }
          console.log(list)
          var aid = wx.getStorageSync('id')
          if (that.data.nvg == 1) {
            var address = null
          } else {
            var address = that.data.address
          }
          wx.request({
            url: 'https://trd.dachan.com.cn/dacheng/shoppingCar/addOrderByCar',
            method: 'post',
            data: {
              aId: aid,
              ids: list,
              oPrice: that.data.allNum,
              orderType: that.data.nvg,
              uhId: that.data.uhid,
              uhAddressId: that.data.id,
              oSpecialPrice: that.data.reallyPrice,
              leaveMessage: that.data.sayText
            },
            header: {
              'content-type': 'application/json'
            },
            success(res) {
              wx.setStorageSync('shop', [])
              // wx.navigateTo({
              //       url: '../orderSuccess/orderSuccess?nvg=' + that.data.nvg,
              // })
              wx.request({
                url: 'https://trd.dachan.com.cn/dacheng/shoppingCar/deleteCarByList',
                method: 'delete',
                data: {
                  ids: list,
                },
                header: {
                  'content-type': 'application/json'
                },
                success(res) {
                  wx.navigateTo({
                    url: '../orderSuccess/orderSuccess?nvg=' + that.data.nvg,
                  })
                }
              })
            }
          })
        }
        
      } else {
        //先确认是到店自提 或者同城配送   orderList为传输的列表 
        //同城配送
        if (that.data.nvg==0){
          if (!that.data.address){
            Toast.fail('请选择地址')
          }else{
            var list = wx.getStorageSync("shop")
            var aid = wx.getStorageSync('id')
            wx.request({
              url: 'https://trd.dachan.com.cn/dacheng/order',
              method: 'post',
              header: {
                'content-type': 'application/json'
              },
              data: {
                aId: aid, //代理商ID
                uhId: that.data.uhid, //用户ID
                oType: that.data.nvg, //传输的状态
                oPrice: that.data.allNum, //总价
                oSpecialPrice: that.data.reallyPrice, //优惠之后的价格
                pId: list[0].id,
                amount: list[0].num,
                uhAddId: that.data.id,
                leaveMessage: that.data.sayText
              },
              success(res) {
                console.log(res, "提交订单")
                wx.setStorageSync('shop', [])

                wx.request({
                  url: 'https://trd.dachan.com.cn/dacheng/shoppingCar/deleteCarByList',
                  method: 'delete',
                  data: {
                    ids: list,
                  },
                  header: {
                    'content-type': 'application/json'
                  },
                  success(res) {
                    console.log(that.data.nvg)
                    wx.navigateTo({
                      url: '../orderSuccess/orderSuccess?nvg=' + that.data.nvg,
                    })
                  }
                })
              }
            })
          }
        }else{
          var list = wx.getStorageSync("shop")
          var aid = wx.getStorageSync('id')
          wx.request({
            url: 'https://trd.dachan.com.cn/dacheng/order',
            method: 'post',
            header: {
              'content-type': 'application/json'
            },
            data: {
              aId: aid, //代理商ID
              uhId: that.data.uhid, //用户ID
              oType: that.data.nvg, //传输的状态
              oPrice: that.data.allNum, //总价
              oSpecialPrice: that.data.reallyPrice, //优惠之后的价格
              pId: list[0].id,
              amount: list[0].num,
              uhAddId: that.data.id,
              leaveMessage: that.data.sayText
            },
            success(res) {
              console.log(res, "提交订单")
              wx.setStorageSync('shop', [])

              wx.request({
                url: 'https://trd.dachan.com.cn/dacheng/shoppingCar/deleteCarByList',
                method: 'delete',
                data: {
                  ids: list,
                },
                header: {
                  'content-type': 'application/json'
                },
                success(res) {
                  console.log(that.data.nvg)
                  wx.navigateTo({
                    url: '../orderSuccess/orderSuccess?nvg=' + that.data.nvg,
                  })
                }
              })
            }
          })
        }
        
      }
    

  },
  //拨打电话
  //  点击客服图标
  cellPhone: function() {
    var phone = this.data.storePhone;
    wx.showModal({
      title: '提示',
      content: '是否拨打电话' + phone,
      confirmText: '打电话',
      success: function(res) {
        if (res.confirm) {
          wx.makePhoneCall({
            phoneNumber: phone,
          })
        } else {
          wx.showToast({
            title: '取消拨打电话',
            duration: 500,
            icon: 'none',
            success: function() {}
          })
        }
      }
    })
  },
  //input数据 
  satText: function(res) {
    console.log(res)
    this.setData({
      sayText: res.detail.value
    })
  },
  toShop: function () {
    this.setData({
      nvg: 1,
      showwer: 2
    })
  },
  toCity: function () {
    this.setData({
      nvg: 0,
      showwer: 1
    })
  },
  goback() {
    //addnameer==5  是从接龙提交订单过来的
    if (this.data.addnameer == 0) {
      wx.switchTab({
        url: '../shopingCart/shopingCart',
      })
    } else if (this.data.addnameer == 5){
      wx.switchTab({
        url: '../person/person',
      })
    }
    else {
     var a= wx.getStorageSync("shop")
      wx.redirectTo({
        url: '../commodityDetails/commodityDetails?id='+a[0].id,
      })
      wx.setStorageSync("shop", [])
    }
  },
  onUnload: function () {
    // wx.setStorageSync("shop", [])
    console.log("45145")
      this.setData({
        showwer: ""
      })
  },

  
})