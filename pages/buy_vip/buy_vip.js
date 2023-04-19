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
		choose: false,
		singer: '',
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad(options) {
		var user = JSON.parse(options.user)
		this.setData({
			singer: user,
		})
	},
	chooseVip() {
		this.setData({
			choose: !this.data.choose
		})
	},
	doPay() {
		if (!this.data.choose) {
			wx.showToast({
				title: '请勾选会员',
			})
			return
		}
		var order = {
			customerRemark: "",
			isDelete: 0,
			orderAmount: 0.1, //订单金额@
			orderAmountDetail: "", //订单明细
			orderCancel: 0,
			orderCancelreason: "",
			orderStatus: 1, //订单状态 1=待支付 2=取消 3=已支付 4=已结算
			orderTime: new Date().toISOString(), //@
			remark: '', //客人唱歌名称
			resourceId: "", //歌曲id
			singerName: '', //歌手名称
			singerId: '', //歌手id
			sourceType: 1, //1=点歌 2=赏钱
			orderType: 3, //订单类型 1=用户点歌 2=店铺点歌 3=会员支付 4=查看联系方式 @
			songType: '', //1=原创
			//"tradeNo": "string",
			userId: app.globalData.userId, //用户id@
			userNickname: this.data.singer.userNickname, //用户昵称@
			orderTitle: "会员支付", //订单标题@
			profitSharing: 'N', //Y=分账 N=不分账@
			userPic: this.data.singer.userPic, //用户头像
			blessings: '' //祝福
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
							money: 0.1,
							userId: app.globalData.userId, //点歌人id
							productName: this.data.singer.memberDTO.code == 1 ? 'renewMember' : "member", //code 1续费
							profitSharing: 'N',
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
								wx.showToast("会员购买成功", "success");
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