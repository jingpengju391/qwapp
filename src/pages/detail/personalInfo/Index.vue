<template>
	<div class="personal-info">
		<van-notice-bar v-if="check" mode="closeable" left-icon="info-o">{{check}}</van-notice-bar>
		<ul class="con-box">
			<li v-if="!item.it" v-for="(item, index) in basicInfo" :key="index" @click="setFromData( item )">
				<span>{{item.label}}</span>
				<div>
					<i class="txt-y" v-if="!item.flieData">{{item.value}}{{item.unit}}</i>
					<Upload class="head-box" v-else :flieData="item.flieData" @setKeep="setKeep" :plugs="item.plugs" :imgName="item.imgName" :keep="keep"></Upload>
					<van-icon name="arrow" />
				</div>
			</li>
			<li class="ig-box" v-if="item.it" v-for="(item, index) in basicInfo" :key="index" @click="setFromData( item )">
				<div class="ig-c-box">
					<span>{{item.label}}</span>
					<van-icon name="arrow" />
				</div>
				<i class="txt-y" v-if="!item.flieData">{{item.value}}</i>
				<Upload class="head-box" @setKeep="setKeep" v-else :flieData="item.flieData" :plugs="item.plugs" :imgName="item.imgName" :keep="keep"></Upload>
			</li>
		</ul>
		<h6>让对方更了解你</h6>
		<ul class="con-box no-m">
			<li v-if="!item.it" v-for="(item, index) in moreInfo" :key="index" @click="setFromData( item )">
				<span>{{item.label}}</span>
				<div>
					<i class="txt-y" v-if="!item.flieData">{{item.value}}{{item.unit}}</i>
					<Upload class="head-box" @setKeep="setKeep" v-else :flieData="item.flieData" :plugs="item.plugs" :imgName="item.imgName" :keep="keep"></Upload>
					<van-icon name="arrow" />
				</div>
			</li>
			<li class="ig-box" v-if="item.it" v-for="(item, index) in moreInfo" :key="index" @click="setFromData( item )">
				<div class="ig-c-box">
					<span>{{item.label}}</span>
					<van-icon name="arrow" />
				</div>
				<span class="txt-y-box"><i class="txt-y" v-if="!item.flieData" v-for="iter in item.value" :key="iter.id">{{iter.name}}</i></span>
				<Upload class="head-box" @setKeep="setKeep" v-if="item.flieData" :flieData="item.flieData" :plugs="item.plugs" :imgName="item.imgName" :keep="keep"></Upload>
			</li>
		</ul>
		<h6>私密信息</h6>
		<ul class="con-box no-m">
			<li v-if="!item.it" v-for="(item, index) in private" :key="index" @click="setFromData( item )">
				<span>{{item.label}}</span>
				<div>
					<i class="txt-y" v-if="!item.flieData">{{item.value}}{{item.unit}}</i>
					<Upload class="head-box" @setKeep="setKeep" v-else :flieData="item.flieData" :plugs="item.plugs" :imgName="item.imgName" :keep="keep"></Upload>
					<van-icon name="arrow" />
				</div>
			</li>
			<li class="ig-box" v-if="item.it" v-for="(item, index) in private" :key="index" @click="setFromData( item )">
				<div class="ig-c-box">
					<span>{{item.label}}</span>
					<van-icon name="arrow" />
				</div>
				<i class="txt-y" v-if="!item.flieData">{{item.value}}</i>
				<Upload class="head-box" @setKeep="setKeep" v-else :flieData="item.flieData" :plugs="item.plugs" :imgName="item.imgName" :keep="keep"></Upload>
			</li>
		</ul>
		<h6>择偶标准</h6>
		<ul class="con-box no-m">
			<li v-if="!item.it" v-for="(item, index) in standard" :key="index" @click="setFromData( item )">
				<span>{{item.label}}</span>
				<div>
					<i class="txt-y" v-if="!item.flieData">{{item.value}}{{item.unit}}</i>
					<Upload class="head-box" @setKeep="setKeep" v-else :flieData="item.flieData" :plugs="item.plugs" :imgName="item.imgName" :keep="keep"></Upload>
					<van-icon name="arrow" />
				</div>
			</li>
			<li class="ig-box" v-if="item.it" v-for="(item, index) in standard" :key="index" @click="setFromData( item )">
				<div class="ig-c-box">
					<span>{{item.label}}</span>
					<van-icon name="arrow" />
				</div>
				<i class="txt-y" v-if="!item.flieData">{{item.value}}</i>
				<Upload class="head-box" @setKeep="setKeep" v-else :flieData="item.flieData" :plugs="item.plugs" :imgName="item.imgName" :keep="keep"></Upload>
			</li>
		</ul>
		<van-overlay :show="show" @click="show = false">
			<van-datetime-picker
				v-model="currentDate"
				type="date"
				title="选择年月日"
				:min-date="minDate"
				:max-date="maxDate"
				 @confirm="setBirthday"
			/>
		</van-overlay>
		<Popup @setFromData="setFromData" @getData="getData" :formData="formData"></Popup>
	</div>
