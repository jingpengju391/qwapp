<template>
	<div class="diary-box">
		<header>
			<span>趣味日记</span>
			<span @click="setRouter('/dynamic',{title:'发布情侣圈'})">发布</span>
		</header>
		<van-pull-refresh class="list-box" v-model="refreshing" @refresh="onRefresh">
		  <van-list
		    v-model="loading"
		    :finished="finished"
		    finished-text="没有更多了"
		    @load="onLoad"
		  >
		    <ul class="con-box">
				<li v-for="item in list" :key="item.id">
					<div class="top-nox">
						<em @click="setRouter('/user-info', item)">
							<img :src="item.member.head_image?host + item.member.head_image:defaultHeader" alt="">
						</em>
						<p>
							<span>
								<i>{{item.member.nick_name | on}}</i>
								<i class="sex-box"><img :src="item.member.genderdata=='male' ? male : girl " alt=""></i>
							</span>
							<span>
								<i>{{item.member.age | on}} 岁</i>
								<i>{{item.member.profession | on}}</i>
							</span>
						</p>
					</div>
					<div class="btm-box">
						<span class="introduce-box">{{item.member.content}}</span>
						<span>
							<i class="photo-box" v-for="(iter,index) in item.member.selfie_images" :key="index"  @click="lookImg(item.member.selfie_images,index)">
								<img :src="host + iter" alt="">
							</i>
						</span>
						<span>
							<van-icon class="icon-box" name="clock" />
							<i>{{item.createtime | dateFormat}}</i>
						</span>
						<span>
							<van-icon class="icon-box" name="location" />
							<i>{{item.member.address | on}}</i>
						</span>
						<span @click="setCurrItem(item)">
							<van-icon class="icon-box" name="like" :color="item.already_dian ? '#ffc665' : ''" />
							<i>男才女貌</i>
							<i class="fabulous-num">{{item.dianzan_number | greaterThan}}</i>
						</span>
					</div>
				</li>
			</ul>
		  </van-list>
		</van-pull-refresh>
		<ImgInfo :ImgInfo="imgInfo"></ImgInfo>
		<van-dialog v-model="show" class="choose-box" title="操作" show-cancel-button @confirm="toCheck">
			<van-radio-group v-model="radio">
				<van-radio class="choose-list" name="1" checked-color="#FFC963">
					<span>付费一元</span><br>
					<span class="describe-txt">付费1元可获得一次优惠卷资格</span>
				</van-radio>
				<van-radio class="choose-list" name="2" checked-color="#FFC963">免费祝福</van-radio>
			</van-radio-group>
		</van-dialog>
		<van-dialog v-model="shoWay" title="微信支付" show-cancel-button @cancel="showDatepicker = false" @confirm="onCheckPay">
			<van-radio-group v-model="radio2" class="radio-group-box" checked-color="#FCDC8B">
			  <van-radio name="1">微信支付</van-radio>
			  <van-radio name="2">余额支付</van-radio>
			  <van-radio name="3">情侣基金支付</van-radio>
			</van-radio-group>
		</van-dialog>
	</div>
</template>

