import ClipboardJS from 'mioJs/utils/clipboard.min.js'
import {ui} from 'mioJs/uniapp'

const tu = {
    debounce (fn, delay = 1000) { // 防抖 实时搜索
        // 记录上一次的延时器
        let timer = null
        return function () {
            const args = arguments
            const that = this
            // 清除上一次延时器
            clearTimeout(timer)
            timer = setTimeout(function () {
                fn.apply(that, args)
            }, delay)
        }
    },
    throttle (fn, wait = 1000) { // 节流 滚动条 点击搜索按钮
        let last
        let timer
        const interval = wait
        return function () {
            const th = this
            const args = arguments
            const now = +new Date()
            if (last && now - last < interval) {
                clearTimeout(timer)
                timer = setTimeout(function () {
                    last = now
                    fn.apply(th, args)
                }, interval)
            } else {
                last = now
                fn.apply(th, args)
            }
        }
    },
    arrDelDuplicate (arr) { // 数组去重
        return [...new Set(arr)]
    },
    arrCombineDelDuplicate () { // 数组合并去重
        const arr = [].concat.apply([], arguments) // 没有去重复的新数组
        return Array.from(new Set(arr))
    },
    getClipboardData (data, callback = (res) => {
        if (res) {
            ui.showToast('复制成功')
        } else {
            ui.showToast('复制失败')
        }
    }) {
        // #ifdef APP-PLUS || MP
        uni.setClipboardData({
            data: data,
            success (res) {
                uni.getClipboardData({
                    success (res) {
                        (typeof callback === 'function') && callback(true)
                    },
                    fail (res) {
                        (typeof callback === 'function') && callback(false)
                    }
                })
            },
            fail (res) {
                (typeof callback === 'function') && callback(false)
            }
        })
        // #endif

        // #ifdef H5
        const event = window.event || {}
        const clipboard = new ClipboardJS('', {
            text: () => data
        })
        clipboard.on('success', (e) => {
            (typeof callback === 'function') && callback(true)
            clipboard.off('success')
            clipboard.off('error')
            clipboard.destroy()
        })
        clipboard.on('error', (e) => {
            (typeof callback === 'function') && callback(false)
            clipboard.off('success')
            clipboard.off('error')
            clipboard.destroy()
        })
        clipboard.onClick(event)
        // #endif
    },
    isObj (obj) { // 判断是否是对象
        if (typeof obj !== 'object' && obj !== null) throw Error('传入的不是对象')
    },
    copyNew (constructorFn, ...args) { // 模拟实现new方法
        if (typeof constructorFn !== 'function') throw Error('传入的不是构造函数')
        const obj = Object.create(constructorFn.prototype) // 将obj的隐式原型指向构造函数的显式原型
        const res = constructorFn.apply(obj, args) // 将构造函数的this绑定到obj上
        const isObj = typeof res === 'object' && res !== 'null' // 构造函数可能返回一个对象
        const isFn = typeof res === 'function'
        return isObj || isFn ? res : obj
    },
    getNotEnumerable (obj) { // 获取一个对象自身的不可枚举属性数组
        const target = obj
        const enum_and_nonenum = Object.getOwnPropertyNames(target) // 获取一个对象的所有自身属性的属性名（包括不可枚举属性）的数组
        const enum_only = Object.keys(target) // 获取一个对象的所有自身可枚举属性的属性名的数组
        return enum_and_nonenum.filter((key) => {
            const indexInEnum = enum_only.indexOf(key)
            return indexInEnum === -1
        })
    },
    deepFreeze (obj) { // 深冻结对象
        // 取回定义在obj上的属性名
        const propNames = Object.getOwnPropertyNames(obj)

        for (const item of propNames) {
            const prop = obj[item]
            // 如果prop是个对象，冻结它
            if (typeof prop === 'object' && prop !== null) {
                this.deepFreeze(prop)
            }
        }
        // 冻结自身
        return Object.freeze(obj)
    },

}

export {
    tu
}
