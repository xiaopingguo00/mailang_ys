// pages/my_money/my_money.js
const app = getApp();
import {
	updateUser,
	getshopincome,
	updateshopincome,
	getcashamount,
	tixian,
	getusersigninlist,
	addshopincome,
	getUser
} from "./../../api/user/index";
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		showDGFee: false,
		showFCFee: false,
		showPhoneWindow: false,
		ketixianMoney: '', //可提现金额
		todayMoney: "",
		totalMoney: "",
		currentDGFee0: "",
		singerPercent0: "",
		currentDGFee: "",
		phone: '',
		sss: "",
		tixianFee: "", //输入的提现金额
		phone: ''
	},
	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad(options) {
		this.getData()
		var that = this
		getshopincome({
			shopId: app.globalData.shopId
		}).then(res => {
			if (res.data == null) {
				console.log("分成尚未设置")
			} else {
				console.log("分成歌手" + res.data.singerProportion)
				that.data.sss = res.data.singerProportion
				console.log("分成歌手2" + that.data.sss)
				that.setData({
					sss: res.data.singerProportion,
					singerPercent0: res.data.singerProportion
				})
				console.log("分成歌手3" + that.data.sss)
			}

		})
	},
	getData() {
		var that = this
		getUser({
			userId: app.globalData.userId != "" && app.globalData.userId != null ? app.globalData.userId : '0001'
		}).then(res => {
			that.setData({
				totalMoney: res.data.user.amountNum,
				currentDGFee: res.data.user.price,
				phone: res.data.user.phone,
				// singerPercent: res.data.user.visitorPrice,
			})
		})
		getcashamount({
			userId: app.globalData.userId != "" && app.globalData.userId != null ? app.globalData.userId : '0001'
		}).then(res => {
			that.setData({
				ketixianMoney: res.data.cashamount ?? 0,
				todayMoney: res.data.dateAmount ?? 0,
			})
		})
	},
	inputTXFee(e) {
		this.setData({
			tixianFee: e.detail.value
		})
	},
	submitTXFee() {
		var that = this
		console.log("点击提现1")
		if (that.data.tixianFee == "") {
			wx.showToast({
				title: '请输入提现金额',
			})
			return;
		}
		if (that.data.tixianFee < 0.3) {
			wx.showToast({
				title: '单次最少0.3元',
			})
			return;
		}
		if (that.data.tixianFee > that.data.ketixianMoney) {
			wx.showToast({
				title: '金额不足',
			})
			return;
		}
		if (that.data.tixianFee > 500) {
			wx.showToast({
				title: '单次最多500元',
			})
			return;
		}
		console.log("点击提现2")
		tixian({
			amount: that.data.tixianFee,
			userId: app.globalData.userId,
		}).then(res => {
			console.log("点击提现3")
			if (res.code == 1) {
				wx.showToast({
					title: '提现成功',
				})
				this.setData({
					showTXFee: false
				})
				that.setData({
					showTXFee: false
				})
				this.getData()

			} else {
				// console.log(res.msg)
				// wx.showToast({
				// 	title: res.msg,
				// })
			}
		}).catch(res => {
			console.log(res.msg)
			wx.showToast({
				title: res.msg,
			})
		})
	},
	inputDGFee(e) {
		this.setData({
			currentDGFee0: e.detail.value
		})
	},
	submitPhone(e) {
		if (this.data.phone == "" || this.data.phone == null) {
			wx.showToast({
				title: '请输入手机号',
			})
		} else if (this.data.phone.length != 11) {
			wx.showToast({
				title: '手机号格式不对',
			})
		} else {
			var that = this
			updateUser({
				userId: app.globalData.userId,
				phone: this.data.phone
			}).then(res => {
				if (res.code == 1) {
					that.setData({
						showPhoneWindow: false,
						showDGFee: true
					})
				}
			})
		}

	},
	submitDGFee() {
		var that = this
		if (that.data.currentDGFee0 == "") {
			wx.showToast({
				title: '请输入价格',
			})
			return;
		}
		if (that.data.currentDGFee0 == 0) {
			wx.showToast({
				title: '价格要大于0',
			})
			return;
		}
		updateUser({
			userId: app.globalData.userId,
			price: that.data.currentDGFee0
		}).then(res => {
			if (res.code == 1) {
				that.setData({
					currentDGFee: that.data.currentDGFee0,
					showDGFee: false
				})
			}
		})
	},
	clickDialog() {
		console.log("ss")
	},
	inputKRFee(e) {
		if (e.detail.value > 100) {
			this.setData({
				singerPercent0: 100
			})
		} else if (e.detail.value < 0) {
			this.setData({
				singerPercent0: 0
			})
		} else {
			this.setData({
				singerPercent0: e.detail.value
			})
		}
	},
	inputPhone(e) {
		this.setData({
			phone: e.detail.value
		})
	},
	submitFCFee() {
		var that = this
		if (that.data.sss == "" || that.data.sss == null) {
			addshopincome({
				shopId: app.globalData.shopId,
				shopProportion: 100 - that.data.singerPercent0,
				singerProportion: that.data.singerPercent0 - 0,
			}).then(res => {
				if (res.code == 1) {
					that.setData({
						sss: that.data.singerPercent0,
						showFCFee: false
					})
				}
			})
		} else {
			updateshopincome({
				shopId: app.globalData.shopId,
				shopProportion: 100 - that.data.singerPercent0,
				singerProportion: that.data.singerPercent0 - 0,
			}).then(res => {
				if (res.code == 1) {
					that.setData({
						sss: that.data.singerPercent0,
						showFCFee: false
					})
				}
			})
		}

	},
	closeWidow() {
		this.setData({
			showDGFee: false,
			showFCFee: false,
			showTXFee: false,
			showPhoneWindow: false
		})
	},
	showDGWin() {
		console.log("手机号" + this.data.phone)
		if (this.data.phone == "" || this.data.phone == null) {
			//绑定手机号
			this.setData({
				showPhoneWindow: true
			})
		} else {
			this.setData({
				showDGFee: !this.data.showDGFee
			})
		}

	},
	getPhoneNumber(e) {
		var code = e.detail.code
		console.log("手机参数" + JSON.stringify(e))
		var temp = {
			encryptedData: e.detail.encryptedData,
			code: app.globalData.wxCode,
			iv: e.detail.iv
		}
		wx.request({
			url: app.globalData.global_path + 'user/getopenid',
			method: 'get',
			data: temp,
			success: (res) => {
				console.log("手机号获取")
				console.log(JSON.stringify(res))


				// let str = JSON.parse(res.data)
				// console.log("登陆成功2"+str)

				// if (res.data.data.openid != "" && res.data.data.openid != null) {


				// } else {

				// 	if (res.data.code != 40163) {
				// 		wx.showModal({
				// 			title: '提示',
				// 			content: '登录失败1'
				// 		})
				// 	}
				// }
			},
			fail: (res) => {
				this.globalData.isLoginType = false
				wx.showModal({
					title: '提示',
					content: '登录失败2'
				})
			}
		});
	},
	showKRWin() {
		this.setData({
			showFCFee: !this.data.showFCFee
		})
	},
	showTXWin() {
		this.setData({
			showTXFee: !this.data.showTXFee
		})
	},


	toDetail() {
		wx.navigateTo({
			url: '../money_list/money_list?type=2',
		})
	},
	back() {
		wx.navigateBack()
	},
	/**
	 * 生命周期函数--监听页面显示
	 */
	onShow() {

	},

})