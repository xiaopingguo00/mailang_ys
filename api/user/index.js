import {
	httpReq

} from "../../utils/utils.js"; //根据ID获取场馆信息

export function login(data) {
	return httpReq({
		url: "api/auth/getopenid",
		method: "post",
		data
	});
}

//绑定手机
export function bindMobile(data) {
	return httpReq({
		url: "api/auth/bindMobile",
		method: "get",
		data
	});
}
//绑定手机
export function miaoShaBuy(data) {
	return httpReq({
		url: "api/buy/add",
		method: "get",
		data
	});
}
//检测用户信息
export function getisuser(data) {
	return httpReq({
		url: "api/auth/getisuser",
		method: "get",
		data
	});
}

//后去验证码
export function sencodes(data) {
	return httpReq({
		url: "api/auth/sencodes",
		method: "get",
		data
	});
}

//我的收藏
export function myCollect(data) {
	return httpReq({
		url: "api/collect/list",
		method: "get",
		data
	});
}

//new---------------------------------------
export function getUser(data) {
	return httpReq({
		url: "user/getuser",
		method: "get",
		data
	});
}
export function updateUser(data) {
	return httpReq({
		url: "user/updateuser",
		method: "post",
		data
	});
}
//新接口
export function clearUser(data) {
	return httpReq({
		url: "user/delete",
		method: "get",
		data
	});
}
//添加分成
export function addshopincome(data) {
	return httpReq({
		url: "shopincome/addshopincome",
		method: "post",
		data
	});
}
//查询收益情况
export function getcashamount(data) {
	return httpReq({
		url: "cashamount/getcashamount",
		method: "get",
		data
	});
}
//更新分成
export function updateshopincome(data) {
	return httpReq({
		url: "shopincome/updateshopincome",
		method: "post",
		data
	});
}
//提现
export function tixian(data) {
	return httpReq({
		url: "cashamount/paycashamount",
		method: "post",
		data
	});
}
//查询分成
export function getshopincome(data) {
	return httpReq({
		url: "shopincome/getshopincome",
		method: "get",
		data
	});
}
export function addShop(data) {
	return httpReq({
		url: "shop/addshop",
		method: "post",
		data
	});
}
export function getShopByUserId(data) {
	return httpReq({
		url: "shop/getshop",
		method: "get",
		data
	});
}
export function querySingin(data) {
	return httpReq({
		url: "signin/getsong",
		method: "get",
		data
	});
}
export function addsignin(data) {
	return httpReq({
		url: "signin/addsignin",
		method: "post",
		data
	});
}
export function getShopByShopId(data) {
	return httpReq({
		url: "shop/getshop",
		method: "get",
		data
	});
}



export function updateSinger(data) {
	return httpReq({
		url: "user/updatesinger",
		method: "post",
		data
	});
}
export function updateShop(data) {
	return httpReq({
		url: "shop/updateshop",
		method: "post",
		data
	});
}export function getShop(data) {
	return httpReq({
		url: "shop/getshop",
		method: "get",
		data
	});
}
export function getOssAccessToken(data) {
	return httpReq({
		url: "upload/getOssAuthorization",
		method: "get",
		data
	});
}
export function getShopSigninList(data) {
	return httpReq({
		url: "signin/getusersigninlist",
		method: "get",
		data
	});
}

export function getBangDan(data) {
	return httpReq({
		url: "user/getUserSeniorityList",
		method: "get",
		data
	});
}
export function getSingerList(data) {
	return httpReq({
		url: "user/getPerformanceList",
		method: "post",
		data
	});
}
//收益列表
export function getMoneyList(data) {
	return httpReq({
		url: "cashamount/getusersigninlist",
		method: "get",
		data
	});
} //歌单列表
export function getsonglist(data) {
	return httpReq({
		url: "song/getsonglist",
		method: "get",
		data
	});
}
//歌单列表
export function getsong(data) {
	return httpReq({
		url: "song/getsong",
		method: "get",
		data
	});
}
//删除歌曲
export function deletesong(data) {
	return httpReq({
		url: "song/deletesong",
		method: "get",
		data
	});
}
//创建订单
export function createOrder(data) {
	return httpReq({
		url: "order/addorder",
		method: "post",
		data
	});
}
//创建订单
export function createSongPrepay(data) {
	return httpReq({
		url: "pay/createapppayment",
		method: "post",
		data
	});
}

export function addSong(data) {
	return httpReq({
		url: "song/addsong",
		method: "post",
		data
	});
}

export function updateSong(data) {
	return httpReq({
		url: "song/updatesong",
		method: "post",
		data
	});
}

//收益列表
export function getusersigninlist(data) {
	return httpReq({
		url: "cashamount/getusersigninlist",
		method: "get",
		data
	});
}