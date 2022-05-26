<template>
    <div class="remark-box">
        <van-cell-group>
            <van-field
                    v-model="fieldValue"
                    type="textarea"
                    placeholder="填写备注信息"
                    autosize
					:maxlength="maxlength"
                    :border="false"
                    @input="onInput"
            />
        </van-cell-group>
        <span class="field-num">{{textNum}} / 50</span>
    </div>
</template>
<script>
    export default {
        data() {
            return {
                fieldValue: '',
                textNum: 0,
				maxlength:50
            }
        },
        methods: {
            onInput () {
                this.textNum = this.fieldValue.length
				this.$emit('setMessage',this.fieldValue)
            }
        }
    }
</script>
<style>
    .remark-box {
        position: relative;
        background: #ffffff;
        border-radius: 15px;
        min-height: 100px;
    }

    .remark-box .van-hairline--top-bottom::after, .van-hairline-unset--top-bottom::after {
        border-width: 0;
    }
    .remark-box .van-field__control{
        font-size: 14px;
        color: #040404;
    }
    .remark-box .field-num{
        position: absolute;
        right: 10px;
        bottom: 10px;
        font-size: 12px;
        color: #D4D3D0;
    }
	.van-cell{
		padding: 0;
	}
</style>
