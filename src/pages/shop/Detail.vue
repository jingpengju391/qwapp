<template>
	<div class="shop-detail">
		<div class="top-box">
			<img :src="shopData.store.business_image ? host + shopData.store.business_image : ''" alt="">
			<div class="header-box">
				<span>
					<em @click="$router.go(-1)"></em>
					{{shopData.store.store_name}}
				</span>
				<span @click="setRouter(shopData.store)">详情</span>
			</div>
		</div>
		<div class="con-s-box">
			<div class="introduce-box">
				<em><img :src="shopData.store.store_head ? host + shopData.store.store_head : ''" alt=""></em>
				<div class="con-box">
					<h6>{{shopData.store.store_name}}</h6>
					<span>{{shopData.store.store_content}}</span>
					<div class="style-box">
						<span v-for="(item,index) in shopData.store.tags" :key="index">{{item}}</span>
					</div>
					<div class="loc-box">
						<van-icon name="location" />
						<span>{{shopData.store.address}}</span>
					</div>
				<!-- 	<div class="counting-box">
						<span v-for="item in shopData.coupon" :key="item.id">{{item.price}}元</span>
					</div> -->
				</div>
			</div>
			
			<div class="coupon-w-box">
				<Coupon :coupon="shopData.coupon" @setCoupon="setCoupon"></Coupon>
			</div>
			
			<div class="style-con">
				<h6>门店特色</h6>
				<span>{{shopData.store.feature}}</span>
				<h6>设施</h6>
				<div>
					<span v-for="item in shopData.sheshi" :key="item.id">
						<img :src="item.sheshi_image ? host + item.sheshi_image : ''" alt="">
						{{item.sheshi_name}}
					</span>
				</div>
			</div>
			<div class="swiper-box">
				<swiper :options="options">
				    <swiper-slide v-for="item in shopData.order" :key="item.order_id">
				        <invite-item :shop="true" :inviteInfo="item"></invite-item>
				    </swiper-slide>
				</swiper>
			</div>
			<ul class="goods-box">
				<h6>选择菜品</h6>
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
						<div class="stepper-box">
							<van-stepper button-size="20px" v-model="item.good_num" disable-input min='0' @change="selectGood(item)" />
						</div>
					</div>
				</li>
			</ul>
			<ul class="goods-box">
				<h6>选择套餐</h6>
				<li v-for="item in shopData.taocan" :key="item.id">
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
						<div class="stepper-box">
							<van-stepper button-size="20px" v-model="item.good_num" disable-input min='0' @change="selectGood(item)" />
						</div>
					</div>
				</li>
			</ul>
		</div>
		<div class="shop-footer">
			<div class="left-box">
				<em :class="[anmi ? 'curr' : '']" @click=" show=true ">
					<img :class="[imgAnmi ? 'curr' : '']" :src="require('../../assets/imgs/' + imgUrl + '.svg')" alt="">
				</em>
				<span class="shop-sum__price">价格：{{totalPrice}}</span>
				<span>￥:</span>
				<van-field 
					v-model="prePayment"
					placeholder="预付金额"/>
			</div>
			<van-button :class="[anmi ? 'invite-btn curr' : 'invite-btn']" type="default" @click="onCheck">邀约</van-button>
		</div>
		<van-overlay class="overlay-l-n-box" :show="show" @click="show = false ">
		  <ul class="goods-box">
		  	<h6>已选菜品</h6>
			<p v-if="foodSelectedList.length === 0">您暂时没有选择菜品</p>
		  	<li v-for="item in foodSelectedList" :key="item.id" @click.stop>
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
		  			<div class="stepper-box">
		  				<van-stepper button-size="20px" v-model="item.good_num" disable-input min='0' @change="selectGood(item)" />
		  			</div>
		  		</div>
		  	</li>
		  </ul>
		</van-overlay>
	</div>
</template>

