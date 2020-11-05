// pages/couponsynch/couponsynch.js

const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  // 同步公众号卡券
  couponSynchFun: function(){
    console.log('====执行卡券同步====');
    //
    wx.request({
      url: app.globalData.path + '/store/refreshCouponList',
      dataType: 'json',
      data: {
        data: {
          appId: app.globalData.appId
        }
      },
      success: function(res) {
        console.log('同步卡券返回结果：', res);
        
      }
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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

})