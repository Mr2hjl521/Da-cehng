Page({

    /**
     * 页面的初始数据
     */
    data: {
        defalutAddress: [],
        list: [],
      addressB:'',//orderPage传过来的值 
      nameB: '',//orderPage传过来的值 
      phoneB: '',//orderPage传过来的值 
      idB: '',//orderPage传过来的值 
      xid:'',//订单接龙ID
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
      //判断 如果orderPage传过来值 就使用这个 
          console.log("orderpage传过来的值",options)
          this.setData({
            addressB:options.address,
            nameB:options.name,
            phoneB:options.phone,
            idB:options.id,
            xid:options.xid,//接龙订单
          })
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {
        var that = this
            //获取团长ID  根据团长id查询已有地址 
            // 通过openid查询团长ID 
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
                console.log(res, '按实际')
                wx.request({
                    url: 'https://trd.dachan.com.cn/dacheng/uhAddress/findByuhId?uhId=' + res.data.uhId,
                    success(res) {
                        console.log(res, "jmikde")
                        that.setData({
                            defalutAddress: res.data,
                            
                        })
                    }
                })
            }
        })
        console.log(this.defalutAddress)
    },
    //确定地址 跳转到下订单页面
    makeAddres: function(res) {
        this.setData({
            list: res.currentTarget.dataset
        })
        console.log(this.data.list)
       
       if(this.data.xid && this.data.xid !="undefined"){
         wx.redirectTo({
           url: '../orderPage/orderPage?address=' + this.data.list.address + "&name=" + this.data.list.name +
             "&phone=" + this.data.list.phone + "&id=" + this.data.list.id + '&Dfault=1'+'&xid='+this.data.xid+'&xshow=1'
         })
       }else {
         console.log("aaaaaaaaaaaa")
         wx.redirectTo({
           url: '../orderPage/orderPage?address=' + this.data.list.address + "&name=" + this.data.list.name +
             "&phone=" + this.data.list.phone + "&id=" + this.data.list.id + '&Dfault=1',
         })
       }

       //点击地址  地址变为默认  
       console.log(res,'点击了之后的res')
       wx.request({
         url: 'https://trd.dachan.com.cn/dacheng/uhAddress/updateIsDefault?uhAddId=' + this.data.list.id,
         method:"PUT",
         data:{},
         header: {
           'content-type': 'application/json'
         },
         success:function(res){
           console.log(res)
         }
       })
  
    },
    //添加收货地址
    addAddress: function() {
      console.log(this.data.xid)
        wx.navigateTo({
            url: '../addAdress/addAdress?xid='+this.data.xid,
        })
    },
    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function() {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function() {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {

    },
  onClickLeft:function(){
    //判断如果有xid 说明是接龙订单  需要携带xid和 xshow返回 
    if (this.data.xid != '' && this.data.xid != "undefined"){
      if (this.data.addressB) {
        console.log('222222222222222')
        wx.navigateTo({
          url: '../orderPage/orderPage?address=' + this.data.addressB + "&name=" + this.data.nameB + "&phone=" + this.data.phoneB + "&id=" + this.data.idB + '&Dfault=1&xLeftId='  + this.data.xid +'&xshow=1'
        })
      } else {
        console.log('111111111111')
        wx.redirectTo({
          url: '../orderPage/orderPage?xLeftId=' + this.data.xid +'&xshow=1'
        })
      }
    }else {
        //不是接龙订单
      if (this.data.addressB) {
        wx.redirectTo({
          url: '../orderPage/orderPage?address=' + this.data.addressB + "&name=" + this.data.nameB + "&phone=" + this.data.phoneB + "&id=" + this.data.idB + '&Dfault=1'
        })
      } else {
        wx.navigateTo({
          url: '../orderPage/orderPage'
        })
      }

    }
   
   
  }
})