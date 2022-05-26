<template>
	<div class="lovers-box">
		<div class="header-box">
			<em @click="$router.go(-1)"></em>
			<span>情侣请求</span>
			<van-icon name="search" @click="$router.push('/search')" />
		</div>
		<div class="tab-box">
		   <span v-for="item in tab" :key="item.name" :class="[item.curr?'active':'']" @click="setTab(item)"><i>{{item.name}}</i></span>
		</div>
		<div class="list-c-box">
			<van-pull-refresh v-model="refreshing" @refresh="onRefresh">
			  <van-list
			    v-model="loading"
			    :finished="finished"
			    finished-text="没有更多了"
			    @load="onLoad"
			  >
				<ul class="list-box">
					<li v-for="item in list" :key="item.id">
					   <div class="left-box">
						   <i @click="toPersonal(item)">
							   <img :src="item.info && item.info.head_image ? host + item.info.head_image : headImg" alt="加载失败">
							</i>
						   <div>
							   <span>{{item.info && item.info.nick_name  ? item.info.nick_name : '无昵称'}}</span>
							   <span>{{item.info && item.info.content ? item.info.content :'无内容'}}</span>
						   </div>
					   </div>
					   <div v-if="item.is_accept == '0'" class="rgt-box">待接受</div>
					   <div v-if="item.is_accept == '1'" class="rgt-box active">已接受</div>
					   <div v-if="item.is_accept == '2'" class="rgt-box active">已拒绝</div>
					</li>
				</ul>
			  </van-list>
			</van-pull-refresh>
		</div>
	</div>
</template>

<script>
	import { mapState } from "vuex";
	import { Toast } from "vant";
	import { HOST, DEFAULTHEADER, MALE, GIRL } from "../../../utils/config.js";
	export default {
		data(){
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
				isAccept:'start',
				tab:[
				    {
				        name:'我的请求',
				        curr:true,
				        isAccept:'start'
				    },
				    {
				        name:'待接受',
				        curr:false,
				        isAccept:'end'
				    }
				],
			}
		},
		computed: {
			...mapState(['user']),
			_api: function () {
				return this.$api._views.personal;
			},
		},
		methods:{
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
					who:this.isAccept,
					member_id:this.user.member_id,
					start:this.currPage
				},
				{
					data,
					status
				} = await this._api.intendedlist( params );
				
				if ( status != '1' ) return false;
				
				this.list = [...this.list,...data]
				
				this.loading = false;
				
				// 数据全部加载完成
				if ( !data.length ) this.finished = true;
				
			},
			setTab( currItem ){
			    this.tab.forEach(item => {
			        item.curr = false;
			        currItem.name == item.name ? item.curr = true : '';
			    });
			   this.isAccept = currItem.isAccept;
			   this.list = [];
			   this.currPage = 0;
			   this.getData();
			},
			toPersonal( currItem ){
				console.log(currItem)
				this.$router.push({
					path:'/user-info',
					query:{
						title:currItem.info.nick_name,
						id:currItem.info.id,
					}
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	@import "~@/assets/css/mixin.scss";
	.lovers-box{
		.header-box{
			@include display-flex();
			@include align-items(center);
			@include justify-content_flex-justify();
			position: fixed;
			width: 100%;
			height: 50px;
			background-color: #FFC963;
			color: #fff;
			padding:0 20px;
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
				background-color: #fff;
				transform: rotate(45deg);
				transform-origin: 0 0;
			}
			em::after{
				transform: rotate(-45deg);
			}
		}
		.tab-box{
			position: fixed;
			top: 60px;
		    width: 90%;
		    background: #fff;
		    margin: 10px 0 0 5%;
		    line-height: 3;
		    font-size: 14px;
		    text-align: center;
		    border-radius: 5px;
			z-index: 2;
			span{
			    width: 50%;
			    display: inline-block;
			    color: #333;
				i{
				    font-style: normal;
				}
			}
			span.active{
			    color: rgb(255, 201, 99);
				i{
				    border-bottom: 1px solid rgb(255, 201, 99);
				}
			}
		}
		.list-c-box{
			padding-top: 110px;
		}
		.list-box{
		    width: 90%;
		    margin: 15px 0 0 5%;
		    line-height: 3;
		    font-size: 14px;
		    border-radius: 5px;
			li{
			    display: inline-block;
			    width: 100%;
			    padding: 10px;
			    -webkit-box-sizing: border-box;
			    -moz-box-sizing: border-box;
			    box-sizing: border-box;
			    background: #fff;
				border-radius: 5px;
				div.left-box{
				    float: left;
				}
				div.rgt-box{
				    float: right;
				    margin: 7px 0 0 0;
				    color: #bababa;
				    font-weight: bold;
				}
				div.active{
				    color: rgb(255, 201, 99);
				}
			}
			li:first-child{
			    margin: 0;
			}
			div.left-box {
				i{
				    width: 1.5rem;
				    height: 1.5rem;
				    float: left;
				    border-radius: 50%;
				    overflow: hidden;
					img{
					    display: block;
					    width: 100%;
					    height: 100%;
					    object-fit: cover;
					}
				}
				div{
				    float: left;
				    margin: 0 0 0 10px;
					span{
					    display: block;
					    line-height: 1.5;
					    color: #9292928a;
					    font-size: 12px;
						margin-top: 5px;
					}
					span:first-child{
					    color: #333;
					    font-size: 18px;
					    font-weight: bold;
					}
				}
			}
		}
	}
</style>
