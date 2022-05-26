import { POWER } from './config.js'

/*
* 唤醒权限
*/
const
power = {
	androidPower:() => {
		plus.android.requestPermissions( POWER, onSuccess, onError);
	},
}

export default power;

function onSuccess( e ){
	console.log( '成功！' )
}

function onError( e ){
	console.log( '失败！' )
}








