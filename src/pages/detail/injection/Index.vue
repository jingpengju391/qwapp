<template>
	<div class="version-box">
		<div class="top-box">
			<img src="../../../assets/imgs/home-top__icon.png" alt="">
			<p>申请入驻</p>
			<span>{{serviceInfo.phone.beizhu}} : {{serviceInfo.phone.name}}</span>
			<span>{{serviceInfo.qq.beizhu}} : {{serviceInfo.qq.name}}</span>
		</div>
	</div>
</template>

<script>
	import { mapState } from "vuex";
	import { Dialog,　Toast } from "vant";
	export default {
		data() {
			return {
				serviceInfo:{
					phone:{},
					qq:{}
				}
			}
		},
		computed: {
			...mapState(['user']),
			_api: function () {
				return this.$api._views.personal;
			},
		},
		methods: {
			// 获取数据
			async getData(v){
				
				const
				params = {
					member_id:this.user.member_id
				},
				{
					data,
					status
				} = await this._api.kefu();
				
				if ( status !== '1' ) return false;
				
				this.serviceInfo = data;
				
			},
		},
		mounted(){
			this.getData();
		}
	}
</script>

<style lang="scss" scoped>
	@import "~@/assets/css/mixin.scss";
	.version-box{
		@include display-flex();
		@include flex-direction-column();
		width: 100%;
		.top-box{
			@include display-flex();
			@include justify-content();
			@include align-items(center);
			@include flex-direction-column();
			height: 50vh;
			width: 100%;
			background-color: #fff;
			img{
				width: 116px;
				margin-top: -30px;
			}
			p{
				font-size: 36px;
				color: #333;
				margin: 50px 0 10px 0;
			}
			span{
				color: rgb(170, 170, 170);
				font-size: 14px;
				margin-top: 15px;
			}
		}
	}
</style>
