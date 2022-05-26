<template>
	<div class="set-up">
		<ul class="btm-box">
			<li @click="showPop = true">
				<span>联系客户</span>
				<van-icon name="arrow" color="#969799" />
			</li>
			<li @click="feedBack = true">
				<span>意见反馈</span>
				<van-icon name="arrow" color="#969799" />
			</li>
		</ul>
		<ul class="btm-box">
			<li @click="onSignOut">
				<span>退出</span>
				<span></span>
			</li>
		</ul>
		
		<van-popup v-model="showPop" class="show-pop">
			<div class="con-box">
				<h6>联系客服</h6>
				<div class="c-box">
					<span>
						<i><img src="../../../assets/imgs/icon-qq.svg" alt=""></i>
						<em>{{serverInfo.qq.name}}</em>
					</span>
					<span @click="onCall">
						<i><img src="../../../assets/imgs/icon-tel.svg" alt=""></i>
						<em>{{serverInfo.phone.name}}</em>
					</span>
				</div>
				<span class="close-box" @click="showPop = false">确定</span>
			</div>
		</van-popup>
		<van-popup v-model="feedBack" class="show-pop feedBack-pop">
			<div class="con-box">
				<div class="c-box">
					<h6>意见反馈</h6>
					<van-icon name="cross" @click="feedBack = false" />
				</div>
				<van-field v-model="value" type="textarea" rows="5" :maxlength="200" placeholder="请输入反馈的信息" show-word-limit />
				<div class="c-box c-btn-box">
					<span class="close-box" @click="feedBack = false">取消</span>
					<span class="close-box" @click="toCheck">反馈</span>
				</div>
			</div>
		</van-popup>
	</div>
</template>

<script>
	import { mapState } from "vuex";
	import { Dialog,　Toast } from "vant";
	import storage from '../../../utils/storage.js'
	import { callPhone } from "../../../utils/conversion.js";
	export default {
		data() {
			return {
				serverInfo:{
					phone:{},
					qq:{}
				},
				showPop:false,
				feedBack:false,
				value:'',
				maxNum:0
			}
		},
		computed: {
			...mapState(['user']),
			_api: function () {
				return this.$api._views.personal;
			},
		},
		methods: {
			// 重置数据
			closeDialog(){
				Object.assign(this.$data, this.$options.data())
			},
			// 获取数据
			async getData(v){
				
				const
				{
					data,
					status
				} = await this._api.kefu();
				
				if ( status !== '1' ) return false;
				
				this.serverInfo = data;
				
			},
			// 拨打电话
			onCall(){
				callPhone(this.serverInfo.phone.name)
				this.showPop = false;
			},
			// 软件功能简介
			onSynopsis(){
			
			},
			// 退出
			onSignOut(){
				
				Dialog.confirm({
					title: '温情提示',
					message: '您确定要退出登陆吗？',
				})
				.then(() => {
					storage.remove('chat');
					storage.remove('user');
					storage.remove('currURL');
					this.$router.push('/login');
				})
				.catch(() => {
					
				});
				
			},
			// 打电话
            takePhone () {
                window.location.href = 'tel://' + this.serverInfo.phone.name
            },
			toCheck(){
				if( !this.value ){
					Toast('请输入反馈信息')
					return false;
				}
				this.onSubmit();
			},
			async onSubmit(){
				const
				params = {
					member_id:this.user.member_id,
					suggestion:this.value
				},
				{
					data,
					status
				} = await this._api.suggestion(params);
				
				if ( status == '1' ) {
					Toast('反馈信息已提交')
					this.feedBack = false;
				}
				
			}
		},
		mounted(){
			this.getData();
		},
		watch: {
			feedBack: {
				handler( val ) {
					!val ? this.closeDialog() : ''
				},
				deep: true
			}
		},
	}
</script>

<style lang="scss" scoped>
	@import "~@/assets/css/mixin.scss";
	.set-up{
		@include display-flex();
		@include flex-direction-column();
		width: 100%;
		.btm-box{
			@include display-flex();
			@include flex-direction-column();
			background-color: #fff;
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
		.btm-box:nth-child(2){
			margin-top: 20px;
		}
		.show-pop{
			@include display-flex();
			width: 100%;
			padding: 0 10%;
			background-color: transparent;
			.con-box{
				@include display-flex();
				@include flex-direction-column();
				width: 100%;
				background-color: #fff;
				padding: 0 35px;
				border-radius: 10px;
				h6{
					font-size: 26px;
					text-align: center;
					color: #182B33;
					font-weight: 500;
					line-height: 70px;
				}
				div.c-box{
					@include display-flex();
					@include align-items(center);
					@include justify-content_flex-justify();
					padding: 30px 0;
					border-top: 1px solid #ebedf0;
					border-bottom: 1px solid #ebedf0;
					span{
						@include display-flex();
						@include align-items(center);
						i{
							display: inline-block;
							width: 20px;
							height: 20px;
							margin-right: 10px;
							font-style: normal;
							img{
								display: inline-block;
								width: 100%;
							}
						}
						em{
							display: inline-block;
							font-size: 15px;
							font-style: normal;
							color: #4A474A;
						}
					}
				}
				.close-box{
					line-height: 60px;
					text-align: center;
					color: #323233;
					font-size: 16px;
				}
			}
		}
		.feedBack-pop{
			.con-box {
				padding: 0 20px;
				h6{
					font-size: 18px;
					line-height: 70px;
				}
				div.c-box{
					padding: 0;
					border: none;
				}
				div.c-btn-box{
					padding: 0 55px;
					span{
						font-size: 16px;
					}
				}
			}
			.van-cell{
				padding: 0;
				color: #333;
			}
		}
	}
</style>
