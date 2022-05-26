<template>
	<div class="order-box">
		<div class="header-box">
			<img src="../../../assets/imgs/back-white.png" @click="setRouter" class="ql-back__wh" alt="">
			<span v-if="scan">扫赴约</span>
			<span v-if="!scan" :class="[item.curr ? 'active' : '']" v-for="item in categoryList" :key="item.name" @click="setTabs(item)">{{item.name}}</span>
		</div>
		<div class="con-box">
			<van-pull-refresh v-model="refreshing" @refresh="onRefresh">
			  <van-list
			    v-model="loading"
			    :finished="finished"
			    finished-text="没有更多了"
			    @load="onLoad"
			  >
			    <div class="con-list-box">
					<div class="list-box" v-for="item in list">
						<em class="state-img"><img :src="require('../../../assets/imgs/'+finishStutsImg+'.png')" alt=""></em>
						<div class="list-clid list-one">
							<div>
								<em><img :src="item.store.store_head ? host + item.store.store_head : defaultHeader" alt=""></em>
								<span>{{item.store.store_name}}</span>
							</div>
							<div>{{item.total_price}}</div>
						</div>
						<div class="list-clid list-two" v-for="item2 in item.goods">
							<!-- <p class="revise-txt">菜品已更改</p> -->
							<div class="c-box">
								<div class="left-box">
									<em><img :src="item2.good_image ? host +item2.good_image : defaultHeader" alt=""></em>
									<div class="n-box">
										<span class="foot-name">{{item2.good_name}}</span>
										<div class="x-pic">
											<span class="c-foot">{{item2.goods_type}}</span>
											<span>x{{item2.quantity}}</span>
										</div>
									</div>
								</div>
								<span class="rgt-box">{{item2.good_price}}</span>
							</div>
						</div>
						<div class="list-clid list-txt">
							<van-icon name="clock" color="#ccc" />
							<span>{{item.store.start_time}} ~ {{item.store.end_time}}</span>
						</div>
						<div class="list-clid list-txt txt-btm">
							<van-icon name="location" color="#ccc" />
							<span>{{item.store.address}}</span>
						</div>
						<div v-if="item.member" class="list-clid list-two list-four">
							<div class="c-box">
								<div class="left-box">
									<em><img :src="item.member.head_image ? host+item.member.head_image : defaultHeader" alt=""></em>
									<div class="n-box">
										<div>
											<span class="foot-name">{{item.member.nick_name}}</span>
											<i class="sex-box">
												<img v-if="item.member.genderdata == 'male'" src="../../../assets/imgs/man.svg" alt="">
												<img v-else src="../../../assets/imgs/girl.svg" alt="">
											</i>
										</div>
										<div class="x-pic">
											<span v-if="item.order_status=='create'" class="c-foot">创造：{{item.start_price}}</span>
											<span v-if="item.order_status=='part'" class="c-foot">部分付：{{item.start_price}}</span>
											<span v-if="item.order_status=='payed'" class="c-foot">待赴约：{{item.start_price}}</span>
											<span v-if="item.order_status=='finish'" class="c-foot">已完成：{{item.start_price}}</span>
											<span v-if="item.order_status=='cancel'" class="c-foot">已取消：{{item.start_price}}</span>
											<span>$：{{item.percentage*100}}%</span>
										</div>
									</div>
								</div>
							</div>
						</div>
						<div class="btn-box">
							<span 
								v-for="itemr in aButton[routerOrder]" 	
								:class="[itemr.bClass ? 'btn' : '']" 
								:key="itemr.handle" @click="setData( itemr, item )">
								{{itemr.name}}
							</span>
						</div>
					</div>
				</div>
			  </van-list>
			</van-pull-refresh>
		</div>
		<!-- 拒绝信息 -->
		<van-dialog v-model="refuse" title="拒绝原因" show-cancel-button @cancel="refuse = false" @confirm="setAccept">
		  <van-field
		    v-model="refuseTxt"
		    rows="5"
		    autosize
		    label="留言"
		    type="textarea"
		    placeholder="请输入拒绝原因"
		  />
		</van-dialog>
		<!-- 修改时间 -->
		<van-dialog v-model="upTime" show-cancel-button confirmButtonColor="#ffc963"  @cancel="upTime = false" @confirm="setTime">
			<span class="title-txt">选择预约时间</span>
			<van-radio-group class="rad-gup" v-model="radio" direction="horizontal" checked-color="#ffc963">
			  <van-radio class="rad-g" :name="item.id" v-for="item in storeTime" :key="item.id">{{ item.start_time }} ~ {{ item.end_time }}</van-radio>
			</van-radio-group>
		</van-dialog>
		<Scan v-if="scan" ref="scancode" @onScanCode="onScanCode"></Scan>
	</div>
