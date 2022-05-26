// 模板过滤器
const
filter = {
	// 时间戳转换年月日时分秒格式
	dateFormat:timestamp => {
		let date = new Date();
		let Y = date.getFullYear() + '-';
		let M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
		let D = (date.getDate() < 10 ? '0'+date.getDate() : date.getDate()) + ' ';
		let h = (date.getHours() < 10 ? '0'+date.getHours() : date.getHours()) + ':';
		let m = (date.getMinutes() < 10 ? '0'+date.getMinutes() : date.getMinutes()) + ':';
		let s = (date.getSeconds() < 10 ? '0'+date.getSeconds() : date.getSeconds());
		timestamp = Y+M+D+h+m+s;
		return timestamp;
	},
	// 时间戳转换年月日时分秒格式
	date:timestamp => {
		let date = new Date();
		let Y = date.getFullYear() + '/';
		let M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '/';
		let D = (date.getDate() < 10 ? '0'+date.getDate() : date.getDate()) + ' ';
		let h = (date.getHours() < 10 ? '0'+date.getHours() : date.getHours()) + ':';
		let m = (date.getMinutes() < 10 ? '0'+date.getMinutes() : date.getMinutes()) + ':';
		let s = (date.getSeconds() < 10 ? '0'+date.getSeconds() : date.getSeconds());
		timestamp = Y+M+D;
		return timestamp;
	},
	// 数量转换999+
	greaterThan : num => {
		if( num >= 1000 ){
			return '999+'
		}else{
			return num
		}
	},
	// 数量转换999+
	on : data => {
		if( data ){
			return data
		}else{
			return '--'
		}
	}
}

export default filter;











