

const app = getApp();
const baseUrl = app.globalData.global_path;
const baseUrl2 = app.globalData.global_login_path;
const xikeUrl = app.globalData.xike_path;
const utils = require('../utils/utils');
/*
 * Promise封装请求
 */

export function httpReq(params, noString) {
    return new Promise(function(resolve, reject) {
        // 为了妥协后端post请求还要拼接参数的代码
        let sbData = "";
        sbData = Object.keys(params.data ? params.data : {}).reduce(
            (prev, key, index) => {
                return `${prev}${index == 0 ? "?" : "&"}${key}=${
                    params.data[key]
                }`;
            },
            ""
        );
        let url = noString
            ? baseUrl + params.url
            : baseUrl + params.url + encodeURI(sbData); // 为了妥协后端 post 请求 还要拼接参数的 代码

        wx.request({
            url,
            method: params.method,
            headers: {
                TOKEN: app.globalData.TOKEN
            },
            
            data: params.data,
            success: res => {
                if (res.data.errno == 0 || res.data.code == 1) {
                    resolve(res.data);
                } else if (res.data.success == "T") {
                    resolve(res.data);
                } else if (res.data.code == 0) {
									console.log("ddd")
									reject(res.data);
							} else if (res.data.errno == 403) {
                    wx.navigateTo({
                        url: "/subPackage/pages/user/loginPhone/loginPhone"
                    });
                } else if (res.data.errno == 603) {
                    reject(res.data);
                } else if (res.data.errno == 406 || res.data.errno == 410) {
                    // token 过期406
                    if (app.globalData.isShop) {
                        wx.redirectTo({
                            url: "/subPackage/pages/user/login/login"
                        });

                        reject(res.data);
                    } else {
                        app.globalData.TOKEN = "";
                        app.globalData.userInfo = "";
                        app.getUserInfo(() => {
                            app.globalData.isLoginType = false;
                            reject(res.data);
                        });
                        // if (!app.globalData.isLoginType) {
                        //     app.globalData.isLoginType = true;
                        // }
                    }
                } else if(res.data.errno ==1){
                    utils.showToast(res.data.errmsg)
                     // setTimeout(()=>{
                    // my.showToast({
                    //   content: res.data.data,
                    //   duration: 2000
                    // });
                    // },100)

                    // wx.alert({
                    //     title: '提示',
                    //     content: res.data.message,
                    //     buttonText: "我知道了"
                    // });

                    reject(res.data);
                }
            },
            fail: res => {
								reject(res.data);
								console.log(res.msg)
            }
        });
    });
}
export function httpReq4(params, noString) {
    return new Promise(function(resolve, reject) {
        // 为了妥协后端post请求还要拼接参数的代码
        let sbData = "";
        sbData = Object.keys(params.data ? params.data : {}).reduce(
            (prev, key, index) => {
                return `${prev}${index == 0 ? "?" : "&"}${key}=${
                    params.data[key]
                }`;
            },
            ""
        );
        let url = noString
            ? baseUrl + params.url
            : baseUrl + params.url + encodeURI(sbData); // 为了妥协后端 post 请求 还要拼接参数的 代码

        wx.request({
            url,
            method: params.method,
            headers: {
                TOKEN: app.globalData.TOKEN
            },
            data: params.data,
            success: res => {
                if (res.data.errno == 200) {
                    resolve(res.data);
                } else if (res.data.success == "T") {
                    resolve(res.data);
                } else if (res.data.errno == 403) {
                    wx.navigateTo({
                        url: "/subPackage/pages/user/login2/login2"
                    });
                } else if (res.data.errno == 603) {
                    reject(res.data);
                } else if (res.data.errno == 406 || res.data.errno == 410) {
                    // token 过期406
                    if (app.globalData.isShop) {
                        wx.redirectTo({
                            url: "/subPackage/pages/user/login/login"
                        });

                        reject(res.data);
                    } else {
                        app.globalData.TOKEN = "";
                        app.globalData.userInfo = "";

                        if (!app.globalData.isLoginType) {
                            app.globalData.isLoginType = true;
                            app.getUserInfo(() => {
                                app.globalData.isLoginType = false;
                                reject(res.data);
                            });
                        }
                    }
                } else {
                    wx.hideLoading(); // setTimeout(()=>{
                    // my.showToast({
                    //   content: res.data.data,
                    //   duration: 2000
                    // });
                    // },100)

                    // wx.alert({
                    //     title: "提示",
                    //     content: res.data.message,
                    //     buttonText: "我知道了"
                    // });

                    reject(res.data);
                }
            },
            fail: res => {
                reject(res.data);
            }
        });
    });
}
export function httpReq3(params, noString) {
    return new Promise(function(resolve, reject) {
        // 为了妥协后端 post 请求 还要拼接参数的 代码
        let sbData = "";
        sbData = Object.keys(params.data ? params.data : {}).reduce(
            (prev, key, index) => {
                return `${prev}${index == 0 ? "?" : "&"}${key}=${
                    params.data[key]
                }`;
            },
            ""
        );
        let url = noString
            ? baseUrl + params.url
            : baseUrl + params.url + encodeURI(sbData); // 为了妥协后端 post 请求 还要拼接参数的 代码

        wx.request({
            url,
            method: params.method,
            headers: {
                TOKEN: app.globalData.TOKEN
            },
            data: params.data,
            success: res => {
                console.log("nick---errno" + res.data.errno);

                if (res.data.success == "T") {
                    resolve(res.data);
                } else {
                    wx.showToast({
                        content: `资讯获取失败`,
                        duration: 2000
                    });
                }
            },
            fail: res => {
                reject(res.data);
            }
        });
    });
}
/*
 * Promise封装请求
 */

