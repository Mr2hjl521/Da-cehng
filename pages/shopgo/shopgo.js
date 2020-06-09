// pages/shopgo/shopgo.js
import Dialog from '../../miniprogram_npm/@vant/weapp/dialog/dialog';
import Toast from '../../miniprogram_npm/@vant/weapp/toast/toast';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    active:1,
    pageNum:"1",
    pageSize:"1000",
    number:0,
    addlist:[],//上架
    list:[],//下架
    show:false,
    value:"",//输入框
    id:""//商品id
  },
  onShow(){
    var that=this
    var agentId=wx.getStorageSync("id")
    wx.request({ 
      url: 'https://trd.dachan.com.cn/dacheng/product/findProductByAgent?agentId=' + agentId + "&pageNum=" + this.data.pageNum + "&pageSize=" + this.data.pageSize,
      method:"get",
      header: {
        'Content-Type': 'application/json',
      },
      data: {},
      success: function (res) {
           var addlist=[]
           var list=[]
           console.log(res,"获取所有数据")
          //  上架商品
           for(let i in res.data.list){
             if (res.data.list[i].shopProductStatus==0){
               addlist.push(res.data.list[i])
              }
           }
          //下架商品
        for(let i in res.data.list){
          if (res.data.list[i].shopProductStatus == 1){
            list.push(res.data.list[i])
           }
        }
        that.setData({
          addlist:addlist,
          list:list
        })
      },
    })
  },
  //上架
  dataserver(event){
    var that=this
    // console.log(event.currentTarget.dataset.id)
    var shopid = event.currentTarget.dataset.id
    wx.request({
      url: 'https://trd.dachan.com.cn/dacheng/shopProduct',
      method:"post",
      header: {
        'Content-Type': 'application/json',
      },
      data: {
        "agentId": wx.getStorageSync("id"),
        "productId": shopid
      },
      success: function (res) {
        console.log(res, "上架")
        Toast.success('上架成功');
        that.onShow()
      },
    })
  },
  //下架
  addOut(event){
    console.log(event)
    var that = this
    var shopid = event.currentTarget.dataset.id
    var agentId=wx.getStorageSync("id")
    wx.request({
      url: 'https://trd.dachan.com.cn/dacheng/shopProduct/delete?agentId=' +agentId + "&productId=" + shopid,
      method: "DELETE",
      header: {
        'Content-Type': 'application/json',
      },
      data: {
        // "agentId": agentId,
        // "productId": shopid
      },
      success: function (res) {
        console.log(res, "下架")
        Toast.success('下架成功');
        that.onShow()
      },
    })
  },
  //库存确认按钮
  getUserInfo() {
    var that = this
    var shopid = this.data.id
    var agentId = wx.getStorageSync("id")
    wx.request({
      url: 'https://trd.dachan.com.cn/dacheng/product/updatepStock',
      method: "PUT",
      header: {
        'Content-Type': 'application/json',
      },
      data: {
        "agentId": agentId,
        "pId": shopid,
        "pStock": this.data.value
      },
      success: function (res) {
        console.log(res, "下架")
        Toast.success('下架成功');
        that.onShow()
      },
    })
  },
  //库存取消按钮
  onClose() {
    this.setData({ show: false });
  },
  //库存点击按钮
  addshowA(event){
    console.log(event)
    this.setData({ 
      show: true,
      id: event.currentTarget.dataset.id    //获取到的商品id
     });
  },
  //输入框
   onChangeA(event) {
    // event.detail 为当前输入的值
    this.setData({
      value: event.detail
    })
  },
  onChange(event) {
    // event.detail 的值为当前选中项的索引
    this.setData({ active: event.detail });
    if (event.detail == 0) {
      wx.navigateTo({
        url: '../merchantName/merchantName',
      })
    } else if (event.detail == 1) {
      wx.navigateTo({
        url: '../shopgo/shopgo',
      })
    } else {
      wx.navigateTo({
        url: '../addcenter/addcenter',
      })
    }
  },
})