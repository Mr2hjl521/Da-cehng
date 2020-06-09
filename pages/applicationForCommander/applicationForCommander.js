// 申请成为合伙人.js
Page({
    data: {
        show: 0, //显示按钮的控制开关
        checked: false, //复选框
        activeIcon: '../images/1.png',
        inactiveIcon: '../images/2.png',
        isHead: 1, //团长审核状态 1-未审核 2-审核中 3-通过
        addid: "0"
    },
    onLoad: function(options) {
        this.setData({
                addid: options.id
            })
            // 查询团长审核状态
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
                    console.log(res.data.isHead) //团长审核状态
                    var isHead = Number(res.data.isHead)
                    that.setData({
                        isHead: 3
                    })
                }
            })
        } else {
            // 没有openId
            console.log("没有openId")
        }
    },
    // 改变复选框状态
    onChange(event) {
        this.setData({
            checked: event.detail
        });
    },
    // 提交申请
    submit() {
        if (this.data.addid == 1) {
          console.log("12")
            var that = this;
            var openId = wx.getStorageSync('openId');
            wx.request({
                url: 'https://trd.dachan.com.cn/dacheng/userHead',
                data: {
                    openId: openId
                },
                method: 'POST',
                header: {
                    'content-type': 'application/json'
                },
                success(res) {
                    console.log("申请发送成功")
                    wx.switchTab({
                        url: '../../pages/shopingCart/shopingCart',
                    })
                    wx.setStorageSync("idHade", 2)
                    that.setData({
                        isHead: 2
                    })
                }
            })
        } else {
          // console.log("34")
            var that = this;
            var openId = wx.getStorageSync('openId');
            wx.request({
                url: 'https://trd.dachan.com.cn/dacheng/userHead',
                data: {
                    openId: openId
                },
                method: 'POST',
                header: {
                    'content-type': 'application/json'
                },
                success(res) {
                    console.log("申请发送成功")
                    that.setData({
                        isHead: 2
                    })
                }
            })
        }

    }
})