// pages/cardcode/cardcode.js
const { formatTime, getAddDate } = require("../../utils/util");

const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    paraData: null,
    cardName: '',
    startDate: formatTime(new Date()),
    endDate: getAddDate(6),
    cardDate: formatTime(new Date()),
    dateStr: formatTime(new Date()),
    imgbase64: null,
  },


  // 日期选择
  datePickerBindchange: function(e){
    this.setData({
      cardDate: e.detail.value,
      dateStr: e.detail.value,
      imgbase64: null
    });
    console.log('选择日期：', e.detail.value);
    //
    this.createFiexdQrCode();
  },

  // 生成选择日期领券小程序码
  createFiexdQrCode: function() {
    //
    let _this = this;
    let userInfo =  wx.getStorageSync('userInfo');
    console.log('用户信息：', userInfo);
    let dataInfo = _this.data.paraData;
    console.info('请求固码参数：', dataInfo);
    dataInfo.endDate = _this.data.cardDate;
    dataInfo.userCode = userInfo.userCode;
    // 显示遮罩层
    wx.showLoading({
      title: '数据加载中...',
      mask: true
    });
    //
    wx.request({
      url: app.globalData.path + '/store/createFixedCodeFun',
      dataType: 'json',
      data: {
        data: dataInfo
      },
      success: function(res){
        console.log('生成固码返回结果：', res.data);
        //
        _this.setData({
          imgbase64: res.data.data
        });
        // 隐藏遮罩层
        wx.hideLoading({
          success: (res) => {},
        });
      },
      fail: function(){
        // 隐藏遮罩层
        wx.hideLoading({
          success: (res) => {},
        });
      }
    });
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (opt) {
    //
    console.log('===onLoad参数=====：', opt);
    let paraData = JSON.parse(opt.para);
    //
    let _this = this;
    _this.setData({
      paraData: paraData,
      cardName: paraData.name
    });
    // 执行函数
    this.createFiexdQrCode();
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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})