export function httpReq2(params, noString) {
    return new Promise(function(resolve, reject) {
        // 为了妥协后端 post 请求 还要拼接参数的 代码
        let sbData = "";
        sbData = Object.keys(params.data ? params.data : {}).reduce(
            (prev, key, index) => {
                return `${prev}${index == 0 ? "?" : "&"}${key}=${
                    params.data[key]
                }`;
            },
            ""
        );
        let url = noString
            ? baseUrl2 + params.url
            : baseUrl2 + params.url + encodeURI(sbData); // 为了妥协后端 post 请求 还要拼接参数的 代码

        wx.request({
            url,
            method: params.method,
            headers: {
                TOKEN: app.globalData.TOKEN
            },
            data: params.data,
            success: res => {
                if (res.data.errno === 200) {
                    resolve(res.data);
                } else if (res.data.errno === 406) {
                    // token 过期406
                    if (app.globalData.isShop) {
                        wx.redirectTo({
                            url: "/subPackage/pages/user/login/login"
                        });
                    } else {
                        app.globalData.TOKEN = "";
                        app.globalData.userInfo = "";
                        app.getUserInfo(() => {
                            reject(res.data);
                        });
                    }
                } else if (res.data.errno === 408) {
                    // token 换token 408
                    if (app.globalData.isShop) {
                        app.globalData.TOKEN = res.data.data;

                        wx.setStorage({
                            key: "shopToken",
                            data: {
                                TOKEN: app.globalData.TOKEN,
                                isShop: app.globalData.isShop,
                                sys: app.globalData.sys
                            }
                        });

                        reject(res.data);
                    } else {
                        app.getUserInfo(() => {
                            reject(res.data);
                        });
                    }
                } else {
                    wx.hideLoading();

                    wx.showToast({
                        content: res.data.message,
                        duration: 2000
                    });

                    reject(res.data);
                }
            },
            fail: res => {
                reject(res.data);
            }
        });
    });
}
/*
 * 转换时间戳
 */

export function formatDate(date, fmt) {
    date = new Date(date);

    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(
            RegExp.$1,
            (date.getFullYear() + "").substr(4 - RegExp.$1.length)
        );
    }

    let o = {
        "M+": date.getMonth() + 1,
        "d+": date.getDate(),
        "h+": date.getHours(),
        "m+": date.getMinutes(),
        "s+": date.getSeconds()
    }; // 遍历这个对象

    for (let k in o) {
        if (new RegExp(`(${k})`).test(fmt)) {
            let str = o[k] + "";
            fmt = fmt.replace(
                RegExp.$1,
                RegExp.$1.length === 1 ? str : padLeftZero(str)
            );
        }
    }

    return fmt;
}
function padLeftZero(str) {
    return ("00" + str).substr(str.length);
}
/*
 * 本月从今天到1号的日期list
 */

export function getThisMonthDay(date) {
    let now = new Date(parseInt(date)),
        newList = [],
        y = now.getFullYear(),
        m = ("0" + (now.getMonth() + 1)).slice(-2),
        d = ("0" + now.getDate()).slice(-2);

    for (let i = 1; i <= d; i++) {
        let item = {
            day: `${y}-${m}-${i}`
        };

        if (i < 10) {
            item = {
                day: `${y}-${m}-0${i}`
            };
        }

        newList.push(item);
    }

    return newList;
}

//获取当天yyyy-MM-DD
export function getTodayYYYY() {
	var myDate = new Date((new Date).getTime() + 8*60*60*1000);
	var time = myDate.toJSON().split('T').join(' ').substr(0,10);
	return time;
}

/*
 * 显示 loading
 */

