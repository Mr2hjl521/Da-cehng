const app = getApp()
import Toast from '../../miniprogram_npm/@vant/weapp/toast/toast';

// 轮播图.js
Page({
  data: {
    message: {},
    detailsPic: "", //详情图
    swiper: [], //轮播图
    identity: 0, //身份
    num: 1, //默认数量
    minusStatus: 'normal', //判断减号按钮是否禁用
    image: '../../pages/images/xq_03.png',
    imageA: '../../pages/images/xq_04.png',
    price: 0, //产品价格
    allPrice: 0, //数量和单价的乘积
    specialPrice: '', //团长价格
    anum: false, //多钱起送
    tap: "",
    allNum: "", //总价格
    oid: '',
    uhid: '',
    agendId: '',
    shopNum: '', //购物车数量


  },
  onLoad: function(options) {
    this.setData({
      oid: options.id,

    })
    console
    wx.request({
      url: 'https://trd.dachan.com.cn/dacheng/DataAnalysis',
      method: "POST",
      data: {
        "aId": wx.getStorageSync("id"),
        "status": 1,
        "pId": options.id,
        "openid": wx.getStorageSync("openId"),
      },
      success: function(res) {
        console.log(res, "成功")
      }
    })

    wx.request({
      url: 'https://trd.dachan.com.cn/dacheng/DataAnalysis',
      method: "POST",
      data: {
        "aId": wx.getStorageSync("id"),
        "status": 2,
        "pId": options.id,
        "openid": wx.getStorageSync("openId"),
      },
      success: function(res) {
        console.log(res, "成功")
      }
    })

    wx.request({
      url: 'https://trd.dachan.com.cn/dacheng/DataAnalysis',
      method: "POST",
      data: {
        "aId": wx.getStorageSync("id"),
        "status": 3,
        "pId": options.id,
        "openid": wx.getStorageSync("openId"),
      },
      success: function(res) {
        console.log(res, "成功")
      }
    })
    wx.request({
      url: 'https://trd.dachan.com.cn/dacheng/discount/findAll?pageNum=1&pageSize=10',
      method: 'GET',
      header: {
        'Content-Type': 'application/json',
      },
      success: function(res) {
        //获取默认数量 * 价格 
        that.setData({
          anum: res.data.list[0].lowPrice
        })
        //判断
        var sta = that.data.specialPrice
        if (sta < res.data.list[0].lowPrice) {
          that.setData({
            tap: false
          })
        } else {
          that.setData({
            tap: true
          })
        }
        for (var i = 0; i < res.length; i++) {
          if (res.data.list[i].lowPrice < that.data.specialPrice * that.data.num < res.data.list[i].highPrice) {
            var zhePrice = that.data.specialPrice * that.data.num * res.data.list[i].discountRat
          }
        }
      }
    })
    //监听购买数量 去求总和
    app.watch(this, {
      num: function(newvalue) {
        var identity = this.__data__.identity
        var price = this.__data__.price //普通民众价格
        var tuanPrice = this.__data__.message.specialPrice
        //如果是团长 使用哪个价格 如果是普通 使用哪个价格 
        if (identity == 0) {
          var allPrice = tuanPrice * newvalue
        } else {
          var allPrice = price * newvalue
        }
        this.setData({
          allPrice: allPrice
        })
      }
    })
    this.setData({
      nameInfo: {
        name: 'haha',
        sex: 'boy'
      }
    })
    //接收上个界面的id（options)
    console.log(options.id)
    var id = options.id;
    var that = this;
    //获取身份
    var identity = wx.getStorageSync('identity')
    that.setData({
      identity: identity
    })
    //首页
    wx.request({
      url: 'https://trd.dachan.com.cn/dacheng/product',
      data: {
        id: id,
        agentid: wx.getStorageSync('id')
      },
      header: {
        'content-type': 'application/json'
      },
      success(res) {
        console.log(res, "商品详细信息 ")
        var swiperImg = []
        var list = res.data.productImageList;
        var price = res.data.price;
        var speciaPrice = res.data.specialPrice;
        that.setData({
          specialPrice: speciaPrice
        })
        for (var i = 0; i < list.length; i++) {
          if (list[i].status == 1) {
            // 详情图
            that.setData({
              detailsPic: list[i].imageUrl,
              price: price
            })
          } else {
            swiperImg.push(list[i].imageUrl);
            that.setData({
              swiper: swiperImg
            })
          }

        }
        that.setData({
          //message页面信息对象
          message: res.data
        })
      }
    })
  },
  onChange(event) {
    var that = this
    console.log(event.detail);
    that.setData({
      num: event.detail
    })
    var num = event.detail * this.data.specialPrice
    console.log(num)
    if (num < this.data.anum) {
      this.setData({
        tap: false,
        allNum: num
      })
    } else {
      this.setData({
        tap: true,
        allNum: num
      })
      wx.request({
        url: 'https://trd.dachan.com.cn/dacheng/discount/findAll?pageNum=1&pageSize=10',
        method: 'GET',
        header: {
          'Content-Type': 'application/json',
        },
        success: function(res) {
          console.log('www', res)
          //获取默认数量 * 价格 
          that.setData({
            anum: res.data.list[0].lowPrice
          })
          //判断
        }
      })
    }
  },
  //跳转页面
  orderPage: function() {
    var that = this
    var dName = that.data.message.name
    var dId = that.data.message.id
    var dImageUrl = that.data.message.imageUrl
    var identity = that.data.message.identity
    var desc = that.data.message.desc;
    var num = that.data.num
    var price = that.data.specialPrice

    var b = {}
    b.id = dId,
      b.name = dName,
      b.url = dImageUrl || ''
    b.price = price
    b.desc = desc
    b.num = num
    var c = wx.getStorageSync('shop') || []
    // console.log(c)
    if (c.length == "") {
      c.push(b)
    } else {
      // for(var i=0;i<c.length;i++){
      //   if(c[i].id == b.id){
      //     c.splice(i,1)
      //   }
      // }
      c.splice(0, 1, b)
    }
    wx.navigateTo({
      url: '../orderPage/orderPage',
      success: function() {
        wx.setStorageSync("shop", [])
        wx.setStorageSync('shop', c)
      },
    })
    wx.setStorageSync("addnameer", 1)
  },
  //加入购物车
  goCar: function(res) {
    var that = this
    wx.request({
      url: 'https://trd.dachan.com.cn/dacheng/shoppingCar',
      data: {
        amount: this.data.num,
        pId: this.data.oid,
        uhId: this.data.uhid,
        agentId: this.data.agendId
      },
      method: 'post',
      header: {
        'content-type': 'application/json'
      },
      success: function(res) {
        Toast.success("加入成功");
        console.log("加入购物车", res)
        console.log(res, "gouwuche ")
        var id = wx.getStorageSync('uhId')
        wx.request({
          url: 'https://trd.dachan.com.cn/dacheng/shoppingCar/findCarByUhId',
          method: 'get',
          header: {
            'content-type': 'application/json'
          },
          data: {
            uhId: wx.getStorageSync("uhId"),
            agentId: wx.getStorageSync("id")
          },
          success(res) {
            that.setData({
              shopNum: res.data.length
            })
            //zai 
          }
        })
        // wx.switchTab({
        //     url: '../shopingCart/shopingCart',
        // })
      }
    })
  },
  onShow: function() {
    //获取购物车数量  
    var that = this
    var id = wx.getStorageSync('uhIdd')
    wx.request({
      url: 'https://trd.dachan.com.cn/dacheng/shoppingCar/findCarByUhId',
      method: 'get',
      header: {
        'content-type': 'application/json'
      },
      data: {
        uhId: wx.getStorageSync("uhId"),
        agentId: wx.getStorageSync("id")
      },
      success(res) {
        that.setData({
          shopNum: res.data.length
        })
        //zai 
      }
    })
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
          uhid: res.data.uhId
        })
      }
    })
    var that = this
    var agendId = wx.getStorageSync('id')
    that.setData({
      agendId: agendId
    })
    //获取购物车种类数量 
    wx.request({
      url: "https://trd.dachan.com.cn/dacheng/discount/findAll?pageNum=1&pageSize=100",
      method: 'get',
      header: {
        'content-type': 'application/json'
      },
      success(res) {}
    })

  },
  goshopping() {
    wx.switchTab({
      url: '../shopingCart/shopingCart',
    })
  },
  onClickLeft() {
    if (wx.getStorageSync("addtypea") == 1) {
      wx.switchTab({
        url: '../index/index',
      })
    } else {
      wx.switchTab({
        url: '../category/category',
      })
    }

  },
  onHide: function() {},
  previewImage: function(e) {
    console.log(e)
    console.log(this.data.swiper[0])
    var current = e.target.dataset.src;
    wx.previewImage({
      current: e.currentTarget.dataset.image, // 当前显示图片的http链接 
      urls: this.data.swiper // 需要预览的图片http链接列表 
    })
  },
})