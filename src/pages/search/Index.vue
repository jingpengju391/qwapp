<template>
	<div class="lovers-box">
		<div class="header-box">
			<em @click="$router.go(-1)"></em>
			<span>搜索</span>
			<i></i>
		</div>
		<van-search
			class="search-v"
			v-model="value"
			shape="round"
			background="transparent"
			placeholder="请输入搜索ID"
			@input="getData"
		/>
		<div class="list-c-box">
			<ul class="list-box">
				<li v-if="userInfo">
				   <div class="left-box">
					   <i @click="toPersonal"><img :src="userInfo && userInfo.head_image ? host + userInfo.head_image : headImg"  alt="加载失败"></i>
					   <div>
						   <span>{{userInfo && userInfo.nick_name ? userInfo.nick_name : '无昵称'}}</span>
						   <span>{{userInfo && userInfo.content ? userInfo.content :'无内容'}}</span>
					   </div>
				   </div>
				   <div v-if="userInfo.is_accept == '0'" class="rgt-box">待接受</div>
				   <div v-if="userInfo.is_accept == '1'" class="rgt-box active">已接受</div>
				   <div v-if="userInfo.is_accept == '2'" class="rgt-box active">已拒绝</div>
				</li>
			</ul>
		</div>
	</div>
</template>

<script>
	import { mapState } from "vuex";
	import { Toast } from "vant";
	import { HOST, DEFAULTHEADER, MALE, GIRL } from "../../utils/config.js";
	export default {
		data(){
			return {
				host:HOST,
				headImg:require('../../' + DEFAULTHEADER),
				male:require('../../' + MALE),
				girl:require('../../' + GIRL),
				isAccept:'start',
				value:'',
				userInfo:null
			}
		},
		computed: {
			...mapState(['user']),
			_api: function () {
				return this.$api._views.personal;
			},
		},
		methods:{
			// 获取数据
			async getData(){
				this.userInfo = {}
				const
				params = {
					member_id:this.user.member_id,
					uid:this.value,
				},
				{
					data
				} = await this._api.getMemberById( params );
				
				this.userInfo = data;
			},
			toPersonal(){
				this.$router.push({
					path:'/user-info',
					query:{
						title:this.userInfo.nick_name,
						id:this.userInfo.id,
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
		.search-v{
			padding-top: 60px;
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
					}
					span:first-child{
					    color: #333;
					    font-size: 18px;
					    font-weight: bold;
					    margin: 7px 0 0 0;
					}
				}
			}
		}
	}
</style>
