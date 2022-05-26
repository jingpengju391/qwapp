<template>
	<div class="layout">
		<Content class="ctr-box">
			<router-view></router-view>
		</Content>
		<TabBar></TabBar>
	</div>
</template>
<script>
	import TabBar from "../../components/tabBar";
	export default {
		components: {
		    TabBar,
		},
		data() {
			return {
				
			}
		},
		
	}
</script>

<style lang="scss" scoped>
	@import "~@/assets/css/mixin.scss";
</style>
