<template>
	<div v-if="model" class="audio-box">
		<van-loading color="#ffc963" />
		<span>正在录音...</span>
	</div>
</template>

<script>
	import Recorder from 'js-audio-recorder'
	import {Toast} from "vant"
	import NIM from '../../../../utils/nim';
	export default {
		props:{
		    userInfo:{
		        type: Object,
		        default: () => null
		    },
			otherInfo:{
			    type: Object,
			    default: () => null
			},
		},
		data() {
			return {
				model:false,
				recorder:new Recorder(),
			}
		},
		computed: {
			onSendFile: function () {
				return this.$NIMFC.onSendFile;
			},
		},
		methods: {
			// 按下组件
			soundRecord( v ){
				
				if( v ) return false;
				
				const _THIS = this;
				
				_THIS.model = true
				//开始录音
				_THIS.recorder = new Recorder({
					sampleBits: 16,         // 采样位数，支持 8 或 16，默认是16
					sampleRate: 16000,      // 采样率，支持 11025、16000、22050、24000、44100、48000，根据浏览器默认值，我的chrome是48000
					numChannels: 1,         // 声道，支持 1 或 2， 默认是1
					compiling: false,       // 是否边录边转换，默认是false
				});
				_THIS.recorder.start()
				
				_THIS.recorder.duration >= 60 && this.sendAudio();
				
			},
			// 松开组件
			sendAudio(){
				const _THIS = this;
				this.model = false;
				if( _THIS.recorder.duration < 0.5 ){
					Toast('说话时间太短啦')
					_THIS.recorder.stop();
					// 销毁录音实例，释放资源，fn为回调函数
					this.recorder.destroy();
					this.recorder = null;
					return false;
				}
				
				const LONG = 5 / 3 * this.recorder.duration + '%'
				
				NIM.onSendFile(_THIS.recorder.getWAVBlob(),_THIS.otherInfo.accid,_THIS.recorder.duration,LONG, this.userInfo);
				// 销毁录音实例，释放资源，fn为回调函数
				this.recorder.destroy();
				this.recorder = null;
			},
			onSubmit(){
				setAudio().then(res => {
					if( res.data.status == '1' ){
						let url = res.data.url
						
					}else{
						console.log('存储数据库失败')
					}
				});
			}
		}
	}
</script>

<style lang="scss" scoped>
	@import "~@/assets/css/mixin.scss";
	.audio-box{
		@include display-flex();
		@include align-items(center);
		@include justify-content();
		width: 100vw;
		height: 100vh;
		background-color: #000000ba;
		position: fixed;
		top: 0;
		left: 0;
		z-index: 2;
		transition:2s;
		-moz-transition:2s; /* Firefox 4 */
		-webkit-transition:2s; /* Safari and Chrome */
		-o-transition:2s; /* Opera */
		-webkit-user-select:none;
		-moz-user-select:none;
		-ms-user-select:none;
		user-select:none;
		span{
			color: #ffc963;
			font-size: 18px;
		}
	}
</style>
