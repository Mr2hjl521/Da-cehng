Page({

    data: {
        orderDetail: {},
        valuefrist: 0,
        valuesecond: 0,
        valuethird: 0,
        oid: ''
    },

    // 生命周期函数--监听页面加载

    onLoad: function(options) {
        console.log(options.id)
        this.setData({
            oid: options.id
        })
        var that = this
        wx.request({
            url: 'https://trd.dachan.com.cn/dacheng/order',
            method: 'GET',
            data: {
                "orderId": options.id
            },
            header: {
                'content-type': 'application/json'
            },
            success(res) {
                console.log(res)
                that.setData({
                    orderDetail: res.data
                })
            }
        })
    },

    // 生命周期函数--监听页面初次渲染完成

    onReady: function() {

    },

    // 生命周期函数--监听页面显示

    onShow: function() {

    },

    // 生命周期函数--监听页面隐藏

    onHide: function() {

    },

    //生命周期函数--监听页面卸载

    onUnload: function() {

    },
    //评价星级
    onChangefrist: function(event) {
        this.setData({
            valuefrist: event.detail
        });
        console.log(this.data.valuefrist)
    },
    onChangesecond: function(event) {
        this.setData({
            valuesecond: event.detail
        });
        console.log(this.data.valuesecond)
    },
    onChangethird: function(event) {
        this.setData({
            valuethird: event.detail
        });
        console.log(this.data.valuethird)
    },
    evaluate() {
        var that = this
        wx.request({
            url: 'https://trd.dachan.com.cn/dacheng/evaluation',
            method: 'POST',
            data: {
                "logisticsQuality": that.data.valuethird,
                "oId": that.data.oid,
                "productQuality": that.data.valuefrist,
                "serviceQuality": that.data.valuesecond
            },
            header: {
                'content-type': 'application/json'
            },
            success(res) {
                console.log(res)
                wx.navigateTo({
                    url: '../orderMessage/orderMessage?type=' + that.data.orderDetail.oStatus,
                })
            }
        })
    }
})