</template>

<script>
	import { mapState, mapActions } from "vuex";
	import Upload from '../../../components/upload/Index.vue'
	import Popup from './components/popup'
	import { HOST } from "../../../utils/config.js"
	import { timeConvert } from "../../../utils/conversion.js"
	export default {
		components:{
			Upload,
			Popup
		},
		data() {
			return {
				basicInfo:[
					{
						label:'头像',
						value:'',
						flieData:{
							accept:"",
							maxSize:'500 * 1204',
							maxCount:1,
							multiple:true,
							capture:'camera',
							previewSize:'40px',
							url:'',
							field:'head_image'
						},
						imgName:'defult-head.png',
						plugs:'HeaderImg',
						iShow:true,
						field:'head_image'
					},
					{
						label:'昵称',
						value:'',
						limit:true,
						maxlength:5,
						field:'nick_name'
					},
					{
						label:'性别',
						value:'',
						field:'genderdata',
						select:{
							radio:'',
							radios:[
								{
									name:'male',
									label:'男'
								},
								{
									name:'female',
									label:'女'
								}
							]
						}
					},
					{
						label:'年龄',
						value:'',
						limit:true,
						maxlength:3,
						unit:'岁',
						field:'age',
					},
					{
						label:'身高',
						value:'',
						limit:true,
						maxlength:3,
						unit:'cm',
						field:'stature',
					},
					{
						label:'体重',
						value:'',
						limit:true,
						maxlength:3,
						unit:'kg',
						field:'weight',
					},
					{
						label:'位置',
						value:'',
						field:'address',
					},
					{
						label:'独白',
						value:'',
						it:true,
						type:'textarea',
						limit:false,
						maxlength:50,
						field:'content',
					}
				],
				moreInfo:[
					{
						label:'生日',
						value:'',
						iShow:true,
						currData:true,
						field:'birthday',
					},
					{
						label:'学历',
						value:'',
						select:{
							radio:'',
							radios:[
								{name: 'illiteracy', label: '文盲'},
								{name: 'primary', label: '小学'},
								{name: 'middle', label: '中学'},
								{name: 'senior', label: '高中'},
								{name: 'junior', label: '专科'},
								{name: 'regular', label: '本科'},
								{name: 'graduate', label: '研究生'},
								{name: 'doctor', label: '博士'},
								{name: 'postdoctor', label: '博士后'}
							]
						},
						field:'school',
					},
					{
						label:'职业',
						value:'',
						field:'profession',
					},
					{
						label:'自拍信息',
						value:'',
						flieData:{
							accept:"",
							maxSize:'500 * 1204',
							maxCount:4,
							multiple:true,
							capture:'camera',
							previewSize:'80px',
							url:'',
							field:'selfieimagess'
						},
						it:true,
						imgName:'defult-head.png',
						plugs:'Dynamic',
						iShow:true,
						field:'selfieimagess'
					},
					{
						label:'我的标签',
						value:[],
						placeholder:'多个标签请用英文逗号分隔',
						field:'label',
						it:true,
						arrType:true
					}
				],
				standard:[
					{
						label:'婚姻状况',
						value:'',
						select:{
							radio:'',
							radios:[
								{
									name:'0',
									label:'未婚'
								},
								{
									name:'1',
									label:'离异'
								},
								{
									name:'2',
									label:'已婚'
								}
							]
						},
						field:'other_maritalstatus',
					},
					{
						label:'子女状况',
						value:'',
						field:'other_childrennumber',
					},
					{
						label:'年收入',
						value:'',
						field:'other_income',
					},
					{
						label:'身高',
						value:'',
						unit:'cm',
						field:'other_stature',
					},
					{
						label:'体重',
						value:'',
						unit:'kg',
						field:'other_weight',
					},
					{
						label:'房产状态',
						value:'',
						select:{
							radio:'',
							radios:[
								{
									name:0,
									label:'无'
								},
								{
									name:1,
									label:'有'
								}
							]
						},
						field:'is_house',
					},
				],
				private:[
					{
						label:'婚姻状况',
						value:'',
						select:{
							radio:'',
							radios:[
								{
									name:'0',
									label:'未婚'
								},
								{
									name:'1',
									label:'离异'
								},
								{
									name:'2',
									label:'已婚'
								}
							]
						},
						field:'maritalstatus',
					},
					{
						label:'子女状况',
						value:'',
						field:'childrennumber',
					},
					{
						label:'年收入',
						value:'',
						field:'income',
					},
				],
				minDate: new Date(1980, 0, 1),
				maxDate: new Date(),
				currentDate: new Date(),
				formData:null,
				show:false,
				keep:true,
				field:'',
				check:'审核中'
			};
		},
		computed: {
			...mapState(['user']),
			_api: function () {
				return this.$api._views.personal;
			},
			_home: function () {
				return this.$api._views.home;
			},
		},
		methods: {
			...mapActions(['setLoginInfo']),
			// 设置数据
			setFromData( currItem ){
				
				if( !currItem ){
					
					this.formData = currItem
					this.getData();
					
				}else{
					
					this.field = currItem.field
					currItem.iShow ? '' : this.formData = currItem;
					this.show = currItem.currData
					
				}
				
			},
			// 获取列表数据
			async getData(){
				
				const
				params = {
					member_id: this.user.member_id,
				},
				{
					data,
					status
				} = await this._api.personalinformation( params );
			
				data.member.member_id = data.member.id
				data.member.member_token = data.member.token
				this.setLoginInfo(data.member)
				
				const arr = ['basicInfo','moreInfo','standard','private'];
				 
				arr.forEach(itey => {
					this[itey].forEach(item => {
						if( !item.select && !item.flieData ){
							
							if( item.field == 'label' ){
								item.value = data.label
							}else{
								item.value = data.member[item.field]
							}
							
						}else if( !item.select && item.flieData ){
							item.flieData.url = data.member[item.field] ? data.member[item.field] : ''
						}else{
							item.select.radios.forEach(iter => {
								iter.name === data.member[item.field] ? item.value = iter.label : ''
							})
						}
					})
				})
				
			},
			// 上传头像
			async setKeep( list,curr ){
				let arr = [],params={};
				const FIEID = this.field ? this.field : curr.field;
				list.forEach(item => arr.push(item.name ? item.name : item.url));
				params.member_id = this.user.member_id;
				params[FIEID] = arr.join(',');
				
				const
				{
					data,
					status
				} = await this._api.fromlinformation( params );
				
			},
			// 修改生日
			async setBirthday(v){
		 
				const
				params = {
					member_id: this.user.member_id,
					birthday:timeConvert(v,1)
				},
				{
					data,
					status
				} = await this._api.fromlinformation( params );
				
				status == '1' && this.getData();
			},
			async getPanshiming(){
				const
				params = {
					member_id:this.user.member_id
				},
				{
					status,
				} = await this._home.panshiming( params );
				
				if( status == 2 ){
					this.check = '审核中，暂时不能应用';
				}else if( status == 3 ){
					this.check = '审核未通过，重新实名';
				}else if( status == 0 ){
					this.check = '未实名认证，请去实名认证';
				}else if( status == 1 ){
					this.check = '';
				}
			}
		},
		mounted(){
			this.getData();
			this.getPanshiming();
		}
	}
