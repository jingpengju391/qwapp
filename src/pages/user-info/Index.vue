<template>
	<div class="user-box">
		<header>
			<p>
				<em @click="$router.go(-1)"></em>
				<i>{{userInfo.nick_name}}</i>
			</p>
			<span @click="setMore"></span>
		</header>
		<div class="con-box">
			<div class="introduction-box">
				<div>
					<em>
						<img :src="userInfo.head_image?host + userInfo.head_image:defaultHeader" alt="">
					</em>
					<p>
						<span>
							<i>{{userInfo.nick_name}}</i>
							<i class="sex-box"><img :src="userInfo.genderdata == 'male' ? male : girl" alt=""></i>
						</span>
						<span>
							<i>{{userInfo.age}}岁</i>
							<i>{{userInfo.profession}}</i>
						</span>
					</p>
				</div>
				<div class="tag-box">
					<span v-for="(item, index) in userInfo.tags" :key="item + index" class="tag-txt">{{item}}</span>
				</div>
				<div class="user-detail" v-if="userInfo.is_privacy">
					<span>
						<i>身高：{{userInfo.stature}} cm</i>
						<i>体重：{{userInfo.weight}} kg</i>
						<i>生日：{{userInfo.birthday ? userInfo.birthday.substring(0, 10) : ''}}</i>
					</span>
					<span>
						<i>相亲次数：{{userInfo.see_number}} 次</i>
						<i>婚姻状态：{{userInfo.maritalstatus === '0' ? '未婚' : (userInfo.maritalstatus === '1' ? '离异' : '已婚' )}}</i>
						<i>子女状态：{{userInfo.childrennumber}}</i>
					</span>
					<span>
						<i>均年收入：{{userInfo.income}}</i>
					</span>
				</div>
			</div>
			<div class="user-monologue">
				<h6>独白</h6>
				<span>{{userInfo.content}}</span>
			</div>
			<div class="user-monologue">
				<h6>用户照片</h6>
				<div class="album-box">
					<i class="photo-box" v-for="(iter,index) in inm" :key="index"  @click="lookImg(inm,index)">
						<img :src="host + iter" alt="">
					</i>
				</div>
			</div>
		</div>
		<div class="btm-box">
			<span @click="setRouter('/chat',{title:userInfo.nick_name,id:userInfo.id})">聊天</span>
			<span @click="setRelation">关联意中人</span>
		</div>
		<van-dialog v-model="show" class="choose-box" title="操作" show-cancel-button @confirm="toCheck">
			<van-radio-group v-model="radio">
				<van-radio class="choose-list" name="1" checked-color="#FFC963">举报</van-radio>
				<van-radio class="choose-list" name="2" checked-color="#FFC963">关联意中人</van-radio>
			</van-radio-group>
			<van-field v-if="radio==1" v-model="value" label="举报留言" type="textarea" placeholder="请输入用户名" />
		</van-dialog>
		<ImgInfo :ImgInfo="imgInfo"></ImgInfo>
	</div>
</template>

<script>
	import { mapState } from "vuex";
	import { Toast } from "vant";
	import ImgInfo from "../../components/Image-info"
	import { HOST , MALE , GIRL , DEFAULTHEADER } from "../../utils/config.js";
	export default {
		components: {
			ImgInfo
		},
		data() {
			return {
				host:HOST,
				show:false,
				radio:'',
				value:'',
				defaultHeader:require( '../../' + DEFAULTHEADER ),
				male:require( '../../' + MALE ),
				girl:require( '../../' + GIRL ),
				userInfo:{},
				inm:[
					'/uploads/tingfeng.jpg',
					'/uploads/tingfeng.jpg',
					'/uploads/tingfeng.jpg',
					'/uploads/tingfeng.jpg',
				],
				imgInfo:{
					list:[],
					curr:''
				}
			}
		},
		computed: {
			...mapState(['user']),
			_api: function () {
				return this.$api._views.user;
			},
			userId: function () {
				return this.$route.query.id;
			},
			articleId: function () {
				return this.$route.query.articleId;
			},
		},
		methods: {
			// 获取数据
			async getData(){
				
				const
				params = {
					other_look_id: this.userId,
					member_id: this.user.member_id
				},
				{
					data,
					status
				} = await this._api.look( params );
				
				if( status != '1' ) return false;
				
				data.tags = data.label ? data.label.split(',') : ''
				
				this.userInfo = data;
				
			},
			lookImg( imgList,curr ){
				
				const IMGINFO = {
					imgList:imgList,
					curr:curr
				}
				this.imgInfo = IMGINFO;
				
			},
			// banner 跳转
			setRouter( path, query ){
				
				this.$router.push({
					path: path, 
					query: query
				})
			},
			setMore(){
				this.show = true
			},
			toCheck(){
				if( !this.value && this.radio == '1' ){
					Toast('请输入举报留言');
					return false;
				}
				
				this.radio == '1' && this.setSeport();
				
				this.radio == '2' && this.setRelation();
			},
			// 举报
			async setSeport(){
				const
				params = {
					content: this.value,
					member_id: this.user.member_id,
					quan_id: this.userId
				},
				{
					data,
					msg,
					status
				} = await this._api.report( params );
				
				if( status != '1' ) return false;
				Toast(msg);
			},
			// 关联意中人
			async setRelation(){
				const
				params = {
					member_id: this.user.member_id,
					intended_id: this.userId,
					operation:'offline',
					order_id:''
				},
				{
					data,
					msg,
					status
				} = await this._api.relevancemember( params );
				
				if( status != '1' ) return false;
				Toast(msg);
			}
		},
		mounted() {
			this.getData();
		}
	}
