// pages/category/category.js
Page({
    data: {
        goodId: 1,
        getuserkey: false,
        agentId: 2,
        windowHeight: 500,
        mainActiveIndex: 0,
        activeKey: 0,
        categoryList: ["盐酥鸡", "黄金鸡块", "鲜香鸡柳", "汉堡肉排", "熏制肉品", "Q弹丸滑", "罗普芝士", "好食甜品"],
        goodsList: [], // 右侧商品信息
        identity: 0 //获取身份
    },
    onLoad: function() {

        var that = this;
        // 获取屏幕方高度
        wx.getSystemInfo({
            success: (res) => {
                that.setData({
                    windowHeight: res.windowHeight - 60,
                })
            },
        })
        console.log(this.data.windowHeight)
            // 根据代理商Id 和分类Id查询具体商品  默认展示分类1
    },

    onShow: function() {

        var that = this;
        //获取身份改变价格
        var identity = wx.getStorageSync('identity')
        that.setData({
                identity: identity
            })
            // 根据代理商Id 和分类Id查询具体商品  默认展示分类1
        var id = wx.getStorageSync('id')
        var categoryId = wx.getStorageSync('categoryId')
        that.setData({
            activeKey: categoryId
        });
        var cId = that.data.activeKey + 1;
        wx.request({
                url: 'https://trd.dachan.com.cn/dacheng/product/select?agentId=' + id + '&categoryId=' + cId,
                // url: 'https://trd.dachan.com.cn/dacheng/product/select?agentId=' + id + '&categoryId=' + cId,
                data: {},
                header: {
                    'content-type': 'application/json'
                },
                success(res) {
                    console.log("123123123", res.data)
                    that.setData({
                        goodsList: res.data
                    })
                }
            })
            //获取所有分类
        wx.request({
            url: 'https://trd.dachan.com.cn/dacheng/category/findAll?pageNum=1&pageSize=10',
            data: {},
            header: {
                'content-type': 'application/json'
            },
            success(res) {
                that.setData({
                    categoryList: res.data.list
                })
            }
        })
    },
    // 改变左侧导航栏
    onChange(event) {
        // 每次点击左侧导航栏都覆盖缓存里面的cid
        var that = this;
        var categoryId = that.data.activeKey;
        wx.setStorageSync('categoryId', categoryId);

        that.setData({
            activeKey: event.detail
        });
        var id = wx.getStorageSync('id')
        console.log(that.data.activeKey);
        var num = that.data.activeKey + 1
        wx.request({
            url: 'https://trd.dachan.com.cn/dacheng/product/select?agentId=' + id + '&categoryId=' + num,
            data: {},
            header: {
                'content-type': 'application/json'
            },
            success(res) {
                console.log(res)
                    // console.log(res.data)
                that.setData({
                    goodsList: res.data
                })
            }
        })
    },
    // 跳转至具体商品
    toDetails(e) {
        var that = this;
        var id = e.currentTarget.dataset.id;
        that.setData({
            goodId: id
        });
        var flag = wx.getStorageSync('myFlag')
        var infoShow = wx.getStorageSync('infoShow')

        // myFlag = 1  授权了地理位置  9 未授权
        if (flag == 1) {
            if (infoShow == true) {
                wx.navigateTo({
                  url: '../commodityDetails/commodityDetails?id=' + id,
                })
              wx.setStorageSync("addtypea", "2")
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
                url: '../selectPoint/selectPoint?id=' + id,
            })
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
                                    if (orderOpenId) {
                                        // 是被人邀请来的   
                                        wx.request({
                                            url: 'https://trd.dachan.com.cn/dacheng/weChat/wxLogin',
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
                                                console.log(res.data)
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
                                                            //将身份更新
                                                        var identity = Number(res.data.identity)
                                                        console.log(identity)
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
                                                        wx.setStorageSync('identity', identity)
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
                                                iv: iv
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
                                                        console.log(identity)
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
    // 关闭授权弹窗
    giveup() {
        this.setData({
            getuserkey: false
        });
    },
  //商品搜索
  addfocus() {
    wx.navigateTo({
      url: '../shopowner/shopowner',
    })
  },
});