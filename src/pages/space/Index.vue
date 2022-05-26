<template>
	<div class="space-box">
		<Lover v-if="status == '1'" :spaceInfo="spaceInfo" @getData="getData"></Lover>
		<Lovers v-else></Lovers>
	</div>
</template>

<script>
	import { mapState } from "vuex";
	import Lover from "./components/lover";
	import Lovers from "./components/lovers";
	export default {
		components:{
			Lover,
			Lovers
		},
		data() {
			return {
				status:'1',
				spaceInfo:{
					cishu:0,
					endmember:{},
					intended:{},
					startmember:{}
				},
			}
		},
		computed: {
			...mapState(['user']),
			_api: function () {
				return this.$api._views.personal;
			},
		},
		methods: {
			// 获取数据
			async getData(){
				
				const
				params = {
					member_id:this.user.member_id
				},
				{
					data,
					status
				} = await this._api.loversspace( params );
				
				this.status = status;
				
				if( status == '1' ) this.spaceInfo = data;
				
			},
		},
		mounted() {
			this.getData();
		},
	}
</script>

