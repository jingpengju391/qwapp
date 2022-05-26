<template>
    <van-swipe class="my-swipe" :loop="false">
        <van-swipe-item>
            <img src="../../assets/welcome/w1.png"/>
        </van-swipe-item>
        <van-swipe-item>
            <img src="../../assets/welcome/w2.png"/>
        </van-swipe-item>
        <van-swipe-item>
            <img src="../../assets/welcome/w3.png"/>
        </van-swipe-item>
        <van-swipe-item @touchstart.prevent="handleTouchStart"
                        @touchend="handleTouchEnd">
            <img src="../../assets/welcome/w4.png"/>
        </van-swipe-item>
    </van-swipe>
</template>
<script>
    export default {
        name: 'welcome',
        data() {
            return {
                vueTouches: null
            }
        },
        methods: {
            handleTouchStart(el) {
                this.vueTouches = {x: el.changedTouches[0].pageX, y: el.changedTouches[0].pageY};
            },
            handleTouchEnd(el) {
                let disX = el.changedTouches[0].pageX - this.vueTouches.x;
                if (disX < -10) {
                    this.$router.push({path: '/login'})
                }
            }
        }
    }
</script>
<style>
    .my-swipe {
        background: #ffffff;
    }

    .my-swipe .van-swipe-item {
        width: 100%;
        height: 100%;
    }

    .my-swipe .van-swipe-item img {
        width: 100%;
        height: 100%;
    }
</style>
