<template>
    <view style="height: 100%" v-if="masters">
        <mioSearch style="height: 100%" @parentFun="searchFn" class="test">
            <template v-slot:content>
                <ad v-if="ggkzs" unit-id="adunit-f199c3512f32503a" ad-type="video" ad-theme="black"></ad>
                <ad v-if="ggkzs" unit-id="adunit-35711c1e83d8593c" ad-type="grid" grid-opacity="0.8" grid-count="5" ad-theme="white"></ad>
                <view class="bg-white padding margin">
                    新版本更新了多个视频源，视频观看卡顿，切换视频源就行了
                </view>
                <ad v-if="ggkzs" unit-id="adunit-25b59fd8185c8f72" ad-intervals="30"></ad>
            </template>
            <template v-slot:detail>
                <scroll-view style="height: 45%" class="padding radius" scroll-y="true" @scrolltolower="throttleOne">
                    <ad v-if="ggkzs" unit-id="adunit-25b59fd8185c8f72" ad-intervals="30"></ad>
                    <view class="cu-list menu" :class="[true?'sm-border':'', false?'card-menu margin-top':'']">
                        <view class="cu-item" v-for="(item, index) in pkTv" :key="index">
                            <view class="content padding-tb-sm">
                                <view>
                                    <text class="fa fa-video-camera text-blue margin-right-sm"></text>
                                    <text>{{item.name}}</text>
                                </view>
                            </view>

                            <view class="action">
                                <button @tap="detail(item.url, 'one')" :class="['cu-btn', 'bg-blue', 'shadow']">
                                    播放
                                </button>
                            </view>
                            <view v-show="true" class="fa fa-angle-right fa-2x margin-left"></view>
                        </view>
                        <loadMore :status="loadStatusOne"></loadMore>
                        <ad v-if="ggkzs" unit-id="adunit-35711c1e83d8593c" ad-type="grid" grid-opacity="0.8" grid-count="5" ad-theme="white"></ad>
                    </view>
                </scroll-view>
                <scroll-view style="height: 45%" class="padding radius" scroll-y="true" @scrolltolower="throttleTwo">
                    <ad v-if="ggkzs" unit-id="adunit-35711c1e83d8593c" ad-type="grid" grid-opacity="0.8" grid-count="5" ad-theme="white"></ad>
                    <view class="cu-list menu" :class="[true?'sm-border':'', false?'card-menu margin-top':'']">
                        <view class="cu-item" v-for="(item, index) in appyy" :key="index">
                            <view class="content padding-tb-sm">
                                <view>
                                    <text class="fa fa-video-camera text-blue margin-right-sm"></text>
                                    <text>{{item.name}}</text>
                                </view>
                            </view>

                            <view class="action">
                                <button @tap="detail(item.url, 'two')" :class="['cu-btn', 'bg-blue', 'shadow']">
                                    播放
                                </button>
                            </view>
                            <view v-show="true" class="fa fa-angle-right fa-2x margin-left"></view>
                        </view>
                        <loadMore :status="loadStatusTwo"></loadMore>
                    </view>
                    <ad v-if="ggkzs" unit-id="adunit-25b59fd8185c8f72" ad-intervals="30"></ad>
                </scroll-view>
                <ad v-if="ggkzs" unit-id="adunit-f199c3512f32503a" ad-type="video" ad-theme="black"></ad>
            </template>
        </mioSearch>
    </view>
</template>

