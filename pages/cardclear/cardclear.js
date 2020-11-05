// pages/cards/cards.js
const QRCode = require('../../utils/weapp-qrcode.js');
import rpx2px from '../../utils/rpx2px.js'
//
const app = getApp(); 
//
let qrcode;
// 300rpx 在6s上为 150px
const qrcodeWidth = rpx2px(400);

//
Page({
  /**
   * 页面的初始数据
   */
  data: {
    paraData: null,
    // 用于设置wxml里canvas的width和height样式
    qrcodeWidth: qrcodeWidth,
    staffOpenId: null,
    cardId: null,
    cardCode: '',
    cardName: '',
    showHalf: false
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


  // 用户点击确定，拉起授权手机
  getPhoneNumber(e) {
    //
    console.log('拉起手机授权框：', e);
    var that = this;
    //
    that.setData({
        showHalf: false
    });
    //
    if (e.detail.errMsg.indexOf('ok') != -1) {
      //
      console.info('用户同意手机授权：', e);
      // 检查用户登录session
      wx.checkSession({
        success: function(res) {
          //session_key 未过期，并且在本生命周期一直有效
          console.log('sessionKey未失效：', res);
          console.log('sessionKey = ' + wx.getStorageSync('sessionKey'));
          //
          that.updateUserPhone(e.detail);
        },
        fail: function(res) {
          //
          app.userLogin();
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
    let that = this;
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
        }
        // 返回成功，查询可核销的卡券
        that.queryUserCardInfo(that.data.paraData);
      }
    });
  },

  // 初始化二维码画布
  initCanvas: function(){
    //
    console.log('====初始化卡券二维码画布====');
    //注意这里的 canvas 要与wxml文件的canvas-id属性命名一样
    const ctx = wx.createCanvasContext('canvas'); 
    let width = 800;
    let height = 300;
    let bgPicturePath = "../../image/w-bg.png";//图片路径不要出错
    ctx.drawImage(bgPicturePath, 0, 0, width, height);
    ctx.draw();//绘制背景图片
    //
    qrcode = new QRCode('canvas', {
      usingIn: this, // usingIn 如果放到组件里使用需要加这个参数
      width: qrcodeWidth,
      height: qrcodeWidth,
      // colorDark: "#DA4967",
      colorLight: "white",
      correctLevel: QRCode.CorrectLevel.H,
    });
  },

  // 调用接口核销用户卡券
  consumeUserCouponFun: function(e) {
    //
    let that = this;
    console.log('立即使用参数：', e.target.dataset);
    let cardId = e.target.dataset.cardid;
    let cardName = e.target.dataset.cardname;
    let staffOpenId = e.target.dataset.staffopenid;
    //
    wx.request({
      url: app.globalData.path + '/store/clearUserCoupon',
      dataType: 'json',
      data: {
        data: {
          appId: app.globalData.appId,
          openId: wx.getStorageSync('openId'),
          cardId: cardId,
          cardName: cardName,
          staffOpenId: staffOpenId,
          cardCode: that.data.cardCode
        }
      },
      success: function(res){
        console.log('调用卡券核销接口返回结果：', res);
        let code = res.data.code;
        // 核销成功
        if('200' == code){
          // 用户核销卡券成功，弹出提示信息框
          wx.showModal({
            title: '成功提示',
            content: '用户卡券核销成功！',
            success (res) {
              if (res.confirm) {
                wx.switchTab({
                  url: '../index/index',
                });
              } else if (res.cancel) {
                wx.switchTab({
                  url: '../index/index',
                });
              }
            }
          });
        } else {
          // 用户核销卡券失败，弹出提示信息框
          wx.showModal({
            title: '失败提示',
            content: '用户卡券核销失败，请联系管理员',
            success (res) {
              if (res.confirm) {
                wx.switchTab({
                  url: '../index/index',
                });
              } else if (res.cancel) {
                wx.switchTab({
                  url: '../index/index',
                });
              }
            }
          });
        }
      }
    })
  },

  // 查询用户信息
  findUserInfo: function(opt){
    let that = this;
    that.setData({
      paraData: opt
    });
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
          // 如果没有手机号，拉起授权手机号
          if(!user.userPhone){
            //
            that.setData({
              showHalf: true
            });
            // 刷新登录sessionKey
            app.onlogin();
          } else {
            // 查询用户需核销卡券
            that.queryUserCardInfo(opt);
          }
        } else {
          // 用户不存在，跳转首页
          wx.switchTab({
            url: '../index/index'
          });
        }
      },
      fail: function(res){
        console.info('请求后台数据异常',res);
      }
    });
  },

  // 查询用户需核销的卡券
  queryUserCardInfo(opt){
    //
    let that = this;
    console.log('获取扫码核销参数：', opt);
    //
    let paraData = decodeURIComponent(opt.consum);
    let paraAry = paraData.split(',');
    let cardId = paraAry[0];
    let cardName = paraAry[1];
    let cardType = paraAry[2];
    let staffOpenId = paraAry[3];
    // 查询可核销的卡券
    wx.request({
      url: app.globalData.path + '/store/getUserCouponClear',
      dataType: 'json',
      data: {
        data: {
          appId: app.globalData.appId,
          openId: wx.getStorageSync('openId'),
          cardId: cardId,
          cardName: cardName,
          cardType: cardType
        }
      },
      success: function(res){
        //
        console.log('用户可核销卡券：', res);
        //
        if(res.data){
          //
          let couponData = res.data;
          //
          that.setData({
            staffOpenId: staffOpenId,
            cardId: couponData.cardId,
            cardName: couponData.cardName,
            cardCode: couponData.code
          });
          //
          console.log('==开始==绘制核销码====')
          qrcode.makeCode(couponData.code);
          console.log('==结束==绘制核销码====')
        } else {
          // 用户无可核销卡券，弹出提示信息框
          wx.showModal({
            title: '提示',
            content: '用户没有可核销卡券',
            success (res) {
              if (res.confirm) {
                //
                wx.switchTab({
                  url: '../index/index',
                });
              } else if (res.cancel) {
                //
                wx.switchTab({
                  url: '../index/index',
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
  onLoad: function (options) {
    // 初始画布
    this.initCanvas();
    console.log('扫码核销：', options);
    //
    this.findUserInfo(options);
    
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

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