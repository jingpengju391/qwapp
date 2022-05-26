<template>
	<div class="lover-box">
		<header>
			<span>消息通知</span>
			<div>
				<span>畅聊</span>
				<van-switch :value="checked" @input="onInput" active-color="#b2b0ad" />
			</div>
		</header>
		<div class="ctr-box">
			<span  @click="setRouter('/passers',{id:'lookme',title:'谁看过我'})">
				<i><img src="../../../assets/imgs/chat-visiter.png" alt=""></i>
				<em>谁看过我</em>
			</span>
			<span @click="setRouter('/passers',{id:'recommendisomerism',title:'推荐人员'})">
				<i><img src="../../../assets/imgs/chat-recommend.png" alt=""></i>
				<em>推荐人员</em>
			</span>
		</div>
		<ul class="con-box">
			<li v-for="item in msgList" :key="item.idClient" @click="setRouter('/chat',{id:item.custom.id,title:item.custom.name})">
				<i :class="[item.unread ? 'header-img' : 'header-img new-msg']"><img :src="item.custom.userHeader ?  host + item.custom.userHeader : defaultHeader" alt=""></i>
				<div class="con-m-box">
					<div>
						<span>{{item.custom.name}}<img :src="item.custom.genderdata == 'male' ? male : girl" alt=""></span>
						<time>{{item.times}}</time>
					</div>
					<span :class="[!item.unread && item.type == 'file' ? 'con-u voice-file' : 'con-u']">{{item.type == 'file' ? '[ 语音 ]' : item.text}}</span>
				</div>
			</li>
		</ul>
		<van-empty v-if="msgList.length == 0" description="暂时没有好友消息" />
	</div>
</template>

<script>
	import { mapState } from "vuex";
	import storage from '../../../utils/storage';
	import { Toast, Dialog, Empty } from "vant";
	import NIM from '../../../utils/nim';
	import { timestampFormat, timeConvert } from '../../../utils/conversion.js';
	import { HOST , MALE , GIRL , DEFAULTHEADER } from "../../../utils/config.js";
	export default {
		data() {
			return {
				host:HOST,
				defaultHeader:require( '../../../' + DEFAULTHEADER ),
				male:require( '../../../' + MALE ),
				girl:require( '../../../' + GIRL ),
				checked:true,
				msgList:[],
				timer:null
			}
		},
		computed: {
			...mapState(['user','oChat']),
			_api: function () {
				return this.$api._views.diary;
			},
		},
		methods: {
			onInput( checked ) {
				
				const 
				MSG = checked ? 
				'打开畅聊后你将可以和他(她)人对话' : 
				'关闭畅聊你将不能接到任何消息且不能发送消息'
				
				Dialog.confirm({
					title: '温馨提醒',
					message: MSG,
				}).then(() => {
					this.checked = checked;
					storage.set('chat',checked)
					this.onSignal( checked );
				}).catch(() => {});
				
			},
			// 通信开关
			onSignal( checked ){
				NIM.setConnect( checked );
			},
			// 获取数据
			async getData(){
				
				this.currPage ++
				
				const
				params = {
					member_id: this.user.member_id,
					start:this.currPage
				},
				{
					data,
					status
				} = await this._api.qinglvlist( params );
				
				if ( status != '1' ) return false;
				
				this.list = [...this.list,...data]
				
				this.loading = false;
				
				// 数据全部加载完成
				if ( !data.length ) this.finished = true;
				
			},
			// 刷新时间
			setNewTime(){
				const _this = this;
				clearInterval(this.timer)
				this.timer = setInterval(function(){
					_this.msgList.forEach(item => {
						item.times = timestampFormat( item.time );
					})
				},1000)
			},
			// 获取最新消息
			getNewMessage(){
				
				let 
				arr = [],
				obj = JSON.parse(JSON.stringify(this.oChat));
				
				// 取出数组序列
				for(let key in obj){
					arr = [...arr, obj[key]]
				}
				
				
				let arr2 = [];
				
				// 过滤掉发出信息 , 并将json串转换成json对象
				arr.forEach(item => {
					
					let arr3 = [];
					
					item.forEach((iter, index) => {
					
						if( iter.flow == "in" ){
							
							iter.custom = JSON.parse(iter.custom);
							iter.times = timestampFormat( iter.time );
							
							arr3 = [...arr3,iter]
							 
						}
					})
					
					arr2 = [...arr2, arr3]
					
				})
				
				let arr4 = [];
				
				// 聊天记录倒序并取最新一条放进list里
				arr2.forEach(item => {
					if( item.length > 0 ){
						item = item.reverse();
						arr4 = [...arr4,item[0]];
					}
				})
				
				// // 时间降序排列
				this.msgList = arr4.sort((a, b) => a.time > b.time ? 1 : -1)
				
				this.setNewTime();
				
			},
			// banner 跳转
			setRouter( path, query ){
				this.$router.push({
					path: path, 
					query: query
				})
			},
		},
		mounted() {
			this.checked = storage.get('chat');
		},
		watch: {
			oChat: {
				handler(newVal,oldVal) {
					this.getNewMessage();
				},
				immediate: true,
				deep: true
			}
		}
	}
