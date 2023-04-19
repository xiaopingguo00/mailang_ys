// const app = getApp();
Component({
	properties: {

	},
	data: {
		close: false,
		// 是否显示关闭按钮
		show: false,
		// 显示弹窗
		onDialogClose: false,
		className: ""
	},

	methods: {
		// 关闭前的回调
		onDialogClose() {
			this.setData({
				show: false
			});
			// app.globalData.modalReceive = false;
		}
	}
});