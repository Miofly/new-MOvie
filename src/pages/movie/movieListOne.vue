<template>
    <scroll-view style="height: 100%" scroll-y v-if="masters">
        <ad v-if="ggkzs" unit-id="adunit-25b59fd8185c8f72" ad-intervals="30"></ad>
        <video custom-cache="false" :title="videoTitle" enable-play-gesture="true"
               show-mute-btn="true" style="position: fixed;top: 100rpx;left:0;width: 100%;height: 300rpx;z-index: 1024"
               ad-unit-id="adunit-6d8d6c137d7b7841" @aderror="playAd"
               :id="videoId" @error="videoError" :src="videoSrc" :poster="posterImg" @play="play" autoplay="true">
        </video>

        <scroll-view style="height: 100%;margin-top: 400rpx" scroll-y>
            <view :style="{height: Math.ceil(mvDetailDataOne.length/5) <=3 ? Math.ceil(mvDetailDataOne.length/5)* 8 + '%' : 24 + '%'}"
                  style="margin-bottom: 40rpx" v-if="mvDetailDataOne.length!==0">
                <view>信号源一：</view>
                <scroll-view style="height: 100%" scroll-y>
                    <view class="cu-list grid" :class="['col-' + 5]">
                        <view class="cu-item" @tap="videoPlays(item.url, 'one' + index)" :class="['one' + index === bgIndex ? 'bg-gray':'']"
                              v-for="(item,index) in mvDetailDataOne" :key="index">
                            <text>{{item.name}}</text>
                        </view>
                    </view>
                </scroll-view>
            </view>

            <view :style="{height: Math.ceil(mvDetailDataTwo.length/5) <=3 ? Math.ceil(mvDetailDataTwo.length/5)* 8 + '%' : 24 + '%'}"
                    v-if="mvDetailDataTwo.length!==0" style="margin-bottom: 40rpx">
                <view>信号源二：</view>
                <scroll-view style="height: 100%" scroll-y class="cu-list grid" :class="['col-' + 5]">
                    <view class="cu-list grid" :class="['col-' + 5]">
                        <view class="cu-item" @tap="videoPlays(item.url, 'two' + index)" :class="['two' + index === bgIndex ? 'bg-gray':'']"
                              v-for="(item,index) in mvDetailDataTwo" :key="index">
                            <text>{{item.name}}</text>
                        </view>
                    </view>
                </scroll-view>
            </view>
            <ad v-if="ggkzs" unit-id="adunit-25b59fd8185c8f72" ad-intervals="30"></ad>
            <view :style="{height: Math.ceil(mvDetailDataThree.length/5) <=3 ? Math.ceil(mvDetailDataThree.length/5)* 8 + '%' : 24 + '%'}"
                    v-if="mvDetailDataThree.length!==0" style="height: 24%;margin-bottom: 40rpx" >
                <view>信号源三：</view>
                <scroll-view style="height: 100%" scroll-y class="cu-list grid" :class="['col-' + 5]">
                    <view class="cu-list grid" :class="['col-' + 5]">
                        <view class="cu-item" @tap="videoPlays(item.url, 'three' + index)" :class="['three' + index === bgIndex ? 'bg-gray':'']"
                              v-for="(item,index) in mvDetailDataThree" :key="index">
                            <text>{{item.name}}</text>
                        </view>
                    </view>
                </scroll-view>
            </view>
            <view :style="{height: Math.ceil(mvDetailDataFour.length/5) <=3 ? Math.ceil(mvDetailDataFour.length/5)* 8 + '%' : 24 + '%'}"
                    v-if="mvDetailDataFour.length!=0" style="height: 24%;margin-bottom: 40rpx" >
                <view>信号源四：</view>
                <scroll-view style="height: 100%" scroll-y class="cu-list grid" :class="['col-' + 5]">
                    <view class="cu-list grid" :class="['col-' + 5]">
                        <view class="cu-item" @tap="videoPlays(item.url, 'four' + index)" :class="['four' + index === bgIndex ? 'bg-gray':'']"
                              v-for="(item,index) in mvDetailDataFour" :key="index">
                            <text>{{item.name}}</text>
                        </view>
                    </view>
                </scroll-view>
            </view>
            <ad v-if="ggkzs" unit-id="adunit-f199c3512f32503a" ad-type="video" ad-theme="black"></ad>
            <ad v-if="ggkzs" unit-id="adunit-35711c1e83d8593c" ad-type="grid" grid-opacity="0.8" grid-count="5" ad-theme="white"></ad>
        </scroll-view>
    </scroll-view>
</template>

