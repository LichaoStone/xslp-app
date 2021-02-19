// pages/serial/serial.js
const app = getApp(); 
//
Page({

  /**
   * 页面的初始数据
   */
  data: {
    listData: null,
    hidenForm: true,
    hidenTable: false,
    storeCode: null,
    storeName: null,
    storeAry: [],
    storeIdx: -1
  },

  // 门店选择
  bindPickerChange: function (e) {
    console.log('门店选择：', this.data.storeAry[e.detail.value]);
    //
    this.setData({
      storeCode: this.data.storeAry[e.detail.value].storeCode,
      storeName: this.data.storeAry[e.detail.value].storeName,
      storeIdx: e.detail.value,
      hidenTable: true,
      hidenForm: false
    });
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
        //
        if(dataInfo){
          //
          _this.setData({
            storeAry: dataInfo
          });
        }
      }
    })
  },

  // 查询门店设备配置集合
  queryStoreTurnstileCfgListFun: function(){
    //
    let _this = this;
    //
    wx.request({
      url: app.globalData.path + '/store/queryTurnstileConfigList',
      dataType: 'json',
      data: {
        data: {
          appId: app.globalData.appId
        }
      },
      success: function(res) {
        console.log('门店设备配置集合：', res);
        //
        if(res.data || res.data.length > 0){
          _this.setData({
            listData: res.data
          });
        }
      }
    })
  },

  // 保存门店设备配置信息
  subTurnstileCfgFun: function(e){
    console.log('保存门店设备配置参数：', e);
    let paraData = e.detail.value;
    // 检查提交参数值
    let flag = this.checkSubParamsFun(paraData);
    console.log('提交参数检查结果：', flag);
    //
    if(flag){
      //
      paraData.appId = app.globalData.appId;
      paraData.storeCode = this.data.storeCode;
      //
      wx.request({
        url: app.globalData.path + '/store/addTurnstileConfig',
        dataType: 'json',
        data: {
          data: paraData
        },
        success: function(res) {
          console.log('保存门店设备配置结果：', res);
          let errCode = res.data.code;
          //
          if('200' == errCode){
            // 弹出提示信息框
            wx.showModal({
              title: '成功提示',
              content: '保存门店设备配置成功！',
              success (res) {}
            });
          } else {
            // 弹出提示信息框
            wx.showModal({
              title: '失败提示',
              content: '保存门店设备配置失败！',
              success (res) {}
            });
          }
        }
      })
    }
  },

  // 删除门店设备配置信息
  delTurnstileCfgFun: function(e){
    //
    console.log('删除门店设备配置参数：', e);
    let serialNo = e.target.dataset.serialno;
    //
    wx.request({
      url: app.globalData.path + '/store/delTurnstileConfig',
      dataType: 'json',
      data: {
        data: {
          appId: app.globalData.appId,
          serialNo: serialNo
        }
      },
      success: function(res) {
        console.log('删除门店设备配置结果：', res);
        let errCode = res.data.code;
        //
        if('200' == errCode){
          // 弹出提示信息框
          wx.showModal({
            title: '成功提示',
            content: '删除门店设备配置成功！',
            success (res) {}
          });
        } else {
          // 弹出提示信息框
          wx.showModal({
            title: '失败提示',
            content: '删除门店设备配置失败！',
            success (res) {}
          });
        }
      }
    })
  },

  // 检查提交参数
  checkSubParamsFun: function(paraData){
    //
    if('' == paraData.serialNo.replace(/\s/g, '') || null == paraData.serialNo.replace(/\s/g, '')){
      // 弹出提示信息框
      wx.showModal({
        title: '错误提示',
        content: '请输入设备编号！',
        success (res) {}
      });
      return false;
    }
    if('' == paraData.productKey.replace(/\s/g, '') || null == paraData.productKey.replace(/\s/g, '')){
      // 弹出提示信息框
      wx.showModal({
        title: '错误提示',
        content: '请输入设备秘钥！',
        success (res) {}
      });
      return false;
    }
    if('' == paraData.cardId.replace(/\s/g, '') || null == paraData.cardId.replace(/\s/g, '')){
      // 弹出提示信息框
      wx.showModal({
        title: '错误提示',
        content: '请输入卡券编号！',
        success (res) {}
      });
      return false;
    }
    if('' == paraData.cardName.replace(/\s/g, '') || null == paraData.cardName.replace(/\s/g, '')){
      // 弹出提示信息框
      wx.showModal({
        title: '错误提示',
        content: '请输入卡券名称！',
        success (res) {}
      });
      return false;
    }
    return true;
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 查询门店信息
    this.searchStoreFun();
    // 加载已设置门店设备信息
    this.queryStoreTurnstileCfgListFun();
  }


})