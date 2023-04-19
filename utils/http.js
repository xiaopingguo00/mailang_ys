// const server = "http://localhost:3000/api"//这是我要请求的数据接口的公共部分

const app = getApp();
const server = app.globalData.global_path;

export default {
		
	post:(_url,data)=>{
		
		return new Promise((resolve,reject) => {
			   wx.request({
			     url: server+_url,
			     method:'post',
			     data:data,
				 headers: {
				     TOKEN: app.globalData.TOKEN
				 },
			     success:(res)=>{
					 
					 if(res.errno==1){
						 wx.showToast({
						     title:res.data.errmsg,
						 	icon:"none",
						     duration: 2500
						 });
						  reject(res.data)
					 }else{
						 resolve(res.data) 
					 }
					 
					
					 
				 },
			     fail:(req)=>{
					  wx.hideLoading();
					  reject(req)
				  }
			   })
			
			
		})
		
		
	}	,
	get:(_url,data)=>{
		
		return new Promise((resolve,reject) => {
			   wx.request({
			     url: server+_url,
			     method:'get',
			     data:data,
				 headers: {
				     TOKEN: app.globalData.TOKEN
				 },
			     success:(res)=>{
					 
					 if(res.data.errno==1){
						 wx.showToast({
						     title:res.data.errmsg,
							 icon:"none",
						     duration: 2500
						 });
						  reject(res.data)
					 }else{
						 resolve(res.data) 
					 }
					 
					
					 
				 },
			     fail:(req)=>{
					  wx.hideLoading();
					  reject(req)
				  }
			   })
			
			
		})
		
		
	}	


	
	
	
}