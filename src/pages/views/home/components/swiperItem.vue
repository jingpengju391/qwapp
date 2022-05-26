<template>
	<div class="swiper-item" 
		:style="{backgroundImage: 'url(' + host + inviteInfo.bg_img + ')', backgroundSize:'100% 100%'}" @click="setRouter">
		<img :src="host + inviteInfo.image" alt="">
		<span>{{inviteInfo.name}}</span>
		<span>{{inviteInfo.nickname}}</span>
	</div>
</template>

<script>
	import { HOST } from "../../../../utils/config.js";
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
			}
		},
		methods: {
			// banner 跳转
			setRouter(){
				
				this.$router.push({
					path: '/shop-list', 
					query: {
						id:this.inviteInfo.id
					}
				})
			},
		},
	}
</script>

<style lang="scss" scoped>
	@import "~@/assets/css/mixin.scss";
	.swiper-item{
		@include display-flex();
		@include align-items(center);
		@include flex-direction-column();
		@include justify-content();
		padding: 30px 0;
		img{
			width: 80px;
		}
		span{
			color: #fff;
			font-size: 15px;
		}
		span:nth-child(2){
			margin: 10px 0;
		}
	}
</style>
