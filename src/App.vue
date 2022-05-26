<template>
	<div id="app">
		<router-view></router-view>
	</div>
</template>

<script>
import storage from './utils/storage.js';
export default {
	name: 'App',
	data() {
		return {
			first:null,
		}
	},
	methods: {
		init(){
			mui.init({
				swipeBack: false, //关闭右滑关闭功能(默认就是false)
				keyEventBind: {
					backbutton: true //开启back按键监听( 默认就是true)
				}
			});
			this.onBack()
		},
		onBack(){
			const _this = this;
			mui.back = function() {
				//首次按键，提示 再按一次退出应用
				if ( !_this.first ) {
					_this.first = new Date().getTime(); //记录第一次按下回退键的时间
					_this.$router.go(-1); //回退到上一页面
					mui.toast("再按一次退出应用")
					setTimeout(function() {
						//1s中后清除
						_this.first = null;
					}, 1000);
				} else {
					
					if (new Date().getTime() - _this.first < 1000) {
						//如果两次按下的时间小于1s，
						plus.runtime.quit(); //那么就退出app
					}
					
				}
			};
		}
	},
	mounted() {
		this.init();
	}
}
</script>

<style>
	@import './assets/css/app.css';
</style>
