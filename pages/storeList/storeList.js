// pages/storeList/storeList.js

const app = getApp();

Page({
  /**
   * 页面的初始数据
   */
  data: {
    showNoneImg : false, // 无数据时显示背景图开关
    shows: false, //控制下拉列表的显示隐藏，false隐藏、true显示
    selectDatas: ['10公里内', '15公里内', '25公里内','50公里内'], //下拉列表的数据
    indexs: 0 //选择的下拉列表下标,
  },

  // 点击下拉显示框
  selectTaps() {
    this.setData({
      shows: !this.data.shows,
    });
  },
  // 点击下拉列表
  optionTaps(e) {
    let Indexs = e.currentTarget.dataset.index; //获取点击的下拉列表的下标
    console.log(Indexs)
    this.setData({
      indexs: Indexs,
      shows: !this.data.shows
    });
    // 下拉选择后刷数据
    this.onLoad();
  },

  getLocation:function(event){
    console.log(event.target.dataset)
    let lon = event.target.dataset.lon;
    let lat = event.target.dataset.lat;
    let storeName = event.target.dataset.name;
    let storeAddres = event.target.dataset.addres;
    //
    wx.openLocation({
      longitude: parseFloat(lon), //121.5039390000,//要去的经度-地址
      latitude: parseFloat(lat), //31.0938140000,//要去的纬度-地址
      name: storeName,
      address: storeAddres
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //
    let that = this;
    //
    that.setData({
      showNoneImg: false
    });
    //
    var promise = new Promise((resolve) => {
      //
      wx.getLocation({
        type: 'wgs84', 
        success: function (res) {
          let longitude = res.longitude.toString();
          let latitude = res.latitude.toString();
          let s_index = that.data.indexs;
          let radius = 5000; // 默认10千米
          //
          if(1 == s_index){
            radius = 15;
          } else if(2 == s_index){
            radius = 25;
          } else if(3 == s_index){
            radius = 5000;
          }
          //
          console.info('select-index=' + s_index);
          that.setData({
            reqData:{
              merchantId: app.globalData.appId,
              lon: longitude,
              lat: latitude,
              radius: radius
            }
          });
          resolve();
        }
      });
    });

    //
    promise.then(() => {
      console.log('查询门店列表参数：',this.data.reqData)
      //
      wx.request({
        url: app.globalData.path + '/store/findStoreList',
        data: {
          data: this.data.reqData
        },
        success(result) {
          console.info(result);
          let code = result.data.code;
          if(200 == code){
            let storeData = result.data.data;
            //
            if(storeData.length > 0){
              for(let i=0; i<storeData.length; i++){
                let d = storeData[i];
                let name = d.storeName;
                let address = d.storeAddress;
                let storeDesc = d.storeDesc;
                //
                let descAry = storeDesc.split('@');
                // 赋值参数
                storeData[i].bizzTime = descAry[0];
                storeData[i].bizzDesc = descAry[1];
                //
                if(name.length > 10){
                  storeData[i].sortName = name.substring(0,10) + "...";
                }else{
                  storeData[i].sortName = d.storeName;
                }
                //
                if(address.length > 18){
                  storeData[i].sortAddres = address.substring(0,18) + "...";
                }else{
                  storeData[i].sortAddres = d.storeAddress;
                }
              }
              //
              that.setData({
                storeList: storeData // 页面分配数据
              });
            } else {
              // 打开无数据，显示背景图
              that.setData({
                showNoneImg: !that.data.showNoneImg,
                storeList: storeData // 页面分配数据
              });
            }
            console.info(storeData);
          } else {
            alert(result.data.message);
          }
        },
        fail(error) {
          console.log(error)
        }
      })
    })
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