const app = getApp();
import {
	getUser,clearUser,
	updateSinger
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
		region: ["广东省", "广州市", "海珠区"],
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
		avatarUrl: "https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0",
		showSy: 1, //是否商演展示 0=否 1=是
		showPhone: false,
		showWechat: false,
		userId: ""
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad(options) {
		var that = this
		getUser({
			userId: app.globalData.userId!=""&&app.globalData.userId!=null?app.globalData.userId:'0001'
			})
			.then(res => {
				var user = res.data.user
				console.log("学校:" + user.userProvinceName)
				console.log("照片:" +user.userPhoto.search(","))
				console.log("照片1:" +user.userPhoto)
				console.log("照片2:" +user.userPhoto.split(",")[0])
				that.setData({
					pics: user.userPhoto.length > 0 ?user.userPhoto.search(",")!=-1? user.userPhoto.split(",") : [user.userPhoto]:[],
					videos:user.userVideo.length > 0 ?user.userVideo.search(",")!=-1? user.userVideo.split(",") : [user.userVideo]:[],
					avatarUrl: user.userPic,
					nickname: user.userNickname,
					sexIndex: user.userSex,
					birthday: user.birthday,
					showSy: user.business == null ? 1 : user.business,
					region: [user.userProvince, user.userCity, user.userRegionName, ],
					mingzu: user.nations,
					// phone:user.phone,userVideo
					musical: user.musical,
					wechat: user.wechat,
					phonePrice: user.phonePrice,
					school: user.school,
					introduce: user.userIntroduction,
					profile: user.words,
				})

			})
			.catch(err => {
				console.error(err);
			});
	},
	onChooseAvatar(e) {
		const {
			avatarUrl
		} = e.detail
		console.log("nick--用户信息" + JSON.stringify(e.detail))
		console.log("nick--头像" + e.detail.avatarUrl)
			// this.setData({
			// 	avatarUrl
			// })
		var that = this
		var imageKey = `${
			app.globalData.userId
			}/images/${new Date().getTime()}.png`;
		// wx.uploadFile({
		// 	url: app.globalData.global_path + "upload/fileupload/", //仅为示例，非真实的接口地址

		// 	filePath: e.detail.avatarUrl,
		// 	name: 'file',
		// 	formData: {
		// 		'key': imageKey,
		// 	},
		// 	success(res) {

		// 		console.log("成功2=" + JSON.stringify(res.data))
		// 	},
		// 	fail(res) {
		// 		console.log("失败=" + JSON.stringify(res))
		// 	}
		// })
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
				// that.data.pics.push()
				that.setData({
					avatarUrl: JSON.parse(res.data).data
				})
			},
			fail(res) {
				console.log("失败=" + JSON.stringify(res))
			}
		})
	},
	addImage(e) {
		var that = this
		wx.chooseMedia({
			count: 1,
			mediaType: ['image', ],
			sourceType: ['album', 'camera'],
			maxDuration: 30,
			camera: 'back',
			success(res) {
				// console.log("nick1=" + JSON.stringify(res.tempFiles[0]))
				// console.log("nick2=" + res.tempFiles[0].tempFilePath)
				let imageKey = `${
					app.globalData.userId
				  }/images/${new Date().getTime()}.png`;
				wx.uploadFile({
					url: app.globalData.global_path + "upload/fileupload/", //仅为示例，非真实的接口地址

					filePath: res.tempFiles[0].tempFilePath,
					name: 'file',
					formData: {
						'key': imageKey,
					},
					success(res) {
						console.log("添加图片成功1=" + JSON.stringify(res.data))
						console.log("添加图片成功2=" + JSON.parse(res.data).data)
						var set = that.data.pics;
						set.push(JSON.parse(res.data).data);
						// that.data.pics.push()
						that.setData({
							pics: set
						})
					},
					fail(res) {
						console.log("失败=" + JSON.stringify(res))
					}
				})
			}
		})
	},
	bindSexPickerChange(e) {
		console.log("性别"+e.detail.value)
		this.setData({//1=男 2=女
			sexIndex: e.detail.value
		})
	},
	setHome(e) {
		console.log("城市=" + JSON.stringify(e.detail.value)) //
		this.setData({

			region: [(e.detail.value.toString()).split(",")[0], (e.detail.value.toString()).split(",")[1], (e.detail.value.toString()).split(",")[2]]
		})
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
	bindDateChange(e) {
		this.setData({
			birthday: e.detail.value
		})
	},
	inputSchool(e) {
		console.log("=" + e.detail.value) //
		this.setData({
			school: e.detail.value
		})
	},
	inputMZ(e) {
		console.log("=" + e.detail.value) //
		this.setData({
			mingzu: e.detail.value
		})
	},
	inputYQ(e) {
		console.log("=" + e.detail.value) //
		this.setData({
			musical: e.detail.value
		})
	},
	// inputPhone(e) {
	// 	console.log("=" + e.detail.value) //
	// 	this.setData({
	// 		phone: e.detail.value
	// 	})
	// },
	inputWechat(e) {
		console.log("=" + e.detail.value) //
		this.setData({
			wechat: e.detail.value
		})
	},
	inputPrice(e) {
		console.log("=" + e.detail.value) //
		this.setData({
			phonePrice: e.detail.value
		})
	},
	inputProfile(e) {
		console.log("=" + e.detail.value) //
		this.setData({
			profile: e.detail.value
		})
	},
	inputName(e) {
		console.log("=" + e.detail.value) //
		this.setData({
			nickname: e.detail.value
		})
	},
	inputIntroduce(e) {
		console.log("=" + e.detail.value) //
		this.setData({
			introduce: e.detail.value
		})
	},
	delImage(e) {
		var list = this.data.pics
		list.splice(e.currentTarget.dataset.index, 1)
		this.setData({
			pics: list
		})
	},
	// switchPhone(e) {
	// 	console.log("=" + e.currentTarget.dataset.value) //
	// 	this.setData({
	// 		showPhone: !e.currentTarget.dataset.value
	// 	})
	// },

	switchWechat(e) {
		this.setData({
			showWechat: !e.currentTarget.dataset.value
		})
	},

	switchSY(e) {
		console.log("商演=" + JSON.stringify(e.currentTarget.dataset)) //
		console.log("商演=" + e.currentTarget.dataset.zhi) //
		//是否商演展示 0=否 1=是
		this.setData({
			showSy: e.currentTarget.dataset.zhi == 0 ? 1 : 0
		})
	},


	delVideo(e) {
		var list = this.data.videos
		list.splice(e.currentTarget.dataset.index, 1)
		this.setData({
			videos: list
		})
	},

	addVideo(e) {
		var that = this
		wx.chooseMedia({
			count: 1,
			// mediaType: ['image','video'],
			mediaType: ['video', ],
			sourceType: ['album', 'camera'],
			maxDuration: 30,
			camera: 'back',
			success(res) {
				console.log("nick1=" + JSON.stringify(res.tempFiles[0]))
				console.log("nick2=" + res.tempFiles[0].tempFilePath)
				let imageKey = `${
					app.globalData.userId
				  }/images/${new Date().getTime()}.mp4`;
				wx.uploadFile({
					// url: "https://oss.yczx.art/", //仅为示例，非真实的接口地址
					url: app.globalData.global_path + "upload/fileupload/", //仅为示例，非真实的接口地址

					filePath: res.tempFiles[0].tempFilePath,
					name: 'file',
					formData: {
						'key': imageKey,
					},
					success(res) {
						console.log("成功2=" + JSON.parse(res.data).data)
						var set = that.data.videos;
						set.push(JSON.parse(res.data).data);
						// that.data.pics.push()
						that.setData({
							videos: set
						})
					},
					fail(res) {
						console.log("失败=" + JSON.stringify(res))
					}
				})

			}
		})
	},
	savedata() {

		var user = {
			"userId": app.globalData.userId,
			"userSex": this.data.sexIndex, //用户性别 1=男 2=女
			"birthday": this.data.birthday,
			"business": this.data.showSy, //是否商演展示 0=否 1=是
			"userProvince": this.data.region[0],
			"userCity": this.data.region[1],
			"nations": this.data.mingzu, //名族
			"musical": this.data.musical, //乐器
			"wechat": this.data.wechat,
			"phonePrice": this.data.phonePrice,
			"school": this.data.school,
			"userIntroduction": this.data.introduce, //个性标签
			"words": this.data.profile, //一句话介绍自己
			"userNickname": this.data.nickname, //昵称
			"userPic": this.data.avatarUrl, //用户头像
			"userPhoto": this.data.pics.length > 0 ? this.data.pics.join(",") : "",
			"userVideo": this.data.videos.length > 0 ? this.data.videos.join(",") : "",
		}
		console.log("保存-user" + JSON.stringify(user))
		var params = {
			"user": user
		}
		console.log("保存-params" + JSON.stringify(params))
		updateSinger(params).then(res => {
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