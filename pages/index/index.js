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
    imgQrCodeSrc: app.globalData.path + '/imgs/qc.png',
    phoneSysInfo: null,
    paraData: null,
    detail: null,
    userInfo: {},
    hasUserInfo: false,
    isShow: true,
    showHalf: false,
    showPhone: false,
    showLocation: false,
    showSyn: true,
    showQrCode: true,
    showModal: true,
    carCode: null,
    storeInfo: null,
    // 转赠优惠劵信息
    userDonate: null,
    headImage: '../../image/head.png',
    closeBtnImages: '../../image/psc.png',
    // 是否弹出领券窗
    isShowCouponPopUp: false
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },

  //阻止弹出层滑动事件，空函数，不做任何处理
  onPreventTouchMove: function () {
    return false;
  },

  // 用户点击手机授权取消
  closePhoneDialog: function() {
    //
    this.setData({
      showPhone: false
    });
  },

  // 隐藏或显示公司简介
  showSynFun: function(){
    this.setData({
      showSyn: this.data.showSyn?false:true
    });
  },
  // 显示技术支付人员二维码
  showQrCodeFun: function(){
    this.setData({
      showQrCode: this.data.showQrCode?false:true
    });
  },
  //
  imgOcrFun: function(e){
    console.log('支持人员二维码：', e)
    var current = e.target.dataset.src;
    wx.previewImage({
      current: current,
      urls: [current]
    })
  },

  // 跳转链接小程序
  linkStoreAppFun: function(){
    // 跳转小程序
    wx.navigateToMiniProgram({
      appId: 'wx0336c64f5686eb56',
      success(res) {
        console.log('====跳转小程序成功====', res);
      }
    });
  },

  //关闭优惠劵弹窗
  closeTheCouponPopUp: function () {
    // 设置优惠劵弹窗关闭动画
    var animation = wx.createAnimation({
      duration: 300,
      timingFunction: 'ease',
    })
    this.animation = animation;
    animation.scale(0).step();
    this.setData({
      animationData: animation.export(),
    })
    //执行完动画后再关闭
    setTimeout(() => {
      //
      this.setData({
        isShowCouponPopUp: false
      });
      // 还原数据状态
      this.revertDonateInfoStateFun();
    }, 200)
  },

  // 如果有转赠，弹出
  tipUserDonateDialogFun: function(){
    //
    let _this = this;
    //
    setTimeout(() => {
      // 先开启优惠劵弹窗
      _this.setData({
        isShowCouponPopUp: true
      })
      // 设置优惠劵弹窗打开动画
      var animation = wx.createAnimation({
        duration: 600,
        timingFunction: 'ease',
      })
      _this.animation = animation;
      animation.scale(1).step();
      _this.setData({
        animationData: animation.export()
      })
    }, 500);
  },

  // 修改转赠信息
  updateUserDonateInfoFun: function(openId, cardCode){
    //
    let userDonateInfo = this.data.userDonate;
    // 赋值
    userDonateInfo.friendId = openId;
    userDonateInfo.friendCardCode = cardCode;
    //
    wx.request({
      url: app.globalData.path + '/store/updateUserDonateInfo',
      dataType: 'json',
      data: {
        data: userDonateInfo
      },
      success: function(res){
        console.log('修改转赠信息返回：', res);
      }
    })
  },

  // 领取转赠卡券
  getUserDonateCouponFun: function(){
    // 关闭优惠券领券窗
    this.setData({
      isShowCouponPopUp: false
    });
    //
    let userDonate = this.data.userDonate;
    //
    if(null == userDonate){
      // 弹出提示信息框
      wx.showModal({
        title: '异常提示',
        content: '卡券领取异常',
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
      return;
    }
    //
    let openId = app.globalData.openId;
    // 用户openId为null
    console.log('用户OpenId：', openId);
    if(!openId){
      app.openIdCallback = res => {
        console.log('app.openIdCallback：', res.openid);
        //
        this.setData({
          openId: res.openid
        });
        // 加载领取转赠卡券信息
        this.loadDonateCouponInfoFun();
      }
    } else {
      //
      this.setData({
        openId: openId
      });
      // 加载领取转赠卡券信息
      this.loadDonateCouponInfoFun();
    }
  },

  // 加载用户领券转赠卡券信息
  loadDonateCouponInfoFun: function(){
    //
    let _this = this;
    let openId = this.data.openId;
    let userDonate = this.data.userDonate;
    // 请求后台服务
    wx.request({
      url: app.globalData.path + '/store/getUserDonateCoupon',
      dataType: 'json',
      data: {
        data: userDonate
      },
      success: function(res){
        console.log('转赠卡券信息返回：', res);
        let code = res.data.code;
        if('300' == code){
          // 弹出提示信息框
          wx.showModal({
            title: '异常提示',
            content: '卡券领取异常',
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
          return;
        }
        //
        let cardType = res.data.cardType;
        let cardName = res.data.cardName;
        let userCode = res.data.userCode;
        // 加载领取卡券显示
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
                  openId: openId,
                  userCode: userCode,
                  cardName: cardName,
                  cardType: cardType,
                  coupons: resp.cardList
                }
              },
              success: function(e){
                //
                console.log('领取转赠卡券返回结果：', e);
                let code = e.data.code;
                let cardCde = e.data.cardCode;
                if('200' == code){
                  // 修改转赠信息
                  _this.updateUserDonateInfoFun(openId, cardCde);
                  // 跳转显示卡券列表
                  wx.navigateTo({
                    url: '../usercoupon/usercoupon'
                  });
                } else {
                  // 弹出提示信息框
                  wx.showModal({
                    title: '异常提示',
                    content: '卡券领取异常',
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
            //
            _this.revertDonateInfoStateFun();
          }
        });
      }
    });
  },

  // 没有点击领取，则还原数据状态
  revertDonateInfoStateFun: function(){
    //
    let userDonateInfo = this.data.userDonate
    if(userDonateInfo){
      // 没有领取，还原数据状态
      wx.request({
        url: app.globalData.path + '/store/updateUserDonateInfoState',
        dataType: 'json',
        data: {
          data: userDonateInfo
        },
        success: function(res){
          console.log('还原转赠信息返回：', res);
        }
      });
    }
  },

  // 销毁前会执行
  onSaveExitState: function() {
    console.log('====执行onSaveExitState函数====');
  },

  // 处理手机屏幕大小显示
  phoneWindowShowFun: function(){
    //
    let sys = this.data.phoneSysInfo;
    console.log('用户手机系统信息：', sys);
    let s_height = sys.windowHeight;
    //
    if(s_height > 800){
      this.setData({
        s_height: (s_height - 290) + 'rpx'
      });
    } else if(s_height < 700) {
      this.setData({
        s_height: (s_height - 190) + 'rpx'
      });
    } else if(s_height < 600) {
      this.setData({
        s_height: (s_height - 150) + 'rpx'
      });
    }  else if(s_height < 500) {
      // this.setData({
      //   s_height: (s_height + 50) + 'rpx'
      // });
    } else {
      this.setData({
        s_height: (s_height - 100) + 'rpx'
      });
    }
  },

  // 
  onLoad: function (options) {
    //
    let _this = this;
    let sys = wx.getSystemInfoSync();
    this.setData({
      phoneSysInfo: sys
    });
    // 设置屏幕布局
    this.phoneWindowShowFun();
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
    } else if(options.sharepara){ // 好友赠券
      //
      let shareParams = decodeURIComponent(options.sharepara);
      console.log('好友赠券参数：', JSON.parse(shareParams));
      // 验证转赠相关信息
      _this.checkDonateCouponFun(shareParams);
    }
  },
  
  // 检查转赠卡券是否异常
  checkDonateCouponFun: function(params){
    //
    let _this = this;
    let shareData = JSON.parse(params);
    console.log('检查转赠卡券状态参数：', shareData);
    // 请求后台验证卡券
    wx.request({
      url: app.globalData.path + '/store/checkCouponState',
      dataType: 'json',
      data: {
        data: shareData
      },
      success: function(resp){
        console.log('验证转赠卡券状态结果：', resp);
        let data = resp.data;
        if('200' == data.code){
          // 转赠的卡券正常则保持转赠信息
          _this.loadDonateDataInfoFun(params);
        } else {
          // 弹出错误框
          wx.showModal({
            title: '异常提示',
            content: '赠送的' + data.message,
            success: function (res) {
              if (res.confirm) {
                //
              } else if (res.cancel) {
                //
              }
            }
          });
        }
      }
    });
  },

  // 加载转赠相关信息
  loadDonateDataInfoFun: function(params){
    //
    let _this = this;
    //
    let shareData = JSON.parse(params);
    console.log('加载转赠数据：', shareData);
    // 加载转赠信息
    wx.request({
      url: app.globalData.path + '/store/findUserDonateInfo',
      dataType: 'json',
      data: {
        data: shareData
      },
      success: function(res){
        console.log('加载转赠信息返回：', res);
        let dataInfo = res.data;
        //
        if('200' == dataInfo.code){
          let userDonate = dataInfo.data;
          //
          if(dataInfo.userCode){
            userDonate.userCode = dataInfo.userCode;
          }
          //
          _this.setData({
            userDonate: userDonate
          });
          // 弹出领券窗
          _this.tipUserDonateDialogFun();
          //
        } else if('300' == dataInfo.code && dataInfo.message){
          // 弹出提示信息框
          wx.showModal({
            title: '友情提示',
            content: dataInfo.message,
            success (res) {
              if (res.confirm) {
                //
              } else if (res.cancel) {
                //
              }
            }
          });
        }
      }
    });
  },

  // 查询用户信息
  findUserInfo: function(opt){
    console.log('findUserInfo=>查询用户信息：', opt);
    let openId = app.globalData.openId;
    console.log('用户OpenId：', openId);
    if(!openId){
      app.openIdCallback = res => {
        console.log('app.openIdCallback：', res.openid);
        openId = res.openid;
        this.setData({
          openId: res.openid
        });
        //
        this.reqUserInfoFun(opt);
      }
    } else {
      //
      this.setData({
        openId: openId
      });
      //
      this.reqUserInfoFun(opt);
    }
  },

  // 请求后台获取用户信息
  reqUserInfoFun: function(opt){
    //
    let that = this;
    let openId = this.data.openId;
    //
    wx.request({
      url: app.globalData.path + '/store/onlogin',
      dataType: 'json',
      data: {
          data: {
            appId: app.globalData.appId,
            openId: openId
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
          } else if(!user.userPhone){
            // 拉起授权手机号
            that.setData({
              showPhone: true
            });
          } else {
            // 跳转核销
            that.jumpCouponClearFun(opt);
          }
        } else {
          // 用户不存在，拉起授权昵称，保存用户信息
          that.setData({
            showHalf: true
          });
          //
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
    let _this = this;
    // 隐藏下方菜单
    wx.hideTabBar({});
    // 请求后台查询闸机识别用户车牌
    wx.request({
      url: app.globalData.path + '/store/getUserOCRCarCode',
      dataType: 'json',
      data: {
        data: {
          appId: app.globalData.appId,
          params: opt.consum
        }
      },
      success: function(res){
        let data = res.data;
        console.log('返回闸机识别车牌数据：', data);
        if(data && data.carCode){
          // 保存识别车牌
          _this.setData({
            carCode: data.carCode ? data.carCode : null,
            showModal: false,
            opt: opt
          });
        } else {
          // 没有配置闸机的，直接显示核销码
          _this.showConsomerCodeFun(opt);
        }
      }
    });
  },

  // 展示用户卡券核销码
  showConsomerCodeFun: function(opt){
    //
    let dialogObj = this.selectComponent("#dialog");
    console.log('dialogDom', dialogObj);
    //
    dialogObj.properties.isShow = false;
    //
    this.setData({
      showModal: true,
      detail: opt.consum
    });
    // 显示卡券核销码
    dialogObj._initReadyFun();
  },

  // 弹出框蒙层截断touchmove事件
  preventTouchMove: function () {
  },

  // 显示用户绑定车牌-取消
  carCodeCancelFun: function(opt){
    console.log('车牌绑定取消：', opt)
    let obj = this.data.opt;
    let carCode = this.data.carCode;
    let type = opt.target.dataset.type;
    obj.consum = obj.consum+","+type+","+carCode;
    console.log('用户车牌绑定取消时核销参数：', obj);
    this.showConsomerCodeFun(obj);
  },

  // 显示用户绑定车牌-确定
  carCodeConfirmFun: function(opt){
    console.log('车牌绑定确定：', opt)
    let obj = this.data.opt;
    let carCode = this.data.carCode;
    let type = opt.target.dataset.type;
    obj.consum = obj.consum+","+type+","+carCode;
    console.log('用户车牌绑定确定时核销参数：', obj);
    this.showConsomerCodeFun(obj);
  },


  //根据经纬度判断距离
  distanceFun: function(d) {
    return d * Math.PI / 180.0;
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

  // 关闭地理位置窗口
  closeLocationDialog: function(){
    //
    this.setData({
      showLocation: false
    });
  },

  // 打开用户地理位置设置
  authorizeLocationFun: function(){
    //
    let _this = this;
    // 关闭提示窗口
    this.closeLocationDialog();
    // 打开位置设置
    wx.openSetting({
      success: function (dataAu) {
        console.log('用户位置设置：', dataAu)
        if (dataAu.authSetting["scope.userLocation"] == true) {
          let para = wx.getStorageSync('para');
          let type = wx.getStorageSync('type');
          //授权后获取卡券
          _this.getLocationFun(para, type);
        }
      },
      fail: function (res) {
        console.log('打开地理位置设置失败：', res);
      }
    });
  },

  // 获取发券码用户所在门店信息
  getStaffStoreInfoFun: function(){
    //
    let _this = this;
    //
    let paraInfo = wx.getStorageSync('para');
    let type = wx.getStorageSync('type');
    console.log('参数：', paraInfo);
    let paraAry = paraInfo.split(',');
    //
    wx.request({
      url: app.globalData.path + '/store/getStaffStoreInfo',
      dataType: 'json',
      data: {
        data: {
          appId: app.globalData.appId,
          phone: paraAry[3]
        }
      },
      success: function(res) {
        console.log('查询门店返回：', res);
        //
        if(res.data){
          //
          _this.setData({
            storeInfo: res.data
          });
          // 判断用户与门店距离
          _this.getLocationFun(paraInfo, type);
        }
      }
    });
  },

  // 用户扫码领券
  checkScanQrCodeFun: function(para, type) {
    //
    console.log('验证扫码参数：', para);
    wx.setStorageSync('para', para);
    wx.setStorageSync('type', type);
    //
    // 扫固定码时授权地理位置
    if(0 == type){
      // 用户系统信息
      let sysInfo = this.data.phoneSysInfo;
      console.log('用户系统信息：', sysInfo);
      // 用户是否打开定位服务
      if(!sysInfo.locationEnabled){
        // 提示打开系统定位服务
        wx.showModal({
          title: '提示',
          content: '请在设置>隐私>定位服务，打开定位服务',
          success: function (res) {}
        });
        return;
      }
      //
      wx.getSetting({
        success: (res) => {
          console.log('是否授权位置信息：', res);
          if (res.authSetting['scope.userLocation'] != undefined && res.authSetting['scope.userLocation'] != true) {
            // 拉起提示
            this.setData({
              showLocation: true
            });
          } else {
            // 获取用户所属门店信息
            this.getStaffStoreInfoFun();
          }
        }
      });
    } else {
      // 非固定码直接获取卡券
      this.getCouponFun(para, type);
    }
  },

  // 获取用户地理位置
  getLocationFun: function(para, type){
    //
    let _this = this;
    let store = this.data.storeInfo;
    //
    var promise = new Promise((resolve) => {
      //
      wx.getLocation({
        // type: 'wgs84',
        type: 'gcj02',
        success: function (res) {
          // 用户的经度
          let longitude = res.longitude;
          // 用户的纬度
          let latitude = res.latitude;
          console.log('用户地理位置：', res);
          // 商家的纬度
          let storeLng = store.longitude;
          // 商家的纬度
          let storeLat = store.latitude;
          //
          let radLat1 = _this.distanceFun(latitude); // 用户纬度
          console.log('用户纬度：', radLat1);
          let radLat2 = _this.distanceFun(storeLat); // 商家纬度
          console.log('商家纬度：', radLat2);
          let a = radLat1 - radLat2;
          let b = _this.distanceFun(longitude) - _this.distanceFun(storeLng);
          let s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) + Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)));
          s = s * 6378.137;
          s = Math.round(s * 10000) / 10000;
          s = (s * 1000).toFixed(2) + '米' //保留两位小数
          console.log('用户与门店的距离是:' + s);
          // 固定距离数 500米
          if(parseInt(s) > 800){
            // 提示
            wx.showModal({
              title: '提示',
              content: '您距离门店较远，请到达门店后在领取！',
              success (res) {
                if (res.confirm) {
                  //
                } else if (res.cancel) {
                  //
                }
              }
            });
            return false;
          }
          //
          resolve();
        },
        fail: function (res) {
          console.log('用户地理位置失败：', res);
        }
      });
    });
    //
    promise.then(() => {
      //
      _this.getCouponFun(para, type);
    });
  },

  // 获取卡券
  getCouponFun: function(para, type){
    console.log('扫码显示卡券：', para);
    //
    let openId = app.globalData.openId;
    console.log('用户OpenId：', openId);
    if(!openId){
      app.openIdCallback = res => {
        console.log('app.openIdCallback：', res.openid);
        // openId = res.openid;
        this.setData({
          openId: res.openid
        });
        //
        this.loadCouponInfoFun(para, type);
      }
    } else {
      //
      this.setData({
        openId: openId
      });
      //
      this.loadCouponInfoFun(para, type);
    }
  },

  // 加载用户扫码领券信息
  loadCouponInfoFun: function(para, type){
    //
    let _this = this;
    let appId = app.globalData.appId;
    let openId = this.data.openId;
    console.log('this.data.openId = ', openId);
    //
    wx.request({
      url: app.globalData.path + '/store/checkUserQrCode',
      dataType: 'json',
      data: {
        data: {
          openId: openId,
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
                    appId: appId,
                    openId: openId,
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
  },

  // 用户授权昵称函数
  getWxUserInfo(res){
    console.log('授权昵称函数：', res);
    //
    if(res.detail.userInfo){
      //
      let openId = app.globalData.openId;
      //
      console.log('用户OpenId：', openId);
      if(!openId){
        app.openIdCallback = res => {
          console.log('app.openIdCallback：', res.openid);
          //
          this.setData({
            openId: res.openid
          });
          //
          this.authorizeNickNameFun(res);
        }
      } else {
        //
        this.setData({
          openId: openId
        });
        //
        this.authorizeNickNameFun(res);
      }
    }
  },

  // 更新用户昵称
  authorizeNickNameFun: function(res){
    //
    let _this = this;
    let appId = app.globalData.appId;
    let openId = this.data.openId;
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
        // 关闭授权窗口
        _this.closeHalfDialog();
        // 拉起确认手机授权
        setTimeout(function(){
          _this.setData({
            showPhone: true
          });
        }, 1200);
      }
    });
  },

  // 用户点击确定，拉起授权手机
  getPhoneNumber(e) {
    //
    console.log('拉起手机授权框：', e);
    var that = this;
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
            showPhone: true
          });
        }
      });
    } else if(e.detail.errMsg.indexOf('fail') != -1){
      that.setData({
        showPhone: false
      });
    }
  },

  // 更新用户手机号
  updateUserPhone: function(data){
    //
    let openId = app.globalData.openId;
    console.log('用户OpenId：', openId);
    if(!openId){
      app.openIdCallback = res => {
        console.log('app.openIdCallback：', res.openid);
        //
        this.setData({
          openId: res.openid
        });
        //
        this.invokeUpdateUserPhoneFun(data);
      }
    } else {
      //
      this.setData({
        openId: openId
      });
      //
      this.invokeUpdateUserPhoneFun(data);
    }
  },

  // 执行后台更新用户手机号
  invokeUpdateUserPhoneFun: function(para){
    //
    let that = this;
    let openId = this.data.openId;
    //
    wx.request({
      url: app.globalData.path + '/store/decryptUserPhone',
      dataType: 'json',
      data: {
        data: {
          appId: app.globalData.appId,
          openId: openId,
          sessionKey: wx.getStorageSync('sessionKey'),
          encryptedData: para.encryptedData,
          iv: para.iv
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
        //
        setTimeout(function(){
          // 返回成功，查询可核销的卡券
          that.jumpCouponClearFun(that.data.paraData);
        }, 500);
      }
    });
  }

})
