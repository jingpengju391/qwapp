<template>
	<div class="header-box">
		<em @click="$router.go(-1)"></em>
		<span>{{title}}</span>
	</div>
</template>

<script>
	export default {
		props:{
		    title:{
		        type: String,
		        default: () => ''
		    },
		},
		methods:{
			tobacK () {
			    this.$emit('setStatus')
			}
		}
	}
</script>

<style lang="scss" scoped>
	@import "~@/assets/css/mixin.scss";
	.header-box{
		@include display-flex();
		@include align-items(center);
		position: fixed;
		width: 100%;
		height: 50px;
		background-color: #FFC963;
		color: #fff;
		padding: 0 0 0 20px;
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
</style>
