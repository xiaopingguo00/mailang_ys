// pages/gedan/gedan.js

const app = getApp();
import {
	getsonglist,
	getsong,
	addSong,
	updateSong
} from "./../../api/user/index";
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		name: '',
		id: "",
		singerName: '',
		sortnum: '',
		songType: 0, //1原创
		status: 0, //1下架
		songClass: '',
		qfIndex: 0,
		qufengs: ["流行", "民谣", "摇滚", "古风", "中国风", "说唱", "乐器演奏", "其他"]
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad(options) {
		if (options.id != "" && options.id != null) {
			wx.setNavigationBarTitle({
				title: '修改歌曲'
			})
			getsong({
				songId: options.id
			}).then(res => {
				this.setData({
					id: options.id,
					name: res.data.name,
					singerName: res.data.singerName,
					sortnum: res.data.sortnum,
					songType: res.data.songType,
					status: res.data.status,
					songClass: res.data.songClass,
					qfIndex: this.data.qufengs.indexOf(res.data.songClass)
				})
			})

		} else {
			wx.setNavigationBarTitle({
				title: '添加歌曲'
			})
		}
	},
	saveData() {
		if (this.data.name == "") {
			wx.showToast({
				title: '请输入歌名',
			})
			return;
		}
		if (this.data.singerName == "") {
			wx.showToast({
				title: '请输入歌手名',
			})
			return;
		}
		if (this.data.songClass == "") {
			wx.showToast({
				title: '请选择曲风',
			})
			return;
		}
		var that = this
		var songId = that.data.id
		if (songId == "" || songId == null) {
			addSong({
				"name": that.data.name,
				"singerName": that.data.singerName,
				"sortnum": that.data.sortnum == "" ? 1 : that.data.sortnum,
				"songType": that.data.songType,
				"status": that.data.status,
				"type": 1,
				"songClass": that.data.songClass,
				"name": that.data.name,
				"userId": app.globalData.userId,
			}).then(res => {
				if (res.code == 1) {
					wx.showToast({
						content: `添加成功`,
					});
					wx.navigateBack()
				}

			})
		} else {
			updateSong({
				"name": that.data.name,
				"singerName": that.data.singerName,
				"sortnum": that.data.sortnum == "" ? 1 : that.data.sortnum,
				"songType": that.data.songType,
				"status": that.data.status,
				"type": 1,
				"id": songId,
				"songClass": that.data.songClass,
				"name": that.data.name,
				"userId": app.globalData.userId,
			}).then(res => {
				if (res.code == 1) {
					wx.showToast({
						content: `修改成功`,
					});
					wx.navigateBack()
				}

			})
		}

	},
	openYC() {
		this.setData({
			songType: this.data.songType == 1 ? 0 : 1
		})
	},
	openSJ() {
		this.setData({
			status: this.data.status == 1 ? 0 : 1
		})
	},
	inputName(e) {
		this.setData({
			name: e.detail.value
		})
	},
	inputSingerName(e) {
		this.setData({
			singerName: e.detail.value
		})
	},
	inputSortNum(e) {
		this.setData({
			sortnum: e.detail.value
		})
	},
	bindSexPickerChange(e) {
		console.log("nick" + e.detail.value)
		this.data.qfIndex = e.detail.value
		this.setData({
			songClass: this.data.qufengs[e.detail.value]
		})
	}


})