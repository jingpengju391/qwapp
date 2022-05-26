import SDK from './NIM_Web_SDK_v.js'
import config from "./config";
import store from "../../store";
import router from "../../router";
import Storage from '../storage'
import { setBadge } from '../conversion.js'
// 初始化IM SDK
console.log(store.state.user.accid)
console.log(store.state.user.member_token)
let 
NIM = {},
msg = {};
const NIMFC = {
	initNIM:_N => {
		NIM = SDK.NIM.getInstance({
		  debug: true,   // 是否开启日志，将其打印到console。集成开发阶段建议打开。
		  appKey: config.AppKye,
		  account: store.state.user.accid,
		  token: store.state.user.member_token,
		  db:true, //若不要开启数据库请设置false。SDK默认为true。
		  // privateConf: {}, // 私有化部署方案所需的配置
		  onconnect:onConnect,
		  onwillreconnect:onWillReconnect,
		  ondisconnect:onDisconnect,
		  onerror:onError,
		  onroamingmsgs: onRoamingMsgs,
		  onofflinemsgs: onOfflineMsgs,
		  onmsg: onMsg,
		});
	},
	onSendText:( msgtxt, accid, userInfo ) => {

		msg = NIM.sendText({
		    scene: 'p2p',
		    to: accid,
		    text: msgtxt,
			custom:{
				userHeader:userInfo.head_image,
				name:userInfo.nick_name,
				genderdata:userInfo.genderdata,
				id:userInfo.id
			},
		    done: sendMsgDone
		});
	},
	onSendFile:( Blob, accid, dur, long, userInfo) => {

		msg = NIM.sendFile({
		    scene: 'p2p',
		    to: accid,
			blob:Blob,
			custom:{
				time:dur,
				long:long,
				userHeader:userInfo.head_image,
				name:userInfo.nick_name,
				genderdata:userInfo.genderdata,
				id:userInfo.id
			},
		    done: sendMsgDone
		});
	},
	setConnect:_P => {
		setConnectFn( _P );
	},
	// 获取历史消息
	getHistoryMsgs: accid => {
		console.log(accid)
		msg = NIM.getHistoryMsgs({
		    scene: 'p2p',
		    to: accid,
			limit:20,
			asc:true,
		    done: getHistoryMsgsDone
		});
		
	},
};

export default NIMFC;

function onConnect(){
	// console.log('连接成功');
}

function onWillReconnect(){
	// 此时说明 SDK 已经断开连接, 请开发者在界面上提示用户连接已断开, 而且正在重新建立连接
	// console.log('退出登录')
}

function onDisconnect( error ){
	// 此时说明 SDK 处于断开状态, 开发者此时应该根据错误码提示相应的错误信息, 并且跳转到登录页面
	if (error) {
		switch (error.code) {
			// 账号或者密码错误, 请跳转到登录页面并提示错误
			case 302:
				break;
			// 重复登录, 已经在其它端登录了, 请跳转到登录页面并提示错误
			case 417:
				break;
			// 被踢, 请提示错误后跳转到登录页面
			case 'kicked':
				break;
			default:
				break;
		}
	}
}

// 发送消息
function sendMsgDone(error, msg){
	
	msg.etyle = false;
	store.dispatch("setIM", msg);
	
}
// 接受消息
function onMsg(msg) {
	
	const PATH = router.currentRoute.path;
    msg.etyle = false;
    store.dispatch("setIM", msg)
	
	if( PATH === '/chat' ){
		store.dispatch("setChatObj",msg.from);
		
	}else{
		setBadge();
	}
	
}

// 获取历史消息
function getHistoryMsgsDone(error, obj) {
    console.log("=====================================");
	console.log(obj);
	console.log("=====================================");
    // if (!error) {
    //     console.log(obj.msgs);
    // }
}
// 重新链接
function setConnectFn( _P ){
	
	_P ? NIM.connect() : NIM.disconnect();
	
}
// 收到漫游消息
function onRoamingMsgs(obj) {
    // console.log('收到漫游消息', obj);
}
// 收到离线消息
function onOfflineMsgs(obj) {
    // console.log('收到离线消息', obj);
}
// 链接错误
function onError(){
	console.log(error);
}

