// pages/me/me.js
const app = getApp();
import {
	getUser,
	updateSinger,
	getOssAccessToken
} from "./../../api/user/index";
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		user: '',
		userNickname: '',
		sex: 0,
		code: '', //会员相关,里面code 会员状态 0=不是会员 1=会员有效 2=已过期
		words: '', //一句话
		address: '',
		userType: '', //0=普通用户 1=歌手 3=商家
		headImg: 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0'
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onShow() {

		if (typeof this.getTabBar === 'function' &&
			this.getTabBar()) {
			this.getTabBar().setData({
				selected: 2
			})
		}

		getUser({
				userId: app.globalData.userId!=""&&app.globalData.userId!=null?app.globalData.userId:'53042'
				// userId: '53042'
			})
			.then(res => {
				var user = res.data.user
				this.setData({
					userNickname: user.userNickname,
					headImg: user.userPic,
					address: user.userCity,
					words: user.words,
					sex: user.userSex,//1男2女
					userType: user.userType,
					user: user,
					code: user.memberDTO.code
				})
			})
			.catch(err => {
				console.error(err);
			});
	},
	toInfoPage() {
		if (this.data.userType == 1) {
			wx.navigateTo({
				url: "../singer_edit/singer_edit?userId=" + app.globalData.userId,
			});
		} else {
			wx.navigateTo({
				url: "../shop_edit/shop_edit?userId=" + app.globalData.userId,
			});
		}

	},
	/**
	 * 生命周期函数--监听页面初次渲染完成
	 */
	onReady() {

	},

	/**
	 * 生命周期函数--监听页面显示
	 */

	/**
	 * 生命周期函数--监听页面隐藏
	 */
	onHide() {

	},
	openvip() {
		wx.navigateTo({
			url: "../buy_vip/buy_vip?user=" + JSON.stringify(this.data.user),
		});
	},
	/**
	 * 生命周期函数--监听页面卸载
	 */
	onUnload() {

	},

	/**
	 * 页面相关事件处理函数--监听用户下拉动作
	 */
	onPullDownRefresh() {

	},

	/**
	 * 页面上拉触底事件的处理函数
	 */
	onReachBottom() {

	},

	/**
	 * 用户点击右上角分享
	 */
	onShareAppMessage() {

	}
})