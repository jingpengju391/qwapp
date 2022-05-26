import router from '../router';
import store from '../store';
import storage from '../utils/storage';
import NIM from '../utils/nim';
import { Dialog, Toast } from "vant";

/*
* 路由器过滤
*/
const
filter = {
  routrtFilter:() => {
    router.beforeEach(async (to, from, next)=>{
       const 
	   CURRROUTER = from.name,
	   USERLOC = storage.get('user');
	  
	   if( CURRROUTER == '/login' ){
				
			const {
				msg,
				status
			} = await store.dispatch('setUser');
			
			if( status == '1' ){
				
				storage.set('chat',true)
				
				next();
				
			}else{
				to.path =='/login' && next() 
				to.path !='/login' && ( Toast(msg), next(error) )
			}
			
			next();
		   
	   }else if( !CURRROUTER ){
		   
			USERLOC && store.dispatch("setLoginInfo",USERLOC)
			USERLOC && NIM.initNIM()
			
	   }
	   next()
	   
    });
    router.afterEach(() => {
		
		storage.set('currURL',router.currentRoute.name);
		
    })
	
  },
}

export default filter;








