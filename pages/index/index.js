//获取应用实例
const app = getApp()
var startX, endX;
var moveFlag = true;// 判断执行滑动事件
import Toast from '../../miniprogram_npm/@vant/weapp/toast/toast';
var QQMapWX = require('../../utils/qqmap-wx-jssdk.js');
var qqmapsdk;
Page({
    data: {
      addleftB:"",//鼠标点击时,
      addleft:0,
      idders:null,
      idder:0,
      active:null,
      todolist:[],
      addnumber:"",
        addwidth:"1000rpx",
        addshow:false,
        gifUrl: "https://trd.dachan.com.cn/dacheng/resource/image/a/a/2020/03/06/qi.gif",
        goodId: 1, //点击的具体商品ID
        getuserkey: false, //授权基本信息弹窗开关
        windows: false, //首次进入app展示的性能说明弹窗
        value: "",
        pickupTime: '', //字体时间
        agentId: 0, // 代理商ID
        agentInfo: {}, // 店铺信息
        swiperList: [], //轮播图
        hasUserInfo: false,
        windowHeight: 500, //屏幕高度
        canIUse: wx.canIUse('button.open-type.getUserInfo'),
        phone: "", //店铺手机号,
        identity: '', //
        oldPrice: 163, //旧商品价格
        range: '', //配送半径
        deliveryTime: '', //同城配送时间
        categoryList: [],
        addlist:[],//热销商品
        navData: [{
                text: '全部',
                show: 1
            },
            {
                text: '缤纷小食'
            }
        ],
        currentTab: 0,
        navScrollLeft: 0,
        goodsList: [],
        city:""
    },
    onLoad: function(options) {
        var that = this;
        //获取身份
        //首页性能介绍弹窗 开
        that.setData({ windows: true });
        // onload 查询一次轮播图就行  1次
        wx.request({
            url: 'https://trd.dachan.com.cn/dacheng/carousel/findAll?pageNum=1&pageSize=10',
            data: {},
            header: {
                'content-type': 'application/json'
            },
            success(res) {
                console.log(res)
                that.setData({
                    swiperList: res.data.list
                })
            }
        })
    },
    onShow: function() {
      if (wx.getStorageSync("openId")){
        wx.request({
          url: 'https://trd.dachan.com.cn/dacheng/userHead/findAllByOpenid',
          data: {
            openid: wx.getStorageSync("openId")
          },
          method: 'GET', 
          header: {
            'content-type': 'application/json'
          },
          success(res) {
            console.log(res.data.identity) //身份
            console.log(res.data.isHead) //团长审核状态
            //将身份更新
            var identity = Number(res.data.identity)
            // var isHead = Number(res.data.isHead)
            // // console.log(identity)
            wx.setStorageSync("identity", res.data.identity)
            // console.log(that.data.num2)
            // that.getorderNum()
          }

        })
      }else{
        console.log("没有登录")
      }
      // 查询二级分类
      wx.request({
        url: 'https://trd.dachan.com.cn/dacheng/categoryTwo/findAll?pageNum=1&pageSize=10',
        data: {},
        header: {
          'content-type': 'application/json'
        },
        success(res) {
          console.log(res.data.list, "二级分类")
          that.setData({
            todolist: res.data.list
          })
        }
      })
      this.setData({
        addleft: 0
      }
      )
      //判断手机号按钮是否出现
      var ifphoneshow= wx.getStorageSync(' ifphoneshow')
        wx.setStorageSync("shop", [])
        var that = this;
        var identity = wx.getStorageSync('identity') || ''
        that.setData({
            identity: identity,
          ifphoneshow: ifphoneshow
        })
        var id = wx.getStorageSync('id')
        if (id) {
            // 如果有id说明是从缓存里面取的agentid 是从【选择代理商页面来的】
            // 查询店铺信息
            wx.request({
                    url: 'https://trd.dachan.com.cn/dacheng/agent?id=' + id,
                    data: {},
                    header: {
                        'content-type': 'application/json'
                    },
                    success(res) {
                        console.log("1111111111111111111111111", res)
                        that.setData({
                            agentInfo: res.data,
                            phone: res.data.phone,
                            deliveryTime: res.data.deliveryTime
                        })
                        console.log("ppppphobne", that.data.phone)
                    }
                })
                // 查询推荐商品信息
            wx.request({
                    url: 'https://trd.dachan.com.cn/dacheng/product/findProductByAgentId?agentId=' + id,
                    // url: 'https://trd.dachan.com.cn/dacheng/product/findProductByAgentId?agentId=' + id,

                    data: {},
                    header: {
                        'content-type': 'application/json'
                    },
                    success(res) {
                        console.log("1111111111111111111111111111", res.data)
                        that.setData({
                            goodsList: res.data
                        })
                    }
                })
                // 查询热销商品
              wx.request({
                url: 'https://trd.dachan.com.cn/dacheng/product/findHotProductByAgentId',
                data: {
                  agentId:wx.getStorageSync("id")
                },
                header: {
                  'content-type': 'application/json'
                },
                success(res) {
                   console.log(res,"获取热销商品")
                   var addwidth=res.data.length * 270+"rpx"
                   that.setData({
                      addlist:res.data,
                      addwidth: addwidth
                   })
                }
              })
                //查询用户有没有添加到小程序
                if (!wx.getStorageSync("openId")) {
                    that.setData({
                        idder:"1"
                    })
                }
                else {
                  wx.request({
                    url: 'https://trd.dachan.com.cn/dacheng/userHead/findAllByOpenid',
                    method: "GET",
                    data: {
                      openid: wx.getStorageSync("openId")
                    },
                    success: function (res) {
                      console.log(res, "添加我的小程序")
                      that.setData({
                        idder: res.data.isAdd
                      })
                    }
                  })
                }
                //查询所有分类
            wx.request({
                    url: 'https://trd.dachan.com.cn/dacheng/category/findAll?pageNum=1&pageSize=10',
                    data: {},
                    header: {
                        'content-type': 'application/json'
                    },
                    success(res) {
                        console.log("qweqweqw")
                        console.log(res)
                        that.setData({
                            categoryList: res.data.list
                        })
                    }
                })
                //根据Id查询配送半径及时间
            wx.request({
                url: 'https://trd.dachan.com.cn/dacheng/agent?id=' + id,
                data: {},
                header: {
                    'content-type': 'application/json'
                },
                success(res) {
                    console.log("77777777777777777", res)
                    that.setData({
                        range: res.data.range,
                        deliveryTime: res.data.delivery_time,
                        pickupTime: res.data.pickupTime
                    })
                }
            })
        } else {
            //页面传值来的  先不做处理
        }

    },
    //旗帜动图加载成功之后执行
    gifImgLoad(e) {
        var gifurl = this.data.gifUrl;
        var nowTime = +new Date();
        setTimeout(() => {
            this.setData({
                gifUrl: gifurl + '?' + nowTime
            })
        }, 500)
    },
    getUserInfo: function(e) {
        console.log(e)
        app.globalData.userInfo = e.detail.userInfo
        console.log("aaaaaaaaaaaaa")
        this.setData({
            userInfo: e.detail.userInfo,
            hasUserInfo: true,
        })
    },
    switchNav(event) {
        var cur = event.currentTarget.dataset.current;
        //每个tab选项宽度占1/5
        var singleNavWidth = this.data.windowWidth / 5;
        //tab选项居中                            
        this.setData({
            navScrollLeft: (cur - 2) * singleNavWidth
        })
        if (this.data.currentTab == cur) {
            return false;
        } else {
            this.setData({
                currentTab: cur
            })
        }
    },
    switchTab(event) {
        var cur = event.detail.current;
        var singleNavWidth = this.data.windowWidth / 5;
        this.setData({
            currentTab: cur,
            navScrollLeft: (cur - 2) * singleNavWidth
        });
    },
    // 切换城市
    toChangeCity() {
        wx.navigateTo({
            url: '../selectPoint/selectPoint',
        })
    },
    // 根据分类栏1跳转至具体分类
    toCategory(e) {
        console.log(e.currentTarget.dataset.id)
        var cId = e.currentTarget.dataset.id;
        wx.setStorageSync('categoryId', cId);
        wx.switchTab({
            url: '../category/category',
        })
    },
    // 跳转至具体商品
    toDetails(e) {
        var that = this;
        console.log(e.currentTarget.dataset.id)
        var id = e.currentTarget.dataset.id;
        that.setData({
            goodId: id,
        })
        var flag = wx.getStorageSync('myFlag')
        var infoShow = wx.getStorageSync('infoShow')

        // myFlag = 1  授权了地理位置  9 未授权
        if (flag == 1) {
            if (infoShow == true) {
                wx.navigateTo({
                    url: '../commodityDetails/commodityDetails?id=' + id,
                })
              wx.setStorageSync("addtypea", "1")
            } else {
                // 未授权基本信息
                console.log("未授权")
                that.setData({
                    getuserkey: true
                });
            }

        } else if (flag == 9) {
            // 未授权
            // console.log("未授权地理位置")；
            wx.navigateTo({
                url: '../selectPoint/selectPoint',
            })
        }

    },
    // 关闭授权弹窗
    giveup() {
        this.setData({
            getuserkey: false
        });
    },
    // 点击"立即登录"
    bindGetUserInfo: function(e) {
      console.log("1545415")
      // wx.getLocation({
      //   type: 'wgs84',
      //   success: function (res) {
      //     console.log(res, "经纬度");
      //     that.setData({
      //       latitude: res.latitude,
      //       longitude: res.longitude
      //     })
      //   }
      // })
        var that = this;
        console.log("1213")
        that.setData({
          getuserkey: false
        })
        if (e.detail.userInfo) {
            console.log("用户点击了按钮！");
            wx.login({
                    success: function(res) {
                        console.log(res)
                        var code = res.code; //发送给服务器的code 
                        console.log("code:============" + code);

                        // 获取用户信息
                        wx.getUserInfo({
                            success: function(res) {
                                console.log("=======================", res)
                                var iv = res.iv;
                                var encryptedData = res.encryptedData
                                    // console.log(res.userInfo);
                                var nickName = res.userInfo.nickName; //用户昵称 
                                var avatarUrl = res.userInfo.avatarUrl; //用户头像地址 
                                var gender = res.userInfo.gender; //用户性别
                                // 把头像昵称存进缓存
                                wx.setStorageSync('nickName', nickName);
                                // console.log("缓存里面的nickName======" + wx.getStorageSync('nickName'))
                                wx.setStorageSync('avatarUrl', avatarUrl);
                                // console.log("缓存里面的avatarUrl======" + wx.getStorageSync('avatarUrl'))
                                // 把flag存进缓存
                                wx.setStorageSync('infoShow', true);
                                 wx.setStorageSync("ifphoneshow", true)
                                that.setData({
                                    infoShow: true,
                                    nickName: res.userInfo.nickName,
                                    avatarUrl: res.userInfo.avatarUrl,
                                    getuserkey: false
                                })
                                if (code) {
                                    //判断有没有orderOpenId
                                    var orderOpenId = wx.getStorageSync('orderOpenId')
                      
                                    that.addAllmap()
                                    setTimeout(function(){
                                     

                                      if (orderOpenId) {
                                        // 是被人邀请来的   
                                        wx.request({
                                          url: 'https://trd.dachan.com.cn/dacheng/weChat/wxLogin',
                                          data: {
                                            code: code,
                                            encryptedData: encryptedData,
                                            iv: iv,
                                            headOpenId: orderOpenId,
                                            address: that.data.city
                                          },
                                          method: 'POST',
                                          header: {
                                            'content-type': 'application/json'
                                          },
                                          success(res) {
                                            // 提示用户登录成功
                                            wx.showToast({
                                              title: "登录成功",
                                              icon: 'success', //图标，支持"success"、"loading" 
                                              duration: 1000, //提示的延迟时间，单位毫秒，默认：1500 
                                              mask: false, //是否显示透明蒙层，防止触摸穿透，默认：false 
                                              success: function () { },
                                              fail: function () { },
                                              complete: function () { }
                                            })
                                            console.log("1111111111111111")
                                            console.log(res.data)
                                            console.log(res.data.userInfo.openId)
                                            console.log(res.data.session_key)
                                            var session_key = res.data.session_key;
                                            var openId = res.data.userInfo.openId;
                                            // 缓存session_key
                                            wx.setStorageSync('session_key', session_key);
                                            // 缓存openid
                                            wx.setStorageSync('openId', openId);
                                            // 拿到openid 查此人的身份
                                            wx.request({
                                              url: 'https://trd.dachan.com.cn/dacheng/userHead/findAllByOpenid',
                                              // url: 'https://192.168.3.22:8081/userHead/findAllByOpenid',
                                              data: {
                                                openid: openId
                                              },
                                              method: 'GET',
                                              header: {
                                                'content-type': 'application/json'
                                              },
                                              success(res) {
                                                console.log(res.data.identity) //身份
                                                //将身份更新
                                                var identity = Number(res.data.identity)
                                                wx.request({
                                                  url: 'https://trd.dachan.com.cn/dacheng/userHead/findByOpenid',
                                                  data: {
                                                    openid: openId
                                                  },
                                                  method: 'get',
                                                  header: {
                                                    'content-type': 'application/json'
                                                  },
                                                  success(res) {
                                                    console.log("66666666666666", res)
                                                    wx.setStorageSync('identity', res.data.isHead)
                                                    wx.setStorageSync('uhId', res.data.uhId)
                                                  }
                                                })
                                                that.setData({
                                                  identity: identity
                                                })
                                                // 团长人数加1  
                                                wx.request({
                                                  url: 'https://trd.dachan.com.cn/dacheng/userHead/updateNumber',
                                                  data: {
                                                    openid: orderOpenId
                                                  },
                                                  method: 'GET',
                                                  header: {
                                                    'content-type': 'application/json'
                                                  },
                                                  success(res) {
                                                    console.log("团长邀请人+1请求成功") //
                                                  }
                                                })
                                              }
                                            })

                                          }
                                        })
                                      } else {
                                        // 没有被邀请的自己进来的 ===========发请求给后端

                                        wx.request({
                                          url: 'https://trd.dachan.com.cn/dacheng/weChat/wxLogin',
                                          data: {
                                            code: code,
                                            encryptedData: encryptedData,
                                            iv: iv,
                                            address: that.data.city
                                          },
                                          method: 'POST',
                                          header: {
                                            'content-type': 'application/json'
                                          },
                                          success(res) {
                                            // 提示用户登录成功
                                            console.log(res, "我是登录")
                                            wx.showToast({
                                              title: "登录成功",
                                              icon: 'success', //图标，支持"success"、"loading" 
                                              duration: 1000, //提示的延迟时间，单位毫秒，默认：1500 
                                              mask: false, //是否显示透明蒙层，防止触摸穿透，默认：false 
                                              success: function () { },
                                              fail: function () { },
                                              complete: function () { }
                                            })

                                            console.log("999999999999999", res)
                                            console.log(res.data.userInfo.openId)
                                            console.log(res.data.session_key)
                                            var session_key = res.data.session_key;
                                            var openId = res.data.userInfo.openId;

                                            // 缓存session_key
                                            wx.setStorageSync('session_key', session_key);
                                            // 缓存openid
                                            wx.setStorageSync('openId', openId);
                                            // 拿到openid 查此人的身份
                                            wx.request({
                                              url: 'https://trd.dachan.com.cn/dacheng/userHead/findAllByOpenid',
                                              data: {
                                                openid: openId
                                              },
                                              method: 'GET',
                                              header: {
                                                'content-type': 'application/json'
                                              },
                                              success(res) {
                                                console.log(res.data.identity) //身份
                                                console.log(res.data.isHead) //团长审核状态
                                                //将身份更新
                                                var identity = Number(res.data.identity)
                                                // var isHead = Number(res.data.isHead)
                                                // // console.log(identity)
                                                wx.setStorageSync("identity",res.data.identity)
                                                // console.log(that.data.num2)
                                                // that.getorderNum()
                                              },

                                            })
                                            wx.request({
                                              url: 'https://trd.dachan.com.cn/dacheng/userHead/findAllByOpenid',
                                              data: {
                                                openid: openId
                                              },
                                              method: 'GET',
                                              header: {
                                                'content-type': 'application/json'
                                              },
                                              success(res) {
                                                console.log(res.data.identity) //身份
                                                //将身份更新
                                                var identity = Number(res.data.identity)
                                                wx.setStorageSync(identity, identity)
                                                wx.request({
                                                  url: 'https://trd.dachan.com.cn/dacheng/userHead/findByOpenid',
                                                  data: {
                                                    openid: openId
                                                  },
                                                  method: 'get',
                                                  header: {
                                                    'content-type': 'application/json'
                                                  },
                                                  success(res) {
                                                    console.log("66666666666666", res)
                                                    wx.setStorageSync('identity', res.data.isHead)
                                                    wx.setStorageSync('uhId', res.data.uhId)
                                                  }
                                                })
                                                console.log(identity)
                                                that.setData({
                                                  identity: identity
                                                })
                                              }
                                            })

                                          }
                                        })

                                      }
                                    },500)
                                    
                                } else {
                                    console.log("获取用户登录态失败！");
                                }
                            }
                        })
                    },
                    fail: function(error) {
                        console.log('login failed ' + error);
                    },

                })
                //用户按了允许授权按钮
            console.log("用户允许了授权")
        } else {
            console.log("用户拒绝了按钮！");

        }
    },

    // 首页性能介绍弹窗 关
    closeWindow() {
        this.setData({ windows: false });
    },

    //  点击客服图标
    cellPhone: function() {
        var phone = this.data.phone;
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
    //点击轮播图 跳转我的页面
  drunpPerson:function(){
    wx.switchTab({
      url: '../person/person',
    })
  },
  //点击添加
  addservrt(){
    this.setData({
      addshow:true
    })
  },
  //我记住了 去试试
  addshi(){
    var that=this
    if (!wx.getStorageSync("openId")){
      Toast.fail('请先登录');
       that.setData({
         addshow:false
       })
     }
     else{
        wx.request({
          url: 'https://trd.dachan.com.cn/dacheng/user/updateIsAdd',
          method:"PUT",
          data:{
            openid: wx.getStorageSync("openId")
          },
          success:function(res){
              console.log(res,"添加我的小程序")
            that.setData({
              addshow: false,
              idder:"1"
            })
          }
        })
     }
  },
  mytouchstart(e){
     var addleftB = e.changedTouches[0].pageX
     this.setData({
       addleftB: addleftB
     })
  },
  touchend(e){
    if (this.data.addnumber=="左滑"){
      console.log(Math.abs(Number(this.data.addleft)))
      if (Math.abs(Number(this.data.addleft)) >= Number(this.data.addlist.length)*222-(222*3)){
        this.setData({
          addleft: this.data.addleft
        })
      }else{
        this.setData({
          addleft: Number(this.data.addleft) - 222*3
        })
      }
    }else{
      if (this.data.addleft>=0){
          this.setData({
            addleft:0
          })
      }else{
        this.setData({
          addleft: Number(this.data.addleft) + 222 * 3
        })
      // if (this.data.addleft == 0 || this.data.addleft==60){
      //   this.setData({
      //     addleft: 0
      //   })
      //   }else{
      //   this.setData({
      //     addleft: Number(this.data.addleft) + 660
      //   })
      //   }
      }
    }
  },
  mytouchmove(e){
    var addleftA = e.changedTouches[0].pageX
    var addnumber = addleftA - this.data.addleftB
    if (addnumber>0){
       this.setData({
         addnumber:"右滑"
       })
       console.log("右滑")
    }
    else{
      this.setData({
        addnumber: "左滑"
      })
      console.log("左滑")
    }
  },
  toDetailsA(event){
    console.log(event)
    wx.setStorageSync("addtypea", 1)
    wx.navigateTo({
      url: '../commodityDetails/commodityDetails?id=' + event.currentTarget.dataset.id,
    })
  },
  addfocus(){
    wx.navigateTo({
      url: '../shopowner/shopowner',
    })
  },
  //点击进入 地图
  cellmap(){
    //12  用来判断是不是从首页 进去的 如果是就让他进地图   如果不是 就让他返回index
    wx.redirectTo({
      url: '../map/map?id=12',
    })
  },
  //获取经纬度  
  addAllmap(){
    qqmapsdk = new QQMapWX({
      key: '67SBZ-ATLCP-DVJDK-VWVKB-GKY7Q-TRFCO' // 必填
    });
    var that=this
    wx.getLocation({
      type: 'wgs84',
      success: function (res) {
        console.log(res, "经纬度");
        that.setData({
          latitude: res.latitude,
          longitude: res.longitude
        })
        //将获取到的 经纬度 转化 为抵制
        qqmapsdk.reverseGeocoder({
          location: {
            latitude: res.latitude,
            longitude: res.longitude
          },
          success: function (addressRes) {
            console.log(addressRes)
            // 缓存用户授权了地理位置的flag
            wx.setStorageSync('myFlag', 1);
            var province = addressRes.result.address_component.province; //省
            var city =   addressRes.result.address_component.city; //市
            var district = addressRes.result.address_component.district; //区
            var address = addressRes.result.address; //详细地址
            if (province=="天津市"){
              that.setData({
                city: "天津" + city,
              })
            } else if (province == "上海市"){
              that.setData({
                city: "上海" + city,
              })
            } 
            else if (province == "北京市") {
              that.setData({
                city: "北京" + city,
              })
            } 
            else if (province == "重庆市") {
              that.setData({
                city: "重庆" + city,
              })
            } else{
              that.setData({
                city: province+ city,
              })
            }
          }
        })
      }
    })
  },
  //点击除了第一个轮播图以外的所有数据
  drunpPersonA(event){
    //获取下标
    var idder = event.currentTarget.dataset.index
    var that = this;
    var id = event.currentTarget.dataset.id;
    that.setData({
      goodId: id
    })
    var flag = wx.getStorageSync('myFlag')
    var infoShow = wx.getStorageSync('infoShow')

    // myFlag = 1  授权了地理位置  9 未授权
    if (flag == 1) {
      if (infoShow == true) {
        wx.navigateTo({
          url: '../commodityDetails/commodityDetails?id=' + this.data.swiperList[idder].productId,
        })
        wx.setStorageSync("addtypea", "1")
      } else {
        // 未授权基本信息
        console.log("未授权")
        that.setData({
          getuserkey: true
        });
      }

    } else if (flag == 9) {
      // 未授权
      // console.log("未授权地理位置")；
      wx.navigateTo({
        url: '../selectPoint/selectPoint',
      })
    }

      
      //  wx.redirectTo({
      //    url: '../commodityDetails/commodityDetails?id=' + this.data.swiperList[id].productId,
      //  })
  } ,
  //二级分类
   onChange(event) {
     var that=this
     console.log(event)
    // wx.showToast({
    //   title: `切换到标签 ${event.detail.name}`,
    //   icon: 'none'
    // });
     wx.request({
       url: 'https://trd.dachan.com.cn/dacheng/product/findProductByTwo',
       data: {
         agentId:wx.getStorageSync("id"),
         categoryTwoId: this.data.todolist[event.detail.index].id
       },
       header: {
         'content-type': 'application/json'
       },
       success(res) {
         console.log("二级分类的东西", res)
         that.setData({
           goodsList: res.data
         })
       }
     })
  },
  addserver(){
    console.log("15415")
    var that=this
    wx.request({
      url: 'https://trd.dachan.com.cn/dacheng/product/findProductByAgentId?agentId='+wx.getStorageSync("id"),
      // url: 'https://trd.dachan.com.cn/dacheng/product/findProductByAgentId?agentId=' + id,

      data: {},
      header: {
        'content-type': 'application/json'
      },
      success(res) {
        console.log("获取所有的产品", res.data)
        that.setData({
          goodsList: res.data
        })
      }
    })
  },
  addser(){
    this.setData({
      getuserkey:false
    })
  }
}) 