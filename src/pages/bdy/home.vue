<template>
    <view style="height: 100%">
        <view style="height: 100%" v-if="masters">
            <mioSearch style="height: 100%" @parentFun="loadData" class="test">
                <template v-slot:content>
                    <!--<view class="cu-list grid" style="margin-top: 13%;-->
                    <!--border-bottom: 1px solid rgba(0, 0, 0, 0.1);" :class="['col-' + 2,true?'':'no-border']">-->
                    <!--<view class="cu-item item-add" style="padding: 5rpx 20rpx 5rpx 20rpx!important;-->
                    <!--border-top: 1px solid rgba(0, 0, 0, 0.1);" @tap="movieTap(item.id, index)"-->
                    <!--:class="[index === bgIndex ? 'bg-blue':'']"-->
                    <!--v-for="(item,index) in listData" :key="index" >-->
                    <!--<text :style="{color: index === bgIndex ? 'white':''}">{{item.name}}</text>-->
                    <!--</view>-->
                    <!--</view>-->
                    <view style="">
                        <ad v-if="ggkzs" unit-id="adunit-f199c3512f32503a" ad-type="video" ad-theme="black"></ad>
                        <ad v-if="ggkzs" unit-id="adunit-35711c1e83d8593c" ad-type="grid" grid-opacity="0.8" grid-count="5" ad-theme="white"></ad>
                    </view>
                    <view class="margin padding bg-white radius" v-html="bdyContent"></view>
                    <ad v-if="ggkzs" unit-id="adunit-25b59fd8185c8f72" ad-intervals="30"></ad>
                </template>
                <template v-slot:detail>

                    <scroll-view style="height: 100%" scroll-y="true" @scrolltolower="loadMoreFn">
                        <ad v-if="ggkzs" unit-id="adunit-f199c3512f32503a" ad-type="video" ad-theme="black"></ad>
                        <ad v-if="ggkzs" unit-id="adunit-35711c1e83d8593c" ad-type="grid" grid-opacity="0.8" grid-count="5" ad-theme="white"></ad>
                        <view class="cu-list menu" :class="[true?'sm-border':'', false?'card-menu margin-top':'']">
                            <view class="cu-item" v-for="(item, index) in bdyDatas" :key="index">
                                <view class="content padding-tb-sm">
                                    <view>
                                        <text class="fa fa-video-camera text-blue margin-right-sm"></text>
                                        <view v-html=item.title></view>
                                    </view>
                                    <view class="margin-left-xl">大小：{{item.size ==0 ? '未知' : conver(item.size)}}</view>
                                    <!--<view v-if="signalSource == 'one'" class="margin-left-xl">大小：{{item.size ==0 ? '未知' : conver(item.size)}}</view>-->
                                    <!--<view v-if="signalSource == 'two'" class="margin-left-xl">大小：{{item.size}}</view>-->
                                </view>

                                <view class="action">
                                    <button @tap="detail(item.id)" :class="['cu-btn', 'bg-blue', 'shadow']">
                                        获取
                                    </button>
                                </view>
                                <view v-show="true" class="fa fa-angle-right fa-2x margin-left"></view>
                            </view>
                        </view>
                        <ad v-if="ggkzs" unit-id="adunit-25b59fd8185c8f72" ad-intervals="30"></ad>
                        <loadMore :status="loadStatus"></loadMore>
                    </scroll-view>
                </template>
            </mioSearch>
        </view>
        <view v-else>
            测试模块
        </view>
        <modal :show="modalStatus" @cancel="hideModal" :custom="true">
            <view class="flex flex-direction text-center">
                <view>{{title}}</view>
                <view class="margin-top">链接：{{link.slice(0, 20) + '...'}}
                    <button @tap="copyText(link)" class="cu-btn bg-blue margin-left-lg" style="height: 0;padding: 20rpx 18rpx">复制</button>
                </view>

                <view class="margin-top">提取码：{{pwd == '' ? '无需提取码' : pwd}}
                    <button @tap="copyText(pwd)" class="cu-btn bg-blue margin-left-lg" style="height: 0;padding: 20rpx 18rpx">复制</button>
                </view>
            </view>
        </modal>
    </view>
</template>

