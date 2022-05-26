import Vue from 'vue';
import Router from 'vue-router';
// 管理路由

import start from './start';
import views from './views';
const originalPush = Router.prototype.push
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}

Vue.use(Router);
const Routers = new Router({
    routes:[
		...start,
		...views
    ]
});

export default Routers;