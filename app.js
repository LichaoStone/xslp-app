//app.js

App({
  //
  globalData: {
    path: 'https://snmlhui.cn',
    // path: 'https://moliho.natapp4.cc',
    userInfo: null,
    appId: 'wxeed97f5cf2cc1850',
    openId:'',
    unionId: ''
  },

  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    //
    //云开发初始化
    wx.cloud.init({
      env: 'xslp-ay9tn',
      traceUser: true
    });
    //
    this.getOpenid();
    //
    // 检查小程序是否有新版本发布
    if (wx.canIUse('getUpdateManager')) {
      const updateManager = wx.getUpdateManager()
      updateManager.onCheckForUpdate(function (res) {
        //
        console.log('检查是否有新版本发布：', res.hasUpdate);
        // 请求完新版本信息的回调
        if (res.hasUpdate) {
          //
          updateManager.onUpdateReady(function () {
            wx.showModal({
              title: '更新提示',
              content: '新版本已经准备好，是否重启应用？',
              success: function (res) {
                if (res.confirm) {
                  // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
                  updateManager.applyUpdate();
                } else if (res.cancel) {
                  // 点击取消，强制更新
                  updateManager.applyUpdate();
                }
              }
            })
          })
          // 请求更新失败
          updateManager.onUpdateFailed(function () {
            // 新的版本下载失败
            wx.showModal({
              title: '已经有新版本了',
              content: '新版本已经上线，请您删除当前小程序，重新搜索打开！',
            })
          })
        }
      })
    } else {
      // 如果希望用户在最新版本的客户端上体验您的小程序，可以这样子提示
      wx.showModal({
        title: '提示',
        content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
      })
    }
  },

  userLogin: function(){
    //
    let _this = this;
    // 检查登录session
    wx.checkSession({
      success: function(res) {
        //session_key 未过期，并且在本生命周期一直有效
        console.log('检查sessionKey：', res.errMsg);
        let sessionKey = wx.getStorageSync('sessionKey');
        console.log('sessionKey：', sessionKey);
        //
        if(!sessionKey){
          _this.onlogin();
        }
      },
      fail: function(res) {
        _this.onlogin();
      }
    });
  },


  onlogin: function(){
    //
    let _this = this;
    // 调用微信的 wx.login 接口，从而获取code
    wx.login({
      success: function(res) {
        //
        console.log('wx.login信息：', res);
        let appId = _this.globalData.appId;
        //
        wx.request({
          url: _this.globalData.path + '/store/appletLogin',
          dataType: 'json',
          data: {
            data: {
              appId: appId,
              code: res.code
            }
          },
          success: function(rsp){
            console.log('登录返回数据：', rsp);
            let data = rsp.data;
            //
            wx.setStorageSync('sessionKey', data.session_key);
          }
        });
      }
    });
  },


  // 云开发方式获取openid
  getOpenid() {
    //
    wx.cloud.callFunction({
      name: 'getOpenid',
      complete: res => {
        //
        console.log('getOpenid信息：',res);
        // 同步保存部分用户信息
        wx.setStorageSync('openId', res.result.openid);
        wx.setStorageSync('appId', res.result.appid);
        wx.setStorageSync('unionId', res.result.unionid);
        wx.setStorageSync('userInfo', res.result.userInfo);
        //
        this.userLogin();
      }
    })
  }
  
})