</template>

<script>
	import { Toast } from 'vant';
	import { mapState } from "vuex";
	import Scan from '../../../components/scan/Index.vue'
	import { HOST , MALE , GIRL , DEFAULTHEADER } from "../../../utils/config.js";
	export default {
		components:{
			Scan
		},
		data() {
			return {
				categoryList: [
				    {
						id: 'daijieshou',
						name: '待接受',
						curr:true,
						finishStutsImg:'daijs',
						aButton0:[
							{
								name:'接受',
								handle:0,
								bClass:true
							},
							{
								name:'拒绝',
								handle:1,
							}
						],
						aButton1:[
							{
								name:'邀请',
								handle:8,
							},
							{
								name:'取消订单',
								handle:3,
								bClass:true
							}
						]
					},
				    {
						id: 'daizhifu', 
						name: '待支付',
						curr:false,
						finishStutsImg:'daizf',
						aButton:[
							{
								name:'支付',
								handle:2,
								bClass:true
							},
							{
								name:'取消订单',
								handle:3,
							}
						]
					},
				    {
						id: 'weifuyue', 
						name: '未赴约',
						curr:false,
						finishStutsImg:'dai',
						aButton:[
							{
								name:'扫赴约',
								handle:4,
								bClass:true
							},
							{
								name:'修改时间',
								handle:5,
							},
							{
								name:'取消订单',
								handle:3,
							}
						]
					},
				    {
						id: 'yiwancheng', 
						name: '已完成',
						curr:false,
						finishStutsImg:'daiwc',
						aButton:[
							{
								name:'发情侣圈',
								handle:6,
							},
							{
								name:'关联情侣',
								handle:7,
							}
						]
					}
				],
				finishStutsImg:'daiwc',
				aButton:[
					[
						{
							name:'接受',
							handle:0,
							bClass:true
						},
						{
							name:'拒绝',
							handle:1,
						}
					],
					[
						{
							name:'邀请',
							handle:8,
						},
						{
							name:'取消订单',
							handle:3,
							bClass:true
						}
					]
				],
				currPage:0,
				status:'daijieshou',
				list: [],
			    loading: false,
			    finished: false,
			    refreshing: false,
				refuse:false,
				refuseTxt:'',
				handle:0,
				currentDate: new Date(),
				upTime:false,
				currOrder:null,
				storeTime:[],
				radio:null,
				host:HOST,
				scan:false,
				defaultHeader:require( '../../../' + DEFAULTHEADER ),
			}
		},
		computed: {
			...mapState(['user']),
			_api: function () {
				return this.$api._views.order;
			},
			routerOrder: function () {
				return this.$route.query.order;
			},
		},
		methods: {
			onLoad() {
				
				if (this.refreshing) {
					this.list = [];
					this.currPage = 0;
					this.refreshing = false;
				}
				
				this.getData();
			},
			onRefresh() {
				// 清空列表数据
				this.finished = false;
				// 重新加载数据
				// 将 loading 设置为 true，表示处于加载状态
				this.loading = true;
				this.onLoad();
			},
			setRouter(){
				if( this.scan ){
					this.$refs.scancode.onClose();
				}else{
					this.$router.go(-1)
				}
			},
			// 设置tabSwitch数据
			setTabs( currItem ){
				
				this.categoryList.forEach(item => {
					item.curr = false;
					item.id == currItem.id ? item.curr = true : ''
				});
				
				this.finishStutsImg = currItem.finishStutsImg
				
				if( currItem.id === "daijieshou" ){
					
					const STR = 'aButton'+ this.routerOrder;
					this.aButton[this.routerOrder] = currItem[STR]
					
				}else{
					this.aButton[this.routerOrder] = currItem.aButton
				}
				
				this.status = currItem.id;
				
				this.currPage = 0;
				
				this.list = [];
				
				this.onLoad();
				
			},
			// 获取列表数据
			async getData(){
				
				this.currPage ++
				
				const
				apiStr = this.routerOrder ? 'wofaqi' : 'wojieshou',
				params = {
					start:this.currPage,
					status:this.status,
					member_id: this.user.member_id,
				},
				{
					data,
					status
				} = await this._api[apiStr]( params );
				
				if ( status != '1' ) return false;
				
				this.list = [...this.list,...data]
				
				this.loading = false;
				
				// 数据全部加载完成
				if ( !data.length ) this.finished = true;   
				
			},
			// 获取商户的时间端
			async getStore( currOrder ){
				
				const
				params = {
					store_id:currOrder.store_id,
					member_id: this.user.member_id,
				},
				{
					data,
					status
				} = await this._api.getStoreTime( params );
				
				if( status != '1' ) return false;
				
				this.storeTime = data;
				
			},
			// 订单处理
			setData( currBtn, currOrder ){
				
				const HANLE = currBtn.handle;
				
				this.handle = HANLE;
				
				this.currOrder = currOrder;
				
				// 接受  				0
				// 拒绝    				1
				// 邀请   				8
				// 取消订单  			3
				// 支付					2
				// 扫赴约				4
				// 修改时间				5
				// 发情侣圈				6
				// 关联情侣				7
				
				switch(HANLE) {
				     case 0:
				        this.setAccept();
						this.delListOne( currOrder );
				        break;
				     case 1:
						this.refuse = true;
						this.delListOne( currOrder );
				        break;
					case 2:
					   this.setPayment( currOrder );
					   break;	
					case 3:
					   this.canOrder( currOrder );
					   this.delListOne( currOrder );
					   break;	
					case 4:
					   this.scan = true;
					   break;  
					case 5:
					   this.getStore(currOrder);
					   this.upTime = true;
					   break; 	
					case 6:
					   this.publishHeart();
					   break;    
					case 7:
					   this.addHeartPerson( currOrder );
					   break;    
					case 8:
					   this.setInvitation( currOrder );
					   break;	
				     default:
				        Toast.success("错误操作！")
				} 
				
			},
			// 订单接受拒绝
			async setAccept(){
				
				const
				params = {
					is_accept : this.handle + 1,
					message_id:this.refuseTxt,
					member_id: this.user.member_id,
					order_id:this.currOrder.id
				},
				{
					data,
					status,
					msg
				} = await this._api.orderanniu( params );
				
				if ( status === '1' ) Toast.success(msg)
				
			},
			// 订单邀请
			setInvitation( currOrder ){
				
				this.$router.push({
					path: '/friends', 
					query: {
						orderId:currOrder.id,
						title:'邀请好友'
					}
				})
				
			},
			// 取消订单
			async canOrder( currOrder ){
				
				const
				params = {
					order_id : currOrder.id,
					member_id: this.user.member_id,
				},
				{
					data,
					status,
					msg
				} = await this._api.canceorder( params );
				
				if ( status === '1' ) Toast.success(msg)
				
			},
			// 支付订单
			setPayment( currOrder ){
				
				this.$router.push({
					path: '/order', 
					query: {
						title:'确认订单',
						orderId: currOrder.id, 
					}
				})
				
			},
			// 赴约 
			async setKeep( id ){
				
				const
				params = {
					order_id: id,
					member_id: this.user.member_id
				},
				{
					data,
					status,
					msg
				} = await this._api.sanorder( params );
				
				if ( status === '1' ) {
					
					Toast.success(msg);
					
					this.delListOne( this.currOrder );
					
				}
				
			},
			// 扫码
			onScanCode( result ){
				
				this.scan = false;
				
				if( this.currOrder.id == result ){
					
					this.setKeep( result )
					
				}else{
					result && Toast('订单信息错误');
				}
				
			},
			// 修改时间
			async setTime(){
				
				let p = {
					yue_start_time : '',
					yue_end_time : ''
				}
				
				this.storeTime.forEach(item => {
					if( item.id == this.radio ){
						let
						yue_start = this.time_to_sec(item.start_time),
						yue_end = this.time_to_sec(item.end_time);
						
						p.yue_start_time = yue_start
						p.yue_end_time = yue_end
						p.order_id = this.currOrder.id
						p.member_id = this.user.member_id
					} 
				})
				
				const
				{
					data,
					status,
					msg
				} = await this._api.changetime( p );
				
				if ( status === '1' ) Toast.success(msg)
				
			},
			// hh:mm:ss -> 时分秒时间戳
			time_to_sec(time) {
			　　if (time !== null) {
			　　　　let s = "";
			　　　　let hour = time.split(":")[0];
			　　　　let min = time.split(":")[1];
			　　　　let sec = time.split(":")[2];
			　　　　s = Number(hour * 3600) + Number(min * 60) + Number(sec);
			　　　　return s;
			　　}
			},
			// 发情侣圈
			publishHeart(){
				
				this.$router.push({
					path: '/dynamic', 
					query: {
						title:"发布情侣圈",
						orderId:this.currOrder.id,
					}
				})
			},
			// 关联情侣
			async addHeartPerson( currOrder ){
				const
				params = {
					order_id: currOrder.id,
					member_id: this.user.member_id,
				},
				{
					status,
					msg
				} = await this._api.sendren( params );
				
				if ( status === '1' ) Toast.success(msg)
			},
			// 删除数组中某一条
			delListOne( obj ){
				this.list.splice(this.list.findIndex(v => v.id === obj.id), 1)
			}
		},
	}
