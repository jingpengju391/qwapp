<template>
	<van-tabbar class="tabbar-n" v-model="active">
	  <van-tabbar-item 
		v-for="item in tabbar" 
		:key="item.key" 
		:name="item.key"
		:route="item.route"
		:to="item.to">
			<span>{{item.name}}</span>
		    <template #icon="props">
		      <img :src="props.active ? item.icon.inactive : item.icon.active" />
		    </template>
		</van-tabbar-item>
	</van-tabbar>
</template>

<script>
	export default {
		data() {
			return {
				active: 0,
				tabbar:[
					{
						name:'首页',
						key:0,
						route:true,
						to:'/index',
						icon: {
							active: require("../../assets/imgs/tabbar/icon-home.png"),
							inactive: require("../../assets/imgs/tabbar/icon-home-active.png"),
						},
					},
					{
						name:'趣味日记',
						key:1,
						route:true,
						to:'/diary',
						icon: {
							active: require("../../assets/imgs/tabbar/icon-diary.png"),
							inactive: require("../../assets/imgs/tabbar/icon-diary-active.png"),
						},
					},
					{
						name:'意中人',
						key:2,
						route:true,
						to:'/lover',
						icon: {
							active: require("../../assets/imgs/tabbar/icon-lover.png"),
							inactive: require("../../assets/imgs/tabbar/icon-lover-active.png"),
						},
					},
					{
						name:'个人中心',
						key:3,
						route:true,
						to:'/personal',
						icon: {
							active: require("../../assets/imgs/tabbar/icon-me.png"),
							inactive: require("../../assets/imgs/tabbar/icon-me-active.png"),
						},
					},
				]
			}
		},
		computed: {
			path: function () {
				return this.$route.path;
			},
		},
		methods: {
			// 设置当前路由
			setCurrRouter(){
				
				this.tabbar.forEach(item => item.to == this.path ? this.active = item.key : '')
				
			}
		},
		created(){
			this.setCurrRouter();
		},
		watch: {
			path: function(newVal, oldVal) {
				this.setCurrRouter();
			}
		}
	}
</script>
<style lang="scss" scoped>
	@import "~@/assets/css/mixin.scss";
	.tabbar-n{
		height: 55px;
		img{
			width: auto;
		}
		.van-tabbar-item{
			color: rgb(178, 176, 173);
		}
		.van-tabbar-item--active{
			color: rgb(255, 198, 101);
		}
	}
</style>