</script>

<style lang="scss" scoped>
	@import "~@/assets/css/mixin.scss";
	.user-box{
		@include display-flex();
		@include justify-content();
		@include flex-direction-column();
		header{
			@include display-flex();
			@include align-items(center);
			@include justify-content_flex-justify();
			height: 50px;
			padding: 0 20px;
			border-bottom: 1px solid #ddd;
			font-size: 16px;
			color: #182B33;
			p{
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
				i{
					font-style: normal;
					margin-left: 10px;
					font-weight: 800;
				}
			}
			span{
				display: inline-block;
				width: 5px;
				height: 5px;
				background-color: #333;
				border-radius: 50%;
				margin-right: 10px;
				position: relative;
			}
			span::before, span::after{
				content: '';
				display: block;
				width: 5px;
				height: 5px;
				background-color: #333;
				border-radius: 50%;
				position: absolute;
				left: -10px;
			}
			span::after{
				content: '';
				display: block;
				width: 5px;
				height: 5px;
				background-color: #333;
				border-radius: 50%;
				position: absolute;
				left: auto;
				right: -10px;
			}
		}
		.con-box{
			@include display-flex();
			@include justify-content();
			@include flex-direction-column();
			padding: 20px;
			.introduction-box{
				@include display-flex();
				@include flex-direction-column();
				background-color: #FCDC8B;
				border-radius: 10px;
				padding: 20px;
				div{
					@include display-flex();
					@include align-items(center);
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
					p{
						span{
							position: relative;
							color: #182B33;
							font-size: 16px;
							i{
								font-style: normal;
							}
							i.sex-box{
								display: inline-block;
								width: 20px;
								height: 20px;
								position: absolute;
								top: -5px;
								right:-25px;
								img{
									width: 100%;
									height: 100%;
									object-fit: cover;
								}
							}
						}
						span:last-child{
							display: block;
							font-size: 12px;
							margin-top: 5px;
							i{
								margin-right: 10px;
							}
						}
					}
					.tag-txt{
						padding: 0 10px;
						background: #FFC963;
						color: #182B33;
						font-size: 12px;
						margin-right: 5px;
						border-radius: 3px;
						line-height: 20px;
					}
				}
				div.tag-box{
					margin: 20px 0 0 0;
				}
				.user-detail{
					@include display-flex();
					@include align-items(flex-start);
					margin-top: 20px;
					i{
						font-style: normal;
						font-size: 12px;
						margin-bottom: 10px;
					}
					span{
						@include display-flex();
						
						@include flex(1);
						@include flex-direction-column();
					}
				}
			}
		}
		.user-monologue{
			@include display-flex();
			@include flex-direction-column();
			background-color: #fff;
			padding: 15px;
			border-radius: 8px;
			margin-top: 20px;
			h6{
				font-size: 16px;
				color: #333;
				margin-bottom: 10px;
			}
			span{
				font-size: 12px;
				line-height: 1.5;
				color: #A6AEB2;
			}
			.album-box{
				@include display-flex();
				i{
					@include display-flex();
					width: 22%;
					margin-right: 3%;
					padding-bottom: 22%;
					border-radius: 5px;
					position: relative;
					overflow: hidden;
					img{
						width: 100%;
						height: 100%;
						object-fit: cover;
						position: absolute;
						left: 0;
						top: 0;
					}
				}
			}
		}
		.btm-box{
			@include display-flex();
			@include justify-content();
			span{
				line-height: 36px;
				color: #fff;
				font-size: 16px;
				background-color: #FFC963;
				border-radius: 18px;
				padding: 0 30px;
			}
			span:last-child{
				background-color: #FE5145;
				margin-left: 10px;
			}
		}
		.choose-box{
			padding: 0 20px;
			.choose-list{
				margin:10px 0;
			}
		}
	}
</style>