<script>
    import {
        commonHttp,
        bdyData
    } from '@/api'
    import mioSearch from '@/components/common/module/mio-search'
    import loadMore from '@/components/common/load/loadMore'
    import modal from '@/components/common/modal/modal'
    import {tu} from '@/common/js/toolUtils'
    import {mapState} from 'vuex'
    // const cheerio = require('cheerio')

    export default {
        data () {
            return {
                listData: [
                    {name: '信号源1', id: 'one'},
                    {name: '信号源2', id: 'two'},
                ],
                signalSource: 'one',
                bgIndex: 0,
                modalStatus: false,
                loadStatus: 1,
                bdyDatas: [],
                pageIndex: 1,
                keyword: '',
                total: 0,
                title: '',
                link: '',
                pwd: '',
                interstitialAd: null,
                rewardedVideoAd: null,

                dataList: []
            }
        },
        async created () {
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
                // this.interstitialAd.onClose(() => {
                //     console.log('插屏广告关闭')
                // })

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
        components: {
            mioSearch,
            loadMore,
            modal
        },
        methods: {
            movieTap (id, index) {
                this.bgIndex = index
                this.signalSource = id
                this.bdyDatas = []
            },
            copyText (val) {
                this.rewardedVideoAd.show()
                this.rewardedVideoAd.onError((err) => {
                    console.log('激励视频出错', err)
                    this.interstitialAd.show()
                })
                tu.getClipboardData(val)
            },
            async detail (id) {
                this.rewardedVideoAd.show()
                this.rewardedVideoAd.onError((err) => {
                    console.log('激励视频出错', err)
                    this.interstitialAd.show()
                })
                console.log(id)
                const data = await commonHttp(`https://api.nidhsd.top/resource?id=${id}&invitecode=${this.$store.state.bdyCode}`)
                console.log(data)
                this.title = data.data.title
                this.link = data.data.link
                this.pwd = data.data.password
                this.modalStatus = true
            },
            hideModal () {
                this.modalStatus = false
            },
            async loadData (val) { // 搜索
                // this.interstitialAd.show()
                this.keyword = val
                this.pageIndex = 1
                this.bdyDatas = []

                // if (this.signalSource === 'one') {
                const data = await bdyData(val, this.pageIndex, this.$store.state.bdyCode)
                this.bdyDatas = data.data
                this.total = Math.ceil(data.total / 20)
                // }
                // if (this.signalSource === 'two') {
                //     const data = await commonHttp(`https://www.xiaobaipan.com/list-${val}-p1.html`)
                //     const $ = cheerio.load(data, { _useHtmlParser2: true })
                //     for (let i = 0; i < $('.item-list').length; i++) {
                //         this.bdyDatas.push({
                //             title: $('.item-list .job-title a').eq(i).text().trim(),
                //             id: $('.item-list .job-title a').eq(i).attr('href'),
                //             size: $('.item-list .info-row .salary').eq(i).text().replace('大小:', '').trim()
                //         })
                //     }
                // }
            },
            loadMoreFn: tu.throttle(function () {
                this.loadDataMore()
            }, 1000),
            async loadDataMore () {
                if (this.pageIndex < this.total) {
                    this.pageIndex = this.pageIndex + 1
                    const data = await bdyData(this.keyword, this.pageIndex, this.$store.state.bdyCode)
                    this.bdyDatas = this.bdyDatas.concat(data.data)
                } else {
                    this.loadStatus = 2
                }
            },
            conver (limit) {
                let size = ''
                if (limit < 0.1 * 1024) { // 如果小于0.1KB转化成B
                    size = limit.toFixed(2) + 'B'
                } else if (limit < 0.1 * 1024 * 1024) { // 如果小于0.1MB转化成KB
                    size = (limit / 1024).toFixed(2) + 'KB'
                } else if (limit < 0.1 * 1024 * 1024 * 1024) { // 如果小于0.1GB转化成MB
                    size = (limit / (1024 * 1024)).toFixed(2) + 'MB'
                } else { // 其他转化成GB
                    size = (limit / (1024 * 1024 * 1024)).toFixed(2) + 'GB'
                }

                var sizestr = size + ''
                var len = sizestr.indexOf('.')
                var dec = sizestr.substr(len + 1, 2)
                if (dec == '00') { // 当小数点后为00时 去掉小数部分
                    return sizestr.substring(0, len) + sizestr.substr(len + 3, 2)
                }
                return sizestr
            }
        },
        computed: {
            ...mapState(['ggkzs', 'bdyCode', 'bdyContent', 'masters']),
        },
    }
</script>

<style>
    .test>view>view>view{
        height: 93%;
    }
    .item-add:after{
        border-bottom: none!important;
    }
</style>
