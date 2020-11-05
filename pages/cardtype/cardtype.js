// pages/cardtype/cardtype.js
const app = getApp(); 
//
Page({
  /**
   * 页面的初始数据
   */
  data: {
    userInfo: null,
    cardTypeInfo : null,
    inputValue: '',
    radioVal: 0, // radio默认为动态码-0
    modalShow: true,
    couponNumber: 1,
    items: [
      {value: '0', name: '动态码', checked: 'true'},
      {value: '1', name: '固定码'},
    ]
  },

  // radio点击事件
  radioChange(e) {
    //
    let _this = this;
    console.log('radio发生change事件，携带value值为：', e.detail.value)
    //
    let val = e.detail.value;
    //
    const items = this.data.items
    for (let i = 0, len = items.length; i < len; ++i) {
      items[i].checked = items[i].value === e.detail.value
    }
    //
    _this.setData({
      radioVal: val,
      items: items
    });
  },

  // 绑定获取搜索输入框内容函数
  inputValFun: function(e){
    console.log('搜索内容：', e.detail.value);
    wx.setStorageSync('searchVal', e.detail.value);
  },
  // 绑定获取券张数输入框内容函数
  inputNumber: function(e){
    console.log('卡券张数：', e.detail.value);
    this.setData({
      couponNumber: e.detail.value.replace(/\s+/g, '')
    });
  },

  // 发券按钮函数
  showQrCodeFun: function(e){
    //
    console.log('参数：', e);
    wx.setStorageSync('reqData', e);
    //
    this.setData({
      modalShow: false,
      radioVal: 0,
      items: [
        {value: '0', name: '动态码', checked: 'true'},
        {value: '1', name: '固定码'},
      ]
    });
  },

  // 取消操作
  cancelFun: function(){
    this.setData({
      modalShow: true
    });
  },

  // 确定操作
  confirmFun: function(){
    //
    let reqData = wx.getStorageSync('reqData');
    console.log('确定参数：', reqData);
    //
    let radioVal = this.data.radioVal;
    //
    console.log('radio选择值：', radioVal);
    // 判断值，跳转动态码
    if(0 == radioVal){
      this.createDynamicQrCodeFun(reqData);
    } // 跳转固定码 
    else if(1 == radioVal) {
      this.createFixedCodeFun(reqData);
    }
  },

  // 查询用户信息
  getUserInfo: function(){
    console.log('====执行查询用户信息====');
    //
    let _this = this;
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
          console.log('====发券查询用户返回信息：', res);
          //
          if(res.data){
            let userInfo = res.data;
            //
            _this.setData({
              userInfo: userInfo
            });
          }
      },
      fail: function(res){
          console.info('请求后台数据异常',res);
      }
    });
  },

  // 生成领券卡券 动态小程序码
  createDynamicQrCodeFun: function(e){
    //
    let _this = this;
    //
    let reqData = e.target.dataset;
    //
    let userInfo = this.data.userInfo;
    //
    let couponNumber = this.data.couponNumber;
    console.log('卡券张数：', couponNumber);
    if(undefined == couponNumber || null == couponNumber 
        || '' == couponNumber || 0 == couponNumber){
      // 弹出提示信息框
      wx.showModal({
        title: '错误提示',
        content: '请输入正确的卡券张数！',
        success (res) {
          //
        }
      });
      return;
    }
    //
    if(couponNumber > 10){
      // 弹出提示信息框
      wx.showModal({
        title: '错误提示',
        content: '输入卡券张数不能大于10张！',
        success (res) {
          //
        }
      });
      return;
    }
    //
    reqData.appId = app.globalData.appId;
    reqData.userCode = userInfo.userCode;
    reqData.couponNumber = couponNumber;
    //
    console.log('请求动态小程序码', reqData);
    //
    wx.request({
      url: app.globalData.path + '/store/getAppletQrCode',
      data: {
        data: JSON.stringify(reqData)
      },
      success: function(res){
        console.info('生成小程序码返回', res.data);
        let code = res.data.code;
        //
        if('200' == code){
          // 保存全局数据
          app.showText = '请扫码领券';
          app.cardName = reqData.name;
          app.imgbase = res.data.data;
          app.qrcodeData = reqData;
          app.btnShow = false;
          //
          _this.setData({
            modalShow: true
          });
          // 跳转显示小程序码
          wx.navigateTo({
            url: '../qrcode/qrcode'
          });
        } else {
          // 弹出提示信息框
          wx.showModal({
            title: '异常提示',
            content: '生成小程序码异常',
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

  // 生成固定发券小程序码
  createFixedCodeFun: function(e){
    //
    let _this = this;
    let reqData = e.target.dataset;
    let userInfo = this.data.userInfo;
    let couponNumber = this.data.couponNumber;
    if(undefined == couponNumber || null == couponNumber 
        || '' == couponNumber || 0 == couponNumber){
      // 弹出提示信息框
      wx.showModal({
        title: '错误提示',
        content: '请输入正确的卡券张数！',
        success (res) {
          //
        }
      });
      return;
    }
    //
    if(couponNumber > 10){
      // 弹出提示信息框
      wx.showModal({
        title: '错误提示',
        content: '输入卡券张数不能大于10张！',
        success (res) {
          //
        }
      });
      return;
    }
    //
    reqData.appId = app.globalData.appId;
    reqData.userCode = userInfo.userCode;
    reqData.couponNumber = couponNumber;
    console.log('请求生成固定小程序码：', reqData);
    //
    _this.setData({
      modalShow: true
    });
    //
    wx.navigateTo({
      url: '../cardcode/cardcode?para=' + JSON.stringify(reqData),
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
    // 执行查询用户信息
    this.getUserInfo();
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

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },


})