<script>
	import { mapState } from "vuex";
	import { Toast } from "vant";
	import { HOST } from "../../utils/config.js";
	import InviteItem from "../../components/invite";
	import Coupon from "../../components/coupon/Index.vue";
	export default {
		components: {
			InviteItem,
			Coupon
		},
		data() {
			return {
				tj:[],
				host:HOST,
				prePayment:'',
				anmi:true,
				options:{
					slidesPerView : 1.5,
					spaceBetween : 60,
					slidesOffsetBefore : 50,
					slidesOffsetAfter : 50,
				},
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
				foodSelectedList:[],
				anmi:false,
				imgAnmi:false,
				imgUrl:'empty-cart',
				totalPrice:0,
				show:false,
				couponId:null,
				couponValue:0
			}
		},
		computed: {
			...mapState(['user']),
			shopId: function () {
				return this.$route.query.id;
			},
			inviteId: function () {
				return this.$route.query.inviteId;
			},
			_api: function () {
				return this.$api._views.shop;
			},
			_apif: function () {
				return this.$api._views.friends;
			},
		},
		methods: {
			// 获取数据
			async getData(){
				
				const
				params = {
					store_id: this.shopId,
					member_id:this.user.member_id
				},
				{
					data
				} = await this._api.storedetailed( params );
				data.store.tags = data.store.biaoqian.split(',')
				data.order.forEach(item => item.order_id = item.id)
				data.danpin.forEach(item => item.good_num = 0)
				data.taocan.forEach(item => item.good_num = 0)
				this.shopData = data;
			},
			// 设置优惠券
			setCoupon( obj ){
				this.couponId = obj.id
				this.couponValue = obj.value/100
				this.setTotalPrice();
			},
			// 跳转商家详情
			setRouter( data ){
				this.$router.push({
					path: '/detail-shop', 
					query: {id: data.id,title:'商家详情'}
				})
			},
			// 选择商品
			selectGood(currItem){
				
				const INDEX = this.foodSelectedList.findIndex(item => item.id == currItem.id)
				
				if( currItem.good_num > 0 ){
					
					INDEX === -1 ?
					this.foodSelectedList = [...this.foodSelectedList, currItem] : 
					this.foodSelectedList[INDEX] = currItem
					
				}else{
					
					INDEX == -1 ? '' :this.foodSelectedList.splice(INDEX, 1)
					
				}
				
			},
			// 设置动画
			setAnimation(){
				
				const _THIS = this;
				
				this.anmi = this.imgAnmi = this.foodSelectedList.length > 0
				
				this.foodSelectedList.length > 0 ? this.imgUrl = 'full-cart' : this.imgUrl = 'empty-cart'  
				
				setTimeout(function(){
					
					_THIS.imgAnmi = false
					
				},300);
				
			},
			// 计算总价格
			setTotalPrice(){
				
				let totalPrice = 0;
				
				this.foodSelectedList.forEach(item => totalPrice += item.good_price*item.good_num )
				
				this.totalPrice = totalPrice - this.couponValue;
				
			},
			// 校验数据
			onCheck(){
				
				if( this.foodSelectedList.length === 0 ){
					Toast('请添加菜品或订单后进行邀约')
					return false
				}
				
				if( this.prePayment == '' ){
					Toast('请输入金额后进行邀约')
					return false
				}
				
				let selectId = [],selectNum = []
				
				this.foodSelectedList.forEach(item => {
					selectId = [...selectId,item.id]
					selectNum = [...selectNum,item.good_num]
				})
				
				this.onSubmit( selectId, selectNum );
				
			},
			// 提交数据
			async onSubmit( selectId, selectNum ){
				const
				params = {
					store_id: this.shopData.store.id,
					member_id:this.user.member_id,
					payprice:this.prePayment,
					// selectFood:selectedFood
				},
				{
					order_id,
					msg,
					status
				} = await this._api.creatorder( params );
				
				if( status !== '1' ) return false;
				this.onSubmitCoupon( selectId, selectNum, order_id );
			},
			// 购物车数据提交
			async onSubmitCoupon(  selectId, selectNum, order_id  ){
				
				const
				params = {
					store_id: this.shopData.store.id,
					member_id:this.user.member_id,
					good_ids:selectId.join(','),
					quantitys:selectNum.join(',')
				},
				{
					msg,
					status
				} = await this._api.carttotal( params );
				
				if( status !== '1' ) return false;
				
				
				if( this.inviteId ){
					
					this.setInvite( order_id );
					
				}else{
					
					this.$router.push({
						path: '/friends', 
						query: {
							orderId:order_id,
							title:'邀请好友'
						}
					})
					
				}
				
			},
			async setInvite( orderId ){
				const
				params = {
					member_id:this.user.member_id,
					order_id:orderId,
					invite_id:this.inviteId
				},
				{
					status
				} = await this._apif.invite( params );
				
				if( status == '1' ) Toast('邀请成功')
				
			}
		},
		mounted() {
			this.getData();
		},
		created() {
			
		},
		watch: {
			foodSelectedList: {
				handler(newName, oldName) {
					this.setAnimation();
					this.setTotalPrice();
				},
				immediate: true,
				deep: true
			}
		}
	};
</script>