<script>
    import {mapState} from 'vuex'
    import {
        commonHttp
    } from '@/api'
    import {tu} from 'mioJs/toolUtils'
    const cheerio = require('cheerio')

    export default {
        data () {
            return {
                mvDetailDataOne: [],
                mvDetailDataTwo: [],
                mvDetailDataThree: [],
                mvDetailDataFour: [],

                interstitialAd: null,
                rewardedVideoAd: null,

                video: null,
                videoSrc: null,
                videoTitle: '',
                videoId: '0',
                bgIndex: null,
            }
        },
        async onLoad (e) {
             console.log(JSON.parse(decodeURIComponent(e.movieUrl)))
             this.ui.yunFun('movieOne', {
                     url: JSON.parse(decodeURIComponent(e.movieUrl))
                 }, (res) => {
                 console.log(res.result.body)
                 const $ = cheerio.load(res.result.body, { _useHtmlParser2: true })

                 for (let i = 0; i < $('.bd ul').eq(0).children('li').length; i++) {
                     this.mvDetailDataOne.push({
                         name: $('.bd ul').eq(0).children('li').eq(i).children('a').text(),
                         url: $('.bd ul').eq(0).children('li').eq(i).children('a').attr('href')
                     })
                 }
                 for (let i = 0; i < $('.bd ul').eq(1).children('li').length; i++) {
                     this.mvDetailDataTwo.push({
                         name: $('.bd ul').eq(1).children('li').eq(i).children('a').text(),
                         url: $('.bd ul').eq(1).children('li').eq(i).children('a').attr('href')
                     })
                 }
                 for (let i = 0; i < $('.bd ul').eq(2).children('li').length; i++) {
                     this.mvDetailDataThree.push({
                         name: $('.bd ul').eq(2).children('li').eq(i).children('a').text(),
                         url: $('.bd ul').eq(2).children('li').eq(i).children('a').attr('href')
                     })
                 }
                 for (let i = 0; i < $('.bd ul').eq(3).children('li').length; i++) {
                     this.mvDetailDataFour.push({
                         name: $('.bd ul').eq(3).children('li').eq(i).children('a').text(),
                         url: $('.bd ul').eq(3).children('li').eq(i).children('a').attr('href')
                     })
                 }
             }, false, '', (err) => {
                 console.log('加载失败，云函数的报错')
                 console.log(err)
             })

             if (wx.createInterstitialAd) {
                 this.interstitialAd = wx.createInterstitialAd({
                     adUnitId: 'adunit-e3da36f2854215d1'
                 })
                 this.interstitialAd.onLoad(() => {
                     console.log('插屏广告加载成功')
                 })
                 this.interstitialAd.onError((err) => {
                     console.log('插屏广告出错', err)
                 })
                 this.interstitialAd.onClose(() => {
                     console.log('插屏广告关闭')
                 })

                 this.rewardedVideoAd = wx.createRewardedVideoAd({
                     adUnitId: 'adunit-31de5fd8a39e8a37'
                 })
                 this.rewardedVideoAd.onLoad(() => {
                     console.log('激励视频 广告加载成功')
                 })
                 this.rewardedVideoAd.onError((err) => {
                     console.log('激励视频出错', err)
                     this.interstitialAd.show()
                 })
                 this.rewardedVideoAd.onClose((res) => {
                     // 用户点击了【关闭广告】按钮
                     if (res && res.isEnded) {
                         console.log('正常关闭')
                         // 正常播放结束，可以下发游戏奖励
                     } else {
                         this.interstitialAd.show()
                     }
                 })
             }
        },
        onUnload () {
            this.video = null
            this.videoSrc = null
        },
        onBackPress () {
            this.video = null
            this.videoSrc = null
        },
        onHide () {
            this.video = null
            this.videoSrc = null
        },
        methods: {
            videoError (err) {
                uni.hideLoading()
                this.ui.showToast(err)
            },
            play () {
                clearTimeout(this.timer)
                uni.hideLoading()
            },
            videoPlays: tu.debounce(function (url, id) {
                this.videoPlay(url, id)
            }, 1000),
            async videoPlay (url, id) {
                if (this.bgIndex !== id) {
                    this.bgIndex = id

                    this.incentiveVideo()
                    this.ui.showLoading('正在玩命的加载', false)
                    this.ui.yunFun('movieOne', {
                            url: 'https://www.pianku.tv/' + encodeURI(url)
                        }, (res) => {
                        console.log(res.result.body)
                        this.videoSrc = res.result.body.split('video: {')[1].split('type: ')[0].split('url: \'')[1].split('\',')[0]
                        console.log(this.videoSrc)
                        clearTimeout(this.timer)
                        this.videoId = id
                        console.log('当前点击的视频Id：', id)
                        const newVideo = uni.createVideoContext(id.toString())
                        this.video = newVideo
                        newVideo.play()
                    }, false, '', (err) => {
                        console.log('加载失败，云函数的报错')
                        console.log(err)
                    })
                }
            },
            playAd (e) {
                console.log('前贴视频报错')
                console.log(e)
                this.incentiveVideo()
            },
            incentiveVideo () {
                this.rewardedVideoAd.show().catch(() => {
                    this.rewardedVideoAd.load()
                        .then(() => this.rewardedVideoAd.show())
                        .catch(err => {
                            console.log(err, '激励视频 广告显示失败')
                        })
                })
            },
        },
        computed: {
            ...mapState(['ggkzs', 'masters']),
        },
    }
</script>
