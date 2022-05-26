import * as startRouter from './path';
import Storage from "../../utils/storage.js";
export default [
	{
	    // 登录
	    path: '/',
	    redirect: to => {
	        if (!Storage.get('user').member_id) return '/welcome'
	        if (!Storage.get('user').member_id) return '/login'
	        if (Storage.get('user').member_id) return '/index'
	    }
	},
	{
		path: '/welcome',
		name: '/welcome',
		component: startRouter.Welcome,
	},
	{
		path: '/login',
		name: '/login',
		component: startRouter.start,
	},
]
