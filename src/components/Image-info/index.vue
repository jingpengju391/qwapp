<template>
	<van-popup v-model="show" class="overlay-img" :overlay="false" position="bottom" :closeable="true" close-icon="cross">
		<swiper v-if="show" class="swiper-box" :options="options">
		    <swiper-slide v-for="(item,index) in ImgInfo.imgList" :key="item+index">
		        <img :src="host + item" alt="">
		    </swiper-slide>
			<div class="swiper-pagination" slot="pagination"></div>
		</swiper>
	</van-popup>
</template>
<script>
	import { HOST } from "../../utils/config.js";
	export default {
		props:{
			ImgInfo:{
				type: Object,
				default: () => null
			},
		},
		data() {
			return {
				show: false,
				host:HOST,
				options:{
					initialSlide :0,
					pagination:{
						el: '.swiper-pagination',
						type: 'fraction',
					}
				}
			};
		},
		watch: {
		  ImgInfo: {
		    handler(newName, oldName) {
				this.options.initialSlide = newName.curr
				newName.imgList && newName.imgList.length > 0 ? 
				this.show = true : 
				this.show = false
		    },
		    immediate: true,
		    deep: true
		  }
		}
	};
</script>

<style lang="scss" scoped>
	@import "~@/assets/css/mixin.scss";
	.overlay-img{
		width: 100vw;
		height: 100vh;
		background: #000000e0;
		@include display-flex();
		@include align-items(center);
		.swiper-box{
			@include display-flex();
			@include align-items(center);
			width: 100%;
			img{
				width: 100%;
			}
			.swiper-pagination{
				position: fixed;
				bottom: 10px;
				font-size: 30px;
				color: #fff;
			}
			
		}
	}
</style>
<style lang="scss">
	@import "~@/assets/css/mixin.scss";
	.overlay-img{
		.swiper-box{
			.swiper-wrapper{
				@include display-flex();
				@include align-items(center);
			}
		}
	}
</style>
