<template>
	<div class="detail-box">
		<Navbar :title="title"></Navbar>
		<Content class="ctr-box">
			<router-view></router-view>
		</Content>
	</div>
</template>

<script>
	import Navbar from "@/components/navbar";
	export default {
		components: {
		    Navbar
		},
		computed: {
			shopId: function () {
				return this.$route.query.id;
			},
			title: function () {
				return this.$route.query.title;
			},
		},
	}
</script>

<style lang="scss" scoped>
	@import "~@/assets/css/mixin.scss";
	.detail-box{
		@include display-flex();
		@include flex-direction-column();
		width: 100vw;
		height: 100vh;
		background-color: #f9f1e8;
		.ctr-box{
			margin-top: 50px;
		}
	}
</style>
