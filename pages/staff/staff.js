// pages/staff/staff.js

const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    showFalg: true,
    tabShow: true,
    userPhone: null,
    storeName: null,
    userInfo: null,
    listData:[]
  },

  //
  inputPhoneFun: function(e){
    console.log('输入手机号：', e.detail.value);
    let _this = this;
    //
    _this.setData({
      userPhone: e.detail.value
    });
  },

  // 门店名称
  inputStoreNameFun: function(e){
    console.log('输入门店名称：', e.detail.value);
    let _this = this;
    //
    _this.setData({
      storeName: e.detail.value
    });
  },

  // 根据手机号查询用户
  searchUserInfoFun: function(){
    //
    let _this = this;
    //
    wx.request({
      url: app.globalData.path + '/store/findApletUser',
      dataType: 'json',
      data: {
        data: {
          appId: app.globalData.appId,
          userPhone: this.data.userPhone
        }
      },
      success: function(res) {
        console.log('查询员工返回结果：', res);
        let dataInfo = res.data;
        //
        if(dataInfo){
          //
          _this.setData({
            showFalg: false,
            tabShow: true,
            userInfo: dataInfo
          });
          //
        } else {
          // 弹出提示信息框
          wx.showModal({
            title: '异常提示',
            content: '没有查询到用户信息！',
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
    })
  },

  // 查询成员列表
  searchStaffInfoFun: function(){
    //
    let _this = this;
    //
    wx.request({
      url: app.globalData.path + '/store/queryStoreStaffInfo',
      dataType: 'json',
      data: {
        data: {
          appId: app.globalData.appId
        }
      },
      success: function(res) {
        console.log('查询门店员工返回结果：', res);
        let dataInfo = res.data;
        //
        if(dataInfo){
          //
          _this.setData({
            tabShow: false,
            listData: dataInfo
          });
        }
      }
    })
  },

  // 增加门店员工
  addStoreStaffFun: function(e){
    //
    console.log('增加门店员工：', e);
    let userOpenId = e.target.dataset.openid;
    //
    wx.request({
      url: app.globalData.path + '/store/addStaffInfo',
      dataType: 'json',
      data: {
        data: {
          appId: app.globalData.appId,
          storeName: this.data.storeName,
          openId: userOpenId
        }
      },
      success: function(res){
        console.log('增加门店员工返回结果：', res);
        let code = res.data.code;
        if('200' == code){
          // 弹出提示信息框
          wx.showModal({
            title: '成功提示',
            content: '增加门店员工成功！',
            success (res) {
              if (res.confirm) {
                wx.switchTab({
                  url: '../center/center',
                })
              } else if (res.cancel) {
                wx.switchTab({
                  url: '../center/center',
                })
              }
            }
          });
        } else {
          // 弹出提示信息框
          wx.showModal({
            title: '异常提示',
            content: '增加门店员工失败或员工已存在！',
            success (res) {
              if (res.confirm) {
                wx.switchTab({
                  url: '../center/center',
                })
              } else if (res.cancel) {
                wx.switchTab({
                  url: '../center/center',
                })
              }
            }
          });
        }
      }
    })
  },

  // 移除权限成员
  delStaffFun: function(e){
    //
    let _this = this;
    let userOpenId = e.target.dataset.openid;
    // 弹出提示信息框
    wx.showModal({
      title: '删除数据提示',
      content: '是否要移除员工吗？',
      success (res) {
        if (res.confirm) {
          // 确定移除
          wx.request({
            url: app.globalData.path + '/store/delStoreStaffInfo',
            dataType: 'json',
            data: {
              data: {
                appId: app.globalData.appId,
                openId: userOpenId
              }
            },
            success: function(res){
              console.log('移除门店员工返回结果：', res);
              let data = res.data;
              if('200' == data.code){
                // 弹出提示信息框
                wx.showModal({
                  title: '成功提示',
                  content: '移除门店员工成功！',
                  success (res) {
                    if (res.confirm) {
                      _this.searchMemberFun();
                    } else if (res.cancel) {
                      _this.searchMemberFun();
                    }
                  }
                });
              } else {
                // 弹出提示信息框
                wx.showModal({
                  title: '异常提示',
                  content: '移除门店员工异常！',
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
        } else if (res.cancel) {
          // do some
        }
      }
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    this.searchStaffInfoFun();
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