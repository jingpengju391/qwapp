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
		<span class="register-btn" @click="checkParams">注册</span>
	</div>
</template>

<script>
	import Header from "@/components/header";
	import axios from 'axios';
	import { Toast, CountDown  } from "vant";
	export default {
		components: {
		    Header
		},
		data() {
			return {
				status:0,
				title:'注冊',
				map:null,
				city:'',
				register:[
					{
						value:'',
						label:'用户名',
						placeholder:'请输入用户名不许为空',
						key:0,
						type:'text'
					},
					{
						value:'',
						label:'密码',
						placeholder:'只能输入6-20个字母、数字、下划线',
						key:1,
						type:'password'
					},
					{
						value:'',
						label:'手机',
						placeholder:'输入手机号11位数字',
						key:2,
						type:'number'
					},
					{
						value:'',
						label:'验证码',
						placeholder:'验证码',
						key:3,
						type:'number',
						code:{
							time: 60000,
							format:'发送验证码',
							start:false
						}
					}
				]
			}
		},
		computed: {
		    _reg: function () {
		        return this.$api._start.register;
		    },
			_map: function () {
			    return this.$map.mapApi;
			},
			_common: function () {
			    return this.$api._common;
			},
		},
		methods:{
			setStatus( code ){
				this.$emit('setStatus',0)
			},
			// 初始化地图
			initMap(){
				const _THIS = this;
				this._map(callback => {
					_THIS.map = new BMap.Geolocation();
					this.getLocal()
				});
			},
			// 获取地理位置
			getLocal(){
				this.map.getCurrentPosition(res => {
					
					const {
						address:{
							city,
							city_code
						},
						
					} = res;
					this.city = city;
				});
			},
			// 获取城市city_code
			async getCityCode( city ){
				const
				params = {
					address: city,
					ak: 'ZMRViaPFowvgIxSu6dTnGfoFqEPeZVzl',
				},
				{
					data,
					code,
				} = await this._reg.queryCityCode( params );
				console.log(data)
			},
			// 获取验证码
			start() {
				const _THIS = this;
				this.$verification.checkPhone(_THIS.register[2].value,_THIS.register[2].placeholder,_p => {
					_THIS.register[3].code.start = true;
					_THIS.onSend();
				})
			},
			// 从新获取验证码
			finish(){
				this.register[3].code.format = "重新获取验证码"
				this.register[3].code.start = false
			},
			// 校验
			checkParams(){
				const _THIS = this;
				
				if( !this.register[0].value ){
					Toast(this.register[0].placeholder);
					return false
				}
				
				this.$verification.checkPass(_THIS.register[1].value,_THIS.register[1].placeholder,_p => {
					this.$verification.checkPhone(_THIS.register[2].value,_THIS.register[2].placeholder,_p => {
						if( !_THIS.register[3].value ){
							Toast(_THIS.register[3].placeholder);
							return false
						}
						_THIS.onSubmit();
					})
				})
			},
			// 发送验证码
			async onSend() {
				
			    const
				params = {
					phone: this.register[2].value,
					type: 'zhuce',
				},
				{
					data,
					code,
				} = await this._common.send( params );
			
			},
			// 获取数据
			async onSubmit() {
			    const
				params = {
					user_name: this.register[0].value,
					password: this.register[1].value,
					phone: this.register[2].value,
					cityzip: '230100',
					city_name: this.city,
					address:''
				},
				{
					status,
				} = await this._reg.register( params );
				status == 1 && this.$emit('setStatus',0);
			},
		},
		mounted() {
			this.initMap();
        },
	}
</script>

<style lang="scss" scoped>
	@import "~@/assets/css/mixin.scss";
	.register-box{
		@include display-flex();
		@include flex-direction-column();
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
			border: 1px solid #FFC963;
			line-height: 44px;
			color: #FFC963;
			margin: 20px 0 0 25%;
			text-align: center;
			border-radius: 22px;
		}
	}
</style>