</script>

<style lang="scss" scoped>
	@import "~@/assets/css/mixin.scss";
	.personal-info{
		.con-box{
			@include display-flex();
			@include flex-direction-column();
			padding: 0 20px;
			background-color: #fff;
			margin-bottom: 20px;
			li{
				position: relative;
				@include display-flex();
				@include align-items(center);
				@include justify-content_flex-justify();
				font-size: 15px;
				height: 56px;
				color: #333;
				border-bottom: 1px solid #ebedf0;
				div{
					@include display-flex();
					@include align-items(center);
					color: #cccac7;
					.head-box{
						width: 40px;
						margin-right: 5px;
					}
					i.txt-y{
						font-style: normal;
						margin-right: 5px;
					}
					img{
						width: 50px;
						height: 50px;
					}
				}
			}
			li:last-child{
				border: none;
			}
			li.ig-box{
				@include align-items(flex-start);
				@include flex-direction-column();
				height: auto;
				.ig-c-box{
					width: 100%;
					height: 56px;
					@include justify-content_flex-justify();
					span:first-child{
						color:#333;
					}
				}
				.txt-y{
					display: inline-block;
					font-style: normal;
					color: #969799;
					line-height: 1.5;
					width: 100%;
					word-wrap:break-word;
					word-break:normal;
					 margin-bottom: 10px;
				}
				.txt-y-box{
					@include display-flex();
					flex-wrap: wrap;
					.txt-y{
						background-color: #ffc963;
						color: #333;
						margin-right: 10px;
						padding: 2px 8px;
						border-radius: 3px;
						font-size: 14px;
						margin-bottom: 15px;
						width: auto;
					}
				}
			}
			li:last-child{
				padding-bottom: 20px;
			}
		}
		.con-box:nth-child(3){
			li:nth-child(4){
				padding-bottom: 20px;
			}
		}
		.no-m{
			li:last-child{
				padding-bottom: 0px;
			}
		}
		h6{
			font-size: 16px;
			line-height: 56px;
			padding: 0 0 0 20px;
			font-weight: normal;
			color: #182b33;
		}
		.van-picker{
			position: absolute;
			bottom:0;
			width: 100%;
		}
	}
</style>
