// pages/my_money/my_money.js
const app = getApp();
import {
	updateUser,
	getusersigninlist,
	tixian,
	getcashamount,
	getUser
} from "./../../api/user/index";
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		showDGFee: false,
		showTXFee: false,
		showKRFee: false,
		showPhoneWindow: false,
		ketixianMoney: '', //可提现金额
		todayMoney: "",
		totalMoney: "", //总收益
		todayMoney: "", //今日收益
		currentDGFee0: "",
		kerenFee0: "",
		currentDGFee: "",
		kerenFee: "",
		tixianFee: "", //输入的提现金额

	},
	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad(options) {

		this.getData()
	},
	getData() {
		var that = this
		getUser({
			userId: app.globalData.userId != "" && app.globalData.userId != null ? app.globalData.userId : '0001'
		}).then(res => {
			that.setData({
				totalMoney: res.data.user.amountNum,
				currentDGFee: res.data.user.price,
				kerenFee: res.data.user.visitorPrice,
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
	inputDGFee(e) {
		this.setData({
			currentDGFee0: e.detail.value
		})
	},
	inputTXFee(e) {
		this.setData({
			tixianFee: e.detail.value
		})
	},
	inputPhone(e) {
		this.setData({
			phone: e.detail.value
		})
	},
	submitPhone(e) {
		if (this.data.phone == ""||this.data.phone == null) {
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
		updateUser({
			userId: app.globalData.userId,
			price: this.data.currentDGFee0
		}).then(res => {
			if (res.code == 1) {
				that.setData({
					currentDGFee: that.data.currentDGFee0,
					showDGFee: false
				})
			}
		})
	},
	inputDGFee(e) {
		this.setData({
			currentDGFee0: e.detail.value
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
			amount: this.data.tixianFee,
			userId: app.globalData.userId,
		}).then(res => {
			console.log("点击提现3")
			if (res.code == 1) {
				wx.showToast({
					title: '提现成功',
				})
				this.getData()
				this.setData({
					showTXFee: false
				})
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
	clickDialog() {
		console.log("ss")
	},
	inputKRFee(e) {
		this.setData({
			kerenFee0: e.detail.value
		})
	},
	submitKEFee() {
		var that = this
		if (that.data.kerenFee0 == "") {
			wx.showToast({
				title: '请输入价格',
			})
			return;
		}
		if (that.data.kerenFee0 == 0) {
			wx.showToast({
				title: '价格要大于0',
			})
			return;
		}
		updateUser({
			userId: app.globalData.userId,
			visitorPrice: that.data.kerenFee0
		}).then(res => {
			if (res.code == 1) {
				that.setData({
					kerenFee: that.data.kerenFee0,
					showKRFee: false
				})
			}
		})
	},
	closeWidow() {
		this.setData({
			showDGFee: false,
			showKRFee: false,
			showTXFee: false,showPhoneWindow:false
		})
	},
	showDGWin() {
		if (app.globalData.userInfo.phone == null || app.globalData.userInfo.phone == '') {
			this.setData({
				showPhoneWindow: true
			})
		} else
			this.setData({
				showDGFee: !this.data.showDGFee
			})
	},
	showTXWin() {
		this.setData({
			showTXFee: !this.data.showDGFee
		})
	},
	showKRWin() {
		this.setData({
			showKRFee: !this.data.showKRFee
		})
	},
	showTXWin() {
		this.setData({
			showTXFee: !this.data.showTXFee
		})
	},


	toDetail() {
		wx.navigateTo({
			url: '../money_list/money_list?type=1',//type1=歌手 2=商家
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