import jp from 'vue-jsonp';
import qs from 'qs';
// import { message } from 'antd';

const jsonp = ( url, data = {} ) => {

  url = `${url}?${qs.stringify(data)}`;
  
  return new Promise((resolve, reject) => {
    jp(url, ( err, data ) => {

      if( !err && data.status === 1000 ){
        resolve(data);
      }else{
        // 如果失败不调用reject，只提示异常信息
        // message.error('请求出错了！' + err);
      }

    })
  })
}

export default jsonp;

/*
jsonp解决ajax跨域请求
1.jsonp只能解决GET类型的ajax请求跨域问题
2.jsonp请求不是ajax请求，而是一般的get请求
3.基本原理
  浏览器端：
    动态生成<script>来请求后台接口（ src就是接口的url ）
    定义好用来接收相应数据的函数（ fn ），并将函数名通过请求参数提交给后台（ 如：callback = fn ）
  服务器端
    接收到请求处理产生结果数据后，返回一个函数调用的js代码，并将结果数据作为实参传入函数调用
  浏览器端
    收到响应自动执行函数调用的js代码（ 提前定义好的 callback ）并得到需要的结果数据
 */
