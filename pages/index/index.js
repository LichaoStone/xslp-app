//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    bnrUrl: [{
      url: "../../image/zs1.jpg"
    }, {
      url: "../../image/zs2.jpg"
    },{
      url: "../../image/zs3.jpg"
    },{
      url: "../../image/zs4.jpg"
    },{
      url: "../../image/zs5.jpg"
    }],
    paraData: null,
    detail: null,
    userInfo: {},
    hasUserInfo: false,
    isShow: true,
    showHalf: false
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },

  onLoad: function (options) {
    //
    let _this = this;
    //
    console.info('验证用户扫码请求：',options);
    // 固态码领券
    if(options.para){
      //
      let paraData = decodeURIComponent(options.para);
      console.log('固定码扫码参数：', paraData);
      // 0-固定码
      _this.checkScanQrCodeFun(paraData, 0);
    } else if(options.scene) {  // 动态码领券
      //
      let scene = decodeURIComponent(options.scene);
      console.log('动态码扫码参数：', scene);
      // 1-动态码
      _this.checkScanQrCodeFun(scene, 1);
    } else if(options.consum){ // 扫码核销
      //
      console.log('扫码核销参数：', options);
      //
      _this.setData({
        paraData: options
      });
      // 核销时查询用户是否授权过昵称
      setTimeout(function(){
        _this.findUserInfo(options);
      }, 500);
    }
  },
  
  // 查询用户信息
  findUserInfo: function(opt){
    let that = this;
    // 
    wx.request({
      url: app.globalData.path + '/store/onlogin',
      dataType: 'json',
      data: {
          data: {
            appId: app.globalData.appId,
            openId: wx.getStorageSync('openId')
          }
      },
      success: function(res){
          console.log('查询用户返回信息：', res);
          //
          if(res.data){
            let user = res.data;
            // 如果没有手机号，拉起授权手机号
            if(!user.nickName){
                //
                that.setData({
                    showHalf: true
                });
                // 刷新登录sessionKey
                // app.onlogin();
            } else {
                // 跳转核销
                that.jumpCouponClearFun(opt);
            }
          } else {
            // 用户不存在，跳转首页
            wx.switchTab({
                url: '../index/index'
            });
          }
      },
      fail: function(res){
          console.info('请求后台数据异常',res);
      }
    });
  },

  // 跳转核销
  jumpCouponClearFun(opt) {
    console.log('====跳转卡券核销====', opt);
    //
    let dialogObj = this.selectComponent("#dialog");
    console.log('dialogDom', dialogObj);
    //
    dialogObj.properties.isShow = false;
    //
    this.setData({
      detail: opt.consum
    });
    // 隐藏下方菜单
    wx.hideTabBar({});
    //
    dialogObj._initReadyFun();
  },


  // 跳转门店导航列表
  jumpStoreList () {
    wx.navigateTo({
      url: '../storeList/storeList'
    })
  },

  // 用户点击手机授权取消
  closeHalfDialog: function() {
    //
    this.setData({
      showHalf: false
    });
  },


  // 用户扫码领券
  checkScanQrCodeFun: function(para, type) {
    //
    let _this = this;
    //
    console.log('验证扫码参数：', para);
    let appId = app.globalData.appId;
    // 延时执行验证请求，防止openId为空
    setTimeout(function(){
      wx.request({
        url: app.globalData.path + '/store/checkUserQrCode',
        dataType: 'json',
        data: {
          data: {
            openId: wx.getStorageSync('openId'),
            appId: appId,
            secretKey: para,
            type: type
          }
        },
        success: function(res){
          console.info('验证用户扫码返回结果：', res);
          let code = res.data.code;
          let cardType = res.data.cardType;
          let cardName = res.data.cardName;
          let userCode = res.data.userCode;
          let type = res.data.type;
          //
          if('300' == code){
            // 弹出提示信息框
            wx.showModal({
              title: '异常提示',
              content: type==0?'卡券已领取或券码已过期':'卡券已被领取，不能重复领券',
              success (res) {
                if (res.confirm) {
                  console.log('重复领券卡券异常，用户点击确定')
                  //
                  wx.switchTab({
                    url: '../index/index'
                  })
                } else if (res.cancel) {
                  console.log('重复领券卡券异常，用户点击取消')
                  //
                  wx.switchTab({
                    url: '../index/index'
                  })
                }
              }
            });
          } else if('200' == code){
            // 加载领取卡券显示
            console.log('加载卡券数据串：', res);
            // 显示领取卡券
            wx.addCard({
              cardList: res.data.data, // 参数
              success: function(resp) {
                // 卡券添加结果
                console.log('卡券添加结果:',resp)
                // 保存用户领券卡券信息
                wx.request({
                  url: app.globalData.path + '/store/addUserCardCoupons',
                  dataType: 'json',
                  data: {
                    data: {
                      appId: app.globalData.appId,
                      openId: wx.getStorageSync('openId'),
                      userCode: userCode,
                      cardName: cardName,
                      cardType: cardType,
                      secretKey: para,
                      coupons: resp.cardList
                    }
                  },
                  success: function(e){
                    //
                    console.log('用户领券卡券返回结果：' + JSON.stringify(e));
                    let code = e.data.code;
                    if('200' == code){
                      // 跳转显示卡券列表
                      wx.navigateTo({
                        url: '../usercoupon/usercoupon'
                      });
                    } else {
                      // 弹出提示信息框
                      wx.showModal({
                        title: '异常提示',
                        content: '领取卡券领取异常',
                        success (res) {
                          if (res.confirm) {
                            console.log('领取卡券领取异常，用户点击确定');
                            wx.switchTab({
                              url: '../index/index'
                            })
                          } else if (res.cancel) {
                            console.log('领取卡券领取异常，用户点击取消');
                            wx.switchTab({
                              url: '../index/index'
                            })
                          }
                        }
                      });
                    }
                  }
                })
              },
              cancel: function(res){
                console.log('====关闭到首页====');
                _this.onHide();
              }
            });
          } else {
            // 弹出提示信息框
            wx.showModal({
              title: '异常提示',
              content: '加载领取卡券异常',
              success (res) {
                if (res.confirm) {
                  console.log('加载领取卡券异常，用户点击确定')
                  //
                  wx.switchTab({
                    url: '../index/index'
                  })
                } else if (res.cancel) {
                  console.log('加载领取卡券异常，用户点击取消')
                  //
                  wx.switchTab({
                    url: '../index/index'
                  })
                }
              }
            });
          }
        },
        fail: function(res){
          console.log('请求验证领券码失败', res);
        }
      });
    },500);
  },

  // 用户授权昵称函数
  getWxUserInfo(res){
    console.log('授权昵称函数：', res);
    let _this = this;
    //
    if(res.detail.userInfo){
      //
      let appId = app.globalData.appId;
      let openId = wx.getStorageSync('openId');
      let unionId = wx.getStorageSync('unionId');
      //
      wx.request({
        url: app.globalData.path + '/store/addAppletUserInfo',
        dataType: 'json',
        data: {
          data: {
            openId: openId,
            appId: appId,
            unionId: unionId,
            userInfo: res.detail.userInfo
          }
        },
        success: function(res) {
          console.info('更新用户信息：', res);
          // // 关闭授权窗口
          _this.closeHalfDialog();
          //
          setTimeout(function(){
            // 返回成功，查询可核销的卡券
            _this.jumpCouponClearFun(_this.data.paraData);
          }, 500);
        }
      });
    }
  },

  // 用户点击确定，拉起授权手机
  getPhoneNumber(e) {
    //
    console.log('拉起手机授权框：', e);
    var that = this;
    //
    that.setData({
        showHalf: false
    });
    //
    if (e.detail.errMsg.indexOf('ok') != -1) {
      //
      console.info('用户同意手机授权：', e);
      // 检查用户登录session
      wx.checkSession({
        success: function(res) {
          //session_key 未过期，并且在本生命周期一直有效
          console.log('sessionKey未失效：', res);
          console.log('sessionKey = ' + wx.getStorageSync('sessionKey'));
          //
          that.updateUserPhone(e.detail);
        },
        fail: function(res) {
          //
          app.userLogin();
          // 拉起确认手机授权
          that.setData({
              showHalf: true
          });
        }
      });
      } else if(e.detail.errMsg.indexOf('fail') != -1){
        that.setData({
          showHalf: false
        });
      }
  },

  // 更新用户手机号
  updateUserPhone: function(data){
      //
      let that = this;
      //
      wx.request({
        url: app.globalData.path + '/store/decryptUserPhone',
        dataType: 'json',
        data: {
            data: {
            appId: app.globalData.appId,
            openId: wx.getStorageSync('openId'),
            sessionKey: wx.getStorageSync('sessionKey'),
            encryptedData: data.encryptedData,
            iv: data.iv
            }
        },
        success: function(re){
            //
            console.log('解密返回数据：', re);
            let data = re.data;
            if(data.phoneNumber){
              // 保存全局
              wx.setStorageSync('phone', data.phoneNumber);
            }
            // 返回成功，查询可核销的卡券
            that.jumpCouponClearFun(that.data.paraData);
        }
      });
  },

})
