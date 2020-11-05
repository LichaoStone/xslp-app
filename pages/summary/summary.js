// pages/summary/summary.js
const app = getApp();
//
Page({
  /**
   * 页面的初始数据
   */
  data: {
    cardTypeInfo : null,
    inputValue: '',
  },

  // 绑定获取输入框内容函数
  inputValFun: function(event){
    //
    wx.setStorageSync('searchVal', event.detail.value);
  },

  // 搜索框
  searchDataFun: function(){
    //
    let _this = this;
    let cardName = wx.getStorageSync('searchVal');
    console.log('搜索框输入内容：', cardName);
    // 请求后台查询数据
    wx.request({
      url: app.globalData.path + '/store/getCardCouponType',
      dataType: 'json',
      data: {
        data: {
          appId: app.globalData.appId,
          cardName: cardName
        }
      },
      success: function (res) {
        //
        let dataInfo = res.data;
        console.info('查询卡券类别结果：',dataInfo);
        //
        _this.setData({
          cardTypeInfo : dataInfo
        });
      }
    });
  },

  // 查看发券统计
  viewCouponSummaryFun: function(opt){
    console.log('查看卡券统计参数：', opt);
    //
    let cardId = opt.target.dataset.cardid;
    //
    wx.navigateTo({
      url: '../statistical/statistical?type=0&cardId=' + cardId
    });
  },

  // 查看核销统计
  viewConsumCouponFun: function(opt){
    console.log('查看核销统计参数：', opt);
    //
    let cardId = opt.target.dataset.cardid;
    //
    wx.navigateTo({
      url: '../statistical/statistical?type=1&cardId=' + cardId
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    //
    this.searchDataFun();
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