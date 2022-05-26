<template>
	<div class="dynamic-box">
		<div class="con-box">
			<van-field v-model="text" class="dynamic-txt" type="textarea" :border="false" :rows="6" maxlength="200" placeholder="你这一刻的想法"/>
			<div class="upload-box">
				<Upload 
					ref="upload" 
					:plugs="plugs"
					:flieData="flieData"></Upload>
			</div>
			<div class="info-box">
				<span>
					<van-icon class="icon-box" name="clock" />
					<i>{{currTime}}</i>
				</span>
				<span>
					<van-icon class="icon-box" name="location" />
					<i>{{city}}</i>
				</span>
			</div>
		</div>
		<span class="send-con" @click="onSendCon">发布</span>
	</div>
</template>

<script>
	import {mapState} from "vuex";
	import { Toast } from "vant";
	import Upload from '../../../components/upload/Index'
	export default {
		components: {
		    Upload,
		},
		data() {
			return {
				text:'',
				currTime:'',
				city:'',
				flieData:{
					accept:"",
					maxSize:'500 * 1204',
					maxCount:9,
					multiple:true,
					capture:'camera'
				},
				imgName:'',
				plugs:'Dynamic'
			}
		},
		computed: {
			...mapState(["user"]),
			_api: function () {
				return this.$api._views.diary;
			},
			orderId: function () {
				return this.$route.query.orderId;
			},
		},
		methods: {
			// 获取当前时间
			getTime(){
				const _THIS = this;
				setInterval(function(){
					let date = new Date();
					let y = date.getFullYear();
					let m = date.getMonth() + 1;
					let d = date.getDate();
					let H = date.getHours();
					let mm = date.getMinutes();
					_THIS.currTime = y + "-" + m + "-" + d + " " + H + ":" + mm;
				},1000)	  
			},
			// 获取地理位置
			getLocal(){
				const LOCATION = new BMap.Geolocation();
				LOCATION.getCurrentPosition( res =>  {
					
					const {
						address,
					} = res;
					this.city = address.province + '，'+address.city
				} )
			},
			// 跳转
			setRouter(){
				this.$router.push({
					path: '/diary'
				})
			},
			// 发布情侣圈
			async onSendCon(){
				
				if( this.text === '' ){
					Toast('请编写情侣圈内容')
					return false;
				}
				
				let arr = [];
				
				this.$refs.upload.fileList.forEach(item => arr.push(item.url))
				
				const
				params = {
					member_id: this.user.member_id,
					content: this.text,
					images: arr.join(","),
					order_id: this.orderId ? this.orderId : '',
				},
				{
					status,
				} = await this._api.publishquan( params );
				
				status === '1' && this.setRouter();
			
			}
		},
		mounted() {
			this.getLocal();
		},
		created(){
			this.getTime();
		}
	}
</script>

<style lang="scss" scoped>
	@import "~@/assets/css/mixin.scss";
	.dynamic-box{
		@include display-flex();
		@include flex-direction-column();
		div.con-box{
			@include display-flex();
			@include flex-direction-column();
			background-color: #fff;
			width: 100%;
			padding: 20px;
			.upload-box{
				margin:20px 0 0 0;
			}
			.dynamic-txt{
				font-size: 16px;
				color: #333;
			}
			.info-box{
				@include display-flex();
				@include flex-direction-column();
				margin:20px 0;
				color: #ccc;
				font-size: 12px;
				span{
					margin-bottom: 10px;
					.icon-box{
						margin-right: 10px;
					}
					i{
						font-style: normal;
					}
				}
			}
			.van-cell{
				padding: 0;
				border-bottom: 1px solid #f3f3f3;
			}
		}
		.send-con{
			line-height: 40px;
			border-radius: 20px;
			background-color: #FFC963;
			font-size: 16px;
			color: #fff;
			width: 60%;
			text-align: center;
			margin:20px 0 0 20%;
		}
	}
</style>
