const app = getApp();
import {
	getSingerList
} from "./../../api/user/index";
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		sexArray: ["全部", "男", "女"],
		sexIndex: 0,
		typeArray: ["全部", "会乐器"],
		typeIndex: 0, //空就是全部，会乐器就是1
		region: ["广东省", "广州市", "海珠区"],
		dataList: [],
		pageNum: 1,
		pageSize: 10,
		province: '',
		city: '',
		// userSex: null //1=男 2=女
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad(options) {
		console.log("榜单show--" + typeof this.getTabBar)
		if (typeof this.getTabBar === 'function' &&
			this.getTabBar()) {
			this.getTabBar().setData({
				selected: 1
			})
		}
		this.loadData()
	},
	bindTypePickerChange(e) {
		console.log("类型=" + JSON.stringify(e.detail.value)) //全部是"0"
		this.setData({
			dataList: [],
			typeIndex: parseInt(e.detail.value),
			page: 1
		});

		this.loadData();
	},
	bindSexPickerChange(e) {
		console.log("性别=" + JSON.stringify(e.detail.value)) ///全部是"0"
		this.setData({
			dataList: [],
			sexIndex: parseInt(e.detail.value),
			page: 1
		});

		this.loadData();
	},
	todetail(e){
		var index = e.currentTarget.dataset.index
		wx.navigateTo({
			url: '../singer_info/singer_info?singer=' + JSON.stringify(this.data.dataList[index]),
		})
	},
	setHome(e) {
		console.log("城市=" + JSON.stringify(e.detail.value)) //
		this.setData({
			dataList: [],
			province: (e.detail.value.toString()).split(",")[0],
			city: (e.detail.value.toString()).split(",")[1],
			page: 1
		});

		this.loadData();
	},
	onShow() {
		if (typeof this.getTabBar === 'function' &&
		this.getTabBar()) {
		this.getTabBar().setData({
			selected: 1
		})
	}
	},
	loadData() {
		let dataList = this.data.dataList;
		console.log("加载歌手---" + this.data.dataList.length)
		let params = {
			userSex: this.data.sexIndex==0?null: this.data.sexIndex, //1=男 2=
			city: this.data.city,
			province: this.data.province,
			userNickname: "",
			musical: this.data.typeIndex == 1 ? 1 : null,
			pageNum: this.data.pageNum,
			pageSize: this.data.pageSize,
		};
		getSingerList(params).then(res => {
			dataList = dataList.concat(res.data.records);

			this.setData({
				dataList: dataList,
			});
		});
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
		this.setData({
			page: this.data.page + 1
		});

		this.loadData();
	},

	/**
	 * 用户点击右上角分享
	 */
	onShareAppMessage() {

	}
})