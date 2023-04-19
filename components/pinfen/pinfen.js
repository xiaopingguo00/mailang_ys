Component({
    properties: {
        /**
         * 组件大小
         * small: 小
         * normal: 正常
         * large: 大
         */
        starSize: {
            type: String,
            value: 'normal'
        },
        // 评分值
        score: {
            type: Number,
            value: 0
        },
          // 评分值
          index: {
            type: Number,
            value: 0
        },
        // 同时使用多个组件,事件监听的方法名
        starIdx: {
            type: String,
            value: 'I'
        },
        // 是否可评分
        gradable: {
            type: Boolean,
            value: false
        }
    },
    data: {
        star: [{
                id: 1
            },
            {
                id: 2
            },
            {
                id: 3
            },
            {
                id: 4
            },
            {
                id: 5
            }
        ],
        defaultSrc: '/images/rate_gray.png',
        activeSrc: '/images/rate_light.png'
    },
    // 组件生命周期
    lifetimes: {
        attached() {

        },
        detached() {

        }
    },
    // 兼容v2.2.3以下写法
    attached() {

    },
    // 挂载页面的生命周期
    pageLifetimes: {

    },
    methods: {
        grade(e) {
            // 如果只是展示分值，就屏蔽评分
            
            if(this.data.gradable){
                this.setData({
                    score: e.currentTarget.dataset.index
                }, () => {
                    const scoreDetail = {
                        score: e.currentTarget.dataset.index,
                        index:this.data.index
                    };
                    let evenName = 'getscore' + this.data.starIdx;
                    console.log("bbb")
                    this.triggerEvent('getscore', scoreDetail)
                })
            }
           
        }
    }
})