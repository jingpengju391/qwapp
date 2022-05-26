<template>
	<van-popup class="popup-box" v-model="show" position="right">
		<van-nav-bar
			v-if="formData"
			:left-text="'更改'+formData.label"
			right-text="保存"
			left-arrow
			@click-left="onClickLeft"
			@click-right="onClickRight"
		/>
		<div class="tag-box" v-if="formData && formData.arrType" >
			<span class="del-tag" v-for="item in formData.value">
				<i @click="delTagFn(item)"><van-icon class="del-btn" name="cross" /></i>
				<van-tag class="tag-list" color="#FFC963" type="danger" size="large">{{item.name}}</van-tag>
			</span>
			<van-icon class="tag-add" name="plus" @click="setAddTag" />
		</div>
		<van-field 
			v-if="formData && !formData.select && !formData.arrType" 
			v-model="formData.value" 
			:placeholder="formData.placeholder ? formData.placeholder :'请输入'+formData.label" 
			:type="formData.type" 
			:show-word-limit ="!formData.limit"
			:maxlength="formData.maxlength" />
		<van-radio-group v-if="formData && formData.select"  v-model="formData.select.radio" checked-color="#FFC963">
			<van-radio 
				v-for="(item, index) in formData.select.radios" 
				:key="index" 
				:name="item.name" 
				>{{item.label}}</van-radio>
		</van-radio-group>
		<van-dialog v-model="addtag" title="标签" show-cancel-button @confirm="setValue">
			<van-field v-model="tagName" label="标签名称" placeholder="请输入标签名称" />
		</van-dialog>
	</van-popup>
</template>

<script>
	import { mapState } from "vuex";
	import { Toast } from 'vant';
	export default {
		props: {
			formData: {
				type: Object,
				default: () => null
			},
		},
		data() {
			return {
				show:false,
				addtag:false,
				tagName:'',
				params:{}
			}
		},
		computed: {
			...mapState(['user']),
			_api: function () {
				return this.$api._views.personal;
			},
		},
		methods: {
			// 重置数据
			onClickLeft(){
				
				this.$emit('setFromData',null);
				
			},
			
			onClickRight(){
				
				this.params = {}
				this.params.member_id = this.user.member_id;
				
				if( this.formData.select ){
					
					this.params[this.formData.field] = this.formData.select.radio
					
				}
				
				if( this.formData.arrType ){
					
					let arr = [];
					
					this.formData.value.forEach(item => {
						arr = [...arr,item.name]
					})
					
					this.params[this.formData.field] = arr.join(',')
					
				}
				
				if( !this.formData.select && !this.formData.arrType ){
					
					this.params[this.formData.field] = this.formData.value
					
				}
				
				this.onSubmit();
				
			},
			// 获取商户的时间端
			async onSubmit(){
				
				const
				{
					data,
					status
				} = await this._api.fromlinformation( this.params );
				
				status == 1 && this.$emit('setFromData',null);
				
			},
			setAddTag(){
				this.addtag = true;
			},
			setValue(){
				
				if( !this.tagName ){
					Toast('标签名不能为空字符');
					return false;
				}
				
				this.formData.value = [...this.formData.value,{
					name:this.tagName
				}]
				
				this.tagName = ''
			},
			delTagFn( currItem ){
				
				this.formData.value.splice(this.formData.value.findIndex(item => item.name === currItem.name), 1)
				
			}
		},
		watch: {
			formData: {
				handler(newName, oldName) {
					
					newName ? 
					this.show = true : 
					this.show = false
				
				},
				deep: true,
				immediate: true
			},
		} 
	}
</script>

<style lang="scss" scoped>
	@import "~@/assets/css/mixin.scss";
	.popup-box{
		width: 100vw;
		height: 100vh;
		background-color: #f7f2e8;
		.van-nav-bar{
			background-color: transparent;
			border-bottom: 1px solid #efefef;
			.van-icon{
				color: red;
			}
		}
		.van-cell{
			background-color: transparent;
			border-bottom: 1px solid #e2e2e2;
			margin-top: 20px;
			padding: 10px 25px;
			font-size: 16px;
		}
		.van-radio-group{
			margin: 20px 0 0 20px;
			.van-radio{
				margin-bottom: 20px;
			}
		}
		.tag-box{
			@include display-flex();
			@include align-items(center);
			padding: 20px 40px;
			flex-wrap: wrap;
			.tag-list{
				margin: 0 20px 10px 0;
			}
			.tag-add{
				color:#FFC963;
				margin-bottom: 5px;
			}
			.del-tag{
				position: relative;
				i.del-btn{
					background-color: #00000063;
					border-radius: 50%;
					position: absolute;
					right:10px;
					top: -5px;
					font-size: 12px;
					padding: 1px;
					color: #fff;
				}
			}
		}
	}
</style>
<style lang="scss">
	@import "~@/assets/css/mixin.scss";
	.popup-box{
		.van-nav-bar{
			.van-icon{
				color: #FFC963;
			}
		}
		.van-nav-bar__text{
			color: #FFC963;
			font-size: 16px;
		}
	}
</style>