</script>

<style lang="scss" scoped>
	@import "~@/assets/css/mixin.scss";
	.order-box{
		@include display-flex();
		@include flex-direction-column();
		.rad-gup{
			@include justify-content();
			font-size: 14px;
			margin: 20px 0 0 0;
			.rad-g{
				margin-bottom: 10px;
			}
		}
		.title-txt{
			line-height: 3;
			font-size: 18px;
			font-weight: bold;
			color: #333;
			display: inline-block;
			width: 100%;
			padding: 0 20px;
			border-bottom: 1px solid #ebedf0;
		}
		.header-box{
			@include display-flex();
			@include justify-content();
			@include align-items(center);
			width: 100%;
			height: 46px;
			position: fixed;
			top: 0;
			left: 0;
			background-color: rgb(255, 201, 99);
			z-index: 1;
			span{
				display: inline-block;
				font-size: 16px;
				color: #fff;
				margin: 0 20px 0 0;
			}
			span:last-child{
				margin: 0;
			}
			span.active{
				font-weight: bold;
				font-size: 18px;
			}
			img{
				position: absolute;
				left: 20px;
				width: 10px;
			}
		}
		.con-box{
			margin: 20px 0 0 0;
			padding: 0 18px;
			.con-list-box{
				padding: 2px;
				.list-box{
					@include display-flex();
					@include flex-direction-column();
					background: #fff;
					border-radius: 10px;
					position: relative;
					padding: 20px 15px;
					margin-bottom: 20px;
					.state-img{
						position: absolute;
						right: -2px;
						top: -2px;
						display: block;
						width: 50px;
						img{
							width: 100%;
						}
					}
					.list-clid{
						@include display-flex();
						@include justify-content_flex-justify();
						@include align-items(center);
						font-size: 14px;
						color: #333;
						margin: 0 0 15px 0;
						div{
							@include display-flex();
							@include align-items(center);
							em{
								display: inline-block;
								width: 50px;
								height: 50px;
								min-width: 50px;
								border-radius: 50%;
								overflow: hidden;
								img{
									width: 100%;
									height: 100%;
									object-fit: cover;
								}
							}
						}
					}
					.list-one{
						font-weight: bold;
						em{
							margin: 0 10px 0 0;
						}
					}
					.list-two{
						@include display-flex();
						@include flex-direction-column();
						width: 100%;
						background: #FFF8F8F8;
						border-radius: 15px;
						padding:15px;
						-webkit-box-sizing: border-box;
						-moz-box-sizing: border-box;
						box-sizing: border-box;
						position: relative;
						.revise-txt{
							position: absolute;
							top: -8px;
							right: -2px;
							border-radius: 10px;
							border: 1px solid #fd6c62;
							font-size: 12px;
							line-height: 20px;
							padding: 0 20px;
							color: #fe6960;
							background: #fd6c6240;
						}
						.c-box{
							@include display-flex();
							@include justify-content_flex-justify();
							width: 100%;
							margin: 0 0 20px 0;
							.left-box{
								.n-box{
									@include display-flex();
									@include flex-direction-column();
									@include align-items(flex-start);
									.foot-name{
										margin: 5px 0 10px 0;
										color: #333;
										font-weight: bold;
									}
									.c-foot{
										margin: 0 20px 0 0;
									}
									.x-pic{
										font-size: 12px;
										color: #ccc;
									}
								}
								em{
									margin: 0 10px 0 0;
								}
							}
							.rgt-box{
								color: #fe5145;
								font-weight: bold;
							}
						}
						.c-box:last-child{
							margin-bottom: 0;
						}
					}
					.list-four{
						margin: 20px 0 0 0;
						padding: 0;
						background: transparent;
						.c-box{
							.left-box{
								.n-box{
									.x-pic{
										font-size: 14px;
										span{
											color: #fe5347;
										}
										.c-foot{
											color: #ffc963;
										}
									}
									i.sex-box{
										width: 20px;
										margin: -12px 0 0 3px;
									}
								}
							}
						}
					}
					.list-txt{
						font-size: 14px;
						color: #ccc;
						@include justify-content-v(flex-start);
						margin-bottom: 0px;
						line-height: 1.5;
						span{
							margin: 0 0 0 5px;
						}
					}
					.txt-btm{
						margin-bottom: 0;
					}
					.btn-box{
						@include display-flex();
						@include justify-content();
						width: 100%;
						margin: 20px 0 0 0;
						span{
							margin: 0 15px 0 0;
							font-size: 14px;
							border: 2px solid #ffc963;
							line-height: 28px;
							border-radius: 16px;
							color: #ffc963;
							text-align: center;
							width: 100px;
						}
						span.btn{
							color: #fff;
							background-color: #ffc963;
						}
						span:last-child{
							margin-right: 0;
						}
					}
				}
				.list-box:last-child{
					margin-bottom: 0;
				}
			}
		}
	}
</style>
