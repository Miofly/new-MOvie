/*
ajax请求函数模块
返回值: promise对象(异步返回的数据是: response.data)
 */
import axios from '@/common/js/utils/uni-axios'
// import axios from 'axios'

// 默认配置
axios.defaults.baseURL = 'http://localhost:8080/h5' // 优先级比axios实例要低
axios.defaults.headers.post['Content-Type'] = 'application/json;charset=utf-8'

// 创建一个axios实例 ==> instanceOne
const instanceOne = axios.create()
instanceOne.defaults.baseURL = 'http://localhost:8080/h5' // 实例的baseurl

let cancel
function ajax ({
                   sourceAxios = axios, // 配置多源默认接口，可传axios的实例instanceOne，或者直接传axios
                   url,
                   params = {}, // Get请求传的参数
                   data = {}, // Post请求传的参数
                   method = 'GET',
                   cancelBefore = false, // 是否强制取消上一个没完成的请求
                   errHandle = false, // 单独提示错误信息设置，为true全局提示无效
                   contentType = 'application/json;charset=utf-8', // post请求默认请求头
                   getHeader, // get请求默认请求头
               }) {
    return new Promise((resolve, reject) => {

        // 处理method(转大写) 防止请求类型写成小写形式
        method = method.toUpperCase()

        // 请求拦截器1 设置loading效果与是否之前取消未完成的请求
        sourceAxios.interceptors.request.use(
            config => {
                if (cancelBefore) { // 在准备发请求前, 取消未完成的请求
                    if (typeof cancel === 'function') { // 当cancel是函数时表示上个请求未完成
                        cancel('取消上一个未完成的请求')
                    }
                    // 添加一个cancelToken的配置
                    config.cancelToken = new axios.CancelToken((c) => { // c是用于取消当前请求的函数
                        // 保存取消函数, 用于之后可能需要取消当前请求
                        cancel = c // 把函数c赋给cancel
                    })
                }
                return config
            }, error => {
                return Promise.reject(error)
            }
        )

        // 响应拦截器
        sourceAxios.interceptors.response.use(
            response => {
                cancel = null // 响应成功把cancel置为null
                return response
            }, (error) => {
                console.log('第一个响应拦截器执行fail')
                console.log(error)

                if (axios.isCancel(error)) { // 取消请求的错误
                    cancel = null
                    console.log('请求取消的错误', error.message) // 做相应处理
                    return new Promise(() => { // 中断promise链接
                    })
                } else { // 请求出错了
                    cancel = null
                    return Promise.reject(error) // 将错误向下传递 throw error
                }
            }
        )

        // 执行异步ajax请求
        let promise
        if (method === 'GET') {
            // 发送get请求
            promise = sourceAxios({url, params, headers: getHeader})
        } else {
            // 发送post请求
            promise = sourceAxios({
                method: 'POST',
                url,
                data,
                headers: {'Content-Type': contentType}
            })
        }

        promise.then(response => {
            const resMess = { // 封装返回成功的数据信息
                data: response.data,
                status: response.status,
                statusText: response.statusText
            }
            if (response.status === 200) {
                console.log('获取数据成功', resMess)
                resolve(response.data)
            } else {
                console.log('请求失败', resMess)
            }
        }).catch(err => { // 失败了调用reject()
            if (!errHandle) { // 全局错误的提示
                console.log('请求出错')
            }
            reject(err)
        })
    })
}

export default ajax
