// pages/statistical/statistical.js
const { formatTime, dateSubToDaysFun } = require("../../utils/util");

const app = getApp();
//
Page({

  /**
   * 页面的初始数据
   */
  data: {
    startDate: formatTime(new Date()),
    endDate: formatTime(new Date()),
    summaryInfo: null,
    cardId: null,
    countType: 0, // 统计类型0-发券，1-核销
    size: 0, // 页数
    listData: [],
    showDialog: false, // 弹窗评价
    one_1: 0,
    aesVal: ''
  },

  // 开始日期选择
  startPickerBindchange: function(e){
    this.setData({
      startDate: e.detail.value
    });
    console.log('选择开始日期：', e.detail.value);
  },

  // 结束日期选择
  endPickerBindchange: function(e){
    this.setData({
      endDate: e.detail.value
    });
    console.log('选择结束日期：', e.detail.value);
  },

  // 关闭评价
  closeHalfDialog: function() {
    //
    this.setData({
      showDialog: false
    });
  },

  // 查询卡券统计数据
  couponStatistical: function(){
    //
    let _this = this;
    let userInfo = wx.getStorageSync('userInfo');
    let countType = this.data.countType;
    let days = dateSubToDaysFun(this.data.startDate, this.data.endDate);
    console.log('选择时间段天数：', days);
    if(days > 7){ // 查询时间段不能大于7天
      // 弹出提示信息框
      wx.showModal({
        title: '提示',
        content: '查询时间段不可大于7天',
        success (res) {
          if (res.confirm) {
            //
          } else if (res.cancel) {
            //
          }
        }
      });
      return;
    }
    //
    wx.request({
      url: app.globalData.path + '/store/summaryUserReceive',
      dataType: 'json',
      data: {
        data: {
          staffOpenId: app.globalData.openId,
          startDate: _this.data.startDate,
          endDate: _this.data.endDate,
          cardId: _this.data.cardId,
          userCode: userInfo.userCode,
          countType: countType
        }
      },
      success: function(res){
        console.log('查询返回结果：', res);
        let count = res.data.count;
        //
        if(count > 0) {
          // 执行查询明细
          _this.queryCouponDetail(0);
        }
        //
        _this.setData({
          summaryInfo: res.data
        });
      }
    })
  },

  // 查询发券统计明细
  queryCouponDetail: function(type){
    console.log('====执行查询优惠券明细函数====');
    //
    let _this = this;
    let s_data = this.data.listData;
    let staffOpenId = app.globalData.openId;
    let userInfo = wx.getStorageSync('userInfo');
    // 是搜索时清空列表数据
    if(0 == type) {
      // 清空表格数据
      _this.data.listData.length = 0;
      _this.setData({
        size: 0
      });
    }
    // 如果用户OpenId为null
    if(!staffOpenId){
      app.getOpenid();
    }
    //
    setTimeout(function(){
      //
      wx.request({
        url: app.globalData.path + '/store/summaryStaffCoupons',
        dataType: 'json',
        data: {
          data: {
            staffOpenId: app.globalData.openId,
            startDate: _this.data.startDate,
            endDate: _this.data.endDate,
            cardId: _this.data.cardId,
            userCode: userInfo.userCode,
            countType: _this.data.countType,
            size: _this.data.size,
            num: 10
          }
        },
        success: function(res){
          console.log('查询卡券明细返回结果：', res);
          //
          let dataList = res.data.data;
          if(null != dataList && dataList.length > 0){
            //
            dataList.forEach(d => {
              s_data.push(d);
            });
            //
            _this.setData({
              listData: s_data,
              size: _this.data.size + 10
            });
          }
        }
      });
    }, 500);
  },

  // 表格滑到底触发
  downFootFun: function(){
    console.log('====滑动触发表格底部====')
    // 执行查询数据函数
    this.queryCouponDetail(1);
  },

  // 跳转查看评价信息
  showServiceAesFun: function(ept){
    //
    let _this = this;
    console.log('核销员查看用户评论信息：', ept);
    let eptData = ept.target.dataset;
    //
    wx.request({
      url: app.globalData.path + '/store/queryServiceAesInfo',
      dataType: 'json',
      data: {
        data: {
          staffCode: eptData.usercode,
          couponCode: eptData.code
        }
      },
      success: function(res){
        console.log('查询用户评价信息返回：', res);
        let dataInfo = res.data;
        if(dataInfo && dataInfo.length > 0){
          let aesInfo= dataInfo[0];
          //
          _this.setData({
            showDialog: true,
            one_1: parseInt(aesInfo.serviceQuality),
            aesVal: aesInfo.serviceRemark?aesInfo.serviceRemark:''
          });
        }
      }
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (opt) {
    console.log('参数：', opt);
    //
    this.setData({
      countType: opt.type,
      cardId: opt.cardId
    });
    //
    this.couponStatistical();
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