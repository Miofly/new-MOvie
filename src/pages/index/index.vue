<template>
    <view style="height: 100%">
        <movie v-if="PageCur==='movie'"></movie>
        <bdy v-if="PageCur==='bdy'"></bdy>
        <share v-if="PageCur==='share'"></share>
        <module v-if="PageCur==='module'"></module>
        <webview v-if="PageCur==='webview'"></webview>

        <view class="cu-bar tabbar bg-white foot">
            <view v-if="masters" @click="NavChange" class="action" data-cur="movie">
                <view class="fa-cu-image">
                    <image :src="'/static/tabbar/movie' + [PageCur=='movie'?'_cur':''] + '.png'"></image>
                </view>
                <view :class="PageCur=='movie'?'text-blue':'text-gray'">{{indexArr[0]}}</view>
            </view>
            <view v-if="masters" @click="NavChange" class="action" data-cur="bdy">
                <view class="fa-cu-image">
                    <image :src="'/static/tabbar/bdy' + [PageCur=='bdy'?'_cur':''] + '.png'"></image>
                </view>
                <view :class="PageCur=='bdy'?'text-blue':'text-gray'">{{indexArr[1]}}</view>
            </view>
            <view @click="NavChange" class="action text-gray add-action" data-cur="webview">
                <button class="cu-btn fa-plus fa bg-blue shadow"></button>
                <view :class="PageCur=='webview'?'text-blue':'text-gray'">{{indexArr[2]}}</view>
            </view>
            <view v-if="masters" @click="NavChange" class="action" data-cur="module">
                <view class="fa-cu-image">
                    <image :src="'/static/tabbar/module' + [PageCur=='module'?'_cur':''] + '.png'"></image>
                    <!--<view class="cu-tag badge">99</view>-->
                </view>
                <view :class="PageCur=='plugin'?'text-blue':'text-gray'">{{indexArr[3]}}</view>
            </view>
            <view @click="NavChange" class="action" data-cur="share">
                <view class="fa-cu-image">
                    <image :src="'/static/tabbar/share' + [PageCur=='share'?'_cur':''] + '.png'"></image>
                    <!--<view class="cu-tag badge">99</view>-->
                </view>
                <view :class="PageCur=='share'?'text-blue':'text-gray'">{{indexArr[4]}}</view>
            </view>
        </view>
    </view>
</template>

<script>
    import {mapState} from 'vuex'
    export default {
        data () {
            return {
                PageCur: this.$store.state.defaultPage
            }
        },
        onLoad () {

        },
        onUnload () {
            console.log('onUnload：页面卸载')
        },
        onShow () {
            console.log('onShow：页面显示')
        },
        onHide () {
            console.log('onHide：页面隐藏')
        },
        onReady () {
            console.log('onReady：页面初次渲染完成')
        },
        onResize () {
            console.log('onResize：页面尺寸发生变化')
        },
        onBackPress () {
            console.log('onBackPress：页面返回')
        },
        methods: {
            NavChange (e) {
                this.PageCur = e.currentTarget.dataset.cur
            }
        },
        computed: {
            ...mapState(['masters', 'indexArr', 'defaultPage']),
        },
    }
</script>
