<template>
    <div class="consumption">
		<div class="header-box">
			<em @click="$router.go(-1)"></em>
			<span>消费记录</span>
		</div>
		<div class="all-type">
			<van-dropdown-menu active-color="#FFC963">
			  <van-dropdown-item v-model="value1" :options="option1" @change="onSelet" />
			  <van-dropdown-item v-model="dateValue" :options="option2" @change="onSelet" />
			</van-dropdown-menu>
		</div>
		<div class="statistics">
			<span>
				<i class="m-j">支出￥{{expenditure}}</i> 
				<i>收入{{income}}</i>
			</span>
			<span>
				<i class="v-j">统计</i>
				<van-icon name="arrow" />
			</span>
		</div>
		<van-pull-refresh v-model="refreshing" @refresh="onRefresh">
		  <van-list
		    v-model="loading"
		    :finished="finished"
		    finished-text="没有更多了"
		    @load="onLoad"
		  >
		    <ul class="list-box" v-for="item in list" :key="item.id">
		    	<li>
		    		<div class="left-box">
		    			<img :src="item.image ? host + item.image : ''" alt="">
		    			<span>
		    				<i>{{item.expenditure_type}}</i>
		    				<i>{{item.createtime | dateFormat}}</i>
		    			</span>
		    		</div>
		    		<span :class="[item.record_type =='income' ? 'rgt-box' : '']">{{item.record_type =="income" ? '+' : '-' }}{{item.price}}</span>
		    	</li>
		    </ul>
		  </van-list>
		</van-pull-refresh>
    </div>
</template>

<script>
	import { mapState } from "vuex";
	import { Toast } from "vant";
	import { HOST, DEFAULTHEADER, MALE, GIRL } from "../../utils/config.js";
	import { timeConvert } from "../../utils/conversion.js";
	export default {
		name: 'purchaseRecord',
		data() {
			return {
				refreshing: false,
				loading: false,
				finished: false,
				currPage:0,
				list:[],
				host:HOST,
				value1: 'order',
				dateValue: 1,
				expenditure:0,
				income:0,
				option1: [],
				option2: []
			};
		},
		computed: {
			...mapState(['user']),
			_api: function () {
				return this.$api._views.personal;
			},
		},
		methods: {
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
					member_id:this.user.member_id,
					expenditure_type: this.value1,
					month: this.dateValue,
					start:this.currPage
				},
				{
					data,
					expenditure,
					income,
					expenditure_types,
					months,
					status
				} = await this._api.checkMyMoneyRecord( params );
				
				if ( status != '1' ) return false;
				
				this.list = [...this.list,...data]
				
				this.expenditure = expenditure;
				
				this.option1 = expenditure_types;
				
				this.option2 = months,
				
				this.income = income;
				
				this.loading = false;
				
				// 数据全部加载完成
				if ( !data.length ) this.finished = true;
				
			},
			
			onSelet(){
				this.list = [];
				this.currPage = 0;
				this.getData();
			}
		}
	};
</script>
<style lang="scss" scoped>
	@import "~@/assets/css/mixin.scss";
	.consumption{
		.header-box{
			@include display-flex();
			@include align-items(center);
			position: fixed;
			width: 100%;
			height: 50px;
			background-color: rgb(238, 238, 238);
			color: #333;
			padding: 0 0 0 20px;
			z-index: 1;
			font-size: 18px;
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
				background-color: #333;
				transform: rotate(45deg);
				transform-origin: 0 0;
			}
			em::after{
				transform: rotate(-45deg);
			}
		}
		.all-type{
			padding-top: 50px;
			.van-dropdown-menu__bar{
				background-color: #eeeeee;
			}
		}
		.statistics{
			@include display-flex();
			@include justify-content_flex-justify();
			padding: 15px 20px;
			background-color: #F6F6F6;
			span{
				@include display-flex();
				@include align-items(center);
				font-size: 14px;
				color: #8A8A8A;
				i{
					font-style: normal;
				}
				i.m-j{
					margin-right: 15px;
				}
				i.v-j{
					margin-right: 5px;
				}
			}
		}
		.list-box{
			@include display-flex();
			@include justify-content_flex-justify();
			li{
				@include display-flex();
				@include justify-content_flex-justify();
				width: 100%;
				padding:20px;
				margin-bottom: 1px;
				background-color: #fff;
				.left-box{
					@include display-flex();
					@include align-items(center);
					img{
						width: 40px;
						height: 40px;
						margin-right: 10px;
					}
					span{
						@include display-flex();
						@include flex-direction-column();
						i{
							font-size: 14px;
							font-style: normal;
							color: rgb(184, 184, 184);
						}
						i:first-child{
							color: #333;
							font-size: 15px;
							margin-bottom: 5px;
						}
					}
				}
				.rgt-box{
					color:'#FFC963'
				}
			}
		}
	}
</style>
<style lang="scss">
	.consumption{
		.all-type{
			.van-dropdown-menu__bar{
				background-color: #eeeeee;
			}
		}
		.van-cell{
			padding: 15px 20px;
		}
	}
</style>