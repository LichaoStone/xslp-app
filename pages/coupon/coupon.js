// pages/coupon/coupon.js
const app = getApp(); 
//
Page({
  /**
   * 页面的初始数据
   */
  data: {
    
  },

  // 验证用户扫码是否有效
  checkScanQrCodeFun: function(para, type) {
    //
    console.log('验证扫码参数：', para);
    let appId = app.globalData.appId;
    if(!appId){
      app.getOpenid();
    }
    //
    wx.request({
      url: app.globalData.path + '/store/checkUserQrCode',
      dataType: 'json',
      data: {
        data: {
          appId: app.globalData.appId,
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
            content: type==0?'卡券领取码已过期':'卡券已被领取，不能重复领券',
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
                  // 跳转用户卡券列表
                  wx.request({
                    url: app.globalData.path + '/store/queryUserCardCoupons',
                    dataType: 'json',
                    data: {
                      data: {
                        appId: app.globalData.appId,
                        openId: wx.getStorageSync('openId')
                      }
                    },
                    success: function (res) {
                      //
                      let dataInfo = res.data;
                      console.info('查询用户卡券列表返回：', dataInfo);
                      //
                      if(dataInfo){
                        // 显示卡券列表
                        wx.navigateTo({
                          url: '../usercoupon/usercoupon'
                        });
                      }
                    }
                  });
                }
              })
            },
            cancel: function(res){
              //
              wx.switchTab({
                url: '../center/center',
              });
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

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //
    // console.info('验证用户扫码请求：',options);
    // //
    // if(options.para){
    //   //
    //   let paraData = decodeURIComponent(options.para);
    //   console.log('固定码扫码参数：', paraData);
    //   // 0-固定码
    //   this.checkScanQrCodeFun(paraData, 0);
    // } else {
    //   //
    //   let scene = decodeURIComponent(options.scene);
    //   console.log('动态码扫码参数：', scene);
    //   // 1-动态码
    //   this.checkScanQrCodeFun(scene, 1);
    // }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let pages = getCurrentPages();
    // 数组中索引最大的页面--当前页面
    let currentPage = pages[pages.length-1];
    let options = currentPage.options;
    //
    console.info('==onShow==验证用户扫码请求：',options);
    //
    if(options.para){
      //
      let paraData = decodeURIComponent(options.para);
      console.log('固定码扫码参数：', paraData);
      // 0-固定码
      this.checkScanQrCodeFun(paraData, 0);
    } else {
      //
      let scene = decodeURIComponent(options.scene);
      console.log('动态码扫码参数：', scene);
      // 1-动态码
      this.checkScanQrCodeFun(scene, 1);
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

})