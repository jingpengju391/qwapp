<template>
	<div class="start-box">
		<Login v-if="!status" @setStatus="setStatus"></Login>
		<Register v-if="status == 1" @setStatus="setStatus"></Register>
		<Forget v-if="status == 2" @setStatus="setStatus"></Forget>
	</div>
</template>

<script>
	import Login from "./login/Index";
	import Register from "./register/Index";
	import Forget from "./forget/Index";
	export default {
		components: {
		    Login,
		    Register,
			Forget
		},
		data() {
			return {
				status:0,
			}
		},
		methods:{
			setStatus( code ){
				
				this.status = code
				
			}
		}
	}
</script>
