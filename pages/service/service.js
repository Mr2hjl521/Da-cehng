// pages/service/service.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: "", //所有数据
    fileList: [],
    fileListA: [],
    imageurl: "", //店铺图片
    imageurltwo: "", //二维码
    phone: "", //手机号
    shopName: "", //店铺名称
    name: "", //名字
    delivery: "", //配送
    pickup: "", //自提
    deliveryTime: "", //配送时间
    pickupTime: "", //自提时间
    range: "", //范围
    businessDistrict: "", //营业
    result: [],
    address: "" //地址
  },
  //图片上传
  afterRead(event) {
    var that = this
    const {
      file
    } = event.detail;
    // 当设置 mutiple 为 true 时, file 为数组格式，否则为对象格式
    wx.uploadFile({
      url: 'https://trd.dachan.com.cn/dacheng/image/productImage/upload', // 仅为示例，非真实的接口地址
      filePath: file.path,
      name: 'file',
      formData: {
        user: 'test'
      },
      success(res) {
        console.log(res, "图片地址")
        var datalist = JSON.parse(res.data)
        console.log(datalist)
        that.setData({
          fileList: that.data.fileList.concat({
            url: `https://trd.dachan.com.cn/dacheng/resource/image/a/${datalist.data[0]}`,
          }),
          imageurl: datalist.data[0]
        })
      }
    });
  },
  //二维码
  afterReadtwo(event) {
    var that = this
    const {
      file
    } = event.detail;
    // 当设置 mutiple 为 true 时, file 为数组格式，否则为对象格式
    wx.uploadFile({
      url: 'https://trd.dachan.com.cn/dacheng/image/productImage/upload', // 仅为示例，非真实的接口地址
      filePath: file.path,
      name: 'file',
      formData: {
        user: 'test'
      },
      success(res) {
        console.log(res, "图片地址")
        var datalist = JSON.parse(res.data)
        console.log(datalist)
        that.setData({
          fileListA: that.data.fileListA.concat({
            url: `https://trd.dachan.com.cn/dacheng/resource/image/a/${datalist.data[0]}`,
          }),
          imageurltwo: datalist.data[0]
        })
      }
    })
  },
  onLoad() {
    var that = this
    wx.request({
      url: 'https://trd.dachan.com.cn/dacheng/agent',
      method: "GET",
      header: {
        'Content-Type': 'application/json',
      },
      data: {
        id: wx.getStorageSync("agentId")
      },
      success: function (res) {
        console.log(res, "查询所有数据")
        var adder = []
        if (res.data.delivery == 1) {
          adder.push("1")
        }
        if (res.data.pickup == 1) {
          adder.push("2")
        }
        that.setData({
          phone: res.data.phone,
          shopName: res.data.shopName,
          name: res.data.name,
          deliveryTime: res.data.deliveryTime,
          pickupTime: res.data.pickupTime,
          range: res.data.range,
          businessDistrict: res.data.businessDistrict,
          address: res.data.address,
          result: adder,
          fileListA: that.data.fileListA.concat({
            url: res.data.qrCodeUrl,
          }),
          fileList: that.data.fileList.concat({
            url: res.data.shopImage,
          }),
        })
      },
    })

  },
  //店铺名称
  addshopName(event) {
    this.setData({
      shopName: event.detail
    })
  },
  //姓名
  addname(event) {
    this.setData({
      name: event.detail
    })
  },
  //手机号
  addphone(event) {
    console.log(event)
    this.setData({
      phone: event.detail
    })
  },
  //地址 
  addressA(event) {
    console.log(event)
    this.setData({
      address: event.detail
    })
  },
  //配送时间
  adddeliveryTime(event) {
    console.log(event)
    this.setData({
      deliveryTime: event.detail
    })
  },
  //配送范围
  addrange(event) {
    console.log(event)
    this.setData({
      range: event.detail
    })
  },
  //自提时间
  addpickupTime(event) {
    console.log(event)
    this.setData({
      pickupTime: event.detail
    })
  },
  //营业区
  addbusinessDistrict(event) {
    console.log(event)
    this.setData({
      businessDistrict: event.detail
    })
  },
  //确认修改
  commiont() {
    var that = this
    if (this.data.result.length == 0) {
      this.setData({
        delivery: "0",
        pickup: "0"
      })
    } else {
      for (var i = 0; i < this.data.result.length; i++) {

        console.log("456")
        if (this.data.result[i] == 1) {
          this.setData({
            delivery: "1"
          })
        } else {
          this.setData({
            delivery: "0"
          })
        }

        if (this.data.result[i] == 2) {
          this.setData({
            pickup: "1"
          })
        } else {
          this.setData({
            pickup: "0"
          })
        }
        if (this.data.result.length==2){
          this.setData({
            pickup: "1",
            delivery: "1"
          })
        }
      }
    }
    wx.request({
      url: 'https://trd.dachan.com.cn/dacheng/agent',
      method: "PUT",
      header: {
        'Content-Type': 'application/json',
      },
      data: {
        id: wx.getStorageSync("agentId"),
        phone: that.data.phone,
        shopName: that.data.shopName,
        name: that.data.name,
        deliveryTime: that.data.deliveryTime,
        pickupTime: that.data.pickupTime,
        range: that.data.range,
        businessDistrict: that.data.businessDistrict,
        address: that.data.address,
        qrCodeUrl: that.data.imageurltwo,
        shopImage: that.data.imageurl,
        delivery: that.data.delivery,
        pickup: that.data.pickup
      },
      success: function (res) {
        console.log(res, "修改所有")
        wx.redirectTo({
          url: '../addcenter/addcenter',
        })

      },
    })
  },
  onChange(event) {
    this.setData({
      result: event.detail
    });
  },
  onClickLeft() {
    wx.redirectTo({
      url: '../addcenter/addcenter',
    })
  },
  //删除
  adddelete(event) {
    console.log(event)
    var arr = this.data.fileList
    arr.splice(event.detail.index, 1)
    console.log(arr)
    this.setData({
      fileList: arr
    })
    //  this.data.fileList.splice(event.detail.index,1) 
  },
  adddeleteA(event) {
    console.log(event)
    var arr = this.data.fileListA
    arr.splice(event.detail.index, 1)
    console.log(arr)
    this.setData({
      fileListA: arr
    })
    //  this.data.fileList.splice(event.detail.index,1) 
  }
}) 