import Toast from '../../miniprogram_npm/@vant/weapp/toast/toast';
Page({

    /**
     * 页面的初始数据
     */
    data: {
        getNume: '', //收件人
        getPhone: '', //联系电话
        region: ['请选择'], //所在地区
        customItem: "全部",
        detailAddress: '', //详细地址
        xid:'',//判断是否是接龙订单
        addnumber:"0",
        idser:""
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        console.log("传过来的值", options)
        this.setData({
          xid:options.xid,
          idser: options.idser
        })
      //路由传过来的参数 判断是不是从个人中心过来的 
      if (options.idser==1){
        var shopdelete = wx.getStorageSync("shopdelete") 
        //获取到缓存里面的编辑数据
          this.setData({
            getNume: shopdelete.userName, //收件人
            getPhone: shopdelete.phone, //联系电话
            region: [shopdelete.province,shopdelete.city,shopdelete.district], //所在地区
            detailAddress: shopdelete.province + shopdelete.city + shopdelete.district + shopdelete.address, //详细地址
            addnumber:"1"//这是编辑 用来 判断保存按钮
          })
        }else{
        this.setData({
            getNume: "", //收件人
            getPhone: "", //联系电话
            region: "", //所在地区
            detailAddress: "", //详细地址
            addnumber: "0",//这是编辑 用来 判断保存按钮
            region: ['请选择']
        })
        }
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
   
    },
    //保存姓名
    saveName: function(e) {
        this.setData({
            getNume: e.detail.value
        })
    },
    //保存电话
    savePhone(e) {
        this.setData({
            getPhone: e.detail.value
        })
    },
    // 保存详细地址
    savaAddress(e) {
        this.setData({
            detailAddress: e.detail.value
        })
    },
    //获取当前省市区
    bindchangge(e) {
        console.log(e)
        this.setData({
            region: e.detail.value
        })
    },
    //将地址提交后台
    save: function() {
      if (this.data.getNume == '' || this.data.getPhone == '' || this.data.region == '' || this.data.detailAddress == ''){
        Toast.fail('请完善信息');
      }else{
        var that = this
        console.log(this.data.region)
        var opid = wx.getStorageSync('openId')
            //获取团长Id
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
                console.log(res, "获取用户信息")
                console.log(that.data.detailAddress)
                    //获取团长Id 保存地址
                wx.request({
                  url: "https://trd.dachan.com.cn/dacheng/uhAddress",
                    data: {
                        uhId: res.data.uhId,
                        province: that.data.region[0],
                        city: that.data.region[1],
                        district: that.data.region[2], //区 县
                        address: that.data.detailAddress, //详细地址
                        userName: that.data.getNume, //收货姓名
                        phone: that.data.getPhone, //电话
                        isDefault: 1 //默认
                    },
                    method: 'POST',
                    header: {
                        'content-type': 'application/json'
                    },
                    success(res) {
                        console.log(res, "保存地址返回数据")
                            //保存成功之后跳转到确认订单页面
                        var Dfault = 1
                        console.log(Dfault)
                      if (that.data.idser==2){
                        wx.navigateTo({
                          url: '../addresssiteTwo/addresssiteTwo'
                        })
                        }else{
                        wx.navigateTo({
                          url: '../selectAddress/selectAddress?xid=' + that.data.xid
                        })
                        }
                    }
                })
            }
        })
      }
    },
  //保存编辑
  saveA(){
    var that=this
    this.setData({
      shopdelete: wx.getStorageSync("shopdelete")
    })
    wx.request({
      url: "https://trd.dachan.com.cn/dacheng/uhAddress",
      data: {
        uhId: that.data.shopdelete.uhId,
        id: that.data.shopdelete.id,
        province: that.data.region[0],
        city: that.data.region[1],
        district: that.data.region[2], //区 县
        address: that.data.detailAddress, //详细地址
        userName: that.data.getNume, //收货姓名
        phone: that.data.getPhone, //电话
        isDefault: that.data.shopdelete.isDefault
      },
      method: 'PUT',
      header: {
        'content-type': 'application/json'
      },
      success(res) {
        console.log(res, "修改成功")
        wx.redirectTo({
          url: '../addresssiteTwo/addresssiteTwo',
        })
      }
    })
  }
})