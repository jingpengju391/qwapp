<template>
	<div class="chat-box">
		<div :class="on ? 'v-push v-on' : 'v-push'">
			<div :class="[item.flow == 'out' ? 'con-box own-info' : 'con-box']" v-for="item in oChat[userInfo.accid]" :key="item.time">
					<img v-if="item.flow == 'in'" :src=" userInfo.head_image ? host + userInfo.head_image : headImg " alt="">
					<span v-if="item.type =='text'">{{item.text}}</span>
							<span 
							:class="[item.etyle?'common curr-voice':'common']" 
							:style=" { width: JSON.parse(item.custom).long } " 
							v-if="item.type =='file'" 
							@click="onVoice( item )">
								<i v-if="item.flow == 'out'">{{Math.round(JSON.parse(item.custom).time)}}"</i>
								<p><em><i></i></em></p>
								<i v-if="item.flow == 'in'">{{Math.round(JSON.parse(item.custom).time)}}"</i>
							</span>
					<img v-if="item.flow == 'out'" :src=" user.head_image ? host + user.head_image : headImg " alt="">
			</div>
			<div id="msg_end" style="height:0px;margin-top: 43px;"></div>
		</div>
		<div class="footer-box">
			<!-- 发送语音 -->
			<img :src="imgUrl" alt="" @click="changeInfoType">
			<textarea v-if="imgInfo === 'voice'" v-model="message" class="text-box" rows="1" cols="20"></textarea>
			<p :class="[btnName == '按住 说话' ? 'voice-box':'voice-box voice-curr']" v-if="imgInfo === 'keyboard'" @touchstart="soundRecord"  @touchend="sendAudio">{{btnName}}</p>
			<span @click="toSendText( message, userInfo.accid )">发送</span>
		</div>
		<audioCom ref="audio" :userInfo="userInfow" :otherInfo="userInfo"></audioCom>
	</div>
</template>

<script>
	import { mapState, mapActions } from "vuex";
	import { Toast, Dialog } from "vant"
	import storage from '../../../utils/storage';
	import NIM from '../../../utils/nim';
	import audioCom from './components/audio.vue';
	import { HOST, DEFAULTHEADER } from "../../../utils/config.js";
	import { setBadge } from "../../../utils/conversion.js";
	import power from '../../../utils/power';
	export default {
		components: {
		    audioCom
		},
		data() {
			return {
				userInfo:{
					nick_name:'',
					head_image:''
				},
				refreshing: false,
				loading: false,
				finished: false,
				message:'',
				imgInfo:'voice',
				audio:new Audio(),
				playPromise:null,
				btnName:'按住 说话',
				recorder:null,
				host:HOST,
				headImg:require('../../../' + DEFAULTHEADER),
				checked:true,
				userInfow:{},
				on:false,
			}
		},
		computed: {
			...mapState(['user','oChat','aud']),
			_api: function () {
				return this.$api._common;
			},
			otherId: function () {
				return this.$route.query.id;
			},
			imgUrl: function () {
				return require(`../../../assets/imgs/${this.imgInfo}.svg`)
			},
			
		},
		methods: {
			...mapActions(['setChatObj','setUpData','setUpAudio']),
			onLoad(){
				this.refreshing = false;
			},
			onRefresh() {
				// 清空列表数据
				Toast('暂时不支持查看历史聊天')
				this.refreshing = false;
			},
			// 通信开关
			onSignal( checked ){
				NIM.setConnect( checked );
			},
			// 发送文本信息
			toSendText( message, accid ){
				
				if( !this.checked ){
					
					Dialog.confirm({
						title: '温馨提醒',
						message: '是否要开启畅聊功能？',
					}).then(() => {
						this.checked = true;
						storage.set('chat',true);
						this.onSignal( true );
					}).catch(() => {
						Toast('未开启畅聊功能，暂时不能开始聊天');
					});
					
				}else{
					
					if( !message ){
						Toast('消息不能为空！')
						return false;
					}
					this.message = '';
					NIM.onSendText( message, accid, this.userInfow );
				}
				
			},
			// 创建聊天对象
			createChat(){
				this.setChatObj(this.userInfo.accid)
			},
			// 切换发送信息
			changeInfoType(){
				power.androidPower();
				const 
				TYPE = 
				this.imgInfo === 'voice' ?  'keyboard' : 'voice' ;
				this.imgInfo = TYPE
			},
			// 播放音频
			onVoice( currItem ){
				
				const 
				_THIS = this,
				ACCID = this.userInfo.accid;
				
				currItem.endAudioA = false;
				
				this.audio.pause();
				
				this.audio.currentTime = 0;
				
				this.audio.src = currItem.file.url;
				
				!currItem.etyle && this.audio.play();
				
				this.setUpData(currItem)
				
				this.audio.addEventListener('ended', _P => {
					currItem.endAudioA = true;
					this.setUpData(currItem)
				}, false);
		
			},
			// 按下录音
			soundRecord(){
				
				if( !this.checked ){
					
					Dialog.confirm({
						title: '温馨提醒',
						message: '是否要开启畅聊功能？',
					}).then(() => {
						this.checked = true;
						storage.set('chat',true);
						this.onSignal( true );
					}).catch(() => {
						Toast('未开启畅聊功能，暂时不能开始聊天');
					});
					
				}else{
					this.btnName = "松开 结束"
					this.$refs.audio.soundRecord();
				}
				
			},
			// 发送音频
			sendAudio(){
				if( !this.checked )return false
				this.btnName = "按住 说话"
				this.$refs.audio.sendAudio();
			},
			// 获取用户信息
			async getData(){
				const
				params = {
					other_look_id: this.otherId,
					member_id: this.user.member_id
				},
				{
					data
				} = await this._api.look( params );
				this.userInfo = data;
				this.getHistoryMsgs();
				this.createChat();
			},
			// 获取用户信息
			async getWon(){
				const
				params = {
					other_look_id: this.user.member_id,
					member_id: this.user.member_id
				},
				{
					data
				} = await this._api.look( params );
				this.userInfow = data;
			},
			// 获取历史信息
			getHistoryMsgs(){
				NIM.getHistoryMsgs( this.userInfo.accid );
			}
		},
		mounted() {
			this.checked = storage.get('chat');
			this.getData();
			this.getWon();
			this.createChat();
			let msgEnd = document.getElementById('msg_end');
			msgEnd ? document.getElementById('msg_end').scrollIntoView() : ''
		},
		watch: {
			oChat: {
				handler: function(newVal, oldVal) {
					
					let msgEnd = document.getElementById('msg_end');
					msgEnd ? document.getElementById('msg_end').scrollIntoView() : ''
					// setBadge();
					
				},
				deep: true,
				immediate: true
			},
		},
	}
