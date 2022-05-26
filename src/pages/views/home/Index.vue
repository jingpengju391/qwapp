<template>
	<div class="home-box">
		<div class="header-box">
			<div>
				<van-icon class="loc-txt" name="location" />
				<span>{{city}}</span>
			</div>
			<img class="login-box" src="../../../assets/imgs/home-top__icon.png" alt="">
			<img src="../../../assets/imgs/home-alarm.svg" alt=""  @click="setRouter('/message',{title:'消息通知'})">
		</div>
		<van-swipe :autoplay="3000">
		  <van-swipe-item class="swipe-item-home" v-for="item in indexData.banner" :key="item.id">
		    <img @click="setRouter('/shop-detail',{id: item.store_id})" :src="host + item.banner_image" />
		  </van-swipe-item>
		</van-swipe>
		<div class="ctr-box">
			<div class="swiper-box">
				<swiper :options="options">
				    <swiper-slide v-for="item in indexData.tj" :key="item.order_id">
				        <invite-item :inviteInfo="item"></invite-item>
				    </swiper-slide>
				</swiper>
			</div>
			<div class="shop-slider__box">
				<swiper :options="options2">
				    <swiper-slide v-for="item in indexData.category" :key="item.id">
				        <SwiperItem :inviteInfo="item"></SwiperItem>
				    </swiper-slide>
				</swiper>
			</div>
		</div>
		<div class="btm-box-y"></div>
	</div>
</template>

<script>
	import { mapState } from "vuex";
	import { Dialog } from 'vant';
	import { HOST } from "../../../utils/config.js";
	import storage from "../../../utils/storage.js";
	import InviteItem from "../../../components/invite/index.vue";
	import SwiperItem from "./components/swiperItem.vue";
	export default {
		components: {
			InviteItem,
			SwiperItem
		},
		data() {
			return {
				city:'',
				host:HOST,
				indexData:{
					banner:[],
					category:[],
					tj:[]
				},
				options:{
					slidesPerView : 1.5, 
					spaceBetween : 60,
					slidesOffsetBefore : 50,
					slidesOffsetAfter : 50,
				},
				options2:{
					slidesPerView : 3, 
					// slidesOffsetBefore : 20,
					// slidesOffsetAfter : 20,
				}
			}
		},
		computed: {
			...mapState(['user']),
			_home: function () {
				return this.$api._views.home;
			},
		},
		methods: {
			// 获取当前城市
			getCurrLocation () {
				const LOCATION = new BMap.Geolocation();
				LOCATION.getCurrentPosition( res =>  this.city = res.address.city )
			},
			// 获取数据
			async getData(){
				const
				params = {
					cityzip: 230100,
					member_id:this.user.member_id
				},
				{
					data
				} = await this._home.index( params );
				this.indexData = data;
				this.getPanshiming();
			},
			// banner 跳转
			setRouter( path, query ){
				
				this.$router.push({
					path: path, 
					query: query
				})
			},
			async getPanshiming(){
				const
				params = {
					member_id:this.user.member_id
				},
				{
					status,
				} = await this._home.panshiming( params );
				
				if( status == 2 ){
					Dialog.alert({
					  title: '实名认证',
					  message: '审核中，暂时不能应用',
					}).then(() => {
					  this.$router.push({
					  	path: '/personal-info',
						query:{
							title:'个人信息'
						}
					  })
					});
				}else if( status == 3 ){
					Dialog.alert({
					  title: '实名认证',
					  message: '审核未通过，重新实名',
					}).then(() => {
					  this.$router.push({
					  	path: '/certification',
						query:{
							title:'实名认证'
						}
					  })
					});
				}else if( status == 0 ){
					Dialog.alert({
					  title: '实名认证',
					  message: '未实名认证，请去实名认证',
					}).then(() => {
					  this.$router.push({
					  	path: '/certification',
						query:{
							title:'实名认证'
						}
					  })
					});
				}
			}
		},
		created() {
			this.getCurrLocation();
			this.getData();
		},
	};
</script>

<style lang="scss" scoped>
	@import "~@/assets/css/mixin.scss";
	.home-box{
		@include display-flex();
		@include flex-direction-column();
		.header-box{
			@include display-flex();
			@include align-items(center);
			@include justify-content_flex-justify();
			position: relative;
			width: 100%;
			height: 50px;
			border-bottom: 1px solid #fcdc8b;
			padding: 0 15px;
			font-size: 14px;
			color: rgb(24, 43, 51);
			img.login-box{
				@include positionCenter();
				height: 90%;
				width: auto;
			}
			img{
				height: 40%;
				width: auto;
			}
			div{
				@include display-flex();
				@include align-items(center);
				.loc-txt{
					font-size: 18px;
				}
			}
		}
		.ctr-box{
			@include display-flex();
			@include flex-direction-column();
			max-height: calc(100vh - 300px);
			overflow-y: scroll;
			padding-bottom: 20px;
		}
		.swipe-item-home{
			height: 200px;
			img{
				width: 100%;
				height: 100%;
				object-fit: cover;
			}
			
		}
		.swiper-box{
			margin: 35px 0 15px 0;
			padding: 12px 15px;
		}
		.shop-slider__box{
			@include display-flex();
			margin-top: 20px;
		}
		.btm-box-y{
			width: 100%;
			height: 300px;
			position: fixed;
			left: 0;
			bottom: 0px;
			z-index: -1;
			overflow: hidden;
			background: url(../../../assets/imgs/home_back.png);
			background-size: 100% auto;
			z-index: 0;
		}
	}
</style>
<style lang="scss">
	.home-box{
		.van-swipe__indicator--active{
			background-color: #fff;
		}
		.swiper-box{
			.swiper-container{
				overflow: visible;
			}
		}
	}
</style>