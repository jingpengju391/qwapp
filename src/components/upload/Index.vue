
<template>
		<van-uploader
			class="uploader-com-box"
			v-model="fileList"
			:max-count="flieData.maxCount"
			:multiple="flieData.multiple"
			:after-read="afterRead" 
			:capture="flieData.capture"
			:preview-size="flieData.previewSize"
			:show-upload="show"
			@delete="onDelete"
			@oversize="onOversize" 
		>
			<component v-if="show" :is="plugs" :imgName="imgName"></component>
		</van-uploader>
</template>

<script>
	import { mapState } from "vuex";
	import { Toast } from "vant";
	import { HOST } from "../../utils/config.js";
	export default {
		components: {
			IDcard : r => require(['./components/IDcard'], r),
			Dynamic : r => require(['./components/Dynamic'], r),
			HeaderImg : r => require(['./components/HeaderImg'], r),
		},
		props: {
			flieData: {
				type: Object,
				default: () => null
			},
			plugs: {
				type: String,
				default: () => 'IDcard'
			},
			imgName: {
				type: String,
				default: () => ''
			},
			keep: {
				type: Boolean,
				default: () => false
			},
		},
		data() {
			return {
				fileList: [],
				show:true
			};
		},
		computed: {
			...mapState(["user"]),
			_api: function () {
				return this.$api._common;
			},
			maxCount: function () {
				return this.flieData.maxCount;
			},
			url: function () {
				return this.flieData.url;
			},
		},
		methods: {
			// 文件读取后回调
			afterRead(file) {
				
				file.status = 'uploading';
				file.message = '上传中...';
				this.onUpload( file );
				
			},
			// 文件超过大小触发
			onOversize() {
				
				Toast('文件大小不能超过 500kb');
				
			},
			// 图片上传
			onUpload( file ){
			
				// const TYPE = file.length ? 1 : 0;
				
				// TYPE ? file.forEach(item => this.onSubmit( item.file )) : this.onSubmit( file.file )
				
				this.onSubmit( file );
				
			},
			async onSubmit( files ){
				
				let params = new FormData();
				
				params.append('image', files.file);
				
				const
				{
					data,
					status,
				} = await this._api.upload( params );
				
				if( status == '1' ){
					files.status = 'done';
					files.message = '上传成功';
					files.url = data.image_url;
					this.keep && this.$emit('setKeep',this.fileList);
				}else{
					files.status = 'failed';
					files.message = '上传失败';
				}
				
			},
			onDelete(){
				this.keep && this.$emit('setKeep',this.fileList,this.flieData);
			}
		},
		watch: {
			maxCount: {
				handler(newName, oldName) {
					this.fileList.length >= newName ?
					this.show = false :  
					this.show = true 
				},
				deep: true,
				immediate: true
			},
			url: {
				handler(newName, oldName) {
					if( newName ){
						
						let arr = [];
						arr = newName.split(',');
						arr.forEach(item => {
							this.fileList.push({
								url:HOST + item,
								name:item
							})
						})
						
						console.log(this.fileList)
					}
				},
				deep: true,
				immediate: true
			},
		} 
	};
</script>

