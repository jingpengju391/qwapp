<template>
	<div class="order-box">
		<div class="introduce-box">
			<em><img :src="shopData.store.store_head ? host + shopData.store.store_head : ''" alt=""></em>
			<div class="con-box">
				<h6>{{shopData.store.store_name}}</h6>
				<span>{{shopData.store.store_content}}</span>
				<div class="loc-box">
					<van-icon name="location" />
					<span>{{shopData.store.address}}</span>
				</div>
				<div class="loc-box tel-box">
					<div>
						<van-icon name="phone" />
						<span>{{shopData.store.store_phone}}</span>
					</div>
					<van-button class="tel-btn" type="default"  @click="onCall">拨打电话</van-button>
				</div>
			</div>
		</div>
		<ul class="goods-box">
			<h6>已选菜品</h6>
			<li v-for="item in shopData.danpin" :key="item.id">
				<em><img :src="host + item.good_image" alt=""></em>
				<div class="rgt-box">
					<div class="top-n-box">
						<div>
							<span class="c-ming">{{item.good_name}}</span>
							<span>
								<span>{{item.good_content}}</span>
								<span>X{{item.good_stock}}</span>
							</span>
						</div>
						<span class="pice-txt">{{item.good_price}}</span>
					</div>
				</div>
			</li>
		</ul>
		<div class="time-box">
			<h6>选择时间段</h6>
			<div>
				<van-field class="time-btn" :value="starDate" readonly  placeholder="开始时间" @click="timeType = 1;showDatepicker = true;"/>
				<span>~</span>
				<van-field class="time-btn"  :value="endDate" readonly  placeholder="结束时间" @click="timeType = 2;showDatepicker = true;"/>
			</div>
		</div>
		<div class="time-box">
			<Coupon :coupon="shopData.coupon" @setCoupon="setCoupon"></Coupon>
		</div>
		<div class="remark-w-box">
			<h6>备注</h6>
			<Remark ref="remarkRef" @setMessage="setMessage"></Remark>
		</div>
		<div class="btn-box">
			<div>
				<span class="ii">已支付<i>{{shopData.order.start_price}}</i></span>
				￥<van-field v-model="shopData.order.percentage*100" disabled type="nummber" label="" />%
			</div>
			<van-button type="warning" @click="onCheck">提交订单</van-button>
		</div>
		<van-dialog v-model="show" title="微信支付" show-cancel-button @cancel="showDatepicker = false" @confirm="onCheckPay()">
			<van-radio-group v-model="radio" class="radio-group-box">
			  <van-radio name="1">微信支付</van-radio>
			  <van-radio name="2">余额支付</van-radio>
			  <van-radio name="3">情侣基金支付</van-radio>
			</van-radio-group>
		</van-dialog>
		<van-overlay class="choose-box" :show="showDatepicker" @click="show = false">
		    <van-datetime-picker
		            v-model="currentDate"
		            type="datetime"
		            title="选择完整时间"
		            :min-date="minDate"
		            :max-date="maxDate"
		            @cancel="showDatepicker = false"
		            @confirm="ondatePickerConfirm"
		    />
		</van-overlay>
	</div>
</template>

