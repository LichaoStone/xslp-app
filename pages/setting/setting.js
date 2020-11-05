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
      {value: '10', name: '发券员', checked: 'true'},
      {value: '12', name: '核销员'}
    ]
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

  // 根据手机号查询用户
  searchUserFun: function(){
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
          //
          // let sysmenuList = dataInfo.sysMenuList;
          // let userMenuList = dataInfo.menuList;
          // // 
          // if(userMenuList && userMenuList.length > 0){
          //   // 系统菜单
          //   for (let idx_i = 0; idx_i < sysmenuList.length; idx_i++) {
          //     const sysEle = sysmenuList[idx_i];
          //     // 用户菜单
          //     for (let idx_j = 0; idx_j < userMenuList.length; idx_j++) {
          //       const userEle = userMenuList[idx_j];
          //       if(userEle.id == sysEle.id){
          //         sysEle.checked = true;
          //       }
          //     }
          //   }
          // }
          // console.log('菜单数组内容：', sysmenuList);
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

  // 权限菜单授权
  menuAuthorizeFun: function(e){
    //
    console.log('授权用户菜单：', e);
    let userOpenId = e.target.dataset.openid;
    //
    wx.request({
      url: app.globalData.path + '/store/menuAuthorize',
      dataType: 'json',
      data: {
        data: {
          appId: app.globalData.appId,
          openId: userOpenId,
          radioVal: this.data.radioVal
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
            content: '授权用户菜单失败或用户菜单已授权！',
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
    this.searchMemberFun();
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