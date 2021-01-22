// pages/setting/setting.js
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    showFalg: true,
    tabShow: true,
    userPhone: null,
    userInfo: null,
    listData:[],
    radioVal: 10, // radio默认为动态码-0
    items: [
      {value: '10', name: '发券员', checked: true},
      {value: '12', name: '核销员'},
    ],
    storeCode: null,
    storeName: null,
    storeAry: [],
    storeIdx: 0
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

  // 授权员工门店选择
  bindPickerChange: function (e) {
    console.log('门店选择：', this.data.storeAry[e.detail.value]);
    //
    this.setData({
      storeCode: this.data.storeAry[e.detail.value].storeCode,
      storeName: this.data.storeAry[e.detail.value].storeName,
      storeIdx: e.detail.value
    })
   },

  // checkbox点击事件
  checkboxChange(e) {
    //
    let _this = this;
    console.log('checkbox发生change事件，携带value值为：', e.target.dataset.index)
    let items = this.data.items;
    let index = e.target.dataset.index;
    let selected = e.target.dataset.checks ? false : true;
    for (let i = 0, lenI = items.length; i < lenI; ++i) {
      if(index == items[i].value){
        items[i].checked = selected;
        break;
      }
    }
    //
    _this.setData({
      items
    });
  },

  // 根据手机号查询用户
  searchUserFun: function(){
    //
    let _this = this;
    //
    if(this.data.userPhone){
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
          console.log('根据手机查询返回结果：', res);
          let dataInfo = res.data;
          //
          if(dataInfo){
            //
            _this.setData({
              showFalg: false,
              tabShow: true,
              userInfo: dataInfo
            });
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
    }
  },

  // 查询成员列表
  searchMemberFun: function(){
    //
    let _this = this;
    //
    wx.request({
      url: app.globalData.path + '/store/queryAuthorityMember',
      dataType: 'json',
      data: {
        data: {
          appId: app.globalData.appId
        }
      },
      success: function(res) {
        console.log('查询权限成员返回结果：', res);
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

  // 查询门店列表
  searchStoreFun: function(){
    //
    let _this = this;
    //
    wx.request({
      url: app.globalData.path + '/store/queryStoreList',
      dataType: 'json',
      data: {
        data: {
          appId: app.globalData.appId
        }
      },
      success: function(res) {
        console.log('查询门店返回结果：', res);
        let dataInfo = res.data;
        let storeAry = [];
        //
        if(dataInfo){
          //
          dataInfo.forEach(element => {
            storeAry.push(element.storeName);
          });
          //
          _this.setData({
            storeAry: dataInfo
          });
        }
      }
    })
  },

  // 权限菜单授权
  menuAuthorizeFun: function(e){
    //
    console.log('授权用户菜单：', e);
    let userOpenId = e.target.dataset.openid;
    //
    let radioVal = [];
    let items = this.data.items;
    for (let i = 0, lenI = items.length; i < lenI; ++i) {
      if(true == items[i].checked){
        radioVal.push(items[i].value);
      }
    }
    //
    if(radioVal.length == 0){
      // 弹出提示信息框
      wx.showModal({
        title: '错误提示',
        content: '请选择用户权限！',
        success (res) {
          if (res.confirm) {
            
          } else if (res.cancel) {
            
          }
        }
      });
      return;
    }
    // 发券与核销都勾选，则配置双权限
    if(radioVal.length == 1){
      radioVal = radioVal[0];
    } else if(radioVal.length == 2){
      radioVal = '13'; //发券核销双权限
    }
    console.log('权限选择：', radioVal);
    //
    if(!this.data.storeName){
      this.setData({
        storeName: this.data.storeAry[0]
      });
    }
    console.log('门店选择：', this.data.storeName);
    //
    wx.request({
      url: app.globalData.path + '/store/menuAuthorize',
      dataType: 'json',
      data: {
        data: {
          appId: app.globalData.appId,
          openId: userOpenId,
          radioVal: radioVal,
          storeCode: this.data.storeCode,
          storeName: this.data.storeName
        }
      },
      success: function(res){
        console.log('授权用户菜单返回结果：', res);
        let code = res.data.code;
        if('200' == code){
          // 弹出提示信息框
          wx.showModal({
            title: '成功提示',
            content: '授权用户菜单成功！',
            success (res) {
              if (res.confirm) {
               
              } else if (res.cancel) {
                
              }
            }
          });
        } else {
          // 弹出提示信息框
          wx.showModal({
            title: '异常提示',
            content: '授权用户菜单失败或用户菜单已授权！',
            success (res) {
              if (res.confirm) {
                
              } else if (res.cancel) {
                
              }
            }
          });
        }
      }
    })
  },

  // 移除权限成员
  delMemberFun: function(e){
    //
    let _this = this;
    let userOpenId = e.target.dataset.openid;
    // 弹出提示信息框
    wx.showModal({
      title: '删除数据提示',
      content: '是否要移除授权用户吗？',
      success (res) {
        if (res.confirm) {
          // 确定移除
          wx.request({
            url: app.globalData.path + '/store/delAuthorizeMember',
            dataType: 'json',
            data: {
              data: {
                appId: app.globalData.appId,
                openId: userOpenId
              }
            },
            success: function(res){
              console.log('移除权限成员返回结果：', res);
              let data = res.data;
              if('200' == data.code){
                // 弹出提示信息框
                wx.showModal({
                  title: '成功提示',
                  content: '移除授权用户成功！',
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
                  content: '移除授权用户异常！',
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
    //
    this.searchMemberFun();
    //
    this.searchStoreFun();
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