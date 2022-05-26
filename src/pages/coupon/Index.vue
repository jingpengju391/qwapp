<template>
	<div class="coupon-own">
		<div class="header-box">
			<div class="left-box">
				<em @click="$router.go(-1)"></em>
				<span>优惠券管理</span>
			</div>
			<div class="rgt-box">
				<span :class="[item.curr ? 'active' : '']" v-for="item in tabSwich" :key="item.value" @click="setSwich(item)">{{item.label}}</span>
			</div>
		</div>
		<span class="notice-coupon-box">优惠券兑换次数：<b>0</b>次</span>
		<div class="list-box">
			<van-pull-refresh v-model="refreshing" @refresh="onRefresh">
			  <van-list
			    v-model="loading"
			    :finished="finished"
			    finished-text="没有更多了"
			    @load="onLoad"
			  >
			  <div class="terst">
				  <div :class="[status == 'normal' ? 'quan' : 'quan active']" v-for="item in list">
				  	<div class="quanLeft">
				  		<p class="img-box"><img :src="item.store_head ? host + item.store_head : ''" alt=""></p>
				  		<div class="txt-box">
				  			<p class="money">¥ {{item.low_price}}</p>
				  			<p class="tit">{{item.store_name}}</p>
				  			<p class="conts">无满额限制,立减折扣</p>
				  			<p v-if="status == 'normal'" class="dates">截止期 : {{item.shiyongtime | date}}</p>
				  			<p v-else class="dates">已过期</p>
				  		</div>
				  	</div>
				  	<div class="quanRight">
				  		<p class="ft">折扣券</p> 
				  	</div>
				  </div>
			  </div>
				
			  </van-list>
			</van-pull-refresh>
		</div>
	</div>
</template>

<script>
	import { mapState } from "vuex";
	import { HOST } from "../../utils/config.js";
	export default {
		data(){
			return {
				status:'normal',
				tabSwich:[
					{
						label:'待使用',
						value:'normal',
						curr:true
					},
					{
						label:'已过期',
						value:'hidden',
						curr:false
					}
				],
				host:HOST,
				refreshing: false,
				loading: false,
				finished: false,
				currPage:0,
				list:[]
			}
		},
		computed: {
			...mapState(['user']),
			_api: function () {
				return this.$api._views.personal;
			},
		},
		methods:{
			// 设置选项卡
			setSwich( currItem ){
				this.tabSwich.forEach(item => {
					item.curr = false;
					item.value === currItem.value ? item.curr = true : ''
				})
				this.status = currItem.value
				this.currPage = 0;
				this.list = [];
				this.getData();
			},
			onLoad() {
				
				if (this.refreshing) {
					this.list = [];
					this.currPage = 0;
					this.refreshing = false;
				}
				
				this.getData();
			},
			onRefresh() {
				// 清空列表数据
				this.finished = false;
				// 重新加载数据
				// 将 loading 设置为 true，表示处于加载状态
				this.loading = true;
				this.onLoad();
			},
			// 获取数据
			async getData(){
				
				this.currPage ++
				
				const
				params = {
					start:this.currPage,
					status:this.status,
					member_id:this.user.member_id
				},
				{
					data:{
						coupon
					},
					status
				} = await this._api.mycoupon( params );
				
				if ( status == '1' ) this.list = [...this.list,...coupon]
				
				this.loading = false;
				
				// 数据全部加载完成
				if ( !coupon.length ) this.finished = true;
				
			},
		}
	}
</script>

<style lang="scss" scoped>
	@import "~@/assets/css/mixin.scss";
	.coupon-own{
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
				font-weight: 550;
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
		.notice-coupon-box{
			display: inline-block;
			width: 100%;
			margin-top: 50px;
			font-size: 14px;
			line-height: 36px;
			padding-left: 20px;
			background-color: #FFC963;
			color: #333;
			border-top: 1px solid #fff;
		}
		.list-box{
			padding: 20px;
			.terst{
				.quan{
				@include display-flex();
					@include justify-content_flex-justify();
					position: relative;
					padding: 6px;
					padding-right:0;
					margin-bottom: 10px;
					background-color: #ff6347;
					color: #fff;
					background-image: radial-gradient(#f9f1e8 35%,#ff6374 35%);
					background-size: 17px 17px;
					background-position-x: calc(100% + 9px);
					background-repeat: repeat-y;
					overflow: hidden;
					.quanRight{
						@include display-flex();
						@include justify-content();
						@include align-items(center);
						width: 80px;
						background-image: radial-gradient(#f9f1e8 35%,#ff6374 35%);
						background-size: 10px 10px;
						background-position: 0px 10px;
						background-repeat: repeat-y;
						.ft{
							writing-mode: vertical-rl;
						}
					}
					.quanLeft{
						@include display-flex();
						padding: 0 10px;
						.img-box{
							width: 60px;
							height: 60px;
							border-radius: 50%;
							overflow: hidden;
							img{
								width: 100%;
								height: 100%;
								object-fit: cover;
							}
						}
						.txt-box{
							width: calc(100% - 70px);
							margin-left: 10px;
							.money{
								margin: 15px 0 10px 0;
								padding-bottom: 5px;
								font-size: 26px;
								border-bottom: 1px solid #fff;
								font-weight: bold;
							}
							.tit{
								font-size: 18px;
							}
							.conts{
								font-size: 16px;
							}
							.dates{
								font-size: 14px;
							}
							p{
								margin-top: 5px;
							}
						}
					}
				}
				.quan:before{
					position: absolute;
					left: 0px;
					top: 0;
					padding: 6px;
					padding-right:0;
					background-color: #ff6347;
					color: #fff;
					background-image: radial-gradient(#f9f1e8 35%,#ff6374 35%);
					background-size: 17px 17px;
					background-position: -9px 0;
					background-repeat: repeat-y;
					content: '';
					height: 100%;
				}
				.active{
					background-color: #dcdbd7;
					background-image: radial-gradient(#f9f1e8 35%,#dcdbd7 35%);
					color: #333;
					.quanRight{
						background-image: radial-gradient(#f9f1e8 35%,#dcdbd7 35%);
					}
					.conts{
						color: #a5a5a5;
					}
					.quanRight{
						color: #a5a5a5;
					}
				}
				.active:before{
					background-color: #dcdbd7;
					background-image: radial-gradient(#f9f1e8 35%,#dcdbd7 35%);
				}
			}
			
			
		}
	}
</style>
