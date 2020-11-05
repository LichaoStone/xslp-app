//
import rpx2px from '../../utils/rpx2px.js'
//
const QRCode = require('../../utils/weapp-qrcode.js');
//
const app = getApp();
// 300rpx 在6s上为 150px
const qrcodeWidth = rpx2px(400);

let qrcode;

Component({

    options: {
        multipleSlots: true, // 在组件定义时的选项中启用多slot支持
    },

    properties: {
        isShow: {
            type: Boolean,
            value: true
        },
        detail: {
            type: String
        }
    },

    data: {
        isShow: true,
        // 用于设置wxml里canvas的width和height样式
        qrcodeWidth: qrcodeWidth,
        staffOpenId: null,
        cardId: null,
        cardCode: '',
        cardName: ''
    },

    /**
     * 组件的方法列表
     * 
     */
    methods: {
        /*
         * 内部私有方法建议以下划线开头
         * triggerEvent 用于触发事件
         */
        _initReadyFun() {
            console.log('参数值：', this.properties);
            //
            if (this.properties.isShow) {
                return;
            } else {
                this.setData({
                    isShow: false
                });
            }
            // 初始化画布
            this._initCanvas();
            //
            let consumStr = this.properties.detail;
            //
            this._queryUserCardInfo(consumStr);
            
        },
        // 关闭dialog
        _clossDialogFun: function () {
            this.setData({
                isShow: true
            });
            //
            wx.showTabBar({
                animation: true,
            });
        },
        // 初始化二维码画布
        _initCanvas: function () {
            //
            console.log('====初始化卡券二维码画布====');
            //注意这里的 canvas 要与wxml文件的canvas-id属性命名一样
            const ctx = wx.createCanvasContext('canvas');
            let width = 800;
            let height = 300;
            let bgPicturePath = "../../image/w-bg.png"; //图片路径不要出错
            ctx.drawImage(bgPicturePath, 0, 0, width, height);
            ctx.draw(); //绘制背景图片

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
        _consumeUserCouponFun: function (e) {
            //
            wx.showLoading({
                title: '卡券核销中......',
                mask: true
            });
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
                success: function (res) {
                    //
                    wx.hideLoading({
                        success: (res) => {},
                    });
                    //
                    console.log('调用卡券核销接口返回结果：', res);
                    let code = res.data.code;
                    // 核销成功
                    if ('200' == code) {
                        // 用户核销卡券成功，弹出提示信息框
                        wx.showModal({
                            title: '成功提示',
                            content: '用户卡券核销成功！',
                            success(res) {
                                if (res.confirm) {
                                    //
                                    that._clossDialogFun();
                                } else if (res.cancel) {
                                    that._clossDialogFun();
                                }
                            }
                        });
                    } else {
                        // 用户核销卡券失败，弹出提示信息框
                        wx.showModal({
                            title: '失败提示',
                            content: '用户卡券核销失败，请联系管理员',
                            success(res) {
                                if (res.confirm) {
                                    //
                                    that._clossDialogFun();
                                } else if (res.cancel) {
                                    //
                                    that._clossDialogFun();
                                }
                            }
                        });
                    }
                }
            })
        },

        // 查询用户需核销的卡券
        _queryUserCardInfo: function (opt) {
            //
            wx.showLoading({
                title: '核销码加载中......',
                mask: true
            });
            //
            let that = this;
            console.log('获取扫码核销参数：', opt);
            //
            let paraData = decodeURIComponent(opt);
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
                success: function (res) {
                    //
                    wx.hideLoading({
                        success: (res) => {},
                    });
                    //
                    console.log('用户可核销卡券：', res);
                    //
                    if (res.data) {
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
                            success(res) {
                                if (res.confirm) {
                                    //
                                    that._clossDialogFun();
                                } else if (res.cancel) {
                                    //
                                    that._clossDialogFun();
                                }
                            }
                        });
                    }
                }
            });
        }

    }
});