<script>
	import { mapState } from "vuex";
	import Remark from "./components/Remark";
	import Coupon from "../../../components/coupon/Index.vue";
	import { HOST } from "../../../utils/config.js";
	import { getCurrentDate, getCurrentStamp, callPhone, onPayment } from "../../../utils/conversion.js";
	import { Toast } from "vant";
	export default {
		components: {
		    Remark,
			Coupon
		},
		data() {
			return {
				value:0,
				mumee:0,
				host:HOST,
				remark:'',
				shopData:{
					coupon:[],
					danpin:[],
					order:[],
					pinglun:[],
					sheshi:[],
					store:{
						store:{
							store_head:''
						}
					},
					taocan:[],
					jine:null
				},
				starDate: '',
				endDate: '',
				showDatepicker:false,
				show:false,
				radio:"1",
				currentDate: new Date(),
				minDate: new Date(2020, 0, 1),
				maxDate: new Date(2025, 10, 1),
				couponId:null,
			}
		},
		computed: {
			...mapState(['user']),
			orderId: function () {
				return this.$route.query.orderId;
			},
			_api: function () {
				return this.$api._views.order;
			},
		},
		methods: {
			// 获取数据
			async getData(){
				
				const
				params = {
					order_id: this.orderId,
					member_id:this.user.member_id
				},
				{
					data,
				} = await this._api.confirmorderlist( params );
				this.shopData = data;
			},
			// 拨打电话
			onCall(){
				callPhone(this.shopData.store.store_phone)
			},
			// 选择时间
			ondatePickerConfirm() {
				
				this.timeType === 1 ?
				this.starDate = getCurrentDate(this.currentDate) : 
				this.endDate = getCurrentDate(this.currentDate)
			    this.showDatepicker = false
				
			},
			// 校验数据
			onCheck(){
				if( !this.starDate ){
					Toast('请选择开始时间')
					return false
				}
		
				if( !this.endDate ){
					Toast('请选择结束时间')
					return false
				}
				
				this.show = true;
				
			},
			onCheckPay(){
				if( this.radio == '2' ){
					Toast.fail('余额支付开发中')
					return false
				}
				
				if( this.radio == '3' ){
					Toast.fail('情侣基金支付开发中')
					return false
				}
				
				if(this.radio == '1'){
					this.onSubmit();
				}else if(this.radio == '2'){
					this.onSubmit( this.balancePay );
				}else{
					this.onSubmit( this.loverPay );
				}
				
				
			},
			// 设置购物车信息
			setCoupon( obj ){
				obj.id ? this.couponId = obj.id : this.couponId = null
			},
			// 设置留言
			setMessage( remark ){
				this.remark = remark;
			},
			// 提交数据
			async onSubmit( callback ){
				const
				params = {
					order_id: this.orderId,
					member_id:this.user.member_id,
					coupon_id:this.couponId,
					start_time:getCurrentStamp(this.starDate),
					end_time:getCurrentStamp(this.endDate),
					liuyan:this.remark
				},
				{
					data,
					status
				} = await this._api.sendconfirmorder( params );
				if( status !== '1' ) return false;
				this.onSubmitAppPay( data, callback );
			},
			async onSubmitAppPay( orderData ){
				let 
				who = 'end',
				whos = 'end';	
				this.user.member_id == orderData.start_id ? 
				who = whos = 'start' : 
				''
				const
				params = {
					order_id: this.orderId,
					member_id:this.user.member_id,
					who:who,
				},
				{
					info,
					status,
					msg
				} = await this._api.apppay( params );
				
				if ( status !== '1' ) return fasle;
				
				onPayment( info, _p => {
					this.PayCallback( whos )
				})
				
			},
			// 余额支付
			balancePay(){
				Toast.fail('余额支付开发中')
			},
			// 情侣基金支付
			loverPay(){
				Toast.fail('情侣基金支付开发中')
			},	
			// 支付成功回调
			async PayCallback( whos ){
				
				const
				params = {
					order_id:this.orderId,
					member_id:this.user.member_id,
					who:whos
				},
				{
					status
				} = await this._api.orderOperation( params );
			
				this.getData();
			}
		},
		mounted() {
			this.getData();
		},
	}
</script>

