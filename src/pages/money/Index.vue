<template>
	<div class="money-box">
		<div class="header-box">
			<div class="left-box">
				<em @click="$router.go(-1)"></em>
				<span>钱包</span>
			</div>
			<div class="rgt-box">
				<span class="active" @click="$router.push('/consumption')">消费记录</span>
			</div>
		</div>
		<div class="balance-box">
			剩余: {{balance}} 元
		</div>
		<div class="recharge-box" @click="show = true">
			<i><img src="../../assets/imgs/wx.png" alt=""></i>
			<em>微信充值</em>
		</div>
		
		<van-dialog class="dia-box" v-model="show" title="微信支付" show-cancel-button @cancel="showDatepicker = false" @confirm="onSubmit">
			<van-radio-group v-model="radio" direction="horizontal" checked-color="#FFC963">
			  <van-radio name="balance">余额</van-radio>
			  <van-radio name="intended">情侣基金</van-radio>
			</van-radio-group>
		  <van-field v-model="value" type="number" label="充值金额" placeholder="请输入充值金额" />
		</van-dialog>
	</div>
</template>

<script>
	import { mapState } from "vuex";
	import { onPayment } from '../../utils/conversion.js';
	export default {
		data() {
		    return {
				balance: 0,
				show:false,
				radio:'balance',
				value:'',
				type:1,
				recharge_no:''
			}
		},
		computed: {
			...mapState(['user']),
			_api: function () {
				return this.$api._views.personal;
			},
		},
		methods:{
			// 重置数据
			closeDialog() {
			    Object.assign(this.$data, this.$options.data())
			},
			// 获取数据
			async getData(){
				
				const
				params = {
					member_id:this.user.member_id
				},
				{
					data,
					status
				} = await this._api.yue( params );
				
				if( status !== '1' ) return false;
				
				this.balance = data.balance;
				
			},
			async onSubmit(){
				const
				params = {
					price:this.value,
					daona:this.radio,
					type:this.type,
					recharge_no:this.type == 2 ? this.recharge_no : '',
					member_id:this.user.member_id
				},
				{
					info,
					recharge_no,
					status
				} = await this._api.recharge( params );
				
				if( status !== '1' ) return false;
				
				this.recharge_no = recharge_no;
				
				onPayment( info, _p => {
					this.PayCallback()
				})
				
			},
	
			// 支付成功回调
			async PayCallback(){
				
				const
				params = {
					recharge_no:this.recharge_no,
					member_id:this.user.member_id
				},
				{
					status
				} = await this._api.rechargeOperation( params );
			
				this.getData();
			}
			
		},
		mounted() {
			this.getData();
		},
		watch: {
		    show: {
		        handler(val) {
		            !val ? this.closeDialog() : ''
		        },
		        deep: true
		    },
		},
	}
</script>

<style lang="scss" scoped>
	@import "~@/assets/css/mixin.scss";
	.money-box{
		.header-box{
			@include display-flex();
			@include align-items(center);
			@include justify-content_flex-justify();
			position: fixed;
			width: 100%;
			height: 50px;
			background-color: #FFC963;
			color: #fff;
			padding: 0 20px 0 20px;
			z-index: 1;
			font-size: 18px;
			.left-box{
				em{
					position: relative;
					width: 10px;
					margin: 0 15px 0 0;
				}
				em::before,em::after{
					position: absolute;
					top: 0;
					bottom: 0;
					margin: auto;
					content: '';
					display: inline-block;
					width: 10px;
					height: 2px;
					background-color: #fff;
					transform: rotate(45deg);
					transform-origin: 0 0;
				}
				em::after{
					transform: rotate(-45deg);
				}
				span{
					font-size: 16px;
				}
			}
			.rgt-box{
				font-size: 16px;
				span{
					margin-left: 15px;
					color: #ffffffa3;
				}
				span.active{
					color: #fff;
				}
			}
		}
		.balance-box{
			width: 100%;
			background-color: #FFC963;
			text-align: center;
			padding: 200px 0 50px 0;
			color: #fff;
			font-weight: 600;
			font-size: 28;
		}
		.recharge-box{
			@include display-flex();
			@include align-items(center);
			background-color: #fff;
			padding:20px;
			margin: 20px 10px;
			border-radius: 5px;
			i{
				@include display-flex();
				@include align-items(center);
			}
			em{
				font-style: normal;
				margin-left: 10px;
				font-size: 16px;
				color: #182B33;
			}
		}
		.van-dialog__content{
			margin: 10px 0px 10px 15px;
		}
	}
</style>
<style lang="scss">
	.money-box{
		.van-dialog__content{
			padding: 20px;
		}
		.van-cell{
			padding:30px 0 0 0;
		}
	}
</style>