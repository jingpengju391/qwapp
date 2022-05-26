import * as homeIndex from './path';
export default [
    {
        path: '/index',
        name: 'index',
        component: homeIndex.Home,
        meta:{
          keepAlive:false
        }
    },
	{
	    path: '/diary',
	    name: 'diary',
	    component: homeIndex.Diary,
	    meta:{
	      keepAlive:false
	    }
	},
	{
	    path: '/lover',
	    name: 'lover',
	    component: homeIndex.Lover,
	    meta:{
	      keepAlive:false
	    }
	},
	{
	    path: '/personal',
	    name: 'personal',
	    component: homeIndex.Personal,
	    meta:{
	      keepAlive:false
	    }
	},
]
