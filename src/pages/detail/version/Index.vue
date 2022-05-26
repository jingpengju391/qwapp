<template>
	<div class="version-box">
		<div class="top-box">
			<img src="../../../assets/imgs/home-top__icon.png" alt="">
			<p>趣侣</p>
			<span>{{vInfon.version.beizhu}}{{vInfon.version.name}}</span>
		</div>
		<ul class="btm-box">
			<li @click="onSynopsis">
				<span>软件功能简介</span>
				<van-icon name="arrow" color="#969799" />
			</li>
			<li @click="onSoftUpdate">
				<span>检查更新</span>
				<van-icon name="arrow" color="#969799" />
			</li>
		</ul>
	</div>
</template>

<script>
	import { mapState } from "vuex";
	import { Dialog,　Toast } from "vant";
	export default {
		data() {
			return {
				vInfon:{
					version:{
						
					}
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
				} = await this._api.bbandxgn( params );
				
				if ( status !== '1' ) return false;
				
				this.vInfon = data;
				
				v ?　Toast.success('当前已经是最新版本')　:　''
				
			},
			// 软件功能简介
			onSynopsis(){
				Dialog.alert({
				  title: '软件功能简介',
				  message: this.vInfon.synopsis.name,
				}).then(() => {
				  // on close
				});
			},
			// 软件更新
			onSoftUpdate(){
				this.getData(1);
			}
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
			height: 40vh;
			width: 100%;
			background-color: #fff;
			img{
				width: 116px;
				margin-top: -30px;
			}
			p{
				font-size: 36px;
				color: #333;
				margin: 30px 0 10px 0;
			}
			span{
				color: rgb(170, 170, 170);
				font-size: 14px;
			}
		}
		.btm-box{
			@include display-flex();
			@include flex-direction-column();
			background-color: #fff;
			margin-top: 20px;
			font-size: 15px;
			color: #323233;
			padding-left: 20px;
			li{
				@include display-flex();
				@include align-items(center);
				@include justify-content_flex-justify()
				height: 48px;
				padding-right: 20px;
				border-bottom: 1px solid #ebedf0;
			}
			li:last-child{
				border-bottom: none;
			}
		}
	}
</style>
