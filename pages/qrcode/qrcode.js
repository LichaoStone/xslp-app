// pages/cardtype/cardtype.js
const app = getApp(); 
//
Page({
  /**
   * 页面的初始数据
   */
  data: {
    btnShow: false,
    imgbase64 : null,
    cardName: '',
    showText: ''
  },

  // 刷新领券小程序码
  refushQrCodeFun: function(){
    //
    let _this = this;
    //
    wx.showLoading({
      title: '领券码加载中...',
    });
    // 刷新领券码
    wx.request({
      url: app.globalData.path + '/store/getAppletQrCode',
      data: {
        appId: app.globalData.appId,
        data: JSON.stringify(app.qrcodeData)
      },
      success: function(res){
        console.info('生成小程序码返回', res.data);
        let code = res.data.code;
        //
        wx.hideLoading({
          success: (res) => {},
        });
        //
        if('200' == code){
          //
          _this.setData({
            imgbase64: res.data.data
          });
          //
        } else {
          // 弹出提示信息框
          wx.showModal({
            title: '异常提示',
            content: '刷新领券码异常',
            success (res) {
              if (res.confirm) {
                //
                wx.navigateTo({
                  url: '../cardtype/cardtype'
                });
              } else if (res.cancel) {
                //
                wx.navigateTo({
                  url: '../cardtype/cardtype'
                });
              }
            }
          });
        }
      }
    });
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
    console.log(app.cardName)
    //
    let that = this;
    //
    that.setData({
      btnShow: app.btnShow,
      cardName: app.cardName,
      showText: app.showText,
      imgbase64 : app.imgbase
    });
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