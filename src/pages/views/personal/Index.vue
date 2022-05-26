<template>
	<div class="personal-box">
		<header>
			<span>个人中心</span>
			<span @click="toAuthentication">实名认证</span>
		</header>
		<van-notice-bar v-if="check" mode="closeable" left-icon="info-o">{{check}}</van-notice-bar>
		<div class="top-box">
			<div class="top-left-box">
				<i :class="[userInfo.touxiang_status == '审核中' ? 'chaeck-style' : '']">
					<img :src="userInfo.head_image ? host + userInfo.head_image : defaultHeader" alt="">
				</i>
				<span>
					<em>{{userInfo.nick_name ? userInfo.nick_name : '未填写'}}<img :src="userInfo.genderdata == 'female' ? girl : male" alt=""></em>
					<em>{{userInfo.age}} 岁 {{userInfo.profession}}</em>
					<em>ID {{userInfo.id}}</em>
				</span>
			</div>
			<span class="top-rgt-btn" @click="setRouter('/space')">情侣空间</span>
		</div>
		<div class="ctr-box">
			<span @click="setRouter('/order-way',{order:1})">我发起的订单</span>
			<span @click="setRouter('/order-way',{order:0})">我接受的订单</span>
		</div>
		<ul class="btm-con">
			<li class="btm-box" v-for="item in aButton" :key="item.name" @click="setRouter( item.path,item.query )">
				<van-icon class="btm-icon-i" :name="item.name" :color="item.color" />
				<span>
					<em>{{item.lable}}</em>
					<van-icon name="arrow"  color="#969799"/>
				</span>
			</li>
		</ul>
	</div>
</template>

<script>
	import { mapState } from "vuex";
	import { Toast, Notify } from "vant";
	import { HOST , MALE , GIRL , DEFAULTHEADER } from "../../../utils/config.js";
	export default {
		data() {
			return {
				userInfo:{},
				check:'',
				host:HOST,
				defaultHeader:require( '../../../' + DEFAULTHEADER ),
				male:require( '../../../' + MALE ),
				girl:require( '../../../' + GIRL ),
				aButton:[
					{
						name:'manager-o',
						color:'#f5b105',
						lable:'个人信息',
						path:'/personal-info',
						query:{
							title:'个人信息',
						},
					},
					{
						name:'balance-o',
						color:'#F44336',
						lable:'钱包',
						path:'/money',
						query:{
							title:'钱包',
						},
					},
					{
						name:'star-o',
						color:'#f5b105',
						lable:'收藏商家管理',
						path:'/collection',
						query:{
							title:'收藏商家管理',
						},
					},
					{
						name:'info-o',
						color:'#00BCD4',
						lable:'版本信息管理',
						path:'/version',
						query:{
							title:'版本信息管理',
						},
					},
					{
						name:'shop-o',
						color:'#009688',
						lable:'商家申请入驻',
						path:'/injection',
						query:{
							title:'商家入驻',
						},
					},
					{
						name:'coupon-o',
						color:'#f5b105',
						lable:'优惠券管理',
						path:'/own-coupon',
						query:{
							title:'优惠券管理',
						},
					},
					{
						name:'setting-o',
						color:'#2196F3',
						lable:'设置',
						path:'/set-up',
						query:{
							title:'设置',
						},
					}
				]
			}
		},
		computed: {
			...mapState(['user']),
			_api: function () {
				return this.$api._views.personal;
			},
		},
		methods: {
			// 认证校验
			toAuthentication(){
				
				this.setRouter('/certification',{
					title:'实名认证'
				})
				
			},
			// banner 跳转
			setRouter( path, v ){
				
				let obj = {
					path: path
				}
				
				v ?  obj.query = v : '';
				
				this.$router.push(obj)
			},
			async getData(){
				const
				params = {
					member_id:this.user.member_id,
				},
				{
					data,
					msg,
					status
				} = await this._api.personalinformation( params );
				
				if( status !== '1' ) return false;
				
				this.userInfo = data.member
				
				this.check = '';
				
				if( this.userInfo.shenfenzheng_status == "被拒绝" || this.userInfo.shenghuozhao_status == "被拒绝" || this.userInfo.touxiang_status == "被拒绝" ){
					if( this.userInfo.shenfenzheng_status == "被拒绝" ){
						this.check = '证件审核未通过请重新上传！'
					}else if(this.userInfo.shenghuozhao_status == "被拒绝"){
						this.check = '生活照审核未通过请重新上传！'
					}else{
						this.check = '头像审核未通过请重新上传！'
					}
				}else if( this.userInfo.shenfenzheng_status != "通过了" || this.userInfo.shenghuozhao_status != "通过了" || this.userInfo.touxiang_status != "通过了" ){
					this.check ='审核未通过期间，将展示原信息！';
				}
				
			}
		},
		mounted(){
			this.getData();
		}
	}
</script>

<style lang="scss" scoped>
	@import "~@/assets/css/mixin.scss";
	.personal-box{
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
			span:first-child{
				font-weight: 800;
			}
		}
		.top-box{
			@include display-flex();
			@include align-items(center);
			@include justify-content_flex-justify();
			background-color: #FCDC8B;
			padding: 20px;
			margin: 20px;
			border-radius: 10px;
			.top-left-box{
				@include display-flex();
				@include align-items(center);
				i{
					position: relative;
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
				i.chaeck-style::after{
					content: '审核中...';
					display: block;
					width: 100%;
					height: 100%;
					background-color: #00000061;
					color: #FCDC8B;
					line-height: 60px;
					text-align: center;
					position: absolute;
					left: 0;
					top: 0;
					font-style: normal;
					font-size: 12px;
				}
				span{
					@include display-flex();
					@include flex-direction-column();
					margin-left: 10px;
					em{
						font-weight: 400;
						color: #333;
						font-style: normal;
						font-size: 14px;
						img{
							width: 20px;
							margin-left: 5px;
						}
					}
					em:first-child{
						font-weight: 800;
						font-size: 18px;
						margin-bottom: 10px;
					}
					em:last-child{
						font-size: 12px;
						margin-top: 5px;
						color: #767676;
					}
				}
			}
			.top-rgt-btn{
				display: inline-block;
				padding: 0 20px;
				line-height: 30px;
				border-radius: 30px;
				border: 1px solid #333;
				font-size: 14px;
				color: #333;
			}
		}
		.ctr-box{
			@include display-flex();
			@include justify-content_flex-justify();
			margin: 0 20px 20px 20px;
			span{
				display: inline-block;
				width: 45%;
				height: 64px;
				background: url(../../../assets/imgs/accept.png);
				background-size: 100% 100%;
				line-height: 68px;
				text-align: center;
				font-size: 14px;
				color: #fff;
			}
			span:first-child{
				background: url(../../../assets/imgs/launch.png);
				background-size: 100% 100%;
			}
		}
		.btm-con{
			width: 100%;
			max-height: calc(100vh - 330px);
			overflow-y: scroll;
			padding-bottom: 60px;
			.btm-box{
				@include display-flex();
				@include align-items(center);
				width: 100%;
				background-color: #fff;
				padding:0 20px;
				// border-bottom: 1px solid #ebedf0;
				font-size: 15px;
				.btm-icon-i{
					font-weight: 700;
				}
				span{
					@include display-flex();
					@include align-items(center);
					@include justify-content_flex-justify();
					width: 100%;
					margin-left: 20px;
					border-bottom: 1px solid #ebedf0;
					em{
						font-style: normal;
						color: #182B33;
						line-height: 60px;
					}
				}
			}
			.btm-box:last-child{
				span{
					border-bottom: none;
				}
			}
		}
	}
</style>
