// pages/amendpassword/amendpassword.js
import Toast from '../../miniprogram_npm/@vant/weapp/toast/toast';
Page({

  /**
   * 页面的初始数据
   */
  data: {
     valueA:"",
     valueB:"",
     value:""
  },
  onChange(event){
    console.log(event)
    this.setData({
      value: event.detail
    })
  },
  onChangeA(event) {
    this.setData({
      valueA: event.detail
    })
  },
  onChangeB(event) {
    this.setData({
      valueB: event.detail
    })
  },
  addserve(){
    wx.request({
      url: 'https://trd.dachan.com.cn/dacheng//agent/updatePassword',
      method: "PUT",
      header: {
        'Content-Type': 'application/json',
      },
      data: {
        "agentId": wx.getStorageSync("agentId"),
        "newPassword": this.data.valueA,
        "oldPassword": this.data.value,
        "twoPassword": this.data.valueB
      },
      success: function (res) {
        console.log(res, "修改密码")
        if (res.data != "密码修改成功"){
          Toast.fail(res.data);
        }else{
          Toast.success('修改成功');
          wx.redirectTo({
            url: '../login/login',
          })
        }
      },
    })
  },
  onClickLeft(){
    wx.redirectTo({
      url: '../addcenter/addcenter',
    })
  }
})