<script>
    import {mapState} from 'vuex'
    import mioSearch from 'cn/module/mio-search'
    import loadMore from 'cn/load/loadMore'
    import {tu} from 'mioJs/toolUtils'
    import {
        commonHttp
    } from '@/api'
    const cheerio = require('cheerio')

    export default {
        async onLoad () {

        },
        data () {
            return {
                appyy: [],
                pkTv: [],
                bdTv: [],
                ppIndex: 2,
                appIndex: 1,
                bdIndex: 1,
                bgIndexTwo: 0,
                loadStatusOne: 1,
                loadStatusTwo: 1,
                keyword: '',
                total: 0,
                totalTwo: 1,
                totalThree: 1,
                ppUrl: '',

            }
        },
        methods: {
            searchFn (val) {
                this.loadStatusOne = 1
                this.loadStatusTwo = 1
                this.ppIndex = 2
                this.appIndex = 1
                this.appyy = []
                this.pkTv = []
                this.pkTvDatas(val)
                this.appyyDatas(val)
                this.keyword = val
            },
            throttleOne: tu.throttle(function () {
                this.loadOneMore()
            }, 1000),
            throttleTwo: tu.throttle(function () {
                this.loadTwoMore()
            }, 1000),
            async loadOneMore () {
                console.log(this.ppIndex)
                if (this.ppIndex <= this.total) {
                    this.ui.yunFun('movieOne', {
                            url: 'https://www.pianku.tv' + encodeURI(this.ppUrl) + '-' + this.ppIndex + '.html'
                        }, (res) => {
                        console.log(res.result.body)
                        const $ = cheerio.load(res.result.body, { _useHtmlParser2: true })
                        for (let i = 0; i < $('.sr_lists dl dd').length; i++) {

                            const name = $('.sr_lists dl dd').eq(i).children('p').children('strong').children('a').attr('href')
                            const name1 = name.split('/')[2].replace('.html', '')
                            const name2 = name.split('/')[1]
                            const newName = name1 + '_' + name2
                            this.pkTv.push({
                                name: $('.sr_lists dl dd').eq(i).children('p').children('strong').children('a').text(),
                                url: 'https://www.pianku.tv/ajax/downurl/' + newName + '/'
                            })
                        }
                        this.ppIndex = this.ppIndex + 1
                    }, false, '', (err) => {
                        console.log('加载失败，云函数的报错')
                        console.log(err)
                    })

                } else {
                    console.log('超出限制')
                    this.loadStatusOne = 2
                }
            },
            async loadTwoMore () {
                if (this.appIndex < this.totalTwo) {
                    this.appIndex = this.appIndex + 1
                    this.ui.yunFun('movieOne', {
                            url: `https://app.movie/index.php/vod/search/page/${this.appIndex}/wd/${encodeURI(this.keyword)}.html`
                        }, (res) => {
                        const $ = cheerio.load(res.result.body, { _useHtmlParser2: true })
                        for (var i = 0; i < $('.stui-vodlist li').length; i++) {
                            this.appyy.push({
                                name: $('.stui-vodlist li').eq(i).children('a').attr('title').trim() + $('.stui-vodlist li').eq(i).children().children('.pic-text').text().trim(),
                                url: 'https://app.movie/index.php/vod/play/id/' +
                                    $('.stui-vodlist li').eq(i).children('a').attr('href').split('detail/id/')[1].replace('html', '') +
                                    '/sid/1/nid/1.html'
                            })
                        }
                    }, false, '', (err) => {
                        console.log('加载失败，云函数的报错')
                        console.log(err)
                    })
                } else {
                    this.loadStatusTwo = 2
                    console.log('超出限制')
                }

            },
            async pkTvDatas (val) {

                this.ui.yunFun('movieOne', {
                    url: `https://www.pianku.tv/s/go.php?q=${encodeURI(val)}`
                }, (res) => {
                    console.log('已成功获取搜索数据')
                    console.log(res)
                    if (res.result != null) { // eslint-disable-line
                        const $ = cheerio.load(res.result.body, {_useHtmlParser2: true})
                        const number = $('.breadcrumbs').text().split('条')[0].replace('为您找到', '')
                        console.log(number)
                        if (number > 10) {
                            this.ppUrl = $('.pages .a1').attr('href').split('-')[0]
                        } else {
                            this.loadStatusOne = 2
                        }
                        this.total = Math.ceil(number / 10)

                        for (let i = 0; i < $('.sr_lists dl dd').length; i++) {

                            const name = $('.sr_lists dl dd').eq(i).children('p').children('strong').children('a').attr('href')
                            const name1 = name.split('/')[2].replace('.html', '')
                            const name2 = name.split('/')[1]
                            const newName = name1 + '_' + name2
                            this.pkTv.push({
                                name: $('.sr_lists dl dd').eq(i).children('p').children('strong').children('a').text(),
                                url: 'https://www.pianku.tv/ajax/downurl/' + newName + '/'
                            })
                        }

                    }
                }, false, '', (err) => {
                    console.log('加载失败，云函数的报错')
                    console.log(err)
                })
            },
            async appyyDatas (val) {
                this.ui.yunFun('movieOne', {
                        url: `https://app.movie/index.php/vod/search/page/${this.appIndex}/wd/${encodeURI(val)}.html`
                    }, (res) => {
                    const $ = cheerio.load(res.result.body, { _useHtmlParser2: true })
                    this.totalTwo = $('.num').text().split('/')[1]
                    console.log(this.totalTwo)
                    if (this.totalTwo == 1 || this.totalTwo == '') {
                        this.loadStatusTwo = 2
                    }
                    for (var i = 0; i < $('.stui-vodlist li').length; i++) {
                        this.appyy.push({
                            name: $('.stui-vodlist li').eq(i).children('a').attr('title').trim() + $('.stui-vodlist li').eq(i).children().children('.pic-text').text().trim(),
                            url: 'https://app.movie/index.php/vod/play/id/' +
                                $('.stui-vodlist li').eq(i).children('a').attr('href').split('detail/id/')[1].replace('html', '') +
                                '/sid/1/nid/1.html'
                        })
                    }
                    console.log(this.appyy)
                }, false, '', (err) => {
                    console.log('加载失败，云函数的报错')
                    console.log(err)
                })
            },
            detail (url, num) { // 查看电影详情
                if (num === 'one') {
                    console.log(url)
                    uni.navigateTo({
                        url: `/pages/movie/movieListOne?movieUrl=${encodeURIComponent(JSON.stringify(url))}`
                    })
                }
                if (num === 'two') {
                    console.log(url)
                    uni.navigateTo({
                        url: `/pages/movie/movieListTwo?movieUrl=${encodeURIComponent(JSON.stringify(url))}`
                    })
                }
            },
        },
        components: {
            mioSearch,
            loadMore
        },
        computed: {
            ...mapState(['ggkzs', 'masters']),
        },
    }
</script>

<style>
    page {
        height: 100%;
    }
    .test>view>view>view{
        height: 100%;
    }
</style>
