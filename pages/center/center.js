// pages/center/center.js
const app = getApp(); 
//
Page({
  /**
   * 页面的初始数据
   */
  data: {
    userData: app.userData,
    menuList: null,
    coupons: 0,
    nickName: null,
    avatarUrl: '../../image/head.png',
    mShow: true,
    showLogin: true, // 默认显示登录按钮
    showHalf: false,
    phoneHalf: false
  },

  // 用户登录
  loginFun(){
    wx.navigateTo({
      url: '../login/login'
    });
  },

  // 用户查看个人信息
  userDetailFun(){
    //
    let that = this;
    //
    let userInfo = wx.getStorageSync('userInfo');
    //
    if(undefined == userInfo.nickName){
      // 查询用户信息
      that.queryUserInfo();
    } else {
      // 跳转个人信息
      wx.navigateTo({
        url: '../userdetail/userdetail',
      });
    }
  },

  // 页面测试函数
  couponClearFun: function(){
    wx.navigateTo({
      url: '../usercoupon/usercoupon'
    })
  },

  // 发券菜单
  configFun(){
    //
    let _this = this;
    // 用户信息
    let userInfo = wx.getStorageSync('userInfo');
    // 如果用户手机号未空
    if(!userInfo.userCode){
      _this.queryUserInfo();
    }
    // 跳转页面
    wx.navigateTo({
      url: '../cardtype/cardtype'
    });
  },

  // 核销券菜单
  consumCouponFun(){
     // 跳转页面
     wx.navigateTo({
      url: '../consume/consume'
    });
  },

  // 卡券统计菜单
  statisticalFun(){
    wx.navigateTo({
      url: '../summary/summary'
    });
  },

  // 授权员工菜单
  settingFun(){
    wx.navigateTo({
      url: '../setting/setting'
    });
  },

  // 用户查看优惠券
  viewCardCoupon(){
    //
    wx.navigateTo({
      url: '../usercoupon/usercoupon'
    });
  },

  // 配置门店员工菜单
  staffSettingFun(){
    //
    wx.navigateTo({
      url: '../staff/staff'
    });
  },

  // 系统菜单
  couponSynchFun(){
    //
    wx.navigateTo({
      url: '../couponsynch/couponsynch'
    });
  },

  // 点击我的tabbar触发事件
  onTabItemTap() {
    
  },

  // 请求后台查询用户信息
  queryUserInfo(){
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
          let menuList =  user.menuList;
          let couponNum = user.couponNumber;
          //
          if(user.nickName){
            // 手机号是空，拉起授权手机号
            if(null == user.userPhone || undefined == user.userPhone || "" == user.userPhone){
              //
              that.setData({
                phoneHalf: true
              });
            } else {
              //
              that.setData({
                showHalf: false,
                phoneHalf: false
              });
              // 保存全局数据
              wx.setStorageSync('userInfo', user);
              //
              that.setData({
                nickName: user.nickName,
                avatarUrl: user.avatarUrl,
                coupons: couponNum,
                showLogin: false
              });
              // 菜单
              if(menuList && menuList.length > 0){
                // 显示菜单
                that.setData({
                  mShow: false,
                  menuList: menuList
                });
              }
            }
          } else {
            // 无用户昵称，拉起授权
            that.authorizeFun();
          }
        }else{
          that.authorizeFun();
        }
      },
      fail: function(res){
        console.info('请求后台数据异常',res);
      }
    });
  },

  // 用户点击取消跳转首页
  closeHalfDialog: function() {
    //
    this.onUnload();
  },

  hidHalfDialog: function(){
    let that = this;
    that.setData({
      showHalf: false
    });
  },


  // 拉起用户昵称，性别，地理位置授权
  authorizeFun(){
    //
    let that = this;
    // 判断用户是否授权过
    wx.getSetting({
      success(res) {
        console.log('检查是否授权', res);
        //
        if (res.authSetting['scope.userInfo']) {
          console.log("====已授权====")
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称
          wx.getUserInfo({
            success(res) {
              console.log("获取用户信息成功", res)
              wx.setStorageSync('userInfo', res.userInfo);
              //
              that.setData({
                nickName: res.userInfo.nickName,
                avatarUrl: res.userInfo.avatarUrl,
                showLogin : false
              })
            },
            fail(res) {
              console.log("获取用户信息失败", res)
            }
          })
        } else {
          console.log("====未授权,拉起微信授权窗口====")
          that.setData({
            showHalf: true
          });
        }
      }
    })
    
  },

  // 执行函数
  getWxUserInfo(res){
    console.log('授权触发函数：' + JSON.stringify(res));
    let that = this;
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
          console.info('保存用户信息：' + JSON.stringify(res));
          //
          let userInfo = res.data;
          if(null != userInfo && undefined == userInfo.userCode){
            // 拉起手机号授权
            that.setData({
              phoneHalf: true
            });
          } else {
            //
            wx.setStorageSync('userInfo', res.data);
            that.onShow();
          }
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
        phoneHalf: false
    });
    //
    if (e.detail.errMsg.indexOf('ok') != -1) {
      //
      console.info('用户同意手机授权：', e);
      // 检查用户登录session
      wx.checkSession({
        success: function(res) {
          //session_key 未过期，并且在本生命周期一直有效
          console.log('sessionKey未失效：', res.errMsg);
          console.log('sessionKey = ' + wx.getStorageSync('sessionKey'));
          //
          that.updateUserPhone(e.detail);
        },
        fail: function(res) {
          //
          app.onlogin();
          // 拉起确认手机授权
          that.setData({
            showHalf: true
          });
        }
      });
    } else if(e.detail.errMsg.indexOf('fail') != -1){
      //
      that.closeHalfDialog();
    }
  },

  // 更新用户手机号
  updateUserPhone: function(data){
    //
    let _this = this;
    //
    let sessinKek = wx.getStorageSync('sessionKey');
    if(!sessinKek){
      app.onlogin();
    }
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
          //
          _this.onShow();
        }
      }
    });
  },


  bindGetUserInfo(e) {
    console.log('授权拉起框操作：',e.detail.userInfo)
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    
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
    //
    console.log('=====执行onShow函数====');
    //
    let that = this;
    //
    let userInfo = wx.getStorageSync('userInfo');
    console.info('用户信息：',userInfo);
    // 查询用户信息
    that.queryUserInfo();
    //
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
     //
     wx.switchTab({
      url: '../index/index',
    });
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