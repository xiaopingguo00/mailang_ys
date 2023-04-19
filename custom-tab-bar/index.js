const app = getApp();
Component({
	data: {
		selected: 0,
		color: "#000000",
		roleId: '',
		selectedColor: "#1396DB",
		allList: [{

			list1: [{
					"pagePath": "/pages/home/index",
					"iconPath": "../images/new/c_home1.png",
					"selectedIconPath": "../images/new/c_home2.png",
					"text": "首页"
				},
				{
					"pagePath": "/pages/singer_list/singer_list",
					"iconPath": "../images/new/c_bang1.png",
					"selectedIconPath": "../images/new/c_bang2.png",
					"text": "商演歌手"
				}
			],



			list2: [{
					"pagePath": "/pages/home/index",
					"iconPath": "../images/new/c_home1.png",
					"selectedIconPath": "../images/new/c_home2.png",
					"text": "首页"
				},
				{
					"pagePath": "/pages/bangdan/bangdan",
					"iconPath": "../images/new/c_bang1.png",
					"selectedIconPath": "../images/new/c_bang2.png",
					"text": "排行榜"
				},
				{
					"pagePath": "/pages/me/me",
					"iconPath": "../images/new/c_me1.png",
					"selectedIconPath": "../images/new/c_me2.png",
					"text": "我的"
				}
			],


			list3: [{
					"pagePath": "/pages/home/index",
					"iconPath": "../images/new/c_home1.png",
					"selectedIconPath": "../images/new/c_home2.png",
					"text": "首页"
				},
				{
					"pagePath": "/pages/singer_list/singer_list",
					"iconPath": "../images/new/c_bang1.png",
					"selectedIconPath": "../images/new/c_bang2.png",
					"text": "商演歌手"
				}
			]
		}],
		list: []
	},
	attached() {
		var that = this
		wx.getStorage({
			key: 'userType',
			success(res) {
				var roleId = res.data.userType
				console.log("查询角色成功" + app.globalData.userType)
				if (roleId == 3) {
					that.setData({
						list: that.data.allList[0].list1
					})
				} else if (roleId == 1) {
					that.setData({
						list: that.data.allList[0].list2
					})
				} else if (roleId == 0) {
					that.setData({
						list: that.data.allList[0].list3
					})
				}
			},
			fail(res) {
				console.log("查询角色失败")
			}
		})

	},
	methods: {
		switchTab(e) {
			const data = e.currentTarget.dataset
			const url = data.path
			wx.switchTab({
				url
			})
			console.log("切换tab-index:" + JSON.stringify(data))
			this.setData({
				selected: data.index
			})
		}
	},
})