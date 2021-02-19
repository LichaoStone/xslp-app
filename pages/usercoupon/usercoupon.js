// pages/usercoupon/usercoupon.js

const app = getApp();

//
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navTab: ['可使用','已使用','已过期'],
    position: 'auto',   
    currentTab: 0,
    showList: [],
    showFlag: true,
    noneShow: true,
    showStatus: false,
    size: 0,
    inputVal: null, // 用户评语
    couponCode: null,
    staffOpenId: null,
    one_1: 5, // 默认5个赞
    two_1: 0,
    showDonate: false,
    donateData: null
  },
  //
  select: {
    page: 1,
    size: 6,
    isEnd: false
  },
  // 页签切换
  currentTab: function (e) {
    //
    let _this = this;
    //
    if (_this.data.currentTab == e.currentTarget.dataset.idx){
      return;
    }
    this.setData({
      size: 0,
      currentTab: e.currentTarget.dataset.idx
    })
    this.select={
      page: 1,
      size: 6,
      isEnd: false
    }
    _this.data.showList = [];
    // 切换页签查询数据
    _this.getData();
  },

  // 关闭转赠提示
  closeDonateDialog: function(){
    this.setData({
      showDonate: false
    });
  },

  // 用户卡券转赠
  userDonateFun: function(res){
    //
    let _this = this;
    console.log('用户转赠卡券数据：', res);
    let dataInfo = res.target.dataset;
    dataInfo.type = '0'; // 转赠时验证
    // 验证卡券状态
    wx.request({
      url: app.globalData.path + '/store/checkCouponState',
      dataType: 'json',
      data: {
        data: dataInfo
      },
      success: function(resp){
        console.log('验证卡券状态结果：', resp);
        let data = resp.data;
        if('200' == data.code){
          // 卡券转赠提示框
          _this.setData({
            donateData: dataInfo,
            showDonate: true
          });
        } else {
          // 弹出错误框
          wx.showModal({
            title: '异常提示',
            content: data.message,
            success: function (res) {
              if (res.confirm) {
                //
              } else if (res.cancel) {
                //
              }
            }
          });
        }
      }
    });
  },

  // 拉起分享
  onShareAppMessage: function(res) {
    //
    console.log('转赠卡券数据：', res);
    // 关闭提示窗
    this.closeDonateDialog();
    //
    let shareObj = {
      title: '好友分享您小程序',
      imageUrl: '../../image/2.png',
      path: '/pages/index/index'
    };
    //
    if('menu' == res.from){
      console.log('转发来自右上角事件');
    } else if('button' == res.from){
      //
      let donateData = this.data.donateData;
      console.log('转发来自页面button事件：', res);
      console.log('转发数据：', donateData);
      // 不管是否分享成功，都保存一条数据
      wx.request({
        url: app.globalData.path + '/store/saveUserDonateInfo',
        dataType: 'json',
        data: {
          data: donateData
        },
        success: function(res){
          console.log('保存转赠信息返回：', res);
        }
      });
      // pfToxxBqoYnQmfsN0aTVrSiAIIBk,GIFT,中胜石油洗车券,15010209941,2020-11-20,1
      console.log('卡券转赠参数：', JSON.stringify(donateData));
      shareObj.title = '好友赠送一张卡券';
      shareObj.path = '/pages/index/index?sharepara=' + JSON.stringify(donateData);
    }
    return shareObj;
  },

  // 评价文本域输入函数
  textareaInputFun: function(e){
    let inputVal = e.detail.value;
    this.setData({
      inputVal: inputVal
    });
  },

  // 服务评价，默认5个赞
  service_in:function(e){
    console.log('服务点赞：', e);
    var service_in = e.currentTarget.dataset.in;
    var one_1;
    if ('use_sc1' == service_in){
      one_1 = Number(e.currentTarget.id);
    } else {
      one_1 = Number(e.currentTarget.id) + this.data.one_1;
    }
    //
    this.setData({
      one_1: one_1,
      two_1: 5 - one_1,
    });
  },

  // 查询用户优惠券
  getData:function(tabType){
    //
    var _this = this;
    //
    if (this.select.isEnd){
      return
    }
    //
    let showDataAry = this.data.showList;
    let querySize = this.data.size
    //
    var type = this.data.currentTab;
    //
    if(tabType){
      type = tabType;
    }
    console.log('tab页类型：', type);
    //
    // 跳转用户卡券列表
    wx.request({
      url: app.globalData.path + '/store/queryUserCardCoupons',
      dataType: 'json',
      data: {
        data: {
          type: type,
          appId: app.globalData.appId,
          openId: app.globalData.openId,
          size: querySize
        }
      },
      success: function (res) {
        //
        let dataInfo = res.data;
        //
        console.info('查询用户卡券列表返回：', dataInfo);
        //
        if(dataInfo && dataInfo.length > 0){
          //
          let obj = dataInfo[0];
          //
          if('0' == obj.state){
            //
            if(querySize > 0){
              dataInfo.forEach(d => {
                showDataAry.push(d);
              });
              //
              dataInfo = showDataAry;
            }
            // 显示可使用卡券列表
            _this.setData({
              showList: dataInfo,
              showFlag: false,
              noneShow: true
            });
          } else if('2' == obj.state) {
            //
            if(querySize > 0){
              dataInfo.forEach(d => {
                showDataAry.push(d);
              });
              //
              dataInfo = showDataAry;
            }
            // 显示已使用卡券列表
            _this.setData({
              showList: dataInfo,
              showFlag: false,
              noneShow: true
            });
          } else if('3' == obj.state) {
            //
            if(querySize > 0){
              dataInfo.forEach(d => {
                showDataAry.push(d);
              });
              //
              dataInfo = showDataAry;
            }
            // 显示已过期卡券列表
            _this.setData({
              showList: dataInfo,
              showFlag: false,
              noneShow: true
            });
          }
          
          //
          if (dataInfo.length > 0){
            _this.select.page ++
          }else{
            _this.select.isEnd = true
          }
        } else {
          // 无数据时，显示无数据图片
          if(showDataAry.length == 0){
            _this.setData({
              showList: [],
              // showFlag: true,
              noneShow: false,
              size: 0
            });
          }
        }
      }
    });
  },
  // 查看卡券详情
  couponDetail: function(opt){
    //
    let cardData = opt.currentTarget.dataset;
    console.log('查看卡券单张详情：', cardData);
    //
    if(cardData){
      wx.openCard({
        cardList: [{
          cardId: cardData.cardid,
          code: cardData.code
        }],
        success (res) {
          console.log('显示卡券列表成功：', res);
        },
        fail: function(res){
          console.log('显示卡券列表失败：', res);
        }
      });
    }
  },

  // 弹出用户服务评价
  userAesFun: function(ept){
    //
    let cardCode = ept.target.dataset.code;
    let staffOpenId = ept.target.dataset.staffopenid;
    console.log('用户评价卡券编号：', cardCode);
    console.log('卡券核销员OpenId：', staffOpenId);
    //
    this.setData({
      one_1: 5, // 默认5个赞
      two_1: 0,
      inputVal: null,
      showStatus: true,
      position: 'fixed',
      couponCode: cardCode,
      staffOpenId: staffOpenId
    });
  },

  // 关闭用户服务评价弹出窗
  cancelFun: function(){
    this.setData({
      showStatus: false,
      position: 'auto'
    });
  },

  // 跳转可使用卡券页签
  showKeyongTabFun: function(){
    // 重新加载卡券
    this.setData({
      size: 0,
      currentTab: 0
    })
    //
    this.data.showList = [];
    // 切换页签查询数据
    this.getData();
  },


  // 提交用户评价信息
  confirmFun: function(){
    //
    let _this = this;
    // 点赞数
    let quality = this.data.one_1;
    console.log('用户评价指数：', quality);
    let remark = this.data.inputVal;
    console.log('用户评语：', remark);
    //
    wx.request({
      url: app.globalData.path + '/store/addServiceAesInfo',
      dataType: 'json',
      data: {
        data: {
          appId: app.globalData.appId,
          openId: app.globalData.openId,
          staffOpenId: this.data.staffOpenId,
          couponCode: this.data.couponCode,
          serviceQuality: quality,
          serviceRemark: remark
        }
      },
      success: function(res){
        console.log('提交服务评价返回：', res);
        let code = res.data.code;
        //
        if('200' == code){
          // 隐藏评价窗口
          _this.setData({
            showStatus: false,
            position: 'auto'
          });
          //
          wx.showModal({
            title: '系统提示',
            content: '您的评价已成功提交!',
            success: function (res) {
              if (res.confirm) {
                //
                _this.showKeyongTabFun();
              } else if (res.cancel) {
                // 重新加载卡券
                _this.showKeyongTabFun();
              }
            }
          });
        } else {
          // 隐藏评价窗口
          _this.setData({
            showStatus: false,
            position: 'auto'
          });
          //
          wx.showModal({
            title: '系统提示',
            content: '您的评价提交失败!',
            success: function (res) {
              if (res.confirm) {

              } else if (res.cancel) {

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
    //
    wx.showShareMenu({
      withShareTicket: true //禁止好友多选
    });
    let _this = this;
    console.log('扫码评价参数：', options);
    let tabType = options.currentTab;
    if(tabType && '1' == tabType){
      _this.setData({
        size: 0,
        currentTab: tabType
      });
    }
    wx.showToast({
      title: '加载中...',
      icon: 'loading',
      duration: 1500
    });
    //
    setTimeout(function(){
      _this.getData(options.currentTab);
    }, 1500);
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
    //
    this.setData({
      size: this.data.size + 10
    });
    //
    this.getData();
  },


})