<template>
	<div class="certification-box">
		<span class="card-box">
			<em>上传身份证正面</em>
			<Upload 
				class="upload-card" 
				ref="positive" 
				:flieData="flieData1" 
				:imgName="imgName1" 
				:plugs="plugs"></Upload>
		</span>
		<span class="card-box">
			<em>上传身份证反面</em>
			<Upload 
				class="upload-card" 
				ref="back" 
				:flieData="flieData2" 
				:imgName="imgName2" 
				:plugs="plugs"></Upload>
		</span>
		<div class="sub-box" @click="toCkeck">提交</div>
	</div>
</template>

<script>
	import { mapState } from "vuex";
	import { Toast, Notify } from "vant";
	import Upload from '../../../components/upload/Index';
	import { HOST } from "../../../utils/config.js";
	export default {
		components: {
		    Upload,
		},
		data() {
			return {
				flieData1:{
					accept:"",
					maxSize:'500 * 1204',
					maxCount:1,
					multiple:true,
					capture:'camera',
					previewSize:'100%',
					url:''
				},
				flieData2:{
					accept:"",
					maxSize:'500 * 1204',
					maxCount:1,
					multiple:true,
					capture:'camera',
					previewSize:'100%',
					url:''
				},
				imgName1:'id-card-font.png',
				imgName2:'id-card-back.png',
				plugs:'IDcard',
				userInfo:{}
			}
		},
		computed: {
			...mapState(['user']),
			_api: function () {
				return this.$api._views.personal;
			},
		},
		methods: {
			toCkeck(){
				
				const 
				positive = this.$refs.positive.fileList[0],
				back = this.$refs.back.fileList[0];
				
				if( !positive ){
					Notify({ type: 'warning', message: '请上传正面证件照片' });
					return false;
				}
				
				if( !back ){
					Notify({ type: 'warning', message: '请上传反面证件照片' });
					return false;
				}
				
				this.onSubmit( positive, back );
				
			},
			async onSubmit( positive, back ){
			
				const
				params = {
					member_id:this.user.member_id,
					identity_zheng_img:positive.name ? positive.name :positive.url,
					identity_fan_img:back.name ? back.name :back.url
				},
				{
					status
				} = await this._api.shiming( params );
				
				if( status == '1' ) return false;
				
				this.$router.go(-1);
				
			},
			async getData(){
				const
				params = {
					member_id:this.user.member_id,
				},
				{
					data,
					msg,
					status
				} = await this._api.personalinformation( params );
				
				if( status !== '1' ) return false;
				
				this.userInfo = data.member
				
				this.flieData1.url = this.userInfo.identity_zheng_img
				
				this.flieData2.url = this.userInfo.identity_fan_img
				
			}
		},
		mounted(){
			this.getData();
		}
	}
</script>

<style lang="scss" scoped>
	@import "~@/assets/css/mixin.scss";
	.certification-box{
		@include display-flex();
		@include flex-direction-column();
		margin-top: 20px;
		span.card-box{
			@include display-flex();
			@include justify-content();
			@include flex-direction-column();
			width: 90%;
			margin:0 0 20px 5%;
			padding: 20px;
			background-color: #fff;
			border-radius: 10px;
			em{
				font-style: normal;
				font-size: 14px;
				font-weight: 800;
				margin-bottom: 20px;
				color: #272636;
			}
			.upload-card{
				display: inline-block;
				width: 70%;
				margin-left: 15%;
			}
		}
		.sub-box{
			width: 50%;
			margin: 0 0 20px 25%;
			line-height: 40px;
			color: #fff;
			font-size: 18px;
			font-weight: 800;
			text-align: center;
			border-radius:20px;
			background-color: #FFC963;
		}
	}
</style>
