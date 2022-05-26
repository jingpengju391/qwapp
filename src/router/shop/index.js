import * as shopIndex from './path';
export default [
    {
        path: '/shop-detail',
        name: 'shop-detail',
        component: shopIndex.shopDetail,
        meta:{
          keepAlive:false
        }
    },
	{
	    path: '/shop-list',
	    name: 'shop-list',
	    component: shopIndex.shopList,
	    meta:{
	      keepAlive:false
	    }
	},
]