export function showLoading() {
    wx.showLoading({
        content: "加载中..."
    });
}
/*
 * 隐藏 loading
 */

export function hideLoading() {
    wx.hideLoading();
}
/*
 * 弱提示
 */

export function showToast(text) {
    wx.showToast({
        title: text,
        duration: 2500,
        icon: 'none'
    });
    // wx.showToast({
    //   title: 'title',
    // })
}
/*
 * 没有网
 */

export function netWorkFun(that, boole) {
    that.setData({
        netWork: boole
    });
}
/*
 * 转换单位
 */

export function changeDistance(distance) {
    if (parseInt(distance) > 1000) {
        return (distance / 1000).toFixed(1) + "km";
    } else {
        return distance + "m";
    }
}

function Rad(d) {
    return (d * Math.PI) / 180.0; //经纬度转换成三角函数中度分表形式。
} //计算距离，参数分别为第一点的纬度，经度；第二点的纬度，经度

export function GetDistance(lat1, lng1, lat2, lng2) {
    var radLat1 = Rad(lat1);
    var radLat2 = Rad(lat2);
    var a = radLat1 - radLat2;
    var b = Rad(lng1) - Rad(lng2);
    var s =
        2 *
        Math.asin(
            Math.sqrt(
                Math.pow(Math.sin(a / 2), 2) +
                    Math.cos(radLat1) *
                        Math.cos(radLat2) *
                        Math.pow(Math.sin(b / 2), 2)
            )
        );
    s = s * 6378.137; // EARTH_RADIUS;

    s = Math.round(s * 10000) / 10000; //输出为公里

    s = s.toFixed(2);

    if (s > 1) {
        s = s + "km";
    } else if (s < 1) {
        s = s * 1000 + "m";
    }

    return s;
}
/*
 * 转移符
 */

export function escape2Html(str) {
    var arrEntities = {
        lt: "<",
        gt: ">",
        nbsp: " ",
        amp: "&",
        quot: '"',
        ldquo: "“",
        rdquo: "”",
        ndash: "-",
        mdash: "——",
        times: "x",
        yen: "¥",
        Oslash: "Ø",
        hellip: "...",
        le: "≤",
        middot: "·",
        lsquo: "’",
        rsquo: "’"
    };
    return str.replace(
        /&(lt|gt|nbsp|amp|quot|ldquo|rdquo|ndash|mdash|times|yen|Oslash|hellip|le|middot|lsquo|rsquo);/gi,
        function(all, t) {
            return arrEntities[t];
        }
    );
}
export function checkPhone(phone){ 
    
    if(!(/^1[3|4|5|7|8]\d{9}$/.test(phone))){ 
       
        return false; 
    } else{
        return true
    }
}
export function formatToDay(times)    {
    let date = new Date(times)
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    return year+"年"+month+"月"+day+"日"
  }
export function formatTime(times)    {
    let date = new Date(times)
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    const hour = date.getHours()
    const minute = date.getMinutes()
    const second = date.getSeconds()
  
    return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
  }
  const formatNumber = n => {
    n = n.toString()
    return n[1] ? n : '0' + n
  }
  
export function check_id(value) {
    var arrExp = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2]; //加权因子

    var arrValid = [1, 0, "X", 9, 8, 7, 6, 5, 4, 3, 2]; //校验码

    if (/^\d{17}\d|x$/i.test(value)) {
        var sum = 0,
            idx;

        for (var i = 0; i < value.length - 1; i++) {
            // 对前17位数字与权值乘积求和
            sum += parseInt(value.substr(i, 1), 10) * arrExp[i];
        } // 计算模（固定算法）

        idx = sum % 11; // 检验第18为是否与校验码相等

        return arrValid[idx] == value.substr(17, 1).toUpperCase();
    } else {
        return false;
    }
} //根据时间判断星期几

export function getWeek(timedat) {
    //timedat参数格式：   getWeek（new Date("2017-10-27" )）
    var week;
    if (timedat.getDay() == 0) week = "星期日";
    if (timedat.getDay() == 1) week = "星期一";
    if (timedat.getDay() == 2) week = "星期二";
    if (timedat.getDay() == 3) week = "星期三";
    if (timedat.getDay() == 4) week = "星期四";
    if (timedat.getDay() == 5) week = "星期五";
    if (timedat.getDay() == 6) week = "星期六";
    return week;
} // JS`正则表达式`获取地址栏url参数：

export function getUrlParam(name, url) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); // 构造一个含有目标参数的正则表达式对象

    var r = url.substr(1).match(reg); // 匹配目标参数

    if (r != null) return unescape(r[2]);
    return null; // 返回参数值
} // 调用方法
