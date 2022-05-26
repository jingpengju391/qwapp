<template>
	<van-pull-refresh v-model="refreshing" @refresh="onRefresh">
		<van-list
		v-model="loading"
		:finished="finished"
		finished-text="没有更多了"
		@load="onLoad"
		>
		
			<ul class="passers-box">
				<li v-for="(item, index) in list" :key="item.createtime+index">
					<div class="top-box">
						<em class="header-img" @click="setRouter('/chat',{id:item.id,title:item.nick_name})">
							<img :src="item.head_image ? host + item.head_image : defaultHeader" alt="">
						</em>
						<div class="rgt-box">
							<span>
								<i>{{item.nick_name ? item.nick_name : '未录入名字'}}</i>
								<em v-if="item.genderdata">
									<img :src="item.genderdata == 'female' ?  male : girl" alt="">
								</em>
							</span>
							<span class="brief-txt">{{ item.createtime | dateFormat }}</span>
						</div>
					</div>
					<!-- <time>121321321</time> -->
				</li>
			</ul>

		</van-list>
	</van-pull-refresh>
</template>

<script>
	import { mapState } from "vuex";
	import { Toast } from "vant";
	import { HOST , MALE , GIRL , DEFAULTHEADER } from "../../../utils/config.js";
	export default {
		data() {
			return {
				host:HOST,
				defaultHeader:require( '../../../' + DEFAULTHEADER ),
				male:require( '../../../' + MALE ),
				girl:require( '../../../' + GIRL ),
				list:[],
				refreshing: false,
				loading: false,
				finished: false,
				currPage:0,
			}
		},
		computed: {
			...mapState(['user']),
			_api: function () {
				return this.$api._views.passers;
			},
			apiStr: function () {
				return this.$route.query.id;
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
					start:this.currPage
				},
				{
					data,
					status
				} = await this._api[this.apiStr]( params );
				
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
		},
		mounted() {
			console.log(this._api)
			// this.getData();
		}
		
	}
</script>

<style lang="scss" scoped>
	@import "~@/assets/css/mixin.scss";
	.passers-box{
		@include display-flex();
		@include flex-direction-column();
		width: 100%;
		padding: 20px;
		li{
			@include display-flex();
			@include flex-direction-column();
			width: 100%;
			background-color: #fff;
			border-radius: 8px;
			padding: 20px;
			margin-bottom: 15px;
			div.top-box{
				@include display-flex();
				@include align-items(center);
				em.header-img{
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
					width: calc(100% - 70px);
					span{
						color: #ccc;
						font-size: 14px;
						i{
							font-size: 16px;
							font-style: normal;
							font-weight: 800;
							color: #333;
						}
						em{
							display: inline-block;
							width: 20px;
							margin-left: 5px;
						}
					}
					.brief-txt{
						margin-top: 10px;
						white-space:nowrap;
						overflow:hidden;
						text-overflow:ellipsis;
						color: #FFC963;
					}
				}
			}
			time{
				display: inline-block;
				width: calc(100% - 70px);
				margin: 10px 0 0 70px;
				font-size: 14px;
				color: #FFC963;
			}
		}
		li:last-child{
			margin-bottom: 0;
		}
	}
</style>
