// pages/gedan/gedan.js

const app = getApp();
import {
	getsonglist,
	deletesong
} from "./../../api/user/index";
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		pages: 100,
		dataList: [],
		status: 0, //0已上架,1下架
		isuserId: app.globalData.userId,
		page: 1,
		size: 15,
		userId: app.globalData.userId,
		name: ''

	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onShow(options) {
		this.loadData()
	},

	loadData() {
		let dataList = this.data.dataList;
		console.log("加载歌曲，查询歌曲3---" + this.data.dataList.length)
		let params = {
			status: this.data.status,
			isuserId: app.globalData.userId,
			name: this.data.name,
			userId: app.globalData.userId,
			// type: 1,
			page: this.data.page,
			size: this.data.size,
		};
		getsonglist(params).then(res => {
			dataList = dataList.concat(res.data.rows);

			this.setData({
				dataList: dataList,
				pages: res.data.pages
			});
		});
	},
	inputname(e) {
		this.setData({
			name: e.detail.value
		})
	},
	searchsong() {
		this.setData({
			name: this.data.name,
			dataList: [],
			page: 1
		})
		this.loadData();
	},
	deleteSong(e) {
		var id = e.currentTarget.dataset.id
		var index = e.currentTarget.dataset.index
		var that = this
		wx.showModal({
			title: '提示',
			content: '是否删除歌曲？',
			complete: (res) => {

				if (res.confirm) {
					deletesong({
						songId: id
					}).then(res => {
						if (res.code == 1) {
							// this.loadData()
							var datas = that.data.dataList.filter(function (ele) {
								return ele.id != id;
							})
							that.setData({
								dataList: datas
							})
						}
					})
				}
			}
		})

	},
	changeTab(e) {
		this.setData({
			status: e.currentTarget.dataset.status,
			dataList: [],
			page: 1
		})
		this.loadData();
	},
	/*
	 *  下拉刷新
	 */
	onPullDownRefresh() {
		this.setData({
			dataList: [],
			page: 1
		});

		this.loadData();
	},

	/*
	 *  页面被拉到底部
	 */
	onReachBottom() {
		if (this.data.page < this.data.pages) {
			this.setData({
				page: this.data.page + 1
			});

			this.loadData();
		}

	},

	addSong() {
		this.setData({
			dataList: [],
			page: 1
		});
		wx.navigateTo({
			url: '../add_song/add_song',
		})
	},
	editSong(e) {
		this.setData({
			dataList: [],
			page: 1
		});
		wx.navigateTo({
			url: '../add_song/add_song?id=' + e.currentTarget.dataset.id,
		})
	}


})