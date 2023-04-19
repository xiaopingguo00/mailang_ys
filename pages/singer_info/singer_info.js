// pages/singer_info/singer_info.js
const app = getApp();
import {
	getUser,
	getsonglist,
	createOrder,
	createSongPrepay,
	getShopSigninList
} from "../../api/user/index";
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		singer: '',
		hasPayForPhone: false,
		hasPayForWechat: false,
		showPhoneWindow: false,
		showWechatWindow: false,
		pics: [],
		phonestr: '',
		videos: []
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	// onLoad(options) {
	// 	var user = JSON.parse(options.singer)
	// 	this.setData({
	// 		singer: user,
	// 		phonestr: options.phonestr,
	// 		pics: user.userPhoto != null && user.userPhoto.length > 0 ? user.userPhoto.search(",") != -1 ? user.userPhoto.split(",") : [user.userPhoto] : [],
	// 		videos: user.userVideo != null && user.userVideo.length > 0 ? user.userVideo.search(",") != -1 ? user.userVideo.split(",") : [user.userVideo] : [],
	// 	})
	// },
	onLoad(options) {
		var user = JSON.parse(options.singer)
		var that = this
		getUser({
			"userId": user.userId
		}).then(res => {
			that.setData({
				singer: res.data.user,
				phonestr: res.data.user.phone.substring(0, 3),
				pics: res.data.user.userPhoto != null && res.data.user.userPhoto.length > 0 ? res.data.user.userPhoto.search(",") != -1 ? res.data.user.userPhoto.split(",") : [res.data.user.userPhoto] : [],
				videos: res.data.user.userVideo != null && res.data.user.userVideo.length > 0 ? res.data.user.userVideo.search(",") != -1 ? res.data.user.userVideo.split(",") : [res.data.user.userVideo] : [],
			})
		})

	},
	showPhoneWindow() {
		this.setData({
			showPhoneWindow: true
		})
	},
	closePhoneDialog() {
		this.setData({
			showPhoneWindow: false
		})
	},
	showWechatWindow() {
		console.log("打开")
		this.setData({
			showWechatWindow: true
		})
	},
	closeWechatDialog() {
		this.setData({
			showWechatWindow: false
		})
	},
	//查看微信或者手机号码
	payForContact(e) {
		var type = e.currentTarget.dataset.type
		console.log("查看的是--" + type)
		var order = {
			customerRemark: "",
			isDelete: 0,
			orderAmount: this.data.singer.phonePrice, //订单金额@
			orderAmountDetail: "", //订单明细
			orderCancel: 0,
			orderCancelreason: "",
			orderStatus: 1, //订单状态 1=待支付 2=取消 3=已支付 4=已结算
			orderTime: new Date().toISOString(), //@
			remark: "", //位置
			shopId: "",
			resourceId: "", //歌曲id
			singerName: this.data.singer.userNickname, //歌手名称
			singerId: this.data.singer.userId, //歌手id
			sourceType: 4, //1=用户点歌 2=店铺点歌 3=会员支付 4=查看联系方式
			orderType: 4, //1=用户点歌 2=店铺点歌 3=会员支付 4=查看联系方式 5=用户打赏 6=客人自己唱
			songType: 1, //1=原创
			//"tradeNo": "string",
			userId: app.globalData.userId, //用户id@
			userNickname: app.globalData.userInfo.userNickname, //用户昵称@
			orderTitle: "查看联系方式", //订单标题@
			profitSharing: 'Y', //Y=分账 N=不分账@
			userPic: app.globalData.userInfo.userPic, //用户头像
			blessings: "" //祝福
		};
		var that = this
		createOrder(order)
			.then(res => {
				console.log("##order", res.data);
				const {
					data,
					code
				} = res;
				if (code === 1 && data.orderId && data.tradeNo) {
					const {
						tradeNo
					} = data;
					createSongPrepay({
							money: that.data.singer.phonePrice,
							userId: app.globalData.userId, //点歌人id
							productName: 'contact',
							profitSharing: 'Y',
							tradeNo
						})
						.then(res => {
							const {
								code,
								data
							} = res;
							console.log("## pre pay ", data);
							if (code === 1) {
								return wx.requestPayment({
									timeStamp: data.timeStamp,
									nonceStr: data.nonceStr,
									package: data.package,
									signType: "MD5",
									paySign: data.paySign
								});
							} else {
								return Promise.reject("create prepay fail");
							}
						})
						.then(res => {
							if ((res.errMsg = "requestPayment:ok")) {
								wx.showToast("查看成功", "success");
								if (type == "phone") {
									that.setData({
										hasPayForPhone: true,
										showPhoneWindow: false
									})
								} else if (type == "wechat") {
									that.setData({
										hasPayForWechat: true,
										showWechatWindow: false
									})
								}
							} else {
								return Promise.reject("支付失败");
							}
							console.log(res);
						})
						.catch(err => {
							console.error(err);
						});
				} else {
					return Promise.reject("error to get order");
				}
			})
			.catch(err => {
				console.error(err);
			})
			.finally(() => {});
	},
})