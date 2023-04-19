const app = getApp();
import {
	getShop,
	getUser,
	clearUser,
	updateShop
} from "./../../api/user/index";
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		pics: [
			// "https://xiaomai123456.oss-cn-beijing.aliyuncs.com/jpc/2023-03-07/1678180465748-32eb4d35-14e3-48d0.png",
		],
		videos: [
			// "https://xiaomai123456.oss-cn-beijing.aliyuncs.com/jpc/2023-03-07/1678180971010-d473eb1a-511a-44d4.mp4",
		],
		sexArray: ["请选择", "男", "女"],
		sexIndex: 1, //用户性别 1=男 2=女
		region: [],
		birthday: "",
		nickname: "",
		school: "",
		// phone: "",
		mingzu: "",
		wechat: "",
		phonePrice: "",
		imageArray: [],
		profile: "",
		musical: "", //擅长乐器
		introduce: "",
		morenPic: 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0',
		avatarUrl: "",
		showSy: 1, //是否商演展示 0=否 1=是
		showPhone: false,
		showWechat: false,
		id: '',
		userId: "",
		shopId: '',
		userAddress: '' //店铺地址
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad(options) {
		var that = this
		getUser({
				userId: app.globalData.userId != "" && app.globalData.userId != null ? app.globalData.userId : '0001'
			})
			.then(res => {
				var shop = res.data.user
				getShop({
						userId: app.globalData.userId,
						id: shop.shopId
					})
					.then(res => {
						var user = res.data
						that.setData({
							// avatarUrl: user.userPic,
							shopId: shop.shopId,
							nickname: user.name,
							region: [user.province, user.city],
							userAddress: user.address,
						})

					})
					.catch(err => {
						console.error(err);
					});
			})
			.catch(err => {
				console.error(err);
			});

	},
	onShow() {

		if (typeof this.getTabBar === 'function' &&
			this.getTabBar()) {
			this.getTabBar().setData({
				selected: 2
			})
		}

	},
	qiehuan() {
		wx.showModal({
			title: '提示!',
			content: '切换角色，当前账户信息会全部清除，是否确认操作?',
			complete: (res) => {

				if (res.confirm) {
					clearUser({
						userId: app.globalData.userId
					}).then(res => {
						wx.redirectTo({
							url: '../welcome/welcome',
						})
					})
				}
			}
		})

	},
	onChooseAvatar(e) {
		const {
			avatarUrl
		} = e.detail
		console.log("nick--用户信息" + JSON.stringify(e.detail))
		console.log("nick--头像" + e.detail.avatarUrl)
		var that = this
		var imageKey = `${
			app.globalData.userId
			}/images/${new Date().getTime()}.png`;
		wx.uploadFile({
			url: app.globalData.global_path + "upload/fileupload/", //仅为示例，非真实的接口地址

			filePath: e.detail.avatarUrl,
			name: 'file',
			formData: {
				'key': imageKey,
			},
			success(res) {
				console.log("成功1=" + JSON.stringify(res.data))
				console.log("成功2=" + JSON.parse(res.data).data)
				that.setData({
					avatarUrl: JSON.parse(res.data).data
				})
			},
			fail(res) {
				console.log("失败=" + JSON.stringify(res))
			}
		})
	},
	setHome(e) {
		console.log("城市=" + JSON.stringify(e.detail.value)) //
		this.setData({

			region: [(e.detail.value.toString()).split(",")[0], (e.detail.value.toString()).split(",")[1], (e.detail.value.toString()).split(",")[2]]
		})
	},
	inputName(e) {
		console.log("=" + e.detail.value) //
		this.setData({
			nickname: e.detail.value
		})
	},
	inputUserAddress(e) {
		console.log("=" + e.detail.value) //
		this.setData({
			userAddress: e.detail.value
		})
	},
	savedata() {
		if (this.data.nickname == "" || this.data.nickname == null) {
			wx.showToast({
				title: '店名不可以为空',
			})
			return;
		}
		if (this.data.region[0] == "" || this.data.region[0] == null || this.data.region[0] == 0) {
			wx.showToast({
				title: '请选择城市',
			})
			return;
		}
		if (this.data.userAddress == "" || this.data.userAddress == null) {
			wx.showToast({
				title: '请输入店铺地址',
			})
			return;
		}
		var user = {
			"userId": app.globalData.userId,
			"id": this.data.shopId,
			"province": this.data.region[0],
			"city": this.data.region[1],
			"name": this.data.nickname, //昵称
			// "userPic": this.data.avatarUrl, //用户头像
			"address": this.data.userAddress, //店铺地址
		}
		console.log("保存-user" + JSON.stringify(user))
		// var params = {
		// 	"shop": user
		// }
		console.log("保存-params" + JSON.stringify(user))
		updateShop(user).then(res => {
			if (res.code == 1) {
				wx.navigateBack()
				wx.showToast({
					title: '信息更新成功',
					duration: 0,
				})
			}
		})

	}
})