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
		qufengs: ["全部", "流行", "民谣", "摇滚", "古风", "中国风", "说唱", "乐器演奏", "其他"],
		currentUser: '',
		singer: '',
		showShaiXuan: false, //筛选框
		sxType: '',
		onShow: true, //当前是否演出中
		bigGD: false, //放大歌单
		pics: '',
		hasPayForPhone: false,
		phonestr: '',
		hasPayForWechat: false,
		userType: '',
		singerId: '', //
		shopId: '', //
		dataList: [],
		screenHeight: 480,
		page: 1,
		scene: "",
		showPhoneWindow: false,
		showWechatWindow: false,
		showDGWindow: false,
		showKRWindow: false,
		kerenSong: '', //客人唱歌歌曲名字
		diangeSong: '', //点歌的歌曲名字
		diangeSongId: '', //点歌的歌曲Id
		zhufu: ''
	},
	showKeRenWindow(e) {
		if (this.data.singer.visitorPrice == null) {
			wx.showToast({
				title: '功能尚未开启',

			})
		} else {
			this.setData({
				showKRWindow: !this.data.showKRWindow
			})
		}

	},
	openSX() {
		this.setData({
			showShaiXuan: !this.data.showShaiXuan
		})
	},
	chooseType(e) {
		this.setData({
			showShaiXuan: false,
			sxType: e.currentTarget.dataset.type
		})
		this.loadSongList()
	},
	inputZhufu(e) {
		this.setData({
			zhufu: e.detail.value
		})
	},
	inputKeRenSong(e) {
		this.setData({
			kerenSong: e.detail.value
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
		this.setData({
			showWechatWindow: true
		})
	},
	closeWechatDialog() {
		this.setData({
			showWechatWindow: false
		})
	},
	dashang() {
		if (this.data.onShow) {
			wx.navigateTo({
				url: '../dashang/dashang?user=' + JSON.stringify(this.data.currentUser) + "&singer=" + JSON.stringify(this.data.singer) + "&shopId=" + this.data.shopId,
			})
		} else {
			wx.showModal({
				title: '提示',
				content: '演出尚未开始',
				complete: (res) => {
					if (res.cancel) {

					}

					if (res.confirm) {

					}
				}
			})
		}

	},
	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad(options) {

		// scene 1000商家点歌 scene 2000 歌手个人点歌
		const {
			scene = 2000, shopId = "", userId = ""
		} = options; //这边的userId是二维码歌手的用户id
		console.log("进入点歌页" + JSON.stringify(options))
		console.log("进入点歌页,当前点歌人" + app.globalData.userId)
		console.log("进入点歌页,查询屏幕高度" + app.globalData.screenHeight)
		this.setData({
			singerId: options.userId,
			shopId: options.shopId,
			scene: options.scene,
			screenHeight: app.globalData.screenHeight * 2 - 755
		})
		if (scene == 2000) {
			this.loadSongList()
			this.getSinger()
			this.getCurrentUser()
		} else if (scene == 1000) { //商家
			//根据签到情况查歌手
			var that = this
			getShopSigninList({
				shopId: shopId
			}).then(res => {
				if (res.data.length == 0) {
					console.log("nick---1")
					that.setData({
						onShow: false
					})
					wx.showModal({
						title: '提示',
						content: '演出尚未开始',
						complete: (res) => {}
					})
				} else {
					console.log("nick---2")
					that.setData({
						singerId: res.data[0].userId,
						onShow: true
					})
					that.getSinger()
					that.loadSongList() //加载歌手的歌曲
					that.getCurrentUser()
				}

			})

		}
		app.employIdCallback = () => {
			console.log("检测到回调2,等到app.onlaunch执行完再执行到这里" + app.globalData.userType)
			if (scene == 2000) {
				this.loadSongList()
				this.getSinger()
				this.getCurrentUser()
			} else if (scene == 1000) { //商家
				//根据签到情况查歌手
				var that = this
				getShopSigninList({
					shopId: shopId
				}).then(res => {
					if (res.data.length > 0) {
						that.setData({
							singerId: res.data[0].userId,
							onShow: true
						})
						that.getSinger()
						that.loadSongList() //加载歌手的歌曲
						that.getCurrentUser()
					}

				})

			}

		}

	},
	showGD() {
		this.setData({
			bigGD: true
		})
	},
	loadSongList() {
		let dataList = this.data.dataList;

		let params = {
			status: 0,
			songClass: this.data.sxType == "全部" ? "" : this.data.sxType,
			isuserId: app.globalData.userId, //点歌人
			userId: this.data.singerId, //歌手
			page: 1,
			size: 1000,
		};
		var that = this

		getsonglist(params).then(res => {
			console.log("歌曲数量" + res.data.rows.length)
			// dataList = dataList.concat(res.data.rows);
			dataList = res.data.rows;
			that.setData({
				dataList: dataList,
			});
		});
	},

	getSinger() {
		getUser({
				userId: this.data.singerId != null && this.data.singerId != "" ? this.data.singerId : '00001'
			})
			.then(res => {
				var singer = res.data.user
				this.setData({
					singer: singer,
					phonestr: singer.phone.substring(0, 3),
					pics: singer.userPhoto.length > 0 ? singer.userPhoto.search(",") != -1 ? singer.userPhoto.split(",") : [singer.userPhoto] : [],
				})
			})
			.catch(err => {
				console.error(err);
			});
	},

	showDGWindow(e) {
		this.setData({
			showDGWindow: !this.data.showDGWindow,
			diangeSong: e.currentTarget.dataset.songname,
			diangeSongId: e.currentTarget.dataset.songid
		})
	},

	getCurrentUser() {
		getUser({
				userId: app.globalData.userId != "" && app.globalData.userId != null ? app.globalData.userId : '0001'
			})
			.then(res => {
				var user = res.data.user
				this.setData({
					currentUser: user
				})
			})
			.catch(err => {
				console.error(err);
			});
	},

	//客人唱歌
	kerenPay(e) {
		var songName = e.currentTarget.dataset.songname
		var order = {
			customerRemark: "",
			isDelete: 0,
			orderAmount: this.data.singer.visitorPrice, //订单金额@
			orderAmountDetail: "", //订单明细
			orderCancel: 0,
			orderCancelreason: "",
			orderStatus: 1, //订单状态 1=待支付 2=取消 3=已支付 4=已结算
			orderTime: new Date().toISOString(), //@
			remark: songName, //客人唱歌名称
			resourceId: "", //歌曲id
			shopId: this.data.shopId,
			singerName: this.data.singer.userNickname, //歌手名称
			singerId: this.data.singerId, //歌手id
			sourceType: 1, //1=点歌 2=赏钱
			orderType: 6, //1=用户点歌 2=店铺点歌 3=会员支付 4=查看联系方式 5=用户打赏 6=客人自己唱
			songType: 1, //1=原创
			//"tradeNo": "string",
			userId: app.globalData.userId, //用户id@
			userNickname: this.data.currentUser.userNickname, //用户昵称@
			orderTitle: "客人唱歌-" + this.data.kerenSong, //订单标题@
			profitSharing: 'Y', //Y=分账 N=不分账@
			userPic: this.data.currentUser.userPic, //用户头像
			blessings: this.data.zhufu //祝福
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
							money: that.data.singer.visitorPrice,
							userId: app.globalData.userId, //点歌人id
							productName: 'order',
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
								wx.showToast("提交成功", "success");
								// if (that.data.type == "phone") {
								// 	that.setData({
								// 		hasPayForPhone: true,
								// 		hasPayForWechat: true,
								// 	})
								// }
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
			shopId: this.data.shopId,
			resourceId: "", //歌曲id
			singerName: this.data.singer.userNickname, //歌手名称
			singerId: this.data.singerId, //歌手id
			sourceType: 4, //1=用户点歌 2=店铺点歌 3=会员支付 4=查看联系方式
			orderType: 4, //1=用户点歌 2=店铺点歌 3=会员支付 4=查看联系方式 5=用户打赏 6=客人自己唱
			songType: 1, //1=原创
			//"tradeNo": "string",
			userId: app.globalData.userId, //用户id@
			userNickname: this.data.currentUser.userNickname, //用户昵称@
			orderTitle: "查看联系方式", //订单标题@
			profitSharing: 'Y', //Y=分账 N=不分账@
			userPic: this.data.currentUser.userPic, //用户头像
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
	moreInfo() {
		if (this.data.onShow) {
			wx.navigateTo({
				url: '../singer_info/singer_info?singer=' + JSON.stringify(this.data.singer) + "&phonestr=" + this.data.phonestr,
			})
		} else {
			wx.showModal({
				title: '提示',
				content: '当前暂无歌手',
			})
		}

	},
	closeWidow() {
		this.setData({
			showPhoneWindow: false,
			showWechatWindow: false,
			showDGWindow: false,
			showKRWindow: false,
		})
	},
	diangePay(e) {
		var order = {
			customerRemark: "",
			isDelete: 0,
			orderAmount: this.data.singer.price, //订单金额@
			orderAmountDetail: "", //订单明细
			orderCancel: 0,
			orderCancelreason: "",
			orderStatus: 1, //订单状态 1=待支付 2=取消 3=已支付 4=已结算
			orderTime: new Date().toISOString(), //@
			remark: "", //位置
			resourceId: this.data.diangeSongId, //歌曲id
			shopId: this.data.shopId,
			singerName: this.data.singer.userNickname, //歌手名称
			singerId: this.data.singerId, //歌手id
			sourceType: 1, //1=点歌 2=赏钱
			orderType: this.data.shopId == "" || this.data.shopId == null ? 1 : 2, //1=歌手点歌 2=店铺点歌 3=会员支付 4=查看联系方式 5=用户打赏 6=客人自己唱
			songType: 1, //1=原创
			songName: this.data.diangeSong,
			userId: app.globalData.userId, //用户id@
			userNickname: this.data.currentUser.userNickname, //用户昵称@
			orderTitle: "用户点歌-" + this.data.diangeSong, //订单标题@
			profitSharing: 'Y', //Y=分账 N=不分账@
			userPic: this.data.currentUser.userPic, //用户头像
			blessings: this.data.zhufu //祝福
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
							money: this.data.singer.price,
							userId: app.globalData.userId, //点歌人id
							productName: 'order',
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
								wx.showToast({
									title: '点歌成功',
								})
								// if (type == "phone") {
								// 	that.setData({
								// 		hasPayForPhone: true,
								// 		hasPayForWechat: true,
								// 	})
								// }
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
	/*
	 *  下拉刷新
	 */
	// onPullDownRefresh() {
	// 	this.setData({
	// 		dataList: [],
	// 		page: 1
	// 	});

	// 	this.loadSongList();
	// },

	/*
	 *  页面被拉到底部
	 */
	// onReachBottom() {
	// 	this.setData({
	// 		page: this.data.page + 1
	// 	});

	// 	this.loadSongList();
	// },



})