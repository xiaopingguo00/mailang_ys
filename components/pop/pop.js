Component({
  properties: {
    isShow: {//false:弹出框消息  true:弹出框显示
      value: false,
      type: Boolean
    },
    contentStr:{//弹出框需要显示的内容
      value: '内容',
      type: String,
    },
    btnStr:{//按钮文本(可进行自行扩展两个按钮)
      value: '确定',
      type: String,
    }
  },
  data: {
    timeId: null,//弹出框消息倒计时标识
  },
  // observers: {//监听isShow属性的变化，来进行判断是否显示弹出框
  //   "isShow": function (value) {
  //     clearTimeout(this.data.timeId);
  //     if (value) {
  //       this.data.timeId = setTimeout(() => {
  //         this.setData({
  //           isShow: false,
  //         });
  //       }, 2000);
  //     }
  //   }
  // },
  methods: {
    hideClick() {//点击弹出框的任意位置进行点击事件的传递，从而修改isShow的值，来控制弹出框消失
	 console.log("点击内环")
		this.triggerEvent('clickDialog', {
        isShow: false
      });
      clearTimeout(this.data.timeId);
	},
	close() {//点击弹出框的任意位置进行点击事件的传递，从而修改isShow的值，来控制弹出框消失
		console.log("点击外环")
		  this.setData({
			isShow:false
		  })
	   }
  },
})