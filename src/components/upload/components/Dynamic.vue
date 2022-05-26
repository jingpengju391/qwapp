<template>
	<div class="c-boxs"></div>
</template>

<style lang="scss" scoped>
	@import "~@/assets/css/mixin.scss";
	.c-boxs{
		position: relative;
		display: inline-block;
		width: 80px;
		height: 80px;
		border: 1px solid #FFC963;
		border-radius: 5px;
	}
	.c-boxs::before,.c-boxs::after{
		@include positionCenter();
		content: '';
		display: inline-block;
		width: 50%;
		height: 1px;
		background-color: #FFC963;
	}
	.c-boxs::after{
		@include transform-rotate(90deg);
	}
</style>
