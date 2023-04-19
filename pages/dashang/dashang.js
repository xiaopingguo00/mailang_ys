// pages/dashang/dashang.js
const app = getApp();
import {
	getUser,
	getsonglist,
	createOrder,
	createSongPrepay
} from "../../api/user/index";
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		showWechatWindow: false,
		price: '',
		user: '',
		shopId: '',
		singer: ''
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad(options) {
		if (options.user != null) {
			this.setData({
				user: JSON.parse(options.user),
				singer: JSON.parse(options.singer),
				shopId: options.shopId
			})
			console.log("userId=" + JSON.parse(options.user).userId)
			console.log("singer=" + JSON.parse(options.singer).userId)
			console.log("shopId=" + options.shopId)
		}

	},
	showWechatWindow() {
		this.setData({
			showWechatWindow: true
		})
	},
	closeWechatDialog() {
		this.setData({
			showWechatWindow: false
		})
	},
	inputKRFee(e) {
		this.setData({
			price: e.detail.value
		})
	},
	//打赏
	doPay(e) {
		var price = e.currentTarget.dataset.price
		console.log("金额" + price)
		var order = {
			customerRemark: "",
			isDelete: 0,
			orderAmount: price, //订单金额@
			orderAmountDetail: "", //订单明细
			orderCancel: 0,
			orderCancelreason: "",
			orderStatus: 1, //订单状态 1=待支付 2=取消 3=已支付 4=已结算
			orderTime: new Date().toISOString(), //@
			remark: "", //位置
			shopId: this.data.shopId == null || this.data.shopId == "undefined" || this.data.shopId == "undefined" ? '' : this.data.shopId,
			resourceId: "", //歌曲id
			singerName: this.data.singer.userNickname, //歌手名称@
			singerId: this.data.singer.userId, //歌手id@
			sourceType: 2, //1=点歌 2=赏钱
			orderType: 5, //订单类型  1=用户点歌 2=店铺点歌 3=会员支付 4=查看联系方式 5=用户打赏 6=客人自己唱
			songType: 1, //1=原创
			userId: app.globalData.userId, //用户id@
			userNickname: this.data.user.userNickname, //用户昵称@
			orderTitle: "打赏", //订单标题@
			profitSharing: 'Y', //Y=分账 N=不分账@
			userPic: this.data.user.userPic, //用户头像
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
							money: price,
							userId: app.globalData.userId, //点歌人id
							productName: 'reward',
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
								wx.showToast("打赏成功", "success");
								wx.navigateBack()
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