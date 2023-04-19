// pages/money_list/money_list.js
const app = getApp();
import {
	getMoneyList
} from "./../../api/user/index";
import {
	getTodayYYYY
} from "../../utils/utils.js";
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		datas: [],
		createDate: '',
		page: 1,
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad(options) {

		this.setData({
			createDate: getTodayYYYY(),
		})
		var that = this
		getMoneyList({
			"createDate": this.data.createDate,
			"page": this.data.page,
			"size": 100,
			"userId": app.globalData.userId

		}).then(res => {
			that.setData({
				datas: res.data.rows,
				pages: res.data.pages
			})
		})

	},
	loadData() {

		var that = this
		getMoneyList({
			"createDate": this.data.createDate,
			"page": this.data.page,
			"size": 100,
			"userId": app.globalData.userId
		}).then(res => {
		var	dataList = res.data.rows;
			that.setData({
				datas: dataList,
			});

		})
	},
	bindDateChange(e) {
		this.setData({
			datas: [],
			createDate: e.detail.value,
			page: 1
		});

		this.loadData();
	},

})