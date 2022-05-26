<template>
	<div class="login-box">
		<div class="con-box">
			<div class="top-box">
				<span>登录</span>
				<span>你还没有注册账号，<i @click="setStatus(1)">立即注册</i></span>
			</div>
			<div class="ctr-box">
				<div class="inp-box">
					<van-field
						class="field-txt"
						v-model="value1"
						:type='type'
						:placeholder="placeholder"
					/>
				</div>
				<div class="inp-box">
					<van-field
						class="field-txt"
						:type="type2"
						v-model="value2"
						:label="codelabel"
						:placeholder="codepla"
					/>
					<van-count-down
						class="send-code" 
						v-if="code.start && switchTxt == '账号登录'"
						format="ss 秒后重新获取"
						:auto-start="code.start"
						@finish="finish"
						:time="code.time" />
					<span 
						class="send-code" 
						v-if="!code.start && switchTxt == '账号登录'" 
						@click="start">{{code.format}}</span>	
				</div>
			</div>
			<div class="btm-box">
				<span @click="checkParams">登录</span>
				<span @click="setStatus(2)">忘记密码？</span>
				<span @click="swichFn">{{ switchTxt }}</span>
			</div>
		</div>
	</div>
</template>

<script>
	import { Toast, CountDown  } from "vant";
	import { mapState, mapActions } from "vuex";
	export default {
		data() {
			return {
				value1:'',
				type:'number',
				type2:'number',
				value2:'',
				placeholder:'手机号',
				codepla:'验证码',
				codelabel:'验证码',
				switchTxt:'账号登录',
				code:{
					value:'',
					label:'验证码',
					placeholder:'验证码',
					key:3,
					type:'text',
					time: 60000,
					format:'发送验证码',
					start:false
				},
				nCode:0
			}
		},
		computed: {
			...mapState(['user']),
		    _login: function () {
		        return this.$api._start.login;
		    },
			_common: function () {
			    return this.$api._common;
			},
		},
		methods:{
			...mapActions(['setLoginInfo']),
			// 登录方式切换
			swichFn(){
				this.value1 = '';
				this.value2 = '';
				if( this.switchTxt == "账号登录" ){
					this.switchTxt = "手机登录"
					this.placeholder = "账号"
					this.codelabel = ''
					this.codepla = '密码'
					this.type = 'text'
					this.type2 = 'password'
				}else{
					this.switchTxt = "账号登录"
					this.placeholder = "手机号"
					this.codepla = this.codelabel = '验证码'
					this.type = 'number'
					this.type2 = 'number'
				}
				
			},
			// 组件切换
			setStatus ( code ) {
				
				this.$emit( 'setStatus', code )
				
			},
			// 校验
			checkParams(){
				
				const _THIS = this;
				
				if( this.switchTxt == '账号登录' ){
					
					this.$verification.checkPhone(_THIS.value1,'输入手机号11位数字',_p => {
						if( _THIS.nCode.code != _THIS.value2 || !this.nCode ){
							Toast('请输入正确的验证码')
							return false;
						}
						_THIS.setLogin();
					})
					
				}else{
					
					if( !_THIS.value1 || !_THIS.value2 ){
						Toast('请输入正确的信息')
						return false;
					}
					_THIS.setLogin();
				}
				
			},
			// 获取验证码
			start() {
				const _THIS = this;
				this.$verification.checkPhone(_THIS.value1,'输入手机号11位数字',_p => {
					_THIS.code.start = true;
					_THIS.onSend();
				})
			},
			// 从新获取验证码
			finish(){
				this.code.format = "重新获取验证码"
				this.code.start = false
			},
			// 发送验证码
			async onSend() {
				
			    const
				params = {
					phone: this.value1,
					type: 'denglu',
				},
				{
					code,
				} = await this._common.send( params );
				this.nCode = code;
			},
			// 登陆
			async setLogin() {
				
				const USER = {
					phone:this.switchTxt == '账号登录'?this.value1:'',
					user_name:this.switchTxt == '账号登录'?'':this.value1,
					password:this.switchTxt == '账号登录'?'':this.value2
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
	.login-box{
		@include display-flex();
		@include justify-content();
		@include align-items(center);
		height: 100vh;
		background-color: #fffeff;
		.con-box{
			@include display-flex();
			@include flex-direction-column();
			width: 70%;
			.top-box{
				@include display-flex();
				@include flex-direction-column();
				margin: 0 0 80px 0;
				span{
					display: inherit;
					font-size: 14px;
					color: #A6AEB2;
					font-weight: bold;
					i{
						font-style: normal;
						color: #FFC963;
					}
				}
				span:first-child{
					position: relative;
					font-size: 40px;
					color: #182B33;
					width: max-content;
					margin-bottom: 10px;
				}
				span:first-child::before{
					content: '';
					display: block;
					width: 20px;
					height: 10px;
					position: absolute;
					right: -30px;
					bottom: 6px;
					background-color: #FFC963;
				}
			}
		}
		.ctr-box{
			@include display-flex();
			@include flex-direction-column();
			width: 100%;
			margin: 0 0 50px 0;
			.inp-box{
				@include display-flex();
				@include align-items(center);
				position: relative;
				border-bottom: 1px solid #F3F3F3;
				.field-txt{
					padding-left:0 !important;
					font-size: 16px;
				}
				.van-field__label{
					width: 20px !important;
				}
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
			.inp-box:first-child{
				margin: 0 0 20px 0;
			}
		}
		.btm-box{
			@include display-flex();
			@include flex-direction-column();
			text-align: center;
			span{
				line-height: 40px;
				border-radius: 20px;
				color: #333;
				font-size: 14px;
				font-weight: bold;
			}
			span:first-child{
				background-color: #FFC963;
				color: #fff;
				font-size: 18px;
				margin-bottom: 10px;
			}
			span:last-child{
				color: #333;
				font-size: 14px;
				color:  #bbb;
				margin: 50px 0 0 0;
			}
		}
	}
</style>
<style lang="scss">
	@import "~@/assets/css/mixin.scss";
	.login-box{
		.ctr-box{
			.inp-box{
				.van-field__label{
					width: 50px !important;
				}
			}
		}
		.van-cell::after{
			display: none;
		}
	}
</style>