<template>
	<div class="shop-detail">
		<div class="img-info cons-box">
			<h6>商家图片</h6>
			<span>
				<i 
					v-for="(item, index) in shopInfo.store_banner_image" 
					:key="index">
					<img :src="host + item" alt="" @click="lookImg(shopInfo.store_banner_image,index)">
				</i>
			</span>
			<span>{{shopInfo.store_content}}</span>
		</div>
		<div class="shop-detail-m cons-box">
			<span>
				<i>商家名称</i>
				<i>{{shopInfo.store_name}}</i>
			</span>
			<span>
				<i>商家品类</i>
				<i>{{shopInfo.category_name}}</i>
			</span>
			<span>
				<i>商家地址</i>
				<i>{{shopInfo.address}}</i>
			</span>
			<span>
				<i>商家时间</i>
				<i>{{shopInfo.start_time}} - {{shopInfo.end_time}}</i>
			</span>
			<span>
				<i>商家电话</i>
				<i @click="onCall">{{shopInfo.store_phone}}</i>
			</span>
		</div>
		<div class="serve-box cons-box">
			<h6>商家服务</h6>
			<span>{{shopInfo.feature}}</span>
		</div>
		<div class="img-info cons-box">
			<h6>营业执照</h6>
			<span>
				<i
					v-for="(item, index) in shopInfo.business_image" 
					:key="index">
					<img :src="host + item" @click="lookImg(shopInfo.business_image,index)" alt="">
				</i>
			</span>
		</div>
		<div class="img-info cons-box">
			<h6>卫生许可证</h6>
			<span>
				<i
					v-for="(item, index) in shopInfo.hygienic_image" 
					:key="index">
					<img :src="host + item" @click="lookImg(shopInfo.hygienic_image,index)" alt="">
				</i>
			</span>
		</div>
		<ImgInfo :ImgInfo="imgInfo"></ImgInfo>
	</div>
</template>

<script>
	import { mapState } from "vuex";
	import { HOST } from "../../../utils/config.js";
	import { callPhone } from "../../../utils/conversion.js";
	import ImgInfo from "../../../components/Image-info"
	export default {
		components: {
		    ImgInfo
		},
		computed: {
			...mapState(['user']),
			shopId: function () {
				return this.$route.query.id;
			},
			title: function () {
				return this.$route.query.title;
			},
			_shop: function () {
				return this.$api._views.shop;
			},
		},
		data() {
			return {
				shopInfo:{
					store_banner_image:[]
				},
				host:HOST,
				imgInfo:{
					list:[],
					curr:''
				}
			}
		},
		methods: {
			// 获取数据
			async getData(){
				
				const
				params = {
					store_id: this.shopId,
					member_id:this.user.member_id
				},
				{
					data
				} = await this._shop.storedetails( params );
				this.shopInfo = data;
			},
			setRouter( data ){
				this.$router.push({
					path: '/detail-shop', 
					query: {id: data.id,title:'商家详情'}
				})
			},
			lookImg( imgList,curr ){
				
				const IMGINFO = {
					imgList:imgList,
					curr:curr
				}
				this.imgInfo = IMGINFO;
				
			},
			onCall(){
				callPhone(this.shopInfo.store_phone)
			}
		},
		mounted() {
			this.getData();
		},
	}
</script>

<style lang="scss" scoped>
	@import "~@/assets/css/mixin.scss";
	.shop-detail{
		@include display-flex();
		@include flex-direction-column();
		div.cons-box{
			@include display-flex();
			@include flex-direction-column();
			background-color: #fff;
			margin-bottom: 20px;
			padding: 20px;
		}
		h6{
			font-size: 16px;
			font-weight: 800;
			color: #333;
			margin-bottom: 15px;
		}
		.img-info{
			span{
				font-size: 14px;
				color: #CCCAC7;
				line-height: 1.5;
				i{
					position: relative;
					display: inline-block;
					width: 22%;
					padding-bottom: 22%;
					border-radius: 5px;
					overflow: hidden;
					margin-right: 4%;
					img{
						position: absolute;
						top: 0;
						left: 0;
						width: 100%;
						height: 100%;
						object-fit: cover;
					}
				}
				i:nth-child(4n){
					margin: 0;
				}
			}
		}
		.shop-detail-m{
			padding:0 20px;
			span{
				@include display-flex();
				@include justify-content_flex-justify();
				border-bottom: 1px solid #f5f6f7;
				padding: 15px 0;
				i{
					font-style: normal;
					font-size: 16px;
					color: #333;
					line-height:1.5;
					text-align: right;
				}
				i:last-child{
					font-style: normal;
					font-size: 14px;
					color: #CCCAC7;
					max-width: calc( 100% - 100px );
				}
			}
			span:last-child{
				border: none;
				i:last-child{
					color: #FFC963;
					border-radius: 10px;
					line-height: 20px;
					padding: 0 10px;
					border: 1px solid #FFC963;
				}
			}
		}
		.serve-box{
			span{
				font-size: 14px;
				color: rgb(204, 202, 199);
				line-height: 1.5;
			}
		}
	}
</style>
