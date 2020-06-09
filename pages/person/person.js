// pages/person/person.js
var app = getApp();
Page({
    data: {
        canIUse: wx.canIUse('button.open-type.getUserInfo'),
        infoShow: false, // 信息齐全的falg
        nickName: "", //用户昵称
        avatarUrl: "", //头像
        phoneShow: false,
        phone: "",
        isHead: 9, //团长审核状态 1 - 未审核 2-审核中 3-通过
        img: "",
        //胡仁杰添加
        num1: 0,
        num11: 0,
        num12: 0,
        num2: 0,
        num3: 0,
        num4: 0,
        num5: 0,
        uHid: '',
        ad: '',
        ifphoneshow:false,//判断电话按钮是否显示
        identity: "" //身份用于判断显示什么内容
            //胡仁杰添加
    },
    onLoad: function(options) {
        this.setData({
            identity: wx.getStorageSync('identity')
        })

    },
    /**
     * onShow生命周期
     */
    onShow: function() {
        var ad = wx.getStorageSync('identity')
        this.setData({
          ad: ad,
        })
        
            /**
             * 每次页面显示都查询缓存里面的数据  头像+昵称+手机号
             */
        this.setData({
            identity: wx.getStorageSync("identity")
        })
        var infoShow = wx.getStorageSync('infoShow');
        if (infoShow) {
            this.setData({
                infoShow: infoShow
            })
        } else {
            this.setData({
                isHead: 1
            })
            console.log(this.data.isHead)
        }

        var phone = wx.getStorageSync('phone');
        // 如果缓存里面有手机号
        if (phone) {
            this.setData({
                phoneShow: true,
                phone: phone
            })
        } else {
            // 没有手机号
            this.setData({
                phoneShow: false
            })
        }
        var name = wx.getStorageSync('nickName');
        this.setData({
            nickName: name
        })
        var pic = wx.getStorageSync('avatarUrl');
        this.setData({
            avatarUrl: pic
        })

      //修改手机号按钮是否出现
      //获取 用户的手机号 是否存在 不存在 将本地 ifshow 变成 改变false 
      if (name) {
        if (this.data.phone == '') {
          this.setData({
            ifphoneshow: true
          })
          wx.setStorageSync('ifphoneshow', true)
        } else {
          wx.setStorageSync('ifphoneshow', false)
          this.setData({
            ifphoneshow: false
          })
        }
      } else {
        wx.setStorageSync('ifphoneshow', false)
        this.setData({
          ifphoneshow: false
        })
      }
        // 每次onshow都查用Openid查身份---identity   和审核团长的状态---isHead
        var openId = wx.getStorageSync('openId');
        if (openId) {
            // 如果infoShow存在，说明授权过，缓存里面有openId
            console.log("有openId")
            var that = this;
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
                    var isHead = Number(res.data.isHead)
                        // console.log(identity)
                    that.setData({
                        identity: identity,
                        isHead: isHead
                    })
                    console.log(that.data.num2)
                  that.getorderNum()
                },
              
            })
        } else {
            // 没有openId
            console.log("no")
        }
    }, 
    // 点击"立即登录"
    bindGetUserInfo: function(e) {
        var that = this;
        if (e.detail.userInfo) {
            console.log("用户点击了按钮！");
            wx.login({
                    success: function(res) {
                        console.log(res)
                        var code = res.code; //发送给服务器的code 
                        // 获取用户信息
                        wx.getUserInfo({
                            success: function(res) {
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
                               wx.setStorageSync(" ifphoneshow", true)
                                that.setData({
                                    infoShow: true,
                                    nickName: res.userInfo.nickName,
                                    avatarUrl: res.userInfo.avatarUrl,
                                  ifphoneshow:true
                                })
                                console.log('获取信息')
                                if (code) {
                                    //判断有没有orderOpenId
                                    var orderOpenId = wx.getStorageSync('orderOpenId')
                                    if (orderOpenId) {
                                        // 是被人邀请来的   
                                        wx.request({
                                          url: 'https://trd.dachan.com.cn/dacheng/weChat/wxLogin',
                                          // url: 'https://trd.dachan.com.cn/dacheng/weChat/wxLogin',
                                            data: {
                                                code: code,
                                                encryptedData: encryptedData,
                                                iv: iv,
                                                headOpenId: orderOpenId
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
                                                    success: function() {},
                                                    fail: function() {},
                                                    complete: function() {}
                                                })
                                                console.log(res.data)
                                                console.log(res.data.userInfo.openId)
                                                console.log(res.data.session_key)
                                                var session_key = res.data.session_key;
                                                var openId = res.data.userInfo.openId;
                                                // 缓存session_key
                                                wx.setStorageSync('session_key', session_key);
                                                // 缓存openid
                                                wx.setStorageSync('openId', openId);
                                                //胡仁杰修改---拿到openid查询此人的uhid
                                                wx.request({
                                                  url: 'https://trd.dachan.com.cn/dacheng/userHead/findByOpenid',
                                                        data: {
                                                            openid: openId
                                                        },
                                                        method: 'GET',
                                                        header: {
                                                            'content-type': 'application/json'
                                                        },
                                                        success(res) {
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
                                                                uHid: res.data.uhId,
                                                            })
                                                            console.log(that.data.uHid)
                                                            wx.setStorageSync('uhId', res.data.uhId);

                                                        }
                                                    })
                                                    //胡仁杰修改
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
                                                        console.log(res.data) //身份

                                                        //将身份更新
                                                        var identity = Number(res.data.identity)
                                                        var isHead = Number(res.data.isHead)
                                                        that.setData({
                                                                identity: identity,
                                                                isHead: isHead
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
                                                              that.getorderNum()
                                                            }
                                                        })
                                                    }
                                                })
                                            }
                                        })
                                    } else {
                                        console.log('没被邀请')
                                            // 没有被邀请的自己进来的 ===========发请求给后端
                                        wx.request({
                                          url: 'https://trd.dachan.com.cn/dacheng/weChat/wxLogin',
                                          // url: 'https://trd.dachan.com.cn/dacheng/weChat/wxLogin',
                                            data: {
                                                code: code,
                                                encryptedData: encryptedData,
                                                iv: iv
                                            },
                                            method: 'POST',
                                            header: {
                                                'content-type': 'application/json'
                                            },
                                            success(res) {
                                              console.log(res,"1111111111111111111111111")
                                                // 提示用户登录成功
                                                wx.showToast({
                                                    title: "登录成功",
                                                    icon: 'success', //图标，支持"success"、"loading" 
                                                    duration: 1000, //提示的延迟时间，单位毫秒，默认：1500 
                                                    mask: false, //是否显示透明蒙层，防止触摸穿透，默认：false 
                                                    success: function() {},
                                                    fail: function() {},
                                                    complete: function() {}
                                                })
                                                var session_key = res.data.session_key;
                                                var openId = res.data.userInfo.openId;
                                                console.log(res.data.userInfo)
                                                    // 缓存session_key
                                                wx.setStorageSync('session_key', session_key);
                                                // 缓存openid
                                                wx.setStorageSync('openId', openId);
                                                //胡仁杰修改---拿到openid查询此人的uhid
                                                wx.request({
                                                  url: 'https://trd.dachan.com.cn/dacheng/userHead/findByOpenid',
                                                        data: {
                                                            openid: openId
                                                        },
                                                        method: 'GET',
                                                        header: {
                                                            'content-type': 'application/json'
                                                        },
                                                        success(res) {
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
                                                                }
                                                            })
                                                            that.setData({
                                                                uHid: res.data.uhId,
                                                            })
                                                            wx.setStorageSync('uhId', res.data.uhId);
                                                            console.log(that.data.uHid)
                                                        }
                                                    })
                                                    //胡仁杰修改
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
                                                            //将身份更新
                                                        var identity = Number(res.data.identity)
                                                        var isHead = Number(res.data.isHead)
                                                        console.log(identity)
                                                        that.setData({
                                                            identity: identity,
                                                            isHead: isHead
                                                        })
                                                      that.getorderNum()
                                                    }
                                                })

                                            }
                                        })
                                    }
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
    /**
     * 【获取手机号】
     * 
     */
    getPhoneNumber(e) {
        var that = this;
        if (e.detail.iv) {
            // 如果有说明用户同意授权手机号了
            var encryptedData = e.detail.encryptedData;
            var iv = e.detail.iv;
            var openId = wx.getStorageSync('openId')
            var session_key = wx.getStorageSync('session_key')
            // 拿到解密参数去请求后端
            wx.request({
              url: 'https://trd.dachan.com.cn/dacheng/weChat/phoneNumber',
                data: {
                    encryptedData: encryptedData,
                    iv: iv,
                    sessionKey: session_key,
                    openId: openId
                  },
                method: 'POST',
                header: {
                    'content-type': 'application/json'
                },
                success(res) {
                    var phone = res.data.data;
                    //手机号获取成功之后 将按钮消失   手机号传输上去 
                    wx.setStorageSync('ifphoneshow', false)
                    console.log(phone)
                    that.setData({
                        phoneShow: true,
                      ifphoneshow:false
                    })
                    that.setData({
                            phone: phone
                     })
                        // 缓存手机号
                    wx.setStorageSync('phone', phone);
                }
            })
        } else {
            // 用户拒绝了
            console.log("用户不乐意授权手机号")
        }
    },


    /**
     * 跳转至【关于我们】页面
     * 没有约束条件
     */
    toAboutUs() {
        wx.navigateTo({
            url: '../aboutUs/aboutUs',
        })
    },

    /**
     * 判断用户是否授权了基本信息以及手机号，没授权不能进入
     * 符合判定条件 - - 跳转至【申请成为团长】
     */
    toApply() {
        var infoShow = this.data.infoShow; //授权基本信息flag
        var phone = this.data.phone; //phone=""说明没授权手机号
        if (infoShow == false || phone == "") {
            wx.showModal({
                title: '提示',
                content: '申请合伙人需要您登录后并授权手机号',
                showCancel: true, //是否显示取消按钮
                cancelText: "取消", //默认是“取消”
                confirmText: "确认", //默认是“确定”
                success: function(res) {},
                fail: function(res) {}, //接口调用失败的回调函数
                complete: function(res) {}, //接口调用结束的回调函数（调用成功、失败都会执行）
            })
        } else {
            // 满足了授权条件跳转
            wx.navigateTo({
              url: '../applicationForCommander/applicationForCommander',
            })
        }
    },

    /**
     * 跳转至【邀请成员】
     * 已经在wxml里面判断了用户的isHead = =3说明审核通过了，可以显示邀请成员图标
     */
    toInvited() {
        wx.navigateTo({
            url: '../invitedMembers/invitedMembers',
        })
    },
    /**
     * 【获取手机号】前如果没有授权基本信息，提示用户先授权基本信息
     */
    showToast() {
        wx.showModal({
            title: '提示',
            content: '授权手机号前需要您先登录',
            showCancel: true, //是否显示取消按钮
            cancelText: "取消", //默认是“取消”
            confirmText: "确认", //默认是“确定”
            success: function(res) {},
            fail: function(res) {}, //接口调用失败的回调函数
            complete: function(res) {}, //接口调用结束的回调函数（调用成功、失败都会执行）
        })
    },
    //胡仁杰添加-----------------------------------------------------------------
    goOrder(event) {
        console.log('我要去订单页面' + event.currentTarget.dataset.type)
        wx.navigateTo({
            url: '../orderMessage/orderMessage?type=' + event.currentTarget.dataset.type,
        })
    },
    getorderNum() {
        var that = this
        var uhid = wx.getStorageSync('uhId')
        if (that.data.isHead == '3') {
            wx.request({
              url: 'https://trd.dachan.com.cn/dacheng/order/findOrderNumberByUhId',
                data: {
                    uhId: uhid
                },
                method: 'GET',
                header: {
                    'content-type': 'application/json'
                },
                success(res) {
                  console.log(res,"徽标")
                    that.setData({
                      num2:0,
                      num3: 0,
                      num4: 0,
                      num5: 0,
                      num11: 0,
                      num12: 0,
                    })
                    for (var i = 0; i < res.data.length; i++) {
                        switch (res.data[i].oStstus) {
                            case 6:
                                that.setData({
                                    num11: res.data[i].orderNumber
                                })
                                break;
                            case 0:
                                that.setData({
                                    num12: res.data[i].orderNumber
                                })
                                break;
                            case 1:
                                that.setData({
                                    num2: res.data[i].orderNumber
                                }) 
                                console.log("415415")
                              
                                break;
                            case 2:
                                that.setData({
                                    num3: res.data[i].orderNumber
                                })
                                break;
                            case 3:
                                that.setData({
                                    num4: res.data[i].orderNumber
                                })
                               console.log("415415")
                                break;
                            case 5:
                                that.setData({
                                    num5: res.data[i].orderNumber
                                })
                                break;
                        }
                    }
                    that.setData({
                        num1: 0,
                        num1: that.data.num11 + that.data.num12
                    })
                  // console.log(that.data.num1)
                }
            })
        }
    },
  tojilong(){
    wx.navigateTo({
      url: '../storeSolitairePage/storeSolitairePage',
    })
  },
  //商户管理
  tojilongTen(){
    wx.redirectTo({
      url: '../login/login',
    })
  },
  //地址管理
  tojilongmap(){
    wx.navigateTo({
      url: '../addresssiteTwo/addresssiteTwo',
    })
  }
})  