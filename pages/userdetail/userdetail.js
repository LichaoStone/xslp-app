// pages/userdetail/userdetail.js
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: null,
    carCode: null
  },

  carCodeValFun: function(e){
    console.log('车牌内容：', e.detail.value);
    this.setData({
      carCode: e.detail.value
    });
  },

  updateInfoFun: function(){
    //
    let carCode = this.data.carCode;
    let regxStr = "([京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}(([0-9]{5}[DF])|([DF]([A-HJ-NP-Z0-9])[0-9]{4})))|([京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-HJ-NP-Z0-9]{4}[A-HJ-NP-Z0-9挂学警港澳]{1})";
    let regx_obj = new RegExp(regxStr);
    if(regx_obj.test(carCode)){
      // 请求后台修改信息
      wx.request({
        url: app.globalData.path + '/store/updateUserPhone',
        dataType: 'json',
        data: {
          data: {
            appId: app.globalData.appId,
            openId: app.globalData.openId,
            carCode: carCode
          }
        },
        success: function(res){
          console.log('更新车牌返回结果：',res);
          let code = res.data.code;
          if("200" == code){
            // 弹出提示信息框
            wx.showModal({
              title: '成功提示',
              content: '车牌更新成功',
              success (res) {
                console.log(res);
              }
            });
          }else{
            // 弹出提示信息框
            wx.showModal({
              title: '失败提示',
              content: '车牌更新失败',
              success (res) {
                console.log(res);
              }
            });
          }
        }
      });
    }else{
      // 弹出提示信息框
      wx.showModal({
        title: '错误提示',
        content: '请输入正确车牌号',
        success (res) {
          console.log(res);
        }
      });
    }
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    //
    let that = this;
    let userInfo = wx.getStorageSync('userInfo');
    //
    console.log('用户信息：', userInfo);
    //
    that.setData({
      userInfo: userInfo
    });
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