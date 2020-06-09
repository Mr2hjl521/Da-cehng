// pages/solitaire/solitaire.js
import Toast from '../../miniprogram_npm/@vant/weapp/toast/toast';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list:[],
    uhPrice:"",//所有 input的输入框addnumber
  },
  onLoad(options){
    
  },
  onShow(){
    //获取缓存里面的列表
    var addgodata = wx.getStorageSync("godata")
    for (var i = 0; i < addgodata.length;i++){
      addgodata[i]["uhPrice"]=""
    }
    this.setData({
      list: addgodata
    })
  },
  //input 输入框
  onChange(event){
      var add=this.data.list
    add[event.currentTarget.dataset.id].uhPrice = event.detail
      this.setData({
        list: add
      })
    },
  //发起接龙
  addbutton(){
    //0 d
    for (var i = 0; i < this.data.list.length;i++){
      if (this.data.list[i].uhPrice==""){
          this.setData({
            addnumber:"1"
          })
          break
       }else{
        this.setData({
          addnumber: "0"
        })
       }
    } 
    if (this.data.addnumber==0){
      wx.request({
        url: 'https://trd.dachan.com.cn/dacheng/shoppingCar/addFightOrderByCar',
        method: 'POST',
        header: {
          'Content-Type': 'application/json',
        },
        data: {
          aId: wx.getStorageSync("id"),
          uhId: wx.getStorageSync("uhId"),
          productDtoList: this.data.list,
        },
        success: function (res) {
          console.log(res)
          wx.navigateTo({
            url: '../solitairelist/solitairelist?ids=' + res.data,
          })
        }
      })
    }else{
      Toast.fail('请输入接龙价');
    }
      
  }
})