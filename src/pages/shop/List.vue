<template>
	<div class="shop-list-box">
		<div class="header-box">
			<em @click="$router.go(-1)"></em>
			<van-tabs 
				class="tab-nav-box"
				v-model="activeId" 
				scrollspy 
				sticky   
				color="#FFC963"
				background="transparent" 
				title-active-color="#FFFFFF"
				line-height="0px"
				:swipe-threshold='4' 
				:animated="true" 
				:border="false" 
				@click="getData(1)">
				<van-tab v-for="item in tabSwich" :title="item.name" :name="item.id" :key="item.id"></van-tab>
			</van-tabs>
		</div>
		<div class="list-box">
			<van-pull-refresh v-model="refreshing" @refresh="onRefresh">
			  <van-list
			    v-model="loading"
			    :finished="finished"
			    finished-text="没有更多了"
			    @load="onLoad"
			  >
			    <ul class="con-box">
					<li v-for="item in list" :key="item.id" @click="setRouter(item)">
						<div class="top-box">
							<em><img :src="host + item.store_head" alt=""></em>
							<span>
								<i>{{item.store_name}}</i>
								<i>{{item.store_content}}</i>
							</span>
						</div>
						<div class="btm-box">
							<span v-for="(iter, index) in item.tags" :key="iter+index">{{iter}}</span>
						</div>
					</li>
				</ul>
			  </van-list>
			</van-pull-refresh>
		</div>
	</div>
</template>

<script>
	import { mapState } from "vuex";
	import { HOST } from "../../utils/config.js";
	export default {
		props:{
		    inviteInfo:{
		        type: Object,
		        default: () => null
		    },
		},
		data() {
			return {
				host:HOST,
				activeId:14,
				tabSwich:[],
				refreshing: false,
				loading: false,
				finished: false,
				currPage:0,
				list:[],
			}
		},
		computed: {
			...mapState(['user']),
			typeId: function () {
				return this.$route.query.id;
			},
			inviteId: function () {
				return this.$route.query.inviteId;
			},
			_home: function () {
				return this.$api._views.home;
			},
			_api: function () {
				return this.$api._views.shop;
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
			// banner 跳转
			setRouter( currItem ){
				
				this.$router.push({
					path: '/shop-detail', 
					query: {
						id:currItem.id,
						inviteId:this.inviteId
					}
				})
			},
			// 获取商家数据
			async getType(){
				const
				params = {
					cityzip: 230100,
					member_id:this.user.member_id
				},
				{
					data,
					status
				} = await this._home.index( params );
				
				if( status !== '1' ) return false;
				
				this.tabSwich = data.category;
				
			},
			// 获取数据
			async getData( v ){
				
				if( v ){
					this.currPage = 0;
					this.list = [];
				}
				
				this.currPage ++
				
				const
				params = {
					category_id: this.activeId,
					start:this.currPage
				},
				{
					data,
					status
				} = await this._api.storelist( params );
				
				if ( status != '1' ) return false;
				
				data.forEach(item => item.tags = item.biaoqian.split(','))
				
				this.list = [...this.list,...data]
				
				this.loading = false;
				
				// 数据全部加载完成
				if ( !data.length ) this.finished = true;
				
			},
		},
		mounted() {
			this.getType();
		},
		created(){
			this.typeId ? this.activeId = this.typeId : ''
		}
	}
</script>

<style lang="scss" scoped>
	@import "~@/assets/css/mixin.scss";
	.shop-list-box{
		@include display-flex();
		@include justify-content();
		@include flex-direction-column();
		width: 100%;
		.header-box{
			@include display-flex();
			@include justify-content();
			@include align-items(center);
			position:fixed;
			top: 0;
			left: 0;
			width: 100%;
			height: 50px;
			background: #FFC963;
			z-index: 1;
			.tab-nav-box{
				width: 80%;
			}
			em{
				position: absolute;
				left:20px;
				width: 10px;
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
		ul.con-box{
			@include display-flex();
			@include justify-content();
			@include flex-direction-column();
			width: 100%;
			margin: 50px 0 0 0;
			padding: 20px;
			li{
				@include display-flex();
				@include flex-direction-column();
				width: 100%;
				background-color: #fff;
				padding: 20px 20px 10px 20px;
				margin-bottom: 20px;
				border-radius: 10px;
				.top-box{
					@include display-flex();
					em{
						display: inline-block;
						width: 60px;
						height: 60px;
						overflow: hidden;
						border-radius: 50%;
						margin-right: 10px;
						img{
							width: 100%;
							height: 100%;
							object-fit: cover;
						}
					}
					span{
						@include display-flex();
						@include flex-direction-column();
						width: calc(100% - 70px);
						i{
							font-style: normal;
							color: #333;
							font-size: 18px;
							font-weight: 800;
						}
						i:last-child{
							font-size: 14px;
							color: #ccc;
							font-weight: normal;
							margin-top: 10px;
						}
					}
				}
				.btm-box{
					@include display-flex();
					flex-wrap: wrap;
					padding-left: 70px;
					font-size: 12px;
					color: #FFC963;
					margin-top: 10px;
					span{
						display: inline-block;
						margin-right: 10px;
						border: 1px solid #FFC963;
						padding: 3px 10px;
						border-radius: 5px;
						margin-bottom: 10px;
					}
				}
			}
		}
	}
</style>
<style lang="scss">
	@import "~@/assets/css/mixin.scss";
	.shop-list-box{
		.header-box{
			.tab-nav-box{
				.van-tab{
					color: #fff;
				}
				.van-tab--active{
					font-size: 18px;
					font-weight: 800;
				}
			}
		}
	}
</style>
