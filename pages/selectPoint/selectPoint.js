// pages/selectPoint/selectPoint.js
var QQMapWX = require('../../utils/qqmap-wx-jssdk.js');
var qqmapsdk;
Page({
    data: {
        show: false,
        agentsList: [], //有代理商的数据
        noAgentsList: [], //没有代理商的数据
        erweima: "", //代理商的二维码
        imgIndex: 0,
        address: "", //具体地址
        city: "天津市", //城市
        noAgent: false, //没有代理商时显示的开关
        latitude:"",
        longitude:""
    },

    onLoad: function(options) {
        // 获取从pc端的店铺二维码进入小程序的参数  【options.q】
        if (options.q !== undefined) {
            var scan_url = decodeURIComponent(options.q);
            var str = scan_url
            var num = str.indexOf("?")
            str = str.substr(num + 1);
            var arr = str.split("&");
            var a = arr[0]
            var b = a.lastIndexOf("\=");
            a = a.substring(b + 1, a.length);
            wx.setStorageSync('cid', a);
        } else {
            console.log(123);
        }

        // 获取从好友分享的二维码进入小程序的参数  【options.scene】
        if (options.scene !== undefined) {
            // scene 需要使用 decodeURIComponent 才能获取到生成二维码时传入的 scene
            var scene = decodeURIComponent(options.scene)
            wx.setStorageSync('orderOpenId', scene);
        } else {
            console.log("没有参数scene");
        }
    },

    onShow: function() {
        var optinsId = wx.getStorageSync('cid'); //二维码上带的店铺ID
        if (optinsId) {
            /**
             * 如果有optinsId 说明页面路径上有ID 是扫码进来的 ******0
             * 实例化腾讯地图API核心类
             */
            qqmapsdk = new QQMapWX({
                key: '67SBZ-ATLCP-DVJDK-VWVKB-GKY7Q-TRFCO' // 必填
            });
            //1、获取当前位置坐标
            var that = this;
            wx.getLocation({
                type: 'wgs84',
                success: function(res) {
                    console.log(res);
                    that.setData({
                      latitude: res.latitude,
                      longitude: res.longitude
                    })
                    //2、根据坐标获取当前位置名称，显示在顶部:腾讯地图逆地址解析
                    qqmapsdk.reverseGeocoder({
                        location: {
                            latitude: res.latitude,
                            longitude: res.longitude
                        },
                        success: function(addressRes) {
                            // 缓存用户授权了地理位置的flag
                            wx.setStorageSync('myFlag', 1);
                            var province = addressRes.result.address_component.province; //省
                            var city = addressRes.result.address_component.city; //市
                            var district = addressRes.result.address_component.district; //区
                            var address = addressRes.result.address; //详细地址
                            that.setData({
                                    city: city,
                                    address: address
                                })
                                /**
                                 * 3.到此，(通过店铺二维码进入的)用户同意授权拿到详细地址 ----city
                                 */
                            wx.request({
                                url: 'https://trd.dachan.com.cn/dacheng/agent?id=' + optinsId,
                                data: {},
                                header: {
                                    'content-type': 'application/json'
                                },
                                success(res) {
                                    /**
                                     * 根据店铺二维码中的店铺id查店铺的详细地址，用来和city作比较
                                     * YES - - - 如果当前用户所在的city与二维码中的店铺地址相同，缓存店铺id，跳转首页
                                     * NO - - -  城市不一致，查询当前用户所在地区的代理商
                                     */


                                    console.log(res.data.address) //查询到的完整地址
                                    var aStr = res.data.address
                                    if (aStr.indexOf(city) != -1) {
                                        console.log("包含此城市，该进入店铺了");
                                        // 代理商ID
                                        console.log(optinsId);
                                        // 把代理商ID存缓存
                                        wx.setStorageSync('id', optinsId);
                                        // switchTab页面不能传值哈
                                        wx.switchTab({
                                            url: '/pages/index/index',
                                        })
                                    } else {
                                        // NO - - -  城市不一致，查询当前用户所在地区的代理商
                                        if (province == "天津市") {
                                            wx.request({
                                              url: 'https://trd.dachan.com.cn/dacheng/agent/findAgentByAddressLatLng',
                                                data: {
                                                  latitude: that.data.latitude,
                                                  longitude: that.data.longitude,
                                                  address: "天津天津市"
                                                },
                                                header: {
                                                    'content-type': 'application/json'
                                                },
                                                success(res) {
                                                    console.log(res.data.data,"天津") 
                                                    if (res.data.data == null) {
                                                        // 附近没有代理商
                                                        that.setData({
                                                            noAgent: true
                                                        })
                                                        wx.request({
                                                            url: 'https://trd.dachan.com.cn/dacheng/agentDefault/findAgentDefaultByAddress?address=天津天津市',
                                                            data: {},
                                                            header: {
                                                                'content-type': 'application/json' // 默认值
                                                            },
                                                            success(res) {
                                                                console.log(res.data)
                                                                    /**
                                                                     * 查到的数据是此市没有代理商，默认显示的数据
                                                                     */
                                                              that.bSort(res.data)
                                                              that.datachange(res.data)
                                                                that.setData({
                                                                    noAgentsList: res.data
                                                                })
                                                            }
                                                        })
                                                    } else {
                                                        // 附近有代理商
                                                      that.bSort(res.data.data)
                                                      that.datachange(res.data.data)
                                                        that.setData({
                                                            agentsList: res.data.data
                                                        })
                                                    }
                                                }
                                            })
                                        } else if (province == "重庆市") {
                                            wx.request({
                                              url: 'https://trd.dachan.com.cn/dacheng/agent/findAgentByAddressLatLng',
                                                data: {
                                                  latitude: that.data.latitude,
                                                  longitude: that.data.longitude,
                                                  address: "重庆重庆市"
                                                },
                                                header: {
                                                    'content-type': 'application/json' // 默认值
                                                },
                                                success(res) {
                                                    console.log(res.data.data)
                                                    if (res.data.data == null) {
                                                        // 附近没有代理商
                                                        that.setData({
                                                            noAgent: true
                                                        })
                                                        wx.request({
                                                            url: 'https://trd.dachan.com.cn/dacheng/agentDefault/findAgentDefaultByAddress?address=重庆重庆市',
                                                            data: {},
                                                            header: {
                                                                'content-type': 'application/json' // 默认值
                                                            },
                                                            success(res) {
                                                              that.bSort(res.data)
                                                              that.datachange(res.data)
                                                                that.setData({
                                                                    noAgentsList: res.data
                                                                })
                                                            }
                                                        })
                                                    } else {
                                                        // 附近有代理商
                                                      that.bSort(res.data.data)
                                                      that.datachange(res.data.data)
                                                        that.setData({
                                                            agentsList: res.data.data
                                                        })
                                                    }
                                                }
                                            })
                                        } else if (province == "北京市") {
                                            wx.request({
                                              url: 'https://trd.dachan.com.cn/dacheng/agent/findAgentByAddressLatLng',
                                                data: {
                                                  latitude: that.data.latitude,
                                                  longitude: that.data.longitude,
                                                  address: "北京北京市"
                                                },
                                                header: {
                                                    'content-type': 'application/json' // 默认值
                                                },
                                                success(res) {
                                                    if (res.data.data == null) {
                                                        // 附近没有代理商
                                                        that.setData({
                                                            noAgent: true
                                                        })
                                                        wx.request({
                                                            url: 'https://trd.dachan.com.cn/dacheng/agentDefault/findAgentDefaultByAddress?address=北京北京市',
                                                            data: {},
                                                            header: {
                                                                'content-type': 'application/json' // 默认值
                                                            },
                                                            success(res) {
                                                              that.bSort(res.data)
                                                              that.datachange(res.data)
                                                                console.log(res.data)
                                                                that.setData({
                                                                    noAgentsList: res.data
                                                                })
                                                            }
                                                        })
                                                    } else {
                                                        // 附近有代理商
                                                      that.bSort(res.data.data)
                                                      that.datachange(res.data.data)
                                                        that.setData({
                                                            agentsList: res.data.data
                                                        })
                                                    }
                                                }
                                            })
                                        } else if (province == "上海市") {
                                            wx.request({
                                              url: 'https://trd.dachan.com.cn/dacheng/agent/findAgentByAddressLatLng',
                                                data: {
                                                  latitude: that.data.latitude,
                                                  longitude: that.data.longitude,
                                                  address: "上海上海市"
                                                },
                                                header: {
                                                    'content-type': 'application/json' // 默认值
                                                },
                                                success(res) {
                                                    console.log(res.data.data)
                                                    if (res.data.data == null) {
                                                        // 附近没有代理商
                                                        that.setData({
                                                            noAgent: true
                                                        })
                                                        wx.request({
                                                            url: 'https://trd.dachan.com.cn/dacheng/agentDefault/findAgentDefaultByAddress?address=上海上海市',
                                                            data: {},
                                                            header: {
                                                                'content-type': 'application/json' // 默认值
                                                            },
                                                            success(res) {
                                                                console.log(res.data)
                                                              that.bSort(res.data)
                                                              that.datachange(res.data)
                                                                that.setData({
                                                                    noAgentsList: res.data
                                                                })
                                                            }
                                                        })
                                                    } else {
                                                        // 附近有代理商
                                                      that.bSort(res.data.data)
                                                      that.datachange(res.data.data)
                                                        that.setData({
                                                            agentsList: res.data.data
                                                        })
                                                    }
                                                }
                                            })
                                        } else {
                                            wx.request({
                                              url: 'https://trd.dachan.com.cn/dacheng/agent/findAgentByAddressLatLng',
                                                data: {
                                                  address: province + city,
                                                  latitude: that.data.latitude,
                                                  longitude: that.data.longitude,
                                                },
                                                header: {
                                                    'content-type': 'application/json' // 默认值
                                                },
                                                success(res) {
                                                    console.log(res.data.data)
                                                    if (res.data.data == null) {
                                                        // 附近没有代理商
                                                        that.setData({
                                                            noAgent: true
                                                        })
                                                        wx.request({
                                                            url: 'https://trd.dachan.com.cn/dacheng/agentDefault/findAgentDefaultByAddress?address=' + province + city,
                                                            data: {},
                                                            header: {
                                                                'content-type': 'application/json' // 默认值
                                                            },
                                                            success(res) {
                                                                console.log(res.data)
                                                              that.bSort(res.data)
                                                              that.datachange(res.data)
                                                                that.setData({
                                                                    noAgentsList: res.data
                                                                })
                                                            }
                                                        })
                                                    } else {
                                                        // 附近有代理商
                                                      that.bSort(res.data.data)
                                                      that.datachange(res.data.data)
                                                        that.setData({
                                                            agentsList: res.data.data
                                                        })
                                                    }
                                                }
                                            })
                                        }
                                    }
                                }
                            })
                        },
                        fail: function(res) {
                            wx.showToast({
                                title: '定位失败，请重试',
                                icon: 'none',
                                duration: 2000
                            });
                        }
                    })
                },

                // 用户拒绝了授权地理位置
                fail: function() {
                    wx.hideLoading();
                    // 缓存用户授权了地理位置的flag
                    wx.setStorageSync('myFlag', 9);
                    wx.getSetting({
                        success: function(res) {
                            if (!res.authSetting['scope.userLocation']) {
                                wx.showModal({
                                    title: '',
                                    content: '请允许大成优+获取您的定位',
                                    confirmText: '授权',
                                    success: function(res) {
                                        if (res.confirm) {
                                            wx.openSetting();
                                        } else {
                                            console.log('get location fail');
                                        }
                                    }
                                })
                            } else {
                                //用户已授权，但是获取地理位置失败，提示用户去系统设置中打开定位
                                wx.showModal({
                                    title: '',
                                    content: '请在系统设置中打开定位服务',
                                    confirmText: '确定',
                                    success: function(res) {}
                                })
                            }
                        }
                    })

                    // 用户没进行地理位置授权，默认显示天津市
                    wx.request({
                        url: 'https://trd.dachan.com.cn/dacheng/agent/findAgentByAddress?address=天津天津市',
                        data: {},
                        header: {
                            'content-type': 'application/json' // 默认值
                        },
                        success(res) {
                            console.log(res.data.data)
                            that.setData({
                                agentsList: res.data.data
                            })
                        }
                    })
                }
            })
        } else {
            /**
             * 没有optinsId 说明是一般用户从正常流程进来的 ******1
             * 实例化腾讯地图API核心类
             */
            qqmapsdk = new QQMapWX({
                key: '67SBZ-ATLCP-DVJDK-VWVKB-GKY7Q-TRFCO' // 必填
            });
            //1、获取当前位置坐标
            var that = this;
            wx.getLocation({
                type: 'wgs84',
                success: function(res) {
                    console.log(res);
                  that.setData({
                    latitude: res.latitude,
                    longitude: res.longitude
                  })
                    //2、根据坐标获取当前位置名称，显示在顶部:腾讯地图逆地址解析
                    qqmapsdk.reverseGeocoder({
                        location: {
                            latitude: res.latitude,
                            longitude: res.longitude
                        },
                        success: function(addressRes) {
                            // 缓存用户授权了地理位置的flag
                            wx.setStorageSync('myFlag', 1);
                            var province = addressRes.result.address_component.province;
                            var city = addressRes.result.address_component.city;
                            var district = addressRes.result.address_component.district;
                            var address = addressRes.result.address;
                            that.setData({
                                city: city,
                                address: address
                            })
                            if (province == "天津市") {
                                wx.request({
                                  url: 'https://trd.dachan.com.cn/dacheng/agent/findAgentByAddressLatLng',
                                    data: {
                                      latitude: that.data.latitude,
                                      longitude: that.data.longitude,
                                      address: "天津天津市"
                                    },
                                    header: {
                                        'content-type': 'application/json' // 默认值
                                    },
                                    success(res) {
                                        console.log(res.data.data,"天津11")
                                        if (res.data.data == null) {
                                            // 附近没有代理商
                                            that.setData({
                                                noAgent: true
                                            })
                                            wx.request({
                                                url: 'https://trd.dachan.com.cn/dacheng/agentDefault/findAgentDefaultByAddress?address=天津天津市',
                                                data: {},
                                                header: {
                                                    'content-type': 'application/json' // 默认值
                                                },
                                                success(res) {
                                                    console.log(res.data)
                                                    that.bSort(res.data)
                                                    that.datachange(res.data)
                                                    that.setData({
                                                        noAgentsList: res.data
                                                    })
                                                }
                                            })
                                        } else {
                                            // 附近有代理商
                                           that.bSort(res.data.data)
                                           that.datachange(res.data.data)
                                
                                            that.setData({
                                                agentsList: res.data.data
                                            })
                                        }
                                    }
                                })
                            } else if (province == "重庆市") {
                                wx.request({
                                  url: 'https://trd.dachan.com.cn/dacheng/agent/findAgentByAddressLatLng',
                                    data: {
                                      latitude: that.data.latitude,
                                      longitude: that.data.longitude,
                                      address: "重庆重庆市"
                                    },
                                    header: {
                                        'content-type': 'application/json' // 默认值
                                    },
                                    success(res) {
                                        console.log(res.data.data)
                                        if (res.data.data == null) {
                                            // 附近没有代理商
                                            that.setData({
                                                noAgent: true
                                            })
                                            wx.request({
                                                url: 'https://trd.dachan.com.cn/dacheng/agentDefault/findAgentDefaultByAddress?address=重庆重庆市',
                                                data: {},
                                                header: {
                                                    'content-type': 'application/json' // 默认值
                                                },
                                                success(res) {
                                                    console.log(res.data)
                                                  that.bSort(res.data)
                                                  that.datachange(res.data)
                                                    that.setData({
                                                        noAgentsList: res.data
                                                    })
                                                }
                                            })
                                        } else {
                                            // 附近有代理商
                                          that.bSort(res.data.data)
                                          that.datachange(res.data.data)
                                            that.setData({
                                                agentsList: res.data.data
                                            })
                                        }
                                    }
                                })
                            } else if (province == "北京市") {
                                wx.request({
                                  url: 'https://trd.dachan.com.cn/dacheng/agent/findAgentByAddressLatLng',
                                    data: {
                                      latitude: that.data.latitude,
                                      longitude: that.data.longitude,
                                      address: "北京北京市"
                                    },
                                    header: {
                                        'content-type': 'application/json' // 默认值
                                    },
                                    success(res) {
                                        console.log(res.data.data)
                                        if (res.data.data == null) {
                                            // 附近没有代理商
                                            that.setData({
                                                noAgent: true
                                            })
                                            wx.request({
                                                url: 'https://trd.dachan.com.cn/dacheng/agentDefault/findAgentDefaultByAddress?address=北京北京市',
                                                data: {},
                                                header: {
                                                    'content-type': 'application/json' // 默认值
                                                },
                                                success(res) {
                                                    console.log(res.data)
                                                  that.bSort(res.data)
                                                  that.datachange(res.data)
                                                    that.setData({
                                                        noAgentsList: res.data
                                                    })
                                                }
                                            })
                                        } else {
                                            // 附近有代理商
                                          that.bSort(res.data.data)
                                          that.datachange(res.data.data)
                                            that.setData({
                                                agentsList: res.data.data
                                            })
                                        }
                                    }
                                })
                            } else if (province == "上海市") {
                                wx.request({
                                  url: 'https://trd.dachan.com.cn/dacheng/agent/findAgentByAddressLatLng',
                                    data: {
                                      latitude: that.data.latitude,
                                      longitude: that.data.longitude,
                                      address: "上海上海市"
                                    },
                                    header: {
                                        'content-type': 'application/json' // 默认值
                                    },
                                    success(res) {
                                        console.log(res.data.data)
                                        if (res.data.data == null) {
                                            // 附近没有代理商
                                            that.setData({
                                                noAgent: true
                                            })
                                            wx.request({
                                                url: 'https://trd.dachan.com.cn/dacheng/agentDefault/findAgentDefaultByAddress?address=上海上海市',
                                                data: {},
                                                header: {
                                                    'content-type': 'application/json' // 默认值
                                                },
                                                success(res) {
                                                    // console.log(res.data)
                                                  that.bSort(res.data)
                                                  that.datachange(res.data)
                                                    that.setData({
                                                        noAgentsList: res.data
                                                    })
                                                }
                                            })
                                        } else {
                                            // 附近有代理商
                                          that.bSort(res.data.data)
                                          that.datachange(res.data.data)
                                            that.setData({
                                                agentsList: res.data.data
                                            })
                                        }
                                    }
                                })
                            } else {
                                wx.request({
                                  url: 'https://trd.dachan.com.cn/dacheng/agent/findAgentByAddressLatLng',
                                    data: {
                                      address: province + city,
                                      latitude: that.data.latitude,
                                      longitude: that.data.longitude,
                                    },
                                    header: {
                                        'content-type': 'application/json' // 默认值
                                    },
                                    success(res) {
                                        console.log(res.data.data)
                                        if (res.data.data == null) {
                                            // 附近没有代理商
                                            console.log("附近没有代理商")
                                            that.setData({
                                                noAgent: true
                                            })
                                            wx.request({
                                                url: 'https://trd.dachan.com.cn/dacheng/agentDefault/findAgentDefaultByAddress?address=' + province + city,
                                                data: {},
                                                header: {
                                                    'content-type': 'application/json' // 默认值
                                                },
                                                success(res) {
                                                    console.log(res.data)
                                                  that.bSort(res.data)
                                                  that.datachange(res.data)
                                                    that.setData({
                                                        noAgentsList: res.data
                                                    })
                                                }
                                            })
                                        } else {
                                            // 附近有代理商
                                          that.bSort(res.data.data)
                                          that.datachange(res.data.data)
                                            that.setData({
                                                agentsList: res.data.data
                                            })
                                        }
                                    }
                                })
                            }
                        },
                        fail: function(res) {
                            wx.showToast({
                                title: '定位失败，请重试',
                                icon: 'none',
                                duration: 2000
                            });
                        }
                    })
                },
                // 用户拒绝了授权地理位置
                fail: function() {
                    wx.hideLoading();
                    // 缓存用户授权了地理位置的flag
                    wx.setStorageSync('myFlag', 9);
                    wx.getSetting({
                            success: function(res) {
                                if (!res.authSetting['scope.userLocation']) {
                                    wx.showModal({
                                        title: '',
                                        content: '请允许大成优+获取您的定位',
                                        confirmText: '授权',
                                        success: function(res) {
                                            if (res.confirm) {
                                                wx.openSetting();
                                            } else {
                                                console.log('get location fail');

                                            }
                                        }
                                    })
                                } else {
                                    //用户已授权，但是获取地理位置失败，提示用户去系统设置中打开定位
                                    wx.showModal({
                                        title: '',
                                        content: '请在系统设置中打开定位服务',
                                        confirmText: '确定',
                                        success: function(res) {}
                                    })
                                }
                            }
                        })
                        // 用户没进行地理位置授权，默认显示天津市
                    wx.request({
                        url: 'https://trd.dachan.com.cn/dacheng/agent/findAgentByAddress?address=天津天津市',
                        data: {},
                        header: {
                            'content-type': 'application/json' // 默认值
                        },
                        success(res) {
                            console.log(res.data.data)
                            that.setData({
                                agentsList: res.data.data
                            })

                        }
                    })
                }
            })
        }
    },

    /**
     * 页面卸载生命周期函数-----清除扫码进来的代理商id
     */
    onUnload: function() {
        console.log("页面卸载")
        wx.removeStorageSync('cid')
    },

    /**
     * 点击代理商二维码- - -开启显示二维码的弹出层 【大图二维码】
     */
    showPopup(event) {
        var id = event.currentTarget.id;
        // console.log(id);
        var list = this.data.agentsList;
        for (var i = 0; i < list.length; i++) {
            if (list[i].id == id) {
                this.setData({
                        imgIndex: i
                    })
                    // i 是索引
            }
        }
        var i = this.data.imgIndex;
        var img = this.data.agentsList[i].qrCodeUrl;
        this.setData({
            erweima: img,
            show: true
        });
    },

    /**
     * 关闭显示二维码的弹出层
     */
    onClose() {
        this.setData({ show: false });
    },

    /**
     * 点击附近代理商 - -带着代理商Id 跳转至Index
     */
    toDetails(event) {
        var id = Number(event.currentTarget.id);
        console.log(id);
        // 把代理商ID存缓存
        wx.setStorageSync('id', id);
        wx.request({
          url: 'https://trd.dachan.com.cn/dacheng/DataAnalysis',
          method:"POST",
          data:{
            "aId": wx.getStorageSync("id"),
            "status": 0
          },
          success:function(res){
             console.log(res,"成功")
          }
        })
        // switchTab页面不能传值哈
        wx.switchTab({
            url: '/pages/index/index',
        })
    },
    //
  addnav(){
     wx.navigateTo({
       url: '../siteaddserver/siteaddserver',
     })
  },
  //排序
  bSort(arr) {
    var len = arr.length;
    for(var i = 0; i<len- 1; i++) {
      for (var j = 0; j < len - 1 - i; j++) {
        // 相邻元素两两对比，元素交换，大的元素交换到后面
        if (Number(arr[j].distance) > (Number(arr[j+1].distance))) {
          var temp = arr[j];
          arr[j] = arr[j + 1];
          arr[j + 1] = temp;
        }
      }
    }
    return arr;
  },
  //修改距离
  datachange(arrlea){
    for (var i = 0; i < arrlea.length;i++){
      arrlea[i].distance = Number((arrlea[i].distance) / 1000).toFixed(2)
    }
  },
  //地理位置刷新按钮
  shuaxin(){
     this.onShow()
  }
})