<script>
	import { mapState } from "vuex";
	import { Toast,Notify } from "vant";
	import ImgInfo from "../../../components/Image-info"
	import { onPayment } from '../../../utils/conversion.js';
	import { HOST , MALE , GIRL , DEFAULTHEADER } from "../../../utils/config.js";
	export default {
		components: {
		    ImgInfo
		},
		data() {
			return {
				host:HOST,
				defaultHeader:require( '../../../' + DEFAULTHEADER ),
				male:require( '../../../' + MALE ),
				girl:require( '../../../' + GIRL ),
				refreshing: false,
				loading: false,
				finished: false,
				currPage:0,
				list:[],
				imgInfo:{
					list:[],
					curr:''
				},
				radio:'1',
				radio2:'1',
				show:false,
				shoWay:false,
				currItem:null,
			}
		},
		computed: {
			...mapState(['user']),
			_api: function () {
				return this.$api._views.diary;
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
			lookImg( imgList,curr ){
				
				const IMGINFO = {
					imgList:imgList,
					curr:curr
				}
				this.imgInfo = IMGINFO;
				
			},
			// banner 跳转
			setRouter( path, currItem ){
				this.$router.push({
					path: path, 
					query: {
						id:currItem.member ? currItem.member.id : null,
						articleId:currItem.qinglv_id,
						title:currItem.nick_name
					}
				})
			},
			// 设置当前日记
			setCurrItem( currItem ){
				
				this.currItem = currItem
				this.show = true
				
			},
			// 校验
			toCheck(){
				
				this.radio == '1' ? this.shoWay = true : '';
				
				this.radio == '2' && this.FreeBlessing()
				
			},
			onCheckPay(){
				if( this.radio2 == '2' ){
					Toast.fail('余额支付开发中')
					return false
				}
				
				if( this.radio2 == '3' ){
					Toast.fail('情侣基金支付开发中')
					return false
				}
				
				if(this.radio == '1'){
					this.payOne();
				}else if(this.radio == '2'){
					this.payOne( this.balancePay );
				}else{
					this.payOne( this.loverPay );
				}
				
				
			},
			// 付费
			async payOne( callback ){
				
				const
				params = {
					quan_id: this.currItem.id,
					member_id: this.user.member_id
				},
				{
					info,
					msg,
					recharge_no,
					status
				} = await this._api.payblessing( params );
				
				onPayment( info, _p => {
					this.PayCallback( recharge_no )
				})
				
			},
			// 余额支付
			balancePay(){
				Toast.fail('余额支付开发中')
			},
			// 支付成功回调
			async paySuccess( no ){
				
				const
				params = {
					dianzan_no: no,
					member_id: this.user.member_id
				},
				{
					msg,
				} = await this._api.payblessingOperation( params );
				
				Toast.success(msg)
			},
			// 情侣基金支付
			loverPay(){
				Toast.fail('情侣基金支付开发中')
			},	
			// 免费祝福
			async FreeBlessing(){
				
				if( this.currItem.member.status == 'agree' ){
					Toast('您以为此条送过祝福');
					return false;
				}
				
				const
				params = {
					quan_id: this.currItem.id,
					member_id: this.user.member_id
				},
				{
					msg,
					status
				} = await this._api.freeblessing( params );
				
				if( status !== '1' ) return false;
				
				this.list.forEach(item => item.member.id == this.currItem.member.id ? (item.already_dian = 1,item.dianzan_number++):'')
				
				Toast(msg);
				
			}
		},
	}
</script>

<style lang="scss" scoped>
	@import "~@/assets/css/mixin.scss";
	.diary-box{
		@include display-flex();
		@include justify-content();
		@include flex-direction-column();
		header{
			@include display-flex();
			@include align-items(center);
			@include justify-content_flex-justify();
			position: fixed;
			top: 0;
			z-index: 2;
			width: 100%;
			height: 50px;
			padding: 0 20px;
			border-bottom: 1px solid #ddd;
			font-size: 16px;
			color: #182B33;
			background-color: #f9f1e8;
			span:first-child{
				font-weight: 800;
			}
		}
		.list-box{
			margin-top: 50px;
			ul.con-box{
				@include display-flex();
				@include flex-direction-column();
				padding:20px;
				width: 100%;
				li{
					@include display-flex();
					@include flex-direction-column();
					width: 100%;
					background-color: #fff;
					border-radius: 10px;
					padding: 20px;
					margin-bottom: 20px;
					.top-nox{
						@include display-flex();
						@include align-items(center)
						em{
							display: inline-block;
							width: 60px;
							height: 60px;
							border-radius: 50%;
							overflow: hidden;
							margin-right: 10px;
							img{
								width: 100%;
								height: 100%;
								object-fit: cover;
							}
						}
						p{
							span{
								position: relative;
								color: #182B33;
								font-size: 16px;
								i{
									font-style: normal;
								}
								i.sex-box{
									display: inline-block;
									width: 20px;
									height: 20px;
									position: absolute;
									top: -5px;
									right:-25px;
									img{
										width: 100%;
										height: 100%;
										object-fit: cover;
									}
								}
							}
							span:last-child{
								display: block;
								font-size: 12px;
								margin-top: 5px;
								i{
									margin-right: 10px;
								}
							}
						}
					}
					.btm-box{
						@include display-flex();
						@include flex-direction-column();
						padding-left: 70px;
						span{
							@include display-flex();
							font-size: 14px;
							color: #A6AEB2;
							margin-top: 10px;
							flex-wrap: wrap;
							.icon-box{
								margin-right: 5px;
							}
							i{
								font-style: normal;
							}
							.fabulous-num{
								margin-left: 5px;
							}
							.photo-box{
								position: relative;
								width: 30%;
								padding-bottom: 30%;
								margin-right: 5%;
								border-radius: 5px;
								overflow: hidden;
								margin-bottom: 5%;
								img{
									position: absolute;
									top: 0;
									left: 0;
									width: 100%;
									height: 100%;
									object-fit: cover;
								}
							}
							.photo-box:nth-child(3n){
								margin-right: 0px;
							}
						}
						.introduce-box{
							margin: 10px 0 10px 0;
							line-height: 1.5;
						}
					}
				}
				li:last-child{
					margin-bottom: 0;
				}
			}
		}
		.choose-box{
			padding: 0 20px;
			.choose-list{
				margin:10px 0;
				.van-radio__label{
					@include display-flex();
					@include flex-direction-column();
					.describe-txt{
						font-size: 12px;
						color: #ccc;
					}
				}
			}
		}
		.radio-group-box{
			.van-radio{
				margin: 0 0 20px 20px;
			}
		}
	}
</style>
