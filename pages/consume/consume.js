// pages/consume/consume.js
const app = getApp(); 
//
Page({
  /**
   * 页面的初始数据
   */
  data: {
    cardTypeInfo : null,
    inputValue: '',
    modalShow: true,
  },

  // 绑定获取搜索输入框内容函数
  inputValFun: function(e){
    console.log('搜索内容：', e.detail.value);
    wx.setStorageSync('searchVal', e.detail.value);
  },

  
  // 生成自助扫码核销码
  createClearCodeFun: function(ept){
    //
    let reqData = ept.target.dataset;
    reqData.openId = app.globalData.openId;
    reqData.appId = app.globalData.appId;
    console.log('生成线下核销码：', ept);
    // 请求后台生成核销小程序码
    wx.request({
      url: app.globalData.path + '/store/getCardClearQrCode',
      data: {
        data: JSON.stringify(reqData)
      },
      success: function(res){
        console.log('生成小程序码核销码返回', res.data);
        let code = res.data.code;
        //
        if('200' == code){
          // 保存全局数据
          app.showText = '请扫码核销';
          app.cardName = reqData.name + '--核销码';
          app.imgbase = res.data.data;
          app.btnShow = true;
          // 跳转显示小程序码
          wx.navigateTo({
            url: '../qrcode/qrcode'
          });
        } else {
          // 弹出提示信息框
          wx.showModal({
            title: '异常提示',
            content: '生成核销码异常',
            success (res) {
              if (res.confirm) {
                // do some
              } else if (res.cancel) {
                // do some
              }
            }
          });
        }
      }
    });
  },

  // 搜索框
  searchDataFun: function(){
    //
    let cardName = wx.getStorageSync('searchVal');
    console.log('搜索框输入内容：', cardName);
    this.queryCouponTypeFun(cardName);
  },

  // 查询之前存储的优惠券名称
  queryCacheCouponNamesFun: function(){
    //
    let names = wx.getStorageSync('searchNames');
    //
    console.log('执行查询缓存卡券：', names);
    //
    if(names){
      let nameStr = names.join(',');
      //
      this.queryCouponTypeFun(nameStr);
    }
  },

  // 查询优惠券类别信息
  queryCouponTypeFun: function(name){
    //
    let _this = this;
    // 请求后台查询数据
    wx.request({
      url: app.globalData.path + '/store/getCardCouponType',
      dataType: 'json',
      data: {
        data: {
          appId: app.globalData.appId,
          cardName: name
        }
      },
      success: function (res) {
        //
        let dataInfo = res.data;
        console.info('查询卡券类别结果：',dataInfo);
        if(dataInfo && dataInfo.length > 0){
          let searchNames = wx.getStorageSync('searchNames');
          if(!searchNames){
            searchNames = new Array();
            searchNames.push(name);
            //
            wx.setStorageSync('searchNames', searchNames);
          } else {
            //
            let flag = false;
            //
            if(name.indexOf(',') == -1){
              // 循环数组内容
              searchNames.forEach(element => {
                if(element == name){
                  flag = true;
                  return;
                }
              });
              // 如果缓存数组内容不存在，则添加
              if(!flag){
                searchNames.push(name);
              }
            }
            //
            wx.setStorageSync('searchNames', searchNames);
          }
        }
        //
        _this.setData({
          cardTypeInfo : dataInfo
        });
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

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    //
    this.queryCacheCouponNamesFun();
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