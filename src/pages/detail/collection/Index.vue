<template>
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
				<div class="btn-box">
					<span @click="onRelieve( item )">解除收藏</span>
					<span @click="setRouter( item )">邀约</span>
				</div>
			</li>
		</ul>
	  </van-list>
	</van-pull-refresh>
</template>

<script>
	import { mapState } from "vuex";
	import { HOST } from "../../../utils/config.js";
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
			// banner 跳转
			setRouter( currItem ){
				
				this.$router.push({
					path: '/shop-detail', 
					query: {
						id:currItem.id
					}
				})
			},
			// 获取数据
			async getData(){
				
				this.currPage ++
				
				const
				params = {
					start:this.currPage,
					member_id:this.user.member_id
				},
				{
					data,
					status
				} = await this._api.collectlist( params );
				
				if ( status != '1' ) return false;
				
				data.forEach(item => item.tags = item.biaoqian.split(','))
				
				this.list = [...this.list,...data]
				
				this.loading = false;
				
				// 数据全部加载完成
				if ( !data.length ) this.finished = true;
				
			},
			// 解除收藏
			async onRelieve( currItem ){
				
				const
				params = {
					collect_record_id:currItem.id,
					member_id:this.user.member_id
				},
				{
					data,
					status
				} = await this._api.relievecollect( params );
				
				if( status != '1' ) return false;
				
				this.list.splice(this.list.findIndex(item => item.id === currItem.id), 1)
				
			},
		},
	}
</script>

<style lang="scss" scoped>
	@import "~@/assets/css/mixin.scss";
	ul.con-box{
		@include display-flex();
		@include justify-content();
		@include flex-direction-column();
		width: 100%;
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
				span{
					display: inline-block;
					margin-right: 10px;
					border: 1px solid #FFC963;
					padding: 3px 10px;
					border-radius: 5px;
					margin-bottom: 10px;
				}
			}
			.btn-box{
				@include display-flex();
				margin:5px 0 10px 70px;
				span{
					font-size: 14px;
					background-color: #ff5248;
					color: #fff;
					line-height: 32px;
					padding: 0 20px;
					border-radius: 18px;
					font-weight: 700;
					margin-right:10px;
				}
				span:last-child{
					background-color: #fec960;
				}
			}
		}
		li:last-child{
			margin-bottom: 0;
		}
	}
</style>
