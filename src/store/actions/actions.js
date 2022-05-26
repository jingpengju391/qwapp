import { SET_LOGIN_INFO, SET_USER_ASYN, SET_IMLIST, SET_CHAT_OBJ, SET_UP_DATA, SET_UP_AUDIO } from '../constants/actions_type.js';
export { SET_LOGIN_INFO, SET_USER_ASYN, SET_IMLIST, SET_CHAT_OBJ, SET_UP_DATA, SET_UP_AUDIO }

import api from '../../api';
import router from '../../router';
import storage from '../../utils/storage';
import NIM from '../../utils/nim/index.js';

export default {
	async [SET_USER_ASYN]({
		commit,
		state:{
		  user
		}
	}){
		const 
		apistr = user.phone ? 'dengluphone' : 'login',
		res = await api._start.login[apistr]( user );
		
		let users = {};
		
		res.status == '1' ? users = res : '';
		
		commit('setUser', users);
		
		storage.set('user',users);
		
		res.status == '1' && NIM.initNIM();
		
		return res;
		
	},
	[SET_LOGIN_INFO]({
	  commit
	}, user){
	  commit('setUser', user);
	},
	[SET_IMLIST]({
	  commit
	}, msg, boo){
	  commit('setImList', msg);
	},
	[SET_CHAT_OBJ]({
	  commit
	}, str){
	  commit('setObj', str);
	},
	[SET_UP_DATA]({
	  commit
	}, obj){
	  commit('upData', obj);
	},
	[SET_UP_AUDIO]({
	  commit
	}, obj){
	  commit('upAudio', obj);
	}
}