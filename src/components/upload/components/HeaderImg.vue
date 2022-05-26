<template>
	<img :src="require('../../../assets/imgs/' + imgName)" alt="">
</template>

<script>
	export default {
		props: {
			imgName: {
				type: String,
				default: () => ''
			},
		},
	}
</script>