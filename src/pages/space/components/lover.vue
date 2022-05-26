<template>
	<div class="space-box">
		<div class="header-box">
			<p class="left-box">
				<em @click="$router.go(-1)"></em>
				<span>情侣空间</span>
			</p>
			<p class="rgt-box">
				<span>情侣基金：<b>{{spaceInfo.intended.balance}}</b> 元</span>
				<span @click="show = true">充值</span>
			</p>
		</div>
		
		<div class="ctr-box">
			<span>你们互相中意对方组成了情侣</span>
			<p>
				<time>{{spaceInfo.intended.createtime}}</time>
				<i>缔结情缘</i>
			</p>
		</div>
		<div class="btm-box">
			<div class="btm-t-top">
				<span>约会次数：{{spaceInfo.cishu}} 次</span>
				<i @click="setRelieve"></i>
			</div>
			<div class="btm-c-box">
				<span>
					<i><img :src="spaceInfo.startmember.head_image ? host + spaceInfo.startmember.head_image : defaultHeader" alt=""></i>
					<span class="name-txt">{{spaceInfo.startmember.nick_name ? spaceInfo.startmember.nick_name :'无昵称'}}</span>
					<span class="info-txt">
						<img :src="spaceInfo.startmember.genderdata == 'male'? male : girl" alt="">
						<em>{{spaceInfo.startmember.genderdata == 'male'? '男' : '女'}}</em>
					</span>
				</span>
				<span>
					<i><img :src="spaceInfo.endmember.head_image ? host + spaceInfo.endmember.head_image : defaultHeader" alt=""></i>
					<span class="name-txt">{{spaceInfo.endmember.nick_name ? spaceInfo.endmember.nick_name :'无昵称'}}</span>
					<span class="info-txt">
						<img :src="spaceInfo.endmember.genderdata == 'male'? male : girl" alt="">
						<em>{{spaceInfo.endmember.genderdata == 'male'? '男' : '女'}}</em>
					</span>
				</span>
				<img class="heart-beat" src="../../../assets/imgs/heart-beat.gif" alt="">
			</div>
			<span class="btn-box" @click="setRouter('shop-list',{inviteId:spaceInfo.endmember.id})">发起约会</span>
		</div>
		<van-dialog class="dia-box" v-model="show" title="微信支付" show-cancel-button @cancel="showDatepicker = false" @confirm="onSubmit">
		  <van-field v-model="value" type="number" label="充值金额" placeholder="请输入充值金额" />
		</van-dialog>
	</div>
</template>

<script>
	import { mapState } from "vuex";
	import { Dialog, Toast } from "vant";
	import { onPayment } from '../../../utils/conversion.js';
	import { HOST , MALE , GIRL , DEFAULTHEADER } from "../../../utils/config.js";
	export default {
		props: {
			spaceInfo: {
				type: Object,
				default: () => null
			},
		},
		data() {
			return {
				host:HOST,
				defaultHeader:require( '../../../' + DEFAULTHEADER ),
				male:require( '../../../' + MALE ),
				girl:require( '../../../' + GIRL ),
				show:false,
				value:'',
				type:1,
				recharge_no:''
			}
		},
		computed: {
			...mapState(['user']),
			_api: function () {
				return this.$api._views.personal;
			},
			title: function () {
				return this.$route.query.title;
			},
		},
		methods: {
			// banner 跳转
			setRouter( path, v ){
				
				let obj = {
					path: path
				}
				
				v ?  obj.query = v : '';
				
				this.$router.push(obj)
			},
			setRelieve(){
				Dialog.confirm({
					title: '解除情侣',
					message: '您确定解除情侣配对吗？',
				})
				.then(() => {
					this.onRelieve();
				})
				.catch(() => {
					// on cancel
				});
			},
			async onRelieve(){
				
				const
				params = {
					member_id:this.user.member_id,
				},
				{
					msg,
					status
				} = await this._api.deleteIntended( params );
				
				if( status == '1' ) {
					Toast(msg)
					this.$emit('getData')
				};
				
			},
			
			async onSubmit(){
				const
				params = {
					price:this.value,
					daona:'intended',
					type:this.type,
					recharge_no:this.type == 2 ? this.recharge_no : '',
					member_id:this.user.member_id
				},
				{
					info,
					recharge_no,
					status
				} = await this._api.recharge( params );
				
				if( status !== '1' ) return false;
				
				this.recharge_no = recharge_no;
				
				onPayment( info, _p => {
					this.PayCallback()
				})
				
			},
			// 支付成功回调
			async PayCallback(){
				
				params = {
					recharge_no:this.recharge_no,
					member_id:this.user.member_id
				},
				{
					status
				} = await this._api.rechargeOperation( params );
				
				this.$emit('getData')
			}
		},
	}
