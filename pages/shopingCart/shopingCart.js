// pages/shopingCart/shopingCart.js
import Dialog from '../../miniprogram_npm/@vant/weapp/dialog/dialog';
import Toast from '../../miniprogram_npm/@vant/weapp/toast/toast';
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    key: 1, //是否申请合伙人
    checked: true, //全选按钮
    result: [], //商品的复选框
    allmoney: "0",
    adder: "", //判断全选按钮是否选择中
    isHead: "", //判断是不是团长  //0不是  1是
    allamoney: "",
    tomoney: "",
    arr: "",
    status: "",
    list: [],
    addnewStr:""
  },
  onLoad: function(options) {
   
    var that = this
    //查询是不是合伙人
    wx.request({
      url: "https://trd.dachan.com.cn/dacheng/userHead/findByOpenid",
      method: 'GET',
      header: {
        'Content-Type': 'application/json',
      },
      data: {
        openid: wx.getStorageSync("openId")
      },
      success: function(res) {
        
        wx.setStorageSync("uhIdd", res.data.uhId)
        console.log(res, "7444444444444444444444444444444444444444444")
        that.setData({
          isHead: res.data.isHead,
          status: res.data.status
        })
      },
    })
    var a = 0
    for (var i = 0; i < that.data.result.length; i++) {
      for (var ii = 0; ii < that.data.list.length; ii++) {
        if (that.data.result[i] == that.data.list[ii].id) {
          a += that.data.list[ii].allcoin
        }
      }
    }
    that.setData({
      allmoney: a
    })
    //获取到打折区间
    wx.request({
      url: "https://trd.dachan.com.cn/dacheng/discount/findAll?pageNum=1&pageSize=10",
      method: 'GET',
      header: {
        'Content-Type': 'application/json',
      },

      success: function(res) {
        // console.log(that.data.allamoney)
        // console.log(res)
        that.setData({
          arr: res.data.list
        })
        console.log(res.data.list)
        var addseer = 0
        for (var i = 0; i < res.data.list.length; i++) {
          //判断总价在哪个区间  进行打折
          if (that.data.allmoney >= res.data.list[i].lowPrice && that.data.allmoney <= res.data.list[i].highPrice) {
            addseer = (Number(that.data.allmoney) * Number(res.data.list[i].discountRate)).toFixed(2)
            that.setData({
              allamoney: addseer
            })
            return
          } else if (that.data.allmoney < that.data.arr[1].lowPrice) {
            addseer = that.data.allmoney
            that.setData({
              allamoney: addseer
            })
            return
          }
        }
        
      },
    })
    app.watch(this, {
      allmoney: function (newVal) {
        if (newVal < this.data.arr[0].lowPrice) {
          this.setData({
            addnewStr: `￥${this.data.arr[0].lowPrice}起订`
          })
        }
        else {
          this.setData({
            addnewStr: "结算"
          })
        }
        console.log(newVal)
      }
    })
  },
  
  //返回到首页
  addhome() {
    wx.switchTab({
      url: '../index/index',
    })
  },
  //删除
  deletes() {
    var that = this
    wx.request({
      url: "https://trd.dachan.com.cn/dacheng/shoppingCar/deleteCarByList",
      method: 'DELETE',
      header: {
        'Content-Type': 'application/json',
      },
      data: {
        "aId": 0,
        "ids": this.data.result,
        "oPrice": 0,
        "orderType": 0,
        "uhAddressId": 0,
        "uhId": wx.getStorageSync("uhIdd")
      },
      success: function(res) {
        wx.request({
          url: "https://trd.dachan.com.cn/dacheng/shoppingCar/findCarByUhId",
          method: 'GET',
          header: {
            'Content-Type': 'application/json',
          },
          data: {
            "uhId": wx.getStorageSync("uhId"),
            "agentId":wx.getStorageSync("id")
          },
          success: function(res) {
            console.log(res, "购物车列表")
            var addlist = res.data
            for (var i = 0; i < addlist.length; i++) {
              addlist[i].allcoin = (Number(addlist[i].specialPrice) * Number(addlist[i].amount)).toFixed(2)
            }
            that.setData({
              list: res.data,
              isHead: "1"
            })
            //一上来计算总价
            var a = 0
            for (var i = 0; i < that.data.result.length; i++) {
              for (var ii = 0; ii < that.data.list.length; ii++) {
                if (that.data.result[i] == that.data.list[ii].id) {
                  a += Number(that.data.list[ii].allcoin)
                }
              }
            }
            that.setData({
              allmoney: a
            })
            wx.request({
              url: "https://trd.dachan.com.cn/dacheng/discount/findAll?pageNum=1&pageSize=10",
              method: 'GET',
              header: {
                'Content-Type': 'application/json',
              },

              success: function(res) {
                console.log(res)
                Toast.success('删除成功');
                var addseer = 0
                for (var i = 0; i < res.data.list.length; i++) {
                  //判断总价在哪个区间  进行打折
                  if (that.data.allmoney >= res.data.list[i].lowPrice && that.data.allmoney <= res.data.list[i].highPrice) {
                    addseer = (Number(that.data.allmoney) * Number(res.data.list[i].discountRate)).toFixed(2)
                    that.setData({
                      allamoney: addseer
                    })
                    return
                  } else if (that.data.allmoney < that.data.arr[1].lowPrice) {
                    addseer = that.data.allmoney
                    that.setData({
                      allamoney: addseer
                    })
                    
                  }
                }
                

              },
            })
          },
        })
      },
    })
  },
  //全选按钮
  onChange(event) {
    var that = this
    this.setData({
      checked: event.detail
    });
    //判断商品的状态
    if (event.detail == true) {
      var addresult = []
      for (var i = 0; i < this.data.list.length; i++) {
        addresult.push(String(this.data.list[i].id))
      }
      this.setData({
        result: addresult
      })
    } else {
      this.setData({
        result: [],
        allamoney: "0"
      })
    }
    var a = 0
    for (var i = 0; i < this.data.result.length; i++) {
      for (var ii = 0; ii < this.data.list.length; ii++) {
        if (this.data.result[i] == this.data.list[ii].id) {
          a += Number(this.data.list[ii].allcoin)
        }
      }
    }
    this.setData({
      allmoney: a.toFixed(1)
    })
    //查询打折的区间
    wx.request({
      url: "https://trd.dachan.com.cn/dacheng/discount/findAll?pageNum=1&pageSize=10",
      method: 'GET',
      header: {
        'Content-Type': 'application/json',
      },
      success: function(res) {
        console.log(res)
        var addseer = 0
        for (var i = 0; i < res.data.list.length; i++) {
          //判断总价在哪个区间  进行打折
          if (that.data.allmoney >= res.data.list[i].lowPrice && that.data.allmoney <= res.data.list[i].highPrice) {
            addseer = (Number(that.data.allmoney) * Number(res.data.list[i].discountRate)).toFixed(2)
            that.setData({
              allamoney: addseer
            })
            return
          } else if (that.data.allmoney < that.data.arr[1].lowPrice) {
            addseer = that.data.allmoney
            that.setData({
              allamoney: addseer
            })

          }
        }
        
      },
    })
  },
  //计数器
  onChangeA(event) {
    
    var that = this
    // console.log(event.detail)
    this.data.list[event.currentTarget.dataset.id].amount = event.detail //26
    //获取当前下标
    var addnumber = Number(event.currentTarget.dataset.id)

    //点击计数器将当前总价格赋值给总的数组
    var addlist = this.data.list
    addlist[addnumber].allcoin = (Number(addlist[addnumber].amount) * Number(this.data.list[addnumber].specialPrice)).toFixed(1)
    this.setData({
      list: addlist
    })
    //addlist[addnumber].allcoin这是点击当前的食品的总价格
    var newArr = this.data.list[event.currentTarget.dataset.id]
    console.log(newArr)
    wx.request({
      url: "https://trd.dachan.com.cn/dacheng/shoppingCar",
      method: 'PUT',
      data: newArr,
      header: {
        'Content-Type': 'application/json',
      },
      success: function (res) {
        console.log(res)
      },
    })
    //判断所有所有的商品是否选中状态   选中的计算价格
    var a = 0
    for (var i = 0; i < this.data.result.length; i++) {
      for (var ii = 0; ii < this.data.list.length; ii++) {
        if (this.data.result[i] == this.data.list[ii].id) {
          a += Number(this.data.list[ii].allcoin)
        }
      }
    }
    //获取到的总价
    console.log(a, "45485645415415415415")
    this.setData({
      allmoney: a.toFixed(1)
    })
    //查询打折的区间
    wx.request({
      url: "https://trd.dachan.com.cn/dacheng/discount/findAll?pageNum=1&pageSize=10",
      method: 'GET',
      header: {
        'Content-Type': 'application/json',
      },
      success: function(res) {
        console.log(res,"41548541541541564154154541")
        var addseer = 0
        for (var i = 0; i < res.data.list.length; i++) {
          //判断总价在哪个区间  进行打折
          if (that.data.allmoney >= res.data.list[i].lowPrice && that.data.allmoney <= res.data.list[i].highPrice) {
            console.log(i,"48545515")
            addseer = (Number(that.data.allmoney) * Number(res.data.list[i].discountRate)).toFixed(2)
            that.setData({
              allamoney: addseer
            })
            return
          } else if (that.data.allmoney < that.data.arr[1].lowPrice) {
            addseer = that.data.allmoney
            that.setData({
              allamoney: addseer
            })
          }
        }
        
        that.updataNumber(event)
      },
    })
  },
  //输入框更改数量
  updataNumber(event) {
    console.log("执行更改数量",event.detail.value)
    console.log(this.data.list[event.currentTarget.dataset.id])
    var newArr = this.data.list[event.currentTarget.dataset.id]
    wx.request({
      url: "https://trd.dachan.com.cn/dacheng/shoppingCar",
      method: 'PUT',
      data: newArr,
      header: {
        'Content-Type': 'application/json',
      },
      success: function (res) {
        console.log(res)
      },
    })
  },
  //商品复选框
  onChangeB(event) {
    var that = this
    console.log(event)
    this.setData({
      result: event.detail
    });
    if (this.data.result.length == this.data.adder.length) {
      this.setData({
        checked: true
      })
    } else {
      this.setData({
        checked: false
      })
    }
    //计算商品的总价
    var a = 0
    for (var i = 0; i < that.data.result.length; i++) {
      for (var ii = 0; ii < that.data.list.length; ii++) {
        if (that.data.result[i] == that.data.list[ii].id) {
          a += Number(that.data.list[ii].allcoin)
        }
      }
    }
    this.setData({
      allmoney: a.toFixed(1)
    })
    //获取打折的区间
    wx.request({
      url: "https://trd.dachan.com.cn/dacheng/discount/findAll?pageNum=1&pageSize=10",
      method: 'GET',
      header: {
        'Content-Type': 'application/json',
      },
      success: function(res) {
        var addseer = 0
        for (var i = 0; i < res.data.list.length; i++) {
          //判断总价在哪个区间  进行打折
          if (that.data.allmoney >= res.data.list[i].lowPrice && that.data.allmoney <= res.data.list[i].highPrice) {
            addseer = (Number(that.data.allmoney) * Number(res.data.list[i].discountRate)).toFixed(2)
            that.setData({
              allamoney: addseer
            })
            return
          } else if (that.data.allmoney < that.data.arr[1].lowPrice) {
            addseer = that.data.allmoney
            that.setData({
              allamoney: addseer
            })
            
          }
        }
        

      },
    })
  },

  //申请合伙人
  apply() {
    wx.switchTab({
      url: '../person/person',
    })
  },
  //点击申请合伙人以后   页面显示

  onShow() {
    console.log("145151515")
    var that = this
    wx.setStorageSync("shopNum", that.data.list.length)
    console.log(wx.getStorageSync("idHade"))
    if (wx.getStorageSync("idHade") == 2) {
      this.setData({
        isHead: "1"
      })
    }
    //判断有没有申请合伙人 申请成功查询数据
    wx.request({
      url: "https://trd.dachan.com.cn/dacheng/userHead/findByOpenid",
      method: 'GET',
      header: {
        'Content-Type': 'application/json',
      },
      data: {
        openid: wx.getStorageSync("openId"),
      },
      success: function(res) {
        console.log(res, "11111111111111")
        that.setData({
          isHead: res.data.isHead,
          status: res.data.status
        })
        if (res.data.isHead == 1) {
          console.log("45417545")
          wx.request({
            // url: "https://trd.dachan.com.cn/dacheng/shoppingCar/findCarByUhId",
            url: "https://trd.dachan.com.cn/dacheng/shoppingCar/findCarByUhId",
            method: 'GET',
            header: {
              'Content-Type': 'application/json',
            },
            data: {
              "uhId": wx.getStorageSync("uhId"),
               "agentId": wx.getStorageSync("id")
              
            },
            success: function(res) {
              console.log(res, "购物车列表")
              //计算所有商品的总和
              wx.setStorageSync('shopNum', res.data.length)
              var addlist = res.data
              for (var i = 0; i < addlist.length; i++) {
                addlist[i].allcoin = (Number(addlist[i].specialPrice) * Number(addlist[i].amount)).toFixed(2)
              }
              that.setData({
                list: addlist,
                isHead: "1"
              })
              console.log(res.data.list)
              //判断全选
              if (that.data.checked == false) {
                that.setData({
                  result: []
                })
              } else {
                var addresult = []
                for (var i = 0; i < that.data.list.length; i++) {
                  addresult.push(String(that.data.list[i].id))
                }
                that.setData({
                  result: addresult,
                  adder: addresult
                })
              }
              //计算  商品总的价格 赋值
              var a = 0
              for (var i = 0; i < that.data.result.length; i++) {
                for (var ii = 0; ii < that.data.list.length; ii++) {
                  if (that.data.result[i] == that.data.list[ii].id) {
                    a += Number(that.data.list[ii].allcoin)
                  }
                }
              }
              that.setData({
                allmoney: a.toFixed(1)
              })
              wx.request({
                url: "https://trd.dachan.com.cn/dacheng/discount/findAll?pageNum=1&pageSize=10",
                method: 'GET',
                header: {
                  'Content-Type': 'application/json',
                },

                success: function(res) {
                  var addseer = 0
                  for (var i = 0; i < res.data.list.length; i++) {
                    //判断总价在哪个区间  进行打折
                    if (that.data.allmoney >= res.data.list[i].lowPrice && that.data.allmoney <= res.data.list[i].highPrice) {
                      addseer = (Number(that.data.allmoney) * Number(res.data.list[i].discountRate)).toFixed(2)
                      that.setData({
                        allamoney: addseer
                      })
                      return
                    } else if (that.data.allmoney < that.data.arr[1].lowPrice) {
                      addseer = that.data.allmoney
                      that.setData({
                        allamoney: addseer
                      })
                  
                    }
                  }
                  

                },
              })
              if (that.data.allmoney < that.data.arr[0].lowPrice) {
                that.setData({
                  addnewStr: `￥${that.data.arr[0].lowPrice}起订`
                })
              }
              else {
                that.setData({
                  addnewStr: "结算"
                })
              }
            },
          })
        }
      },
    })
  },
  //结算
  addserver() {
    if (this.data.allmoney < this.data.arr[0].lowPrice) {
      Dialog.alert({
        message: `${this.data.arr[0].lowPrice}起订`
      }).then(() => {
        // on close
      });
    } else {
      //跳转到orderpage页面 判断选中的商品 然后将商品添加到本地  
      for (var i = 0; i < this.data.result.length; i++) {
        for (var y = 0; y < this.data.list.length; y++) {
          if (this.data.result[i] == this.data.list[y].id) {
            var str = {}
            str.id = this.data.list[y].id,
              str.name = this.data.list[y].productName,
              str.url = this.data.list[y].productImage
            str.price = this.data.list[y].specialPrice
            //缺少一个列表的商品的desc
            // str.desc=this.data.list[y].
            str.num = this.data.list[y].amount
            var ashop = wx.getStorageSync('shop') || []
            //判断 如果数组中有重复替换 
            console.log(ashop)
            console.log(str)
            if (ashop == '') {
              ashop.push(str)
            } else {
              for (var q = 0; q < ashop.length; q++) {
                if (ashop[q].id == str.id) {
                  ashop.splice(q, 1)
                }
              }
              ashop.push(str)
            }
            console.log(ashop)
          }
        }
        wx.setStorageSync('shop', ashop)

      }
      wx.navigateTo({
        url: '../orderPage/orderPage',
      })
      wx.setStorageSync("addnameer", 0)
    }
  },
  //发起接龙按钮
  addso(){
    if (this.data.checked==false){
      Toast.fail('请勾选全部');
    }else{
      wx.setStorageSync("productDtoL", this.data.list)
      wx.setStorageSync("godata", "[]")
      wx.navigateTo({
        url: '../solitaire/solitaire'
      })
      wx.setStorageSync("godata", this.data.list)
    }
  }
})  