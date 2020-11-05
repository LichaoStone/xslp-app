// pages/login/login.js
const app = getApp(); 
//
Page({
  /**
   * 页面的初始数据
   */
  data: {
    phone: '',
    password: '',
  },
 
  // 获取输入账号 
  phoneInput: function (e) {
    this.setData({
      phone: e.detail.value
    })
  },
 
  // 获取输入密码 
  passwordInput: function (e) {
    this.setData({
      password: e.detail.value
    })
  },
 
  // 登录 
  login: function () {
    var that = this;   
    //
    var warn = null; //warn为当手机号为空或格式不正确时提示用户的文字，默认为空
    if (that.data.phone.length == 0) {
      wx.showToast({
        title: '用户名不能为空',
        icon: 'loading',
        duration: 1000
      })
    } else if (that.data.password.length == 0) {
      wx.showToast({
        title: '密码不能为空',
        icon: 'loading',
        duration: 1000
      })
    }else {
      //
      wx.request({
        url: app.globalData.path + '/store/userlogin',
        dataType: 'json',
        data: {
          data: {
            appId: app.globalData.appId,
            userPhone: that.data.phone,
            userPass: that.data.password
          }
        },
        success: function (res) {
          //
          console.log('登录返回：' + JSON.stringify(res));
          // 判断是否能正常登录
          if ('300' == res.data.code) {
            warn = "用户不存在或密码不匹配";
            wx.showModal({
              title: '提示',
              content: warn
            })
            return;
          } else {
            // 登录成功跳转个人中心
            app.globalData.userData = res.data.data;
            app.globalData.showFlag = false;
            //
            wx.switchTab({
              url: '../center/center',
            });
          }
        },
        fail: function(res){

        }
      }) 
    }
  },
  // 注册 
  register: function () {
    wx.navigateTo({
      url: '/pages/register/register',
    })
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