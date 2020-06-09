
Page({
  
  data: {
    active: 0,//底部导航栏
    formatter(type, value) {
      if (type === 'year') {
        return `${value}年`;
      } else if (type === 'month') {
        return `${value}月`;
      }
      return value;
    },
    addhide:false,//时间显示
    addhideA:false,//结束时间
    currentDate:"请选择开始时间",//时间
    currentDateA:"请选择结束时间",//结束时间
    num1:"",//送货
    num2: "",//运费
    num3: "",//自提
    numberRes:"",
    numberA: "",
    numberB: "",
    numberC: "",
    visitorsNumber:"",
    orderNumber:""
  },
  //点击开始时间
  onInput(event) {
    var time = this.getdate(event.detail)
    this.setData({
      currentDate: time,
      addhide:false
    });
    this.timeder()
    
  },
  //结束时间
  onInputA(event) {
    var time = this.getdate(event.detail)
    this.setData({
      currentDateA: time,
      addhideA:false
    });
    this.timeder()
  },
  //点击底部导航拦
  onChange(event) {
    // event.detail 的值为当前选中项的索引
    this.setData({ active: event.detail });
    if (event.detail==0){
       wx.navigateTo({
         url: '../merchantName/merchantName',
       })
    } else if (event.detail == 1){
      wx.navigateTo({
        url: '../shopgo/shopgo',
      })
    }else{
      wx.navigateTo({
        url: '../addcenter/addcenter',
      })
    }
  },
  //点击输入框
  serveAdd(){
    wx.hideKeyboard();
    this.setData({
      addhide:true
    })
  },
  //结束时间输入框
  serveAddA(){
    wx.hideKeyboard();
    this.setData({
      addhideA: true
    })
  },
  //时间戳转换
  getdate(data) {
    var now = new Date(data),
    y = now.getFullYear(),
    m = now.getMonth() + 1,
    d = now.getDate();
    return y + "-" + (m < 10 ? "0" + m : m) + "-" + (d < 10 ? "0" + d : d)
  },
  //取消
  cancel(){
      this.setData({
        addhide: false
      })
  },
  cancelA() {
    this.setData({
      addhideA: false
    })
  },
  onShow: function () {
    var that=this
    //获取现在的时间
    var day1 = new Date();
    day1.setTime(day1.getTime() - 24 * 60 * 60 * 1000);
    var s1 = day1.getFullYear() + "-" + (day1.getMonth()+1) + "-" + day1.getDate();
     this.setData({
       currentDate: s1,
       currentDateA: s1
     })
    that.timeder()
    wx.request({
      url: 'https://trd.dachan.com.cn/dacheng/order/findOrderNumberByAgentId',
      method: "GET",
      header: {
        'Content-Type': 'application/json',
      },
      data: {
        agentId: wx.getStorageSync("agentId")
      },
      success: function (res) {
        console.log(res,"徽标")
        that.setData({
          num1: 0,//送货
          num2: 0,//运费
          num3: 0,//自提
        })
        for (var i = 0; i < res.data.length; i++) {
          switch (res.data[i].oStstus) {
            case 0:
              that.setData({
                num2: res.data[i].orderNumber
              })
              break;
            case 1:
              that.setData({
                num1: res.data[i].orderNumber
              })
              break;
            case 2:
              that.setData({
                num3: res.data[i].orderNumber
              })
          }
        }
      },
    })
  },
  //判断两个时间是不是选中
  timeder(){
    var that=this
    if (this.data.currentDate != "" && this.data.currentDateA!=""){
      var that = this
      wx.request({
        url: 'https://trd.dachan.com.cn/dacheng/DataAnalysis/findDataByAgentId',
        method: "POST",
        header: {
          'Content-Type': 'application/json',
        },
        data: {
          "agentId": wx.getStorageSync("agentId"),
          "endTime": this.data.currentDateA+" 00:00:01",
          "startTime": this.data.currentDate + " 23:59:59"
        },
        success: function (res) {
          // 下单转化率
          console.log(res.data.orderNumber)
          console.log(res.data.visitorsNumber)
          that.setData({
            visitorsNumber: res.data.visitorsNumber,
            orderNumber: res.data.orderNumber
          })
          if (that.data.visitorsNumber == 0) {
            that.data.visitorsNumber = 1
          } 
          var numberA = (res.data.orderNumber / that.data.visitorsNumber).toFixed(2)
          console.log(numberA)
          // if (numberA){
          //   numberA=0
          // }
          console.log(numberA)
          if (that.data.visitorsNumber == 0) {
            that.data.visitorsNumber = 1
          } 
         // 下单成交转化率 
          var numberC = (res.data.dealOrderNumber / that.data.visitorsNumber).toFixed(2)
          // if (numberB) {
          //   numberB = 0
          // }
          //成交转化率
          if (that.data.orderNumber == 0) {
            that.data.orderNumber = 1
          } 
          var numberB = (res.data.dealOrderNumber / that.data.orderNumber).toFixed(2)
          // if (numberC) {
          //   numberC = 0
          // }
          
          console.log(res, "查询所有数量")
          that.setData({
            numberRes:res.data,
            numberA: numberA,
            numberB: numberB,
            numberC: numberC
          })
        },
      })
    }
  },
  //自提
  addserverC(){
     wx.navigateTo({
       url: '../pickUP/pickUP',
     })
  },
  //送货
  addserverA() {
    wx.navigateTo({
      url: '../deliverGooder/deliverGooder',
    })
  },
  //运费
  addserverB() {
    wx.navigateTo({
      url: '../freight/freight',
    })
  }
})