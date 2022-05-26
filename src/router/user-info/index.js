
import * as User from './path';
export default [
	{
	    path: '/user-info',
	    name: 'user-info',
	    component: User.userInfo,
	    meta:{
	      keepAlive:false
	    }
	},
]
