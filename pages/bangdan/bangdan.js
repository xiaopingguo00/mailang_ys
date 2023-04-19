const app = getApp();
import {
	getBangDan
} from "./../../api/user/index";
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		picServerUrl: app.globalData.picServerUrl,
		dataList: []
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad(options) {

	},

	toDetail(e) {
		var index = e.currentTarget.dataset.index
		wx.navigateTo({
			url: '../singer_info/singer_info?singer=' + JSON.stringify(this.data.dataList[index]),
		})
	},
	/**
	 * 生命周期函数--监听页面显示
	 */
	onShow() {
		console.log("榜单show--" + typeof this.getTabBar)
		if (typeof this.getTabBar === 'function' &&
			this.getTabBar()) {
			this.getTabBar().setData({
				selected: 1
			})
		}
		getBangDan({}).then(res => {
			var list = res.data
			this.setData({
				dataList: list
			})
		})
	},

	/**
	 * 生命周期函数--监听页面隐藏
	 */
	onHide() {

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