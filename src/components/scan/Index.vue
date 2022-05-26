<template>
	<div class="num-mask"  id="bcid" >
		<!-- <van-icon class="close-btn" name="cross" /> -->
	</div>
</template>

<script>
    export default {
        name: "h5barcode",
      data(){
          return {
            scan:null,
          }
      },
      mounted(){
        this.startRecognize();
      },
      methods:{
    
        // H5调用扫描功能
        startRecognize () {
          let that = this;
          if (!window.plus) return;
		  const styles = {frameColor: "#ffc963",scanbarColor: "#ffc963",background: "#000"};//边框属性，中间线属性，背景色
		  let filter;//扫码格式 空为全类型
          that.scan = new plus.barcode.Barcode('bcid',filter,styles);
          that.scan.onmarked = onmarked;
          that.scan.start();
          function onmarked (type, result, file) {
            switch (type) {
              case plus.barcode.QR:
                type = 'QR';
                break;
              case plus.barcode.EAN13:
                type = 'EAN13';
                break;
              case plus.barcode.EAN8:
                type = 'EAN8';
                break;
              default:
                type = '其它' + type;
                break
            }
            result = result.replace(/\n/g, '');
			
			that.$emit('onScanCode',result)
            that.scan.close();
            //这里写扫码结束后 自己的逻辑
          }
        },
		// 关闭扫码
		onClose(){
			this.scan.close();
			this.$emit('onScanCode')
		}
      }
    }
</script>


<style scoped>
	 .num-mask{
	    width: 100%;
	    height: 100%;
	    position: fixed;
	    left: 0;
	    top: 50px;
	    background: rgba(0,0,0,1);
	    z-index: 9;
		color: #fff;
	  }
	   .title{
	    width: 100%;
	    position: absolute;
	    top: 0;
	    height: 40px;
	    line-height: 40px;
	    text-align: center;
	    font-size: 2rem;
	  }
</style>