<style lang="scss" scoped>
	@import "~@/assets/css/mixin.scss";
	.shop-detail{
		@include display-flex();
		@include flex-direction-column();
		.coupon-w-box{
			@include display-flex();
			@include justify-content();
			@include flex-direction-column();
			background-color: #fff;
			padding: 15px;
			margin: 0 0 20px 0;
			border-radius: 8px;
			div{
				@include display-flex();
				@include align-items(center);
				color: #cbc9cc;
			}
		}
		.goods-box{
			@include display-flex();
			@include flex-direction-column();
			background-color: #fff;
			padding: 15px;
			margin: 20px 0 0 0;
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
		.top-box{
			position: fixed;
			left: 0;
			top: 0;
			z-index: 3;
			width: 100%;
			height: 190px;
			img{
				width: 100%;
				height: 100%;
				object-fit: cover;
			}
			.header-box{
				@include display-flex();
				@include align-items(center);
				@include justify-content_flex-justify();
				position: fixed;
				left: 0;
				top: 0;
				z-index: 2;
				width: 100%;
				color: #fff;
				padding: 10px 20px;
				font-size: 18px;
				font-weight: bold;
				span{
					@include display-flex();
					@include align-items(center);
					em{
						position: relative;
						width: 10px;
						margin: 0 10px 0 0;
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
				}
			}
		}
		.con-s-box{
			@include display-flex();
			@include flex-direction-column();
			margin: 210px 0 80px 0;
			padding: 0 15px;
			overflow-y: scroll;
			width: 100vw;
			overflow: hidden;
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
							background-image: url("../../assets/imgs/coupon.png");
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
					// span:last-child{
					// 	margin: 0;
					// }
					// span:nth-last-child(2){
					// 	margin: 0;
					// }
					// span:nth-last-child(3){
					// 	margin: 0;
					// }
				}
			}
			.swiper-box{
				margin-top: 20px;
				padding: 12px 0px;
			}
		}
		.shop-footer{
			width: 94%;
			height: 50px;
			background-color: #182B33;
			border-radius: 25px;
			position: fixed;
			bottom: 10px;
			z-index: 1;
			left: 3%;
			@include display-flex();
			@include align-items(center);
			@include justify-content_flex-justify();
			em{
				display: inline-block;
				position: absolute;
				left: 15px;
				top: -15px;
				width: 46px;
				height: 46px;
				border-radius: 23px;
				background: #ececec;
				overflow: hidden;
				img{
					@include positionCenter();
					display: block;
					width: 60%;
					object-fit: cover;
				}
			}
			.left-box{
				@include display-flex();
				@include align-items(center);
				span{
					font-size: 13px;
					color: #ffffff;
					margin: 0 10px 0 20px;
				}
				.shop-sum__price{
					margin: 0 0 0 75px;
				}
				.curr{
					background: #FFC963;
					border-color: #FFC963;
					img.curr{
						-webkit-animation: scaleDraw .3s ease-in-out;
					}
				}
			}
			.invite-btn {
			    width: 60px;
			    height: 32px;
			    margin-right: 7px;
			    line-height: 32px;
			    color: #ffffff;
			    border-radius: 16px;
				background: #ccc;
			    border-color: #ccc;
			}
			.curr{
				background: #FFC963;
				border-color: #FFC963;
			}
		}
		.overlay-l-n-box{
			z-index: 4;
			@include display-flex();
			@include justify-content();
			@include align-items(center);
			.goods-box{
				margin: 0;
				width: 90%;
				max-height: 80vh;
				overflow-y: scroll;
				p{
					display: inline-block;
					color: #dad9d9;
					font-size: 14px;
					width: 100%;
					text-align: center;
					border-top: 1px solid #f1f1f1;
					line-height: 46px;
					padding-top: 10px;
				}
			}
		}
	}
	@keyframes scaleDraw {  /*定义关键帧、scaleDrew是需要绑定到选择器的关键帧名称*/
	    0%{ transform: scale(1);  /*开始为原始大小*/
	    }
	    60%{transform: scale(1.2); /*放大1.1倍*/
	    }
	    100%{transform: scale(1);}
	}
</style>
<style lang="scss">
	@import "~@/assets/css/mixin.scss";
	.shop-detail{
		.goods-box{
			li{
				.rgt-box{
					.van-stepper__plus{
						background-color: #FFC963;
					}
					.van-stepper__input{
						background-color: transparent;
					}
				}
				.van-stepper__minus--disabled{
					background-color: #ffe0a5;
					color: #6f6f6f;
				}
				.van-stepper__minus{
					background-color: #FFC963;
				}
			}
		}
		.con-s-box{
			.swiper-container{
				overflow: visible;
			}
		}
		.van-cell{
			background-color: transparent;
			padding: 0;
			width: 100px;
		}
		.coupon-w-box{
			.van-cell{
				background-color: transparent;
				padding: 0;
				width: 100%;
			}
			.van-cell::after{
				display: none;
			}
		}
		.van-field__control{
			color: #fff !important;
			width: 100px !important;
			background: rgba(1,1,1,0);
		}
	}
</style>