</script>

<style lang="scss" scoped>
	@import "~@/assets/css/mixin.scss";
	.chat-box{
		.v-push{
			position: fixed;
			bottom: 50px;
			width: 100%;
			max-height: 86vh;
			padding: 10px;
			-webkit-box-sizing: border-box;
			-moz-box-sizing: border-box;
			box-sizing: border-box;
			overflow-y: scroll;
			.con-box{
				@include display-flex();
				@include align-items(flex-start);
				width: 100%;
				margin-bottom: 10px;
				img{
					width: 35px;
					height: 35px;
					border-radius: 4px;;
				}
				span{
					position: relative;
					display: inline-block;
					max-width: -moz-calc(100% - 120px);
					max-width: -webkit-calc(100% - 120px);
					max-width: calc(100% - 120px);
					padding:10px;
					background-color: #fff;
					font-size: 14px;
					margin: 0 0 0 10px;
					line-height: 1.5;
					border-radius: 4px;
				}
				.common{
					background-color: #fff;
					max-width: -moz-calc(100% - 120px) !important;
					max-width: -webkit-calc(100% - 120px) !important;
					max-width: calc(100% - 120px) !important;
					min-width: 60px !important;
					height: 40px;
					padding: 0;
					@include display-flex();
					@include align-items(center);
					@include justify-content_flex-justify();
					padding-right: 13px;
					i{
						font-style: normal;
					}
					p{
						@include display-flex();
						@include align-items(center);
						@include justify-content();
						min-width: 26px;
						height: 26px;
						border-top: 2px solid transparent;
						border-right: 2px solid #333;
						border-bottom: 2px solid transparent;
						border-left: 2px solid transparent;
						border-radius: 50%;
						margin-right: 10px;
						em{
							@include display-flex();
							@include align-items(center);
							@include justify-content();
							width: 16px;
							height: 16px;
							border-radius: 50%;
							border-top: 2px solid transparent;
							border-right: 2px solid #333;
							border-bottom: 2px solid transparent;
							border-left: 2px solid transparent;
							i{
								display: inline-block;
								width: 0px;
								height: 0px;
								border-radius: 50%;
								border-top: 5px solid transparent;
								border-right: 5px solid #333;
								border-bottom: 5px solid transparent;
								border-left:5px solid transparent;
							}
						}
					}
				}
				// .common::after{
				// 	position: absolute;
				// 	display: block;
				// 	right: -20px;
				// 	top: 17px;
				// 	content: '';
				// 	width:8px;
				// 	height:8px;
				// 	background-color: red;
				// 	border-radius: 50%;
				// }
				span::before{
					position: absolute;
					display: block;
					left: -6px;
					top: 13px;
					content: '';
					width:0;
					height:0;
					border-top:6px solid transparent;
					border-bottom:6px solid transparent;
					border-right:6px solid #fff;
				}
				.curr-voice{
					p{
						border-right: 2px solid transparent;
						@include animation(opacitie,linear,1s,infinite,0.25s,forwards);
						em{
							border-right: 2px solid transparent;
							@include animation(opacities,linear,1s,infinite,0s,forwards);
						}
					}
				}
			}
			.own-info{
				@include justify-content-v(flex-end);
				span{
					margin: 0 10px 0 0;
					background-color: #ffc963;
				}
				.common{
					background-color: #ffc963;
					height: 40px;
					padding: 0;
					max-width: -moz-calc(100% - 120px) !important;
					max-width: -webkit-calc(100% - 120px) !important;
					max-width: calc(100% - 120px) !important;
					min-width: 50px !important;
					@include display-flex();
					@include align-items(center);
					@include justify-content_flex-justify();
					padding:0 0 0 13px;
					i{
						font-style: normal;
					}
					p{
						@include display-flex();
						@include align-items(center);
						@include justify-content();
						min-width: 26px;
						height: 26px;
						border-top: 2px solid transparent;
						border-left: 2px solid #333;
						border-bottom: 2px solid transparent;
						border-right: 2px solid transparent;
						border-radius: 50%;
						margin:0 0 0 10px;
						em{
							@include display-flex();
							@include align-items(center);
							@include justify-content();
							width: 17px;
							height: 16px;
							border-radius: 50%;
							border-top: 2px solid transparent;
							border-left: 2px solid #333;
							border-bottom: 2px solid transparent;
							border-right: 2px solid transparent;
							i{
								display: inline-block;
								width: 0px;
								height: 0px;
								border-radius: 50%;
								border-top: 5px solid transparent;
								border-left: 5px solid #333;
								border-bottom: 5px solid transparent;
								border-right:5px solid transparent;
							}
						}
					}
				}
				.common::before{
					border-left:6px solid #ffc963;
				}
				.common::after{
					display: none;
				}
				span::before{
					position: absolute;
					right: -6px;
					left: auto;
					border-top:6px solid transparent;
					border-bottom:6px solid transparent;
					border-left:6px solid #ffc963;
					border-right:none;
				}
				.curr-voice{
					p{
						border-left: 2px solid transparent;
						@include animation(opac,linear,1s,infinite,0.25s,forwards);
						em{
							border-left: 2px solid transparent;
							@include animation(opaci,linear,1s,infinite,0s,forwards);
						}
					}
				}
			}
		}
		.v-on{
			bottom:400px;
		}
		.footer-box{
			@include display-flex();
			@include align-items(center);
			@include justify-content_flex-justify();
			position: fixed;
			bottom: 0;
			min-height: 50px;
			background-color: #f6f6f6;
			width: 100%;
			padding: 0 10px;
			-webkit-box-sizing: border-box;
			-moz-box-sizing: border-box;
			box-sizing: border-box;
			img{
				width: 10%;
			}
			.inp-box{
				width: 72%;
				min-height: 33px;
			}
			span{
				display: inline-block;
				width: 15%;
				text-align: center;
				background-color: #ffc963;
				font-size: 14px;
				color: #fff;
				line-height: 5vh;
				border-radius: 3px;
				.van-cell{
					padding: 0;
					line-height: 1vh;
				}
			}
			.text-box{
				border: none;
				width: 72%;
				font-size: 14px;
				line-height: 33px;
				padding: 0 5px;
				-webkit-box-sizing: border-box;
				-moz-box-sizing: border-box;
				box-sizing: border-box;
			}
			.voice-box{
				width: 72%;
				font-size: 14px;
				line-height: 33px;
				background-color: #fff;
				text-align: center;
			}
			.voice-curr{
				background-color: #d4d4d4;
			}
		}
		.van-pull-refresh__track{
			overflow-y: scroll;
		}
	}
	
	
	@include keyframes(opacities) {
	    0%{
	        border-right: 2px solid #333;
	    }
	    50%{
	        border-right: 2px solid #333;
	    }
	    51%{
	        border-right: 2px solid transparent;
	    }
	    100%{
	        border-right: 2px solid transparent;
	    }
	}
	
	@include keyframes(opacitie) {
	    0%{
	        border-right: 2px solid #333
	    }
		25%{
		    border-right: 2px solid #333
		}
		26%{
		    border-right: 2px solid transparent;
		}
	    100%{
	        border-right: 2px solid transparent;
	    }
	}
	
	
	@include keyframes(opaci) {
	    0%{
	        border-left: 2px solid #333;
	    }
	    50%{
	        border-left: 2px solid #333;
	    }
	    51%{
	        border-left: 2px solid transparent;
	    }
	    100%{
	        border-left: 2px solid transparent;
	    }
	}
	
	@include keyframes(opac) {
	    0%{
	        border-left: 2px solid #333
	    }
		25%{
		    border-left: 2px solid #333
		}
		26%{
		    border-left: 2px solid transparent;
		}
	    100%{
	        border-left: 2px solid transparent;
	    }
	}

</style>
