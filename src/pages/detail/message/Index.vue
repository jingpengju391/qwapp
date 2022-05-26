<template>
	<div class="msg-box">
		<van-pull-refresh v-model="refreshing" @refresh="onRefresh">
		  <van-list
		    v-model="loading"
		    :finished="finished"
		    finished-text="没有更多了"
		    @load="onLoad"
		  >
		    <div class="con-list-box">
				<div class="list-box" v-for="item in list" :key="item.message_id">
					<i class="img-box" @click="setRouter('/user-info',{title:item.member.nick_name,id:item.member.id})"><img :src="item.member.head_image ? host + item.member.head_image : headImg" alt=""></i>
					<div class="left-box">
						<div class="top-m-box">
							<div class="left-m-box">
								<span>
									<h6>{{item.member.nick_name}}</h6>
									<img :src="item.member.genderdata == 'female'? male : girl" alt="">
								</span>
								<span class="adess-box">
									<van-icon name="location" />
									{{item.member.address}}
								</span>
							</div>
							<div class="rgt-m-box">
								<span>总价格：{{item.order.total_price}}</span>
								<span>已支付：{{item.order.start_price}}%</span>
							</div>
						</div>
						<div class="btm-btn">
							<span @click="setRouter('/order',{title:'确认订单',orderId:item.order.id})" :class="[item.is_accept == '0' ? '' : 'already-btn']">{{ item.is_accept == '0' ? '接收' : '已接受' }}</span>
							<span @click="setRouter('/chat',{title:item.member.nick_name,id:item.member.id})">聊天</span>
						</div>
					</div>
				</div>
			</div>
		  </van-list>
		</van-pull-refresh>
	</div>
</template>

<script>
	import { mapState } from "vuex";
	import { HOST, DEFAULTHEADER, MALE, GIRL } from "../../../utils/config.js";
	export default {
		computed: {
			...mapState(['user']),
			title: function () {
				return this.$route.query.title;
			},
			_api: function () {
				return this.$api._views.message;
			},
		},
		data() {
			return {
				refreshing: false,
				loading: false,
				finished: false,
				currPage:0,
				list:[],
				host:HOST,
				headImg:require('../../../' + DEFAULTHEADER),
				male:require('../../../' + MALE),
				girl:require('../../../' + GIRL),
			}
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
					start: this.currPage,
					member_id:this.user.member_id
				},
				{
					data,
					status
				} = await this._api.messagelist( params );
				
				if ( status != '1' ) return false;
				
				this.list = [...this.list,...data]
				
				this.loading = false;
				
				// 数据全部加载完成
				if ( !data.length ) this.finished = true;
				
			},
			// banner 跳转
			setRouter( path, query ){
				
				this.$router.push({
					path: path, 
					query: query
				})
			},
	// 		// 接受邀请
	// 		async acceptBtn( itemCurr ){
				
	// 			if( itemCurr.is_accept*1 ){
	// 				return false;
	// 			}
				
	// 			const
	// 			params = {
	// 				order_id:itemCurr.order.id,
	// 				message_id: itemCurr.message_id,
	// 				member_id:this.user.member_id,
	// 				is_accept:1
	// 			},
	// 			{
	// 				data
	// 			} = await this._api.jieshou( params );
				
	// 			if ( status === '1' ) {
	// 				this.list.forEach(item => itemCurr.order.id === item.order.id ? item.is_accept = 1 : '')
	// 			}
	
	// 		}
		},
	}
</script>

<style lang="scss" scoped>
	@import "~@/assets/css/mixin.scss";
	.msg-box{
		.con-list-box{
			@include display-flex();
			@include flex-direction-column();
			padding: 20px;
			.list-box{
				@include display-flex();
				@include justify-content_flex-justify();
				background-color: #fff;
				border-radius: 10px;
				padding: 20px;
				margin-bottom: 20px;
				i.img-box{
					display: inline-block;
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
				.left-box{
					@include display-flex();
					@include flex-direction-column();
					width: calc(100% - 70px);
					.top-m-box{
						@include display-flex();
						@include justify-content_flex-justify();
						margin-top: 6px;
						padding-bottom: 20px;
						border-bottom: 1px solid #EFEEEA;
						.left-m-box{
							span{
								display: inline-block;
								position: relative;
								h6{
									font-size: 16px;
									color: #333;
									font-weight: 800;
									margin-bottom: 6px;
								}
								img{
									position: absolute;
									width: 17px;
									top: -5px;
									right: -20px;
								}
							}
							span.adess-box{
								@include display-flex();
								@include align-items(center);
								font-size: 14px;
								color: #ccc;
							}
						}
						.rgt-m-box{
							@include display-flex();
							@include flex-direction-column();
							font-size: 14px;
							font-weight: 500;
							span{
								text-align: right;
								color: #FFC963;
							}
							span:last-child{
								color:#FE5145;
								margin-top: 10px;
							}
						}
					}
					.btm-btn{
						@include display-flex();
						margin-top: 20px;
						span{
							line-height: 34px;
							border-radius: 20px;
							background-color: #FE5145;
							padding: 0 25px;
							color: #fff;
							font-size: 16px;
							font-weight: 500;
							margin: 0 10px 0 0;
						}
						span:last-child{
							background-color: #FFC963;
						}
						span.already-btn{
							background-color: transparent;
							color: #FFC963;
							font-size: 18px;
							border: 2px solid #FFC963;
						}
					}
				}
			}
			.list-box:last-child{
				margin-bottom: 0;
			}
		}
	}
</style>
