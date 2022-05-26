import store from '../store';

/**
 * 判断是pc端和移动端
 * @returns {RegExpMatchArray}
 */
export function isMobile() {
    let flag = navigator.userAgent.match(
        /(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i
    );
    return flag;
}


export function changeDate(fDate) {
    let dateee = new Date(fDate).toJSON()
    let date = new Date(+new Date(dateee) + 8 * 3600 * 1000).toISOString().replace(/T/g, ' ').replace(/\.[\d]{3}Z/, '')
    return date
}

export function getShortDate(date) {
    const y = date.getFullYear();
    let m = date.getMonth() + 1;
    m = m < 10 ? ('0' + m) : m;
    let d = date.getDate();
    d = d < 10 ? ('0' + d) : d;
    //  getDay()返回表示星期的某一天的数字。返回值是 0（周日） 到 6（周六） 之间的一个整数。
    let h = date.getHours();
    h = h < 10 ? ('0' + h) : h;
    let minute = date.getMinutes();
    minute = minute < 10 ? ('0' + minute) : minute;
    return  y + '-' + m + '-' + d;
}

export function timeConvert(timestamp,num){//num:0 YYYY-MM-DD  num:1  YYYY-MM-DD hh:mm:ss // timestamp:时间戳 
            timestamp = timestamp+'';
            timestamp = timestamp.length==10?timestamp*1000:timestamp;
            var date = new Date(timestamp);
            var y = date.getFullYear();  
            var m = date.getMonth() + 1;  
            m = m < 10 ? ('0' + m) : m;  
            var d = date.getDate();  
            d = d < 10 ? ('0' + d) : d;  
            var h = date.getHours();
            h = h < 10 ? ('0' + h) : h;
            var minute = date.getMinutes();
            var second = date.getSeconds();
            minute = minute < 10 ? ('0' + minute) : minute;  
            second = second < 10 ? ('0' + second) : second; 
            if(num==0){
                return y + '-' + m + '-' + d;  
            }else{
                return y + '-' + m + '-' + d +' '+ h +':'+ minute +':' + second;  
            }
}

export function getCurrentDate(dd) {
    let date = dd ? dd : new Date();
    const y = date.getFullYear();
    let m = date.getMonth() + 1;
    m = m < 10 ? ('0' + m) : m;
    let d = date.getDate();
    d = d < 10 ? ('0' + d) : d;
    //  getDay()返回表示星期的某一天的数字。返回值是 0（周日） 到 6（周六） 之间的一个整数。
    let h = date.getHours();
    h = h < 10 ? ('0' + h) : h;
    let minute = date.getMinutes();
    minute = minute < 10 ? ('0' + minute) : minute;
    return  y + '-' + m + '-' + d + " " + h + ':' + minute;
}

export function getCurrentStamp(dd) {
    let d = new Date(dd);
	return d.getTime()
}

// 时间戳转换  昨天，今天，刚刚 ，年月日（/,/,/）
export function timestampFormat( time2 ) {
	
	let minute = 1000 * 60;
	let hour = minute *60;
	let day = hour *24;
	let week = day * 7;
	let month = day * 30;
	
	let time1 = new Date().getTime();//当前的时间戳

	let time = time1 - time2;
		
	let result = null;
	if(time < 0){
	    // alert("设置的时间不能早于当前时间！");
	}else if(time/month >= 1){
	    result = parseInt(time/month) + "月前";
	}else if(time/week >= 1){
	    result = parseInt(time/week) + "周前";
	}else if(time/day >= 1){
	    result = parseInt(time/day) + "天前";
	}else if(time/hour >= 1){
	    result = parseInt(time/hour) + "小时前";
	}else if(time/minute >= 1){
	    result = parseInt(time/minute) + "分钟前";
	}else {
	    result = "刚刚";
	}
	
	return result
}

// 打电话
export function callPhone( tel ){
	
	plus.device.setVolume(1);
	//调用此方法获取程序是否一致保持唤醒状态。
	plus.device.isWakelock();
	//设置设备常亮
	plus.device.setWakelock( true );
	//设置震动事件单位为毫秒
	plus.device.vibrate( 1 );
	//拨打电话，第一个参数为电话号码，第二个true则打开拨打电话界面，如果false则直接拨打
	plus.device.dial(tel,false);
	
}


// 支付

export function onPayment( info, callback ){
	let channel;
	let payId = 'wxpay';
	plus.payment.getChannels(function(channels) {
	    
		
		for (var i in channels) {
		    if (channels[i].id == payId) {
		        channel = channels[i];
		    } 
		}
		
		plus.payment.request(channel, info , function(result) {
			
			callback();
		    
		}, function(e) { 
			
		    // plus.nativeUI.alert('应用签名错误' + e.code); 
			
		});
		
	}, function(e) {
		
		plus.nativeUI.alert('应用只支持微信支付' + e.code); 
		
	});
}

// 设置应用图表消息提醒
export function setBadge() {
	
	if( !plus ) return false;
	
	const oChat = store.state.oChat
	let
	arr = [],
	obj = JSON.parse(JSON.stringify(oChat));
	
	// 取出数组序列
	for(let key in obj){
		arr = [...arr, obj[key]]
	}
	
	
	let arr2 = [];
	
	// 过滤掉发出信息 , 并将json串转换成json对象
	arr.forEach(item => {
		
		let arr3 = [];
		
		item.forEach((iter, index) => {
		
			if( iter.flow == "in" ){
				
				arr3 = [...arr3,iter]
				 
			}
		})
		
		arr2 = [...arr2, arr3]
		
	})
	
	let arr4 = [];
	
	// 聊天记录倒序并取最新一条放进list里
	arr2.forEach(item => {
		if( item.length > 0 ){
			item.forEach(iter => {
				!iter.unread ? arr4 = [...arr4,iter] : ''
			})
		}
	})
	
	plus.runtime.setBadgeNumber(arr4.length);
	
}