</script>

<style lang="scss" scoped>
	@import "~@/assets/css/mixin.scss";
	.space-box{
		width: 100vw;
		height: 100vh;
		overflow: hidden;
		background:url(../../../assets/imgs/personal-cp-bg.gif) #554cae 100% 100%;
		.header-box{
			@include display-flex();
			@include justify-content_flex-justify();
			@include align-items(center);
			position: fixed;
			width: 100%;
			height: 50px;
			color: #fff;
			padding:0 20px;
			z-index: 1;
			font-size: 18px;
			p.left-box{
				em{
					position: relative;
					width: 10px;
					margin: 0 20px 0 0;
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
			p.rgt-box{
				@include display-flex();
				@include align-items(center);
				font-size: 14px;
				span{
					margin-left: 10px;
				}
				span:last-child{
					background-color: #FFC665;
					padding: 0 5px;
					line-height: 20px;
					border-radius: 10px;
				}
			}
		}
		.ctr-box{
			@include display-flex();
			@include justify-content();
			@include flex-direction-column();
			margin-top: 50px;
			padding: 100px 0 50px 0;
			span{
				font-size: 24px;
				color: #fff;
				text-align: center;
				margin-bottom: 20px;
			}
			p{
				@include align-items(center);
				text-align: center;
				font-size: 16px;
				time{
					display: inline-block;
					color: #F98762;
					margin-right: 10px;
				}
				i{
					display: inline-block;
					font-style: normal;
					color: #fff;
				}
			}
		}
		.btm-box{
			@include display-flex();
			@include flex-direction-column();
			width: 86%;
			background-color: #1a1a35c7;
			margin-left: 7%;
			padding: 20px;
			border-radius: 6px;
			.btm-t-top{
				@include display-flex();
				@include align-items(center);
				@include justify-content_flex-justify();
				span{
					position: relative;
					color: #fff;
					font-size: 15px;
					font-weight:bold;
					margin-left: 10px;
				}
				span::before{
					content: '';
					display: block;
					width: 4px;
					height: 4px;
					background-color: #FFC665;
					border-radius: 50%;
					position: absolute;
					left: -10px;
					top: 0;
					bottom: 0;
					margin: auto;
				}
				i{
					display: block;
					width: 4px;
					height: 4px;
					background: #FFC665;
					border-radius: 50%;
					margin-right: 8px;
					position: relative;
				}
				i::before,i::after{
					content: '';
					display: block;
					width: 4px;
					height: 4px;
					background: #FFC665;
					border-radius: 50%;
					position: absolute;
					left:-8px;
					top: 0;
				}
				i::after{
					right:-8px;
					left: auto;
				}
			}
			.btm-c-box{
				@include display-flex();
				@include justify-content();
				margin-top: 40px;
				position: relative;
				.heart-beat{
					position: absolute;
					width: 60px;
					height: 60px;
					top: 20px;
					@include transform-rotate(-30deg)
				}
				span{
					@include display-flex();
					@include justify-content();
					@include flex-direction-column();
					span{
						text-align: center;
					}
					span.name-txt{
						font-size: 18px;
						color: #fff;
						margin: 20px 0 10px 0;
					}
					span.info-txt{
						@include display-flex();
						@include align-items(center);
						@include flex-direction(row);
						img{
							display: inline-block;
							width: 20px;
							margin-right: 5px;
						}
						em{
							font-style: normal;
							color: #fff;
							font-size: 16px;
						}
					}
					i{
						display: inline-block;
						width: 100px;
						height: 100px;
						border-radius: 50%;
						overflow: hidden;
						border: 3px solid #fff;
						img{
							width: 100%;
							height: 100%;
							object-fit: cover;
						}
					}
				}
			}
			.btn-box{
				display: block;
				width: 200px;
				line-height: 36px;
				background-color: #ffc6652b;
				text-align: center;
				color: #fff;
				border-radius: 18px;
				margin: 30px auto 10px auto;
				border: 2px solid #ffc665;
				font-size: 16px;
			}
		}
	}
</style>
<style lang="scss">
	.space-box{
		.van-dialog__content{
			margin: 20px;
		}
	}
</style>