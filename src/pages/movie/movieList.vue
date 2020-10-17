<!--suppress ALL -->
<template>
    <scroll-view class="container" scroll-y style="height: 100%" v-if="masters">

        <scroll-view scroll-y style="height: 100%">
            <ad v-if="ggkzs" unit-id="adunit-f199c3512f32503a" ad-type="video" ad-theme="black"></ad>
            <!--<view class="bg-white solid-bottom padding-xl padding-top-xxl">-->
                <!--<view class="tui-modal-custom-text">片名：{{dtTitle}}</view>-->
                <!--<br>-->
                <!--<view class="tui-modal-custom-text">{{dtType}}</view>-->
                <!--<br>-->
                <!--<view class="tui-modal-custom-text">{{dtActor}}</view>-->
                <!--<br>-->
                <!--<view class="tui-modal-custom-text">{{dtLang}}</view>-->
            <!--</view>-->

            <!--<image v-show="coverImg" :src="posterImg" mode="aspectFit"-->
                   <!--:class="[false?'cu-avatar':'', false?'round': '']"-->
                   <!--style="width: 100%;height: 300rpx;background: #000"></image>-->
            <!-- :show-center-play-btn="control" :show-play-btn="control" :controls="control"
                 -->
            <video v-show="!coverImg" custom-cache="false" :title="videoTitle" enable-play-gesture="true"
                   show-mute-btn="true" style="width: 100%;height: 300rpx;display: block" ad-unit-id="adunit-6d8d6c137d7b7841"
                   @aderror="playAd"
                   :id="videoId" @error="videoError" :src="videoSrc" :poster="posterImg" @play="play" autoplay="true">
            </video>

            <view class="cu-list grid" :class="['col-' + gridCol]">
                <view class="cu-item" @tap="videoPlay(item.url, index)" :class="[index === bgIndex ? 'bg-gray':'']"
                      v-for="(item,index) in mvDetailDataMU" :key="index">
                    <text>{{item.name}}</text>
                </view>
            </view>

            <view class="flex flex-direction padding-top padding-bottom" @tap="spareShow">
                <!--round 圆角 line-red镂空-->
                <text class="text-center">点击下方按钮使用备用地址,复制链接粘贴到任意浏览器播放</text>
                <button class="cu-btn bg-white sm round">用UC浏览器可下载视频</button>
            </view>

            <view v-if="spare" class="cu-list menu"
                  :class="[menuBorder?'sm-border':'', menuCard?'card-menu margin-top':'']">
                <view class="cu-item" v-for="(item, index) in mvDetailData" :key="index">
                    <view class="content padding-tb-sm">
                        <view>
                            <text style="transform:rotate(270deg);margin-top: -3px"
                                  class="fa fa-video-camera text-blue margin-right-sm"></text>
                            <rich-text style="display: inline-block">{{item.name}}</rich-text>
                        </view>
                        <view class="text-df" style="margin-top: 3px">
                            <rich-text style="display: inline-block">{{item.url.length>40?item.url.slice(0,40) +
                                '...':item.url}}
                            </rich-text>
                        </view>
                    </view>
                    <view class="action">
                        <button @tap="copyUrl(item.url)" class="cu-btn bg-blue shadow">
                            复制
                        </button>
                    </view>
                </view>
            </view>
            <ad unit-id="adunit-25b59fd8185c8f72" ad-intervals="30"></ad>
            <ad v-if="ggkzs" unit-id="adunit-35711c1e83d8593c" ad-type="grid" grid-opacity="0.8" grid-count="5" ad-theme="white"></ad>
        </scroll-view>



    </scroll-view>
</template>

