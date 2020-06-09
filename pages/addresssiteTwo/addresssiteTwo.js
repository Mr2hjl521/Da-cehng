// pages/addresssiteTwo/addresssiteTwo.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    radio: "",
    list:""
  },
  onChange(event) {
    wx.setStorageSync("addersTwo", "")
    wx.setStorageSync("addersTwo", this.data.list[event.detail])
    this.setData({
      radio: event.detail
    });
    wx.request({
      url: 'https://trd.dachan.com.cn/dacheng/uhAddress/updateIsDefault?uhAddId=' + event.currentTarget.dataset.id,
      method:"PUT",
      success:function(res){
        console.log(res,"修改默认成功")
      }
    })
  },


  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that=this
    //判断有没有默认地址
    wx.request({
      url: 'https://trd.dachan.com.cn/dacheng/uhAddress/findByuhId',
      method:"GET",
      data:{
        uhId: wx.getStorageSync("uhId")
      },
      success:function(res){
         console.log(res,"获取所有地址")
          //判断有没有默认地址  如果有判断是哪个 
         for(var i=0;i<res.data.length;i++){
           if (res.data[i].isDefault==1){
                that.setData({
                  radio:Number(i)
                })
              wx.setStorageSync("addersTwo", res.data[i])
              break
             }
             else{
             wx.setStorageSync("addersTwo", "")
             }
         }
         that.setData({
           list:res.data
         })
      }
    })
  },
  //添加地址
  addserver(){
    wx.navigateTo({
      url: '../addAdress/addAdress?idser=2',
    })
  },
  //编辑地址
  addcompolie(event){
    wx.setStorageSync("shopdelete", "")
    wx.setStorageSync("shopdelete", this.data.list[event.currentTarget.dataset.index])
    wx.navigateTo({
      url: '../addAdress/addAdress?idser=1',
    })
    // 把当前要编辑的存入缓存 
  },
  //删除地址
  adddelete(event){
    var that=this
    wx.request({
      url: 'https://trd.dachan.com.cn/dacheng/uhAddress?id=' + event.currentTarget.dataset.id,
      method: "DELETE",
      success: function (res) {
        console.log(res, "删除成功")
        that.onShow()
      }
    })
  },
})