import Vue from 'vue'
import App from './App'

import movie from './pages/movie/home.vue'
import bdy from './pages/bdy/home.vue'
import module from './pages/module/home.vue'
import webview from './pages/webview/home.vue'
import share from './pages/share/home.vue'
import '@/common/css/module/font-awesome.css' // font-awesome图标
import store from './store' // 引入vuex
import router from './router' // eslint-disable-line
import {RouterMount} from 'uni-simple-router'
import routerLink from '../node_modules/uni-simple-router/component/router-link.vue'
import {ui} from '@/common/js/uniapp'
import {tu} from '@/common/js/toolUtils'

Vue.prototype.ui = ui
Vue.prototype.tu = tu
Vue.component('movie', movie)
Vue.component('bdy', bdy)
Vue.component('share', share)
Vue.component('module', module)
Vue.component('webview', webview)
Vue.component('router-link', routerLink)

Vue.config.productionTip = false
App.mpType = 'app'
const app = new Vue({
    ...App,
    store,
})

// v1.3.5起 H5端 你应该去除原有的app.$mount();使用路由自带的渲染方式
// #ifdef H5
RouterMount(app, '#app')
// #endif

// #ifndef H5
app.$mount() // 为了兼容小程序及app端必须这样写才有效果
// #endif
