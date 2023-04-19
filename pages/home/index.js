// pages/home/index.js

const app = getApp();
import {
	clearUser,
	getShopByUserId,
	querySingin,
	addsignin
} from "./../../api/user/index";
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		codeUrl: "https://yczx.art/picupload/pic/",
		// codeUrl: "http://192.168.100.150:8080/picupload/pic/",
		userType: null, //0=普通用户 1=歌手 3=商家
		userId: null,
		qrcode: '',
		qdcode: '',

		showCode: false,
		showQDCode: false,
		location: '',
		startTime: '',
		showQdViewFlag: false,
		showQtViewFlag: false,
		endTime: ''
	},
	diange() {
		wx.navigateTo({
			url: '../audience-choose-song/index?userId=' + app.globalData.userId,
		})
	},
	scan() {
		// wx.navigateTo({
		// 	url: '../guide/guide',
		// })
		wx.scanCode({
			success(res) {
				console.log(res)
				console.log("扫码res为:" + res.path);
				let a = res.path.split("/")[0];
				let b = res.path.split("/")[1];
				let c = res.path.split("/")[2];
				console.log("a" + a);
				console.log("b" + b);
				console.log("c" + "../" + b + "/" + c);
				wx.navigateTo({
					url: "../" + b + "/" + c,
					success: result => {},
					fail: () => {},
					complete: () => {}
				});
			}
		})
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad(options) {
		//先查缓存里面是否有UserId,如果有说明已经创建过用户
		var that = this
		wx.getStorage({
			key: "firstin",
			success(res) {
				console.log("查到" + res.data)
			},
			fail(res) {
				console.log("未查到" + res.data)
				wx.showModal({
					title: '提示',
					content: '旧版的点歌码已经失效，请保存新的点歌码进行使用',
					complete: (res) => {
						if (res.confirm) {
							console.log('用户点击确定')
							wx.setStorageSync('firstin', true)
						} else if (res.cancel) {
							console.log('用户点击取消')
						}
					}
				})

			}
		})



		if (app.globalData.userId && app.globalData.userId != '') { //有用户，直接显示主页
			console.log("检测到回调1,等到app.onlaunch执行完再执行到这里" + app.globalData.userType)
			if (app.globalData.userType == 3) {
				//查商品签到码

				getShopByUserId({ //查询商家详情
					id: app.globalData.shopId,
					userId: app.globalData.userId
				}).then(res => {
					that.setData({
						userId: app.globalData.userId,
						userType: app.globalData.userType,
						qrcode: res.data.chooseCode, //商家点歌二维码
						qdcode: res.data.shopCode //商家签到二维码
					})
				})
			} else {
				this.setData({
					userId: app.globalData.userId,
					userType: app.globalData.userType,
					qrcode: app.globalData.userInfo.qrcode
				})
			}


		} else { //不存在，则在app实例中创建创建employIdCallback方法，且该方法带参数employId
			app.employIdCallback = () => {
				console.log("检测到回调2,等到app.onlaunch执行完再执行到这里" + app.globalData.userType)
				if (app.globalData.userType == null || app.globalData.userType == '') {
					console.log("检测到回调2,userType是空")
					wx.redirectTo({
						url: '../welcome/welcome?userId=' + this.data.userId,
					})

				} else {
					console.log("检测到回调3,等到app.onlaunch执行完再执行到这里" + app.globalData.userType)
					if (app.globalData.userType == 3) {
						//查商品签到码

						getShopByUserId({
							id: app.globalData.shopId,
							userId: app.globalData.userId
						}).then(res => {
							that.setData({
								userId: app.globalData.userId,
								userType: app.globalData.userType,
								qrcode: res.data.chooseCode,
								qdcode: res.data.shopCode
							})
						})
					} else {
						this.setData({
							userId: app.globalData.userId,
							userType: app.globalData.userType,
							qrcode: app.globalData.userInfo.qrcode
						})
					}
					console.log("查询options:" + JSON.stringify(options))
					if (options.shopId != '' && options.shopId != null) {
						that.setData({
							shopId: options.shopId
						})
						//说明扫了签到码进来
						console.log("查询userType:" + app.globalData.userType)
						if (app.globalData.userType == 1) {
							console.log("歌手开始签到:" + JSON.stringify(options))
							//1，查商家的信息
							getShopByUserId({
								id: options.shopId,
							}).then(res => {
								console.log("查询到商家信息:" + JSON.stringify(res.data))
								that.setData({
									location: res.data.name,
								})
							})
							//查询是否已经签到
							querySingin({
								shopId: options.shopId,
								userId: app.globalData.userId
							}).then(res2 => {
								if (res2.data == null) {
									//说明尚未签到，弹窗签到
									var date = new Date();
									var h = date.getHours();
									h = h < 10 ? '0' + h : h;

									var min = date.getMinutes();
									min = min < 10 ? '0' + min : min;
									that.setData({
										startTime: h + ":" + min,
										endTime: h + ":" + min,
										showQdViewFlag: true
									})
								} else {
									wx.showToast({
										title: '签到演出中~',
									})
								}
							})

						} else {
							wx.showToast({
								title: '歌手才能签到',
							})
						}
					}

				}
			}

		}
		// if (this.userId != "" && this.userId != null) {
		// 	//直接调接口获取用户信息
		// } else {
		// 	//跳到welcome页面
		// }
	},
	cancelQD() {
		this.setData({
			showQdViewFlag: false
		})
	},
	//new Date().toISOString()
	addQianDao() {
		// if(this.data.startTime>this.data.endTime){
		// 	wx.showToast({
		// 		title: '结束时间不可大于开始时间',
		// 	})
		// }
		addsignin({
			createdate: new Date().toISOString(),
			userId: app.globalData.userId,
			shopId: this.data.shopId,
			enddate: this.data.endTime,
			startdate: this.data.startTime
		}).then(res => {
			wx.showToast({
				title: '签到成功',
			})
			this.setData({
				showQdViewFlag: false
			})
		})
	},

	cancelQt() {
		this.setData({
			showQtViewFlag: false
		})
	},

	setStartTimeChange(e) {
		this.setData({
			startTime: e.detail.value
		})
	},

	setEndTimeChange(e) {
		this.setData({
			endTime: e.detail.value
		})
	},
	songsManage() {
		wx.navigateTo({
			url: '../gedan/gedan?',
		})
	},
	showSingerDGCode() {
		this.setData({
			showCode: true,
		})
	},
	clickDialog() {
		console.log("点击slot")
		this.setData({
			showCode: false,
		})
	},
	showQDCode() {
		this.setData({
			showQDCode: true,
		})
	},
	clickDialog2() {
		console.log("点击slot")
		this.setData({
			showQDCode: false,
		})
	},
	clearUser() {

		clearUser({
			userId: this.data.userId
		}).then(res => {
			wx.redirectTo({
				url: '../welcome/welcome',
			})
		})
	},
	closeCode(e) { //关闭弹窗
		this.setData({
			showCode: false,
		})
	},
	toProfit() {
		wx.navigateTo({
			url: '../my_money/my_money?userId=' + this.data.userId,
		})
	},
	toShopProfit() {
		wx.navigateTo({
			url: '../shop_money/shop_money?userId=' + this.data.userId,
		})
	},
	toShopInfo() {
		wx.navigateTo({
			url: '../shop_edit/shop_edit',
		})
	},
	/**
	 * 用户点击右上角分享
	 */
	onShow() {
		console.log("主页show--" + typeof this.getTabBar)
		if (typeof this.getTabBar === 'function' &&
			this.getTabBar()) {
			this.getTabBar().setData({
				selected: 0
			})
		}
	}
})