/*
  1.能发送异步ajax请求的函数模块
  2.封装axios库
  3.函数的返回值是promise对象
*/

/*
  优化
  1.统一处理请求异常
   1.1在外层包一个promise对象
   1.2在请求出错时不去reject(error),去显示错误提示
  2.异步得到的不是 response，而是 response.data
    在请求成功 resolve 时：resolve( response.data )
*/

import axios from 'axios';
import qs from "qs";
import { Toast } from 'vant';
import router from '../router';

const BASE_URL = process.env.NODE_ENV !== "production"?"/api":"http://www.qulvyuefan.com";
// BASE_URL = "/api",
const
headers = {
  // "Accept":"application/json",
  "Content-Tupe":"application/x-www-form-urlencoded",
  // "X-Requested-With":"XMLHttpRequest"
},
$axios = axios.create({
  baseURL:BASE_URL,
  headers,
  timeout:50000,
  withCredentials:true
});
let
promise,
config = $axios.interceptors.request,
response = $axios.interceptors.response;
// 请求拦截器
config.use( config => {
	Toast.loading({
		mask: true,
		message: '加载中...'
	});	
	// 发送请求之前 设置token
	// const token = JSON.parse(sessionStorage.getItem("token"));
	// token && (config.headers.common["Authorization"] = `Bearer ${token}`);
	return config;

}, error =>{
  // 请求错误
  return Promise.reject(error);
})

// 响应拦截器
response.use( response => {
	Toast.clear()
	// 响应数据
	return response;
}, error =>{
	// 响应错误
	return Promise.reject(error);
})


// 请求数据
const ajax = (  url, data={}, method = 'GET', headers ) => {

    let dataUrl = {};

    dataUrl.method = method;

    method === 'GET' ? dataUrl.url = url+'?'+qs.stringify( data ) : ( dataUrl.url = url,dataUrl.data = data );

    return new Promise(resolve => {
        // 执行异步ajax请求
        const STARTTIME = new Date().getTime();

        promise = $axios( dataUrl );

        promise.then( response => {

            const ENDTIME = new Date().getTime();

            const TIMER = (ENDTIME-STARTTIME)/1000;

            let color = '#67d49d'

            TIMER > 0.5 ? color = '#E9694C' : '';

            console.log(`%c>> [ ${url} ] -- 耗时 --> [ ${(ENDTIME-STARTTIME)/1000} ] 秒`, `color: ${color};font-size:12px`)

            // 接口成功提示信息
            if( method === 'POST' ) {

              const MESSAGE = response.data.msg;

              if( response.data.status != '1' ){

                // 接口成功提示信息
                Toast.fail({
                    mask: true,
                    message: MESSAGE
                });
              }
            };


            // 如果成功调用resolve
            resolve( response.data );

        }).catch( error => {

          const MESSAGE = error.response.data.msg;

            // 接口成功提示信息
            Toast.fail({
                mask: true,
                message: MESSAGE
            });
			
			
			// 登陆超时 接口未返回
            if( error.response.data.code === 1 ){
              router.push({name:'start'})
              sessionStorage.removeItem("token")
            };

            // 如果失败不调用reject，只提示异常信息
            resolve( error.response.data );
        })
    })
}

export default ajax;