</script>

<style lang="scss" scoped>
	@import "~@/assets/css/mixin.scss";
	.lover-box{
		@include display-flex();
		@include justify-content();
		@include flex-direction-column();
		header{
			@include display-flex();
			@include align-items(center);
			@include justify-content_flex-justify();
			height: 50px;
			padding: 0 20px;
			border-bottom: 1px solid #ddd;
			font-size: 16px;
			color: #182B33;
			font-weight: 800;
			div{
				@include display-flex();
				@include align-items(center);
				span{
					margin: 0 10px 0 0;
					font-weight: 400;
				}
			}
		}
		.ctr-box{
			@include display-flex();
			padding: 20px 20px 0 20px;
			span{
				@include display-flex();
				@include flex-direction-column();
				@include justify-content();
				margin-right: 20px;
				i{
					display: inline-block;
					width: 60px;
				}
				em{
					display: inline-block;
					font-size: 14px;
					font-style: normal;
					text-align: center;
				}
			}
		}
		ul.con-box{
			@include display-flex();
			@include flex-direction-column();
			padding:0 20px 20px 20px;
			margin-top: 20px;
			width: 100%;
			max-height: calc(100vh - 210px);
			overflow-y: scroll;
			li{
				@include display-flex();
				@include align-items(center);
				width: 100%;
				background-color: #fff;
				border-radius: 10px;
				padding: 20px;
				margin-bottom: 15px;
				.header-img{
					position: relative;
					display: inline-block;
					width: 60px;
					height: 60px;
					margin-right: 10px;
					img{
						width: 100%;
						height: 100%;
						object-fit: cover;
						border-radius: 50%;
					}
				}
				.new-msg::before{
					content: '';
					display: block;
					width: 7px;
					height: 7px;
					background-color: #d60000;
					position: absolute;
					right: 4px;
					top: 4px;
					border-radius: 100%;
					border: 2px solid #c10000;
				}
				.con-m-box{
					@include display-flex();
					@include flex-direction-column();
					width: calc(100% - 70px);
					div{
						@include display-flex();
						@include align-items(center);
						@include justify-content_flex-justify();
						margin-bottom: 10px;
						span{
							font-size: 18px;
							font-weight: 800;
							img{
								width: 20px;
								margin-left: 5px;
							}
						}
						time{
							font-size: 13px;
							font-weight: 600;
							color:#a6aeb2;
						}
					}
					.con-u{
						font-size: 14px;
						color:#a6aeb2;
						overflow: hidden;
						text-overflow:ellipsis;
						white-space: nowrap;
					}
					.voice-file{
						color:#ffc665;
					}
				}
			}
		}
	}
</style>
<style lang="scss">
	@import "~@/assets/css/mixin.scss";
	.lover-box{
		header{
			div{
				.van-switch__node{
					background-color: #8F8F8F;
					width: 25px;
					height: 25px;
					top: -5px;
				}
				.van-switch{
					width: 50px;
					height: 16px;
				}
			}
		}
	}
</style>