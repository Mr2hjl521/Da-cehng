// pages/invitedMembers/invitedMembers.js
Page({
  data: {
    windows: false, // 生成海报弹窗
    windowHeight: 400,
    avatarUrl: "", //头像
    nickname: "", //昵称
    number: 0, //已邀请人数
    friendList: [], //邀请的好友的数据
    img: "../images/pic6.png",
    wechat: "../images/ma.png",
    xiazai: "../images/xiazai.png",
    share: "../images/ma.png",
    maskHidden: false,
    show: false,
    image: "",
    path: "",
    temPath: "", //临时文件路径
  },
  onLoad: function(options) {
    var that = this;
    // 获取屏幕方高度
    wx.getSystemInfo({
      success: (res) => {
        that.setData({
          windowHeight: res.windowHeight,
        })
      },
    })
    // 如果有openid
    var openId = wx.getStorageSync('openId');
    if (openId) {
      // 1.根据自己的openid查自己的头像昵称
      console.log("有openId")
      wx.request({
        url: 'https://trd.dachan.com.cn/dacheng/userHead/findAllByOpenid',
        data: {
          openid: openId
        },
        method: 'GET',
        header: {
          'content-type': 'application/json'
        },
        success(res) {
          that.setData({
            avatarUrl: res.data.avatarUrl,
            nickname: res.data.nickname
          })
        }
      })
      // 2.根据自己已经成为团长的headOpenid查我邀请过的好友信息
      wx.request({
        url: 'https://trd.dachan.com.cn/dacheng/user/findByHeadopenid',
        data: {
          headOpenid: openId
        },
        method: 'GET',
        header: {
          'content-type': 'application/json'
        },
        success(res) {
          console.log(res.data);
          // var addnumber=10
          if (res.data.length >= 10) {
            wx.setStorageSync('identity', 1)
          }
          if (res.data.length == 0) {
            that.setData({
              number: 0
            })
          } else {
            // 已经邀请了
            that.setData({
              friendList: res.data,
              number: res.data.length
            })
          }
        }
      })
      //3.根据openid获取二维码
      wx.request({
        url: 'https://trd.dachan.com.cn/dacheng/weChat/getQrCodeImage?openid=' + openId,
        data: {},
        method: 'GET',
        header: {
          'content-type': 'application/json'
        },
        success(res) {
          console.log(res.data) //返回的线上地址
          var onlinePath = res.data;
          that.setData({
            path: onlinePath
          })
          // 把线上图片地址换成临时图片地址
          wx.downloadFile({
            url: onlinePath, //仅为示例，并非真实的资源
            success(res) {
              var path = res.tempFilePath;
              if (res.statusCode === 200) {
                wx.getImageInfo({
                  src: path, //线上图片地址
                  success(res) {
                    console.log(res.path) //临时文件地址
                    var temPath = res.path;
                    that.setData({
                      temPath: temPath
                    })
                  }
                })
              }
            }
          })
        }
      })
    } else {
      // 没有openId
      console.log("没有openId")
    }
  },

  /**
   * 点击按钮生成海报
   * 1.从后端获取二维码
   * 2.画到画布上
   */
  formSubmit: function(e) {
    console.log("生成海报ing")
    var that = this;
    wx.showToast({
      title: '海报生成中...',
      icon: 'loading',
      duration: 500
    });
    /**
     * 开始画canvas
     */
    var context = wx.createCanvasContext('mycanvas');
    context.setFillStyle("#fff")
    context.fillRect(0, 0, 500, 700)
    var path = "../images/pic6.jpg";
    context.drawImage(path, 0, 0, 192, 300);
    var path2 = that.data.temPath;
    context.drawImage(path2, 65, 195, 60, 60);
    context.draw();

    //将生成好的图片保存到本地
    setTimeout(function() {
      wx.canvasToTempFilePath({
        canvasId: 'mycanvas',
        success: function(res) {
          var tempFilePath = res.tempFilePath;
          console.log("最终的临时文件地址" + tempFilePath)
          that.setData({
            imagePath: tempFilePath,
            windows: true
          });
        },
        fail: function(res) {
          console.log(res);
        }
      });
    }, 200);
  },



  //点击保存到相册
  baocun: function() {
    console.log("保存")
    var that = this;
    var path = that.data.imagePath
    console.log(path)
    //图片保存到本地
    wx.getImageInfo({
      src: path, //画好的canvas临时文件地址
      success(res) {
        console.log(res.path)
        wx.saveImageToPhotosAlbum({
          filePath: path,
          success: function(data) {
            wx.showModal({
              title: '提示',
              content: '您的邀请好友二维码已存入手机相册，赶快分享给好友吧',
              showCancel: false,
            })
            that.setData({
              windows: false
            })
          },
          fail: function(err) {
            if (err.errMsg ===
              "saveImageToPhotosAlbum:fail:auth denied" || err
              .errMsg === "saveImageToPhotosAlbum:fail auth deny"
            ) {
              // 这边微信做过调整，必须要在按钮中触发，因此需要在弹框回调中进行调用
              wx.showModal({
                title: '提示',
                content: '需要您授权保存相册',
                showCancel: false,
                success: modalSuccess => {
                  wx.openSetting({
                    success(
                      settingdata) {
                      console.log(
                        "settingdata",
                        settingdata
                      )
                      if (settingdata
                        .authSetting[
                          'scope.writePhotosAlbum'
                        ]) {
                        wx.showModal({
                          title: '提示',
                          content: '获取权限成功,再次点击图片即可保存',
                          showCancel: false,
                        })
                      } else {
                        wx.showModal({
                          title: '提示',
                          content: '获取权限失败，将无法保存到相册哦~',
                          showCancel: false,
                        })
                      }
                    },
                    fail(failData) {
                      console.log(
                        "failData",
                        failData
                      )
                    },
                    complete(
                      finishData) {
                      console.log(
                        "finishData",
                        finishData
                      )
                    }
                  })
                }
              })
            }
          },
          complete(res) {
            // wx.hideLoading()
          }
        })
      }
    })
  },
  // 点击遮罩层关闭弹窗
  closeWindow: function() {
    var that = this;
    that.setData({
      windows: false
    })
  }
})