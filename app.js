//app.js
// import {
//     getisuser
//   } from "api/user/index";
App({
	globalData: {
		userInfo: "",
		// 用户信息
		userId: '',
		shopId: '',
		userType: '',
		wxCode: '',
		headImg: '',
		screenHeight: '',
		//正式版
		// global_path: "https://mercury.520yuejian.com/fitnessIsv/", 
		// show_img_path: "https://pic.520yuejian.com/", 
		// upload_path: "https://venus.520yuejian.com/",


		//测试版
		// global_path: "https://testmercury.520yuejian.com/fitnessIsv/",
		// show_img_path: "https://testpic.520yuejian.com/",
		// upload_path: "https://testvenus.520yuejian.com/",



		//老谢本地
		global_path: "https://test.yczx.art/", //shopId对应5   上传和普通接口都用这个前缀 
		// global_path: "http://192.168.100.150:8001/", //公司本地
		// global_path: "http://192.168.31.125:8001/", //宿舍本地  
		// global_path: "http://lanweiany111.vipgz4.idcfengye.com/platform-framework/",
		picServerUrl: "https://oss.yczx.art/", //显示图片，图片前面加这个前缀
		// codeUrl: "https://api.nandougang.cn/picupload/pic/", 
		codeUrl: "https://yczx.art/picupload/pic/",
	},


	onLaunch: function () {
		console.log("登陆1")
		// 登录
		this.wxlogin() //调用wx.login获取code然后直接请求接口获取openid然后请求接口获取后端的用户信息
		// 获取微信的用户用户信息
		wx.getSetting({
			success: res => {
				if (res.authSetting['scope.userInfo']) {
					// 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
					wx.getUserInfo({
						success: res => {
							// 可以将 res 发送给后台解码出 unionId


							// 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
							// 所以此处加入 callback 以防止这种情况
							if (this.userInfoReadyCallback) {
								this.userInfoReadyCallback(res)
							}
						}
					})
				}
			}
		})
		var that = this
		wx.getSystemInfo({
			success: res => {
				that.globalData.screenHeight = res.windowHeight
			}
		});
	},
	wxlogin() { //获取code
		console.log("登陆2")
		var that = this
		wx.login({
			success(res) {
				console.log("登陆3" + JSON.stringify(res))
				that.globalData.wxCode = res.code
				that.userLogin()
			},
			fail(res) {
				console.log("失败3")
				that.globalData.wxCode = res.code
				that.userLogin()
			}
		})
	},


	// 获取到code ,请求接口获取openId 用户登录
	userLogin(type, callBackFun) {
		// 为了妥协后端 post 请求 还要拼接参数的 代码
		// 登录
		// var that = this
		new Promise((resolve, reject) => {
			resolve()
		}).then(() => {
			this.globalData.isLoginType = true
			let temp = {
				code: this.globalData.wxCode,
			}
			console.log("获取到code" + this.globalData.wxCode)
			// 为了妥协后端 post 请求 还要拼接参数的 代码

			wx.request({
				url: this.globalData.global_path + 'user/getopenid',
				method: 'get',
				data: temp,
				success: (res) => {
					console.log("登陆成功1")
					console.log(res)


					// let str = JSON.parse(res.data)
					// console.log("登陆成功2"+str)

					if (res.data.data.openid != "" && res.data.data.openid != null) {
						console.log("登陆成功1" + res.data.data.openid)
						let str = res.data.data
						console.log("登陆成功2" + res.data.data.openid)

						this.globalData.openId = str.openid
						wx.setStorageSync("openId", str.openid);
						wx.setStorageSync("session_key", str.session_key);
						// 回调
						let temp2 = {
							userWechatunionid: str.openid,
							unionid: str.unionid,
							userPic: "",
							recommendUserid: '111',
						}

						wx.request({
							url: this.globalData.global_path + 'user/getisuser',
							method: 'post',
							data: temp2,
							success: (res) => {
								console.log(res)
								this.globalData.userInfo = res.data.data
								this.globalData.userId = res.data.data.userId
								this.globalData.shopId = res.data.data.shopId
								this.globalData.userType = res.data.data.userType
								console.log("设置全局userId" + this.globalData.userId)
								console.log("设置全局userType" + this.globalData.userType)
								wx.setStorage({
									key: 'userType',
									data: {
										userType: res.data.data.userType
									},
								});
								wx.setStorageSync('userId', {
									userId: res.data.data.userId
								})
								if (this.employIdCallback) { //判断app.js中是否存在该回调函数，也就是是否存在改方法
									this.employIdCallback();
								}
							}
						})

					} else {

						if (res.data.code != 40163) {
							wx.showModal({
								title: '提示',
								content: '登录失败1'
							})
						}
					}
				},
				fail: (res) => {
					this.globalData.isLoginType = false
					wx.showModal({
						title: '提示',
						content: '登录失败2'
					})
				}
			});
		});
	},

	getInfo(callBack) {
		console.log('getUserInfo')
		return new Promise((resolve, reject) => {
			if (this.globalData.TOKEN) {
				callBack ? callBack() : ''
				resolve(this.globalData.TOKEN)
				return
			}

			wx.getSetting({
				success: res => {
					console.log(res.authSetting)
					this.globalData.authSetting = res.authSetting
					if (res.authSetting['scope.userInfo']) {
						wx.getUserInfo({
							success: res => {
								// 可以将 res 发送给后台解码出 unionId
								this.globalData.userInfo = res.userInfo
								this.globalData.alluserData = res
								// 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
								// 所以此处加入 callback 以防止这种情况 

								callBack ? callBack() : ''
							}
						})
					} else {
						wx.navigateTo({
							url: '/pages/auth_login/auth_login',
						})
					}
				},
				fail: res => {
					console.log("getSetting失败" + res)
				}
			})
		});
	},
})