// pages/welcome/welcome.js
const app = getApp();
import {
	updateUser,	getUser,
	addShop
} from "./../../api/user/index";
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		currentRole: "audience"
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad(options) {

	},

	clickImage(e) {
		this.setData({
			currentRole: e.currentTarget.dataset.name
		});
	},
	toHome() {
		if (this.data.currentRole == "bussiness") {
			updateUser({
				userId: app.globalData.userId,
				userType: 3
			}).then(res => {
				addShop({
					userId: app.globalData.userId,
					shopType: 2
				}).then(res => {
					// var shopId = res.data.data.id;
					app.globalData.userType = 3
					getUser({
							userId: app.globalData.userId!=""&&app.globalData.userId!=null?app.globalData.userId:'0001'
						})
						.then(res => {
							var user = res.data.user
							app.globalData.shopId = user.shopId
							wx.setStorage({
								key: 'userType',
								data: {
									userType: 3
								},
							});
							wx.switchTab({
								url: "../home/index?userType=3" +
									"&userId=" +
									app.globalData.userId,
							});
						})
						.catch(err => {
							console.error(err);
						});
					
				})
			});
		} else if (this.data.currentRole == "singer") {
			updateUser({
				userId: app.globalData.userId,
				userType: 1
			}).then(res => {
				app.globalData.userType = 1
				wx.setStorage({
					key: 'userType',
					data: {
						userType: 1
					},
				});
				wx.setStorageSync("needGuideRead", true);
				wx.switchTab({
					url: "../home/index?userType=1" +
						"&userId=" +
						app.globalData.userId,
				});
			});
		} else if (this.data.currentRole == "audience") {
			updateUser({
				userId: app.globalData.userId,
				userType: 1
			}).then(res => {
				app.globalData.userType = 0
				wx.setStorage({
					key: 'userType',
					data: {
						userType: 0
					},
				});
				wx.setStorageSync("needGuideRead", true);
				wx.switchTab({
					url: "../home/index?userType=0" +
						"&userId=" +
						app.globalData.userId,
				});
			});
		}
	}
})