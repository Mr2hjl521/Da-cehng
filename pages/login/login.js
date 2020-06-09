// pages/login/login.js
import Toast from '../../miniprogram_npm/@vant/weapp/toast/toast';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    account:"",//账号
    password:"",//密码
  },
  //账号
  onChangeA(event){
    this.setData({
      account: event.detail
    })
  },
  //密码
  onChangeB(event){
    this.setData({
      password: event.detail
    })
  },
  //立即登陆
  loginA(){
    var that = this
    wx.request({
      url: 'https://trd.dachan.com.cn/dacheng/pcLogin/login',
      method: "GET",
      header: {
        'Content-Type': 'application/json',
      },
      data: {
        account: this.data.account,
        password: this.data.password
      },
      success: function (res) {
        if (res.data.code==1){
          Toast.fail('账号密码错误');
        }else{
          console.log(res,"登陆成功")
          wx.setStorageSync("agentId", res.data.data.agentId)
          wx.redirectTo({
            url: '../merchantName/merchantName',
          })
        }
      },
    })
  }
})