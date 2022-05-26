<template>
	<div class="register-box">
		<Header :title="title" @setStatus="setStatus"></Header>
		<div class="con-box">
			<div class="inp-box" v-for="item in register" :key="item.key">
				<van-field
				  v-model="item.value"
				  center
				  clearable
				  :type="item.type"
				  :border="false"
				  :label="item.label"
				  :placeholder="item.placeholder"
				></van-field>
				<van-count-down
					class="send-code" 
					v-if="item.code && item.code.start"
					format="ss 秒后重新获取"
					:auto-start="item.code.start"
					@finish="finish"
					:time="item.code.time" />
				<span 
					class="send-code" 
					v-if="item.code && !item.code.start" 
					@click="start">{{item.code.format}}</span>	
			</div>
		</div>
		<span class="register-btn" @click="checkParams">确定</span>
	</div>
</template>

<script>
	import Header from "@/components/header";
	import { Toast, CountDown  } from "vant";
	import { mapState, mapActions } from "vuex";
	export default {
		components: {
		    Header
		},
		data() {
			return {
				status:0,
				title:'忘记密码',
				nCode:0,
				register:[
					{
						value:'',
						label:'账号',
						placeholder:'请输入账号',
						key:0,
						type:'text',
					},
					{
						value:'',
						label:'新密码',
						placeholder:'英文和数字组合不许出现下划线等符号',
						key:1,
						type:'password',
					},
					{
						value:'',
						label:'确认密码',
						placeholder:'请再次输入密码',
						key:2,
						type:'password',
					},
					{
						value:'',
						label:'手机号',
						placeholder:'输入手机号11位数字',
						key:3,
						type:'number',
					},
					{
						value:'',
						label:'验证码',
						placeholder:'验证码',
						key:4,
						type:'number',
						code:{
							time: 600,
							format:'发送验证码',
							start:false
						}
					}
				]
			}
		},
		computed: {
		    _forget: function () {
		        return this.$api._start.forget;
		    },
			_common: function () {
			    return this.$api._common;
			},
		},
		methods:{
			...mapActions(['setLoginInfo']),
			// 切换组件
			setStatus(){
				this.$emit('setStatus',0)
			},
			// 获取验证码
			start() {
				const _THIS = this;
				this.$verification.checkPhone(_THIS.register[3].value,_THIS.register[3].placeholder,_p => {
					_THIS.register[4].code.start = true;
					_THIS.onSend();
				})
			},
			// 从新获取验证码
			finish(){
				this.register[4].code.format = "重新获取验证码"
				this.register[4].code.start = false
			},
			// 发送验证码
			async onSend() {
				
			    const
				params = {
					phone: this.register[3].value,
					type: 'zhaohui',
				},
				{
					code,
				} = await this._common.send( params );
				this.nCode = code.code;
			},
			// 校验
			checkParams(){
				
				const _THIS = this;
				
				if( !this.register[0].value ){
					Toast('请输入用户名')
					return false;
				}
				
				if( !this.register[1].value || !this.register[2].value ){
					Toast('请输入密码')
					return false;
				}
				
				if( this.register[1].value !== this.register[2].value ){
					Toast('两次密码不一样')
					return false;
				}
				
				this.$verification.checkPhone(_THIS.register[3].value,_THIS.register[3].placeholder,_p => {
					if( _THIS.nCode != _THIS.register[4].value || !_THIS.nCode ){
						Toast('请输入正确的验证码')
						return false;
					}
				})
				
				this.onSubmit();
			},
			// 登陆
			async onSubmit() {
			    const
				params = {
					user_name:this.register[0].value,
					password:this.register[1].value,
					phone:this.register[3].value
				},
				{
					msg,
					status,
				} = await this._forget.wangji( params );
				
				if( status == '1' ){
					Toast(msg)
					this.setLogin();
				}
			},
			// 登陆
			async setLogin() {
				
				const USER = {
					phone:this.register[3].value,
				}
				
				this.setLoginInfo( USER ).then(res => {
					
					this.$router.push({
						path: '/index',
						name: 'index',
					});
				
				});
				
			},
		}
	}
</script>

<style lang="scss" scoped>
	@import "~@/assets/css/mixin.scss";
	.register-box{
		@include display-flex();
		@include flex-direction-column();
		width: 100vw;
		height: 100vh;
		background-color: #f9f1e8;
		.con-box{
			@include display-flex();
			@include flex-direction-column();
			background-color: #fff;
			margin: 50px 0 0 0;
			.inp-box{
				@include display-flex();
				@include align-items(center);
				position: relative;
				width: 94%;
				padding: 10px 0;
				border-bottom: 1px solid #F3F3F3;
				margin: 0 0 0 3%;
				.send-code{
					position: absolute;
					right: 0;
					font-size: 16px;
					border: 1px solid #FFC963;
					line-height: 30px;
					padding: 0 20px;
					border-radius: 15px;
					color: #FFC963;
				}
			}
			.inp-box:last-child{
				border: none;
			}
		}
		.register-btn{
			width: 50%;
			background:#FFC963;
			line-height: 44px;
			color: #fff;
			margin: 20px 0 0 25%;
			text-align: center;
			border-radius: 22px;
		}
	}
</style>
