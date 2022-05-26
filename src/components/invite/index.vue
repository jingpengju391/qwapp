<template>
	<div :class="[shop?'invite-box invite-shop':'invite-box']">
		<div class="left-box">
			<i @click="setRouter('/user-info',{title:inviteInfo.nick_name,id:inviteInfo.id})">
				<img :src="inviteInfo.head_image ? host + inviteInfo.head_image : defaultHeader" alt="">
			</i>
			<div>
				<span>{{inviteInfo.nick_name}}<img :src="inviteInfo.genderdata == 'male' ? male : girl" alt=""></span>
				<span>{{inviteInfo.age}}岁</span>
			</div>
		</div>
		<span class="rgt-btn" @click="setRouter('/order',{title:'确认订单',orderId:inviteInfo.order_id})">接受</span>
		<span class="mix-txt">$:{{inviteInfo.start_price}}%</span>
	</div>
</template>

<script>
	import { HOST , MALE , GIRL , DEFAULTHEADER } from "../../utils/config.js";
	export default {
		props:{
		    inviteInfo:{
		        type: Object,
		        default: () => null
		    },
			shop:{
			    type: Boolean,
			    default: () => false
			},
		},
		data() {
			return {
				host:HOST,
				defaultHeader:require( '../../' + DEFAULTHEADER ),
				male:require( '../../' + MALE ),
				girl:require( '../../' + GIRL ),
			}
		},
		methods: {
			//跳转
			setRouter( path, query ){
				this.$router.push({
					path: path, 
					query: query
				})
			},
		},
	}
</script>

<style lang="scss" scoped>
	@import "~@/assets/css/mixin.scss";
	.invite-box{
		position: relative;
		@include display-flex();
		@include align-items(center);
		@include justify-content_flex-justify();
		background-color: #FCDC8B;
		border-radius: 10px;
		padding: 25px 20px 25px 0;
		.left-box{
			@include display-flex();
			@include align-items(center);
			margin: 0 0 0 -30px;
			i{
				display: inline-block;
				width: 60px;
				height: 60px;
				border-radius: 50%;
				overflow: hidden;
				margin: 0 10px 0 0;
				border: 1px solid #fddfbc;
				img{
					width: 100%;
					height: 100%;
					object-fit: cover;
				}
			}
			div{
				@include display-flex();
				@include flex-direction-column();
				span{
					color: #182B33;
					font-size:14px;
				}
				span:first-child{
					position: relative;
					font-size: 18px;
					font-weight: 800;
					color: #182B33;
					margin-bottom: 20px;
					img{
						position: absolute;
						width: 20px;
						top: -10px;
						right: -23px;
					}
				}
			}
		}
		.rgt-btn{
			font-size: 16px;
			color: #333;
			line-height: 30px;
			border: 1px solid #333;
			border-radius: 15px;
			padding: 0 15px;
		}
		.mix-txt{
			position: absolute;
			right: -15px;
			top: -12px;
			background: #FE5145;
			color: #fff;
			font-size: 14px;
			line-height: 24px;
			padding: 0 8px;
			border-radius: 12px;
		}
	}
	.invite-shop{
		background-color: #fff;
		.rgt-btn{
			color: #FFC661;
			border-color: #FFC661;
		}
		.mix-txt{
			background-color: #FFC661;
		}
	}
</style>