<style lang="scss" scoped>
	@import "~@/assets/css/mixin.scss";
	.order-box{
		@include display-flex();
		@include flex-direction-column();
		margin: 20px 0 76px 0;
		padding: 0 4%;
		overflow-y: scroll;
		.introduce-box{
			@include display-flex();
			width: 100%;
			background-color: #fff;
			padding: 15px;
			border-radius: 8px;
			margin: 0 0 20px 0;
			em{
				width: 60px;
				height: 60px;
				border-radius: 50%;
				overflow: hidden;
				margin: 0 10px 0 0;
				img{
					width: 100%;
					height: 100%;
					object-fit: cover;
				}
			}
			.con-box{
				@include display-flex();
				@include flex-direction-column();
				color: #A6AEB2;
				width: calc(100% - 60px);
				h6{
					font-size: 16px;
					line-height: 40px;
					color: #333;
				}
				span{
					font-size: 12px;
					line-height: 1.5;
				}
				.style-box{
					margin: 20px 0;
					span{
						display: inline-block;
						border: 0.02667rem solid #FFC963;
						color: #FFC963;
						padding:0 10px;
						line-height: 20px;
						border-radius: 10px;
						margin: 0 10px 0 0;
					}
				}
				.loc-box{
					@include display-flex();
					@include align-items(center);
					margin-top: 10px;
				}
				.tel-box{
					@include justify-content_flex-justify();
					div{
						@include display-flex();
						@include align-items(center);
					}
					.van-button{
						height: 22px;
						border-color: #FFC963;
						color: #FFC963;
						border-radius: 11px;
					}
				}
				.counting-box{
					@include display-flex();
					@include align-items(center);
					margin: 20px 0 10px 0;
					span{
						width: 74px;
						height: 34px;
						line-height: 34px;
						padding-left: 8px;
						margin-right: 10px;
						font-size: 13px;
						color: #FE5145;
						background-image: url("../../../assets/imgs/coupon.png");
						background-size: 100% 100%;
					}
				}
			}
		}
		.style-con{
			@include display-flex();
			@include flex-direction-column();
			background-color: #fff;
			padding: 15px;
			border-radius: 8px;
			h6{
				font-size: 16px;
				line-height: 60px;
				color: #333;
			}
			span{
				font-size: 12px;
				line-height: 1.5;
				color: #A6AEB2;
			}
			div{
				@include display-flex();
				flex-wrap: wrap;
				span{
					@include display-flex();
					@include align-items(center);
					width: 33.3%;
					margin: 0 0 20px 0;
					img{
						width: 18px;
						margin: -3px 5px 0 0;
					}
				}
			}
		}
		.goods-box{
			@include display-flex();
			@include flex-direction-column();
			background-color: #fff;
			padding: 15px;
			margin: 0 0 20px 0;
			border-radius: 8px;
			h6{
				font-size: 16px;
				line-height: 40px;
				color: #333;
				margin-bottom: 10px;
			}
			li{
				@include display-flex();
				margin-bottom: 20px;
				em{
					display: inline-block;
					width: 60px;
					height: 60px;
					border-radius: 50%;
					overflow: hidden;
					margin-right: 10px;
					img{
						width: 100%;
						height: 100%;
						object-fit: cover;
					}
				}
				.rgt-box{
					@include display-flex();
					@include flex-direction-column();
					width: calc(100% - 60px);
					padding-bottom: 20px;
					border-bottom: 1px solid #EFEEEA;
					.top-n-box{
						@include display-flex();
						@include align-items(center);
						@include justify-content_flex-justify();
						width: 100%;
						margin-top: 10px;
						div{
							@include display-flex();
							@include flex-direction-column();
							span.c-ming{
								font-size: 16px;
								color: #333;
								font-weight: bold;
							}
							span{
								span{
									font-style: normal;
									font-size: 12px;
									color: #A6AEB2;
									margin: 0 20px 0 0;
								}
							}
						}
						.pice-txt{
							font-size: 16px;
							color: #FE5145;
							font-weight: bold;
						}
					}
					.stepper-box{
						margin-top: 20px;
					}
					.van-stepper__plus{
						background-color: #FFC963 !important;
					}
				}
			}
			li:last-child{
				margin-bottom: 0;
				.rgt-box{
					border-bottom: none;
				}
			}
		}
		.time-box{
			@include display-flex();
			@include justify-content();
			@include flex-direction-column();
			background-color: #fff;
			padding: 15px;
			margin: 0 0 20px 0;
			border-radius: 8px;
			h6{
				font-size: 16px;
				line-height: 40px;
				color: #333;
				margin-bottom: 10px;
			}
			div{
				@include display-flex();
				@include align-items(center);
				color: #cbc9cc;
			}
		}
		.remark-w-box{
			background-color: #fff;
			padding: 15px;
			text-align: left;
			border-radius: 8px;
			h6{
				font-size: 16px;
				line-height: 40px;
				color: #333;
			}
			
		}
		.swiper-box{
			margin-top: 20px;
			padding: 12px 15px;
		}
		.choose-box{
			.van-picker{
				position: absolute;
				left: 0;
				bottom: 0;
				width: 100%;
			}
		}
		.btn-box{
			@include display-flex();
			@include align-items(center);
			@include justify-content_flex-justify();
			background-color: #fff;
			height: 56px;
			width: 100%;
			position: fixed;
			left: 0;
			bottom: 0;
			padding-left: 15px;
			div{
				@include align-items(flex-end);
				@include display-flex();
				span.ii{
					font-weight: normal;
					font-size: 14px;
					margin-right: 20px;
					i{
						display: inline-block;
						font-weight: bold;
						font-style: normal;
						margin-left: 5px;
						color: #FFC963;
						font-size: 30px;
					}
				}
				.van-field__label{
					width: auto;
				}
				
				.van-cell{
					width: 40px;
					font-size: 14px;
					font-weight: bold;
				}
			}
			.van-button--warning{
				@include align-items(center);
				@include display-flex();
				@include justify-content();
				background-color: #FFC963;
				height: 100%;
				width: 120px;
				border: none;
				border-radius: 0;
				text-align: center;
			}
		}
		.radio-group-box{
			.van-radio{
				margin: 0 0 20px 20px;
			}
		}
		
	}
</style>
<style lang="scss">
	.order-box .time-box .van-field__control{
		text-align: center;
	}
	.order-box .van-cell::after{
		display: none;
	}
	
	.order-box .btn-box .van-field__control{
		color: red;
		font-size: 30px;
		margin-left: 5px;
	}
	.order-box .van-radio__icon--checked{
		.van-icon{
			background-color: #FFC963;
			border-color: #FFC963;
		}
	}
	.order-box .van-dialog__header{
		padding: 20px 0;
	}
</style>