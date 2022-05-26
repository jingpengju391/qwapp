import Vue from 'vue';
import Vant from 'vant';
import { Lazyload } from 'vant';
import VueAwesomeSwiper from 'vue-awesome-swiper'
import Mui from 'vue-awesome-mui'
import store from './store';
import App from './App.vue';
import router from './router';
import api from './api';
import filter from './utils/filter';
import filters from "./utils/filters";
import verification from './utils/verification';
import map from './utils/map';
import "lib-flexible";

import 'vant/lib/index.css';
import 'swiper/css/swiper.css'
Vue.prototype.$api = api;
Vue.prototype.$map = map;
Vue.prototype.$verification = verification;

Vue.use(Vant);
Vue.use(Mui);
Vue.use(Lazyload);
Vue.use(VueAwesomeSwiper);
for (const key in filters) {
    Vue.filter(key, filters[key]);
}
Vue.config.productionTip = false

// 登录功能及路由过滤
filter.routrtFilter();
new Vue({
	router,
	store,
	render: h => h(App),
}).$mount('#app')
