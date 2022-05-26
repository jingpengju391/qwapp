<template>
	<div class="coupon-box">
		<!-- 优惠券单元格 -->
		<van-coupon-cell
		  :coupons="coupons"
		  :chosen-coupon="chosenCoupon"
		  @click="showList = true"
		/>
		<!-- 优惠券列表 -->
		<van-popup
		
		  v-model="showList"
		  round
		  position="bottom"
		  style="height: 90%; padding-top: 4px;"
		>
		  <van-coupon-list
		    :coupons="coupons"
		    :chosen-coupon="chosenCoupon"
		    :disabled-coupons="disabledCoupons"
		    @change="onChange"
		    @exchange="onExchange"
		  />
		</van-popup>
	</div>
</template>

<script>
	export default {
		props: {
			coupon: {
				type: Array,
				default: () => []
			}
		},
		data() {
			return {
				chosenCoupon: -1,
				showList:false,
				coupons: [],
				disabledCoupons: [],
			};	
		},
		methods: {
			onChange(index) {
				
				this.showList = false;
				this.chosenCoupon = index;
				
				const OBJ = {
					id:index == -1 ? null : this.coupons[index].id,
					value:index == -1 ? 0 : this.coupons[index].value,
				}
				
				this.$emit('setCoupon',OBJ);
				
			},
			onExchange(code) {
				
				this.coupons.push(coupon);
				
			},
			setCoupons(){
				this.coupon.forEach(item => {
					item.value = item.price*100
					item.startAt = item.low_price
					item.endAt = item.shiyongtime
					item.valueDesc = item.price
					item.reason == '' ? 
					this.disabledCoupons = [...this.disabledCoupons,item] : 
					this.coupons = [...this.coupons,item]  
				})
			}
		},
		watch: {
			coupon: {
				handler(newVal) {
					this.setCoupons();
				},
				immediate: true,
				deep: true 
			}
		}
	}
</script>
<style lang="scss" scoped>
	.coupon-box .van-cell{
		font-weight: bold;
		.van-coupon-cell--selected{
			color: red;
		}
	}
</style>
<style lang="scss">
	.coupon-box .van-coupon-list__exchange-bar{
		display: none;
	}
	.coupon-box .van-button--danger{
		background-color: #FFC963;
		border-color: #ffbc3e;
	}
	.coupon-box .van-tabs__line{
		background-color:#FFC963;
	}
</style>