<script>
    let cheerio = require('cheerio');
    import {mapState} from 'vuex'

    export default {
        onLoad(e) {
            this.mvUrl = JSON.parse(decodeURIComponent(e.movieUrl))
            this.initMv(JSON.parse(decodeURIComponent(e.movieUrl)))
            setTimeout( () => {
                this.$store.state.ts = false
            }, 10000)
            // 在页面onLoad回调事件中创建插屏广告实例
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
            wx.showShareMenu({
                withShareTicket: true
            })

        },
        data() {
            return {
                mvUrl: '',
                dtTitle: '',
                dtType: '',
                dtActor: '',
                dtLang: '',

                interstitialAd: null,
                rewardedVideoAd: null,
                jlNum: '',
                mvDetailDataMU: [],
                messShow: true,
                messTop: 0,
                animation: true,
                bgIndex: null,
                spare: false,
                active: false,
                coverImg: true,
                gridCol: 4, // 控制显示几列
                gridBorder: false, // 是否显示边框

                posterImg: '',
                videoTitle: '',
                video: null,
                videoSrc: null,
                videoId: '0',
                control: false,

                modalState: false,
                modalOpt: [],
                modalTitle: '',
                modalCon: '',
                closeShow: false,
                sxfkCon: '确认链接是否真的失效？',
                sxfkOpt: [{
                    text: "是", // 按钮文本
                    type: 'primary', // 按钮样式类型  (primary,danger,red,warning,green,white,gray)
                    plain: true // 是否空心
                }, {
                    text: "否", // 按钮文本
                    type: 'red', // 按钮样式类型  (primary,danger,red,warning,green,white,gray)
                    plain: true // 是否空心
                }],
                menuBorder: false, // 短边框
                menuCard: false, // 卡片
                movieData: [],
                mvDetailData: [],
                sxfkData: {
                    title: '',
                    subtitle: '',
                    url: '',
                },
                toastMes: '复制成功 ' +
                    '请到浏览器粘贴！',
                timer: null,
            }
        },
        onUnload() {
            clearTimeout(this.timer)
            this.video = null
            this.videoSrc = null
        },
        onBackPress() {
            clearTimeout(this.timer)
            this.video = null
            this.videoSrc = null
        },
        onHide() {
            clearTimeout(this.timer)
            this.video = null
            this.videoSrc = null
        },
        methods: {
            playAd (e) {
                console.log('前贴视频报错')
                console.log(e)
                this.incentiveVideo()
            },
            initMv (parma) {
                this.ui.yunFun('movieInfo', {
                    key: parma
                    // key: '/?m=vod-detail-id-1010.html'
                }, (res) => {
                    console.log('已成功获取电影数据')
                    const $ = cheerio.load(res.result.body, { _useHtmlParser2: true })
                    this.dtTitle = $('.vodh h2').text()
                    this.videoTitle = $('.vodh h2').text()
                    this.dtType = $('.vodinfobox ul li').eq(3).addBack('span').text()
                    this.dtActor = $('.vodinfobox ul li').eq(2).addBack('span').text()
                    this.dtLang = $('.vodinfobox ul li').eq(5).addBack('span').text()
                    this.posterImg = $('.lazy').attr('src')


                    for (let i = 0; i < $('#1 ul li').length; i++) {
                        if ($('#1 ul li').eq(i).text().indexOf('.m3u8') === -1) {
                            this.mvDetailData.push(
                                {
                                    name: $('#1 ul li').eq(i).text().split('$')[0],
                                    url: $('#1 ul li').eq(i).text().split('$')[1]
                                }
                            )
                        } else {
                            this.mvDetailDataMU.push(
                                {
                                    name: $('#1 ul li').eq(i).text().split('$')[0],
                                    url: $('#1 ul li').eq(i).text().split('$')[1]
                                }
                            )
                        }
                    }

                    for (let i = 0; i < $('#2 ul li').length; i++) {
                        if ($('#2 ul li').eq(i).text().indexOf('.m3u8') === -1) {
                            this.mvDetailData.push(
                                {
                                    name: $('#2 ul li').eq(i).text().split('$')[0],
                                    url: $('#2 ul li').eq(i).text().split('$')[1]
                                }
                            )
                        } else {
                            this.mvDetailDataMU.push(
                                {
                                    name: $('#2 ul li').eq(i).text().split('$')[0],
                                    url: $('#2 ul li').eq(i).text().split('$')[1]
                                }
                            )
                        }
                    }
                    console.log(this.mvDetailDataMU)

                    console.log(this.mvDetailDataMU.length)
                    console.log(this.mvDetailDataMU.length === 0)
                    if (this.mvDetailDataMU.length === 0) {
                        this.spare = true
                    }

                },true, '加载中', (err) => {
                    this.ui.showToast('网络不稳定，请求超时', 'none')
                    this.initMv(this.mvUrl)
                    console.log(err);

                })
            },
            incentiveVideo() {
                this.rewardedVideoAd.show().catch(() => {
                    this.rewardedVideoAd.load()
                        .then(() => this.rewardedVideoAd.show())
                        .catch(err => {
                            console.log('激励视频 广告显示失败')
                        })
                })
            },
            spareShow() {
                this.spare = !this.spare
            },
            videoError() {
                uni.hideLoading()
                this.ui.showToast('视频播放出错！请使用备用地址')
            },
            play() {
                clearTimeout(this.timer)
                uni.hideLoading()
            },
            videoPlay(src, id) {
                if (this.bgIndex !== id) {
                    // this.incentiveVideo()
                    this.ui.showLoading('加载中...')
                    this.bgIndex = id
                    this.active = true
                    clearTimeout(this.timer)
                    this.coverImg = false
                    this.videoSrc = src
                    this.videoId = id
                    console.log('当前点击的视频Id：', id)
                    let newVideo = uni.createVideoContext(id.toString())
                    this.video = newVideo
                    newVideo.play()
                    this.timer = setTimeout(() => {
                        uni.hideLoading()
                        this.video = null
                        this.videoSrc = null
                        this.ui.showToast('加载时间过长，请使用备用地址')
                    }, 16000)
                }
            },
            sxfk(index) { // 失效反馈
                this.closeShow = true
                this.modalTitle = ''
                this.modalCon = this.sxfkCon
                this.modalOpt = this.sxfkOpt
                this.modalState = true
            },
            handleClick(e) { // 按钮点击事件,根据e.index控制
                let index = e.index;
                if (e.index === 0) { // 确认失效
                    this.ui.showToast('反馈成功')
                    this.hideModal()

                } else {
                    this.hideModal()
                }
            },
            hideModal() { // 隐藏modal层
                this.modalState = false
            },
            copyUrl(index) {
                this.incentiveVideo()
                wx.setClipboardData({
                    data: index,
                    success: () => {
                        this.ui.showToast(this.toastMes)
                    }
                })
                wx.getClipboardData({
                    success: (res) => {
                        console.log('复制的内容', res.data)
                    }
                })
            },
        },
        components: {

        },
        computed: {
            ...mapState(['masters', 'ggkzs', 'avatar', 'videoTip', 'movieJf', 'integral', 'openId', 'hd', 'videoShow', 'ts']),
        },
    }
</script>

