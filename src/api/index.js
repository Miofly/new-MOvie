import ajax from './ajax'

const navJsonData = () => ajax({url: 'static/mockJson/navJson.json'}) // 导航模块数据
const listJsonData = () => ajax({url: 'static/mockJson/listJson.json'}) // 导航模块数据
const dbJsonData = (type, index = 0, count = 3) => ajax({
    url: `https://movie.douban.com/j/search_subjects?type=movie&tag=${tag}&sort=time&page_limit=${count}&page_start=${index}`,
    // url: `https://douban.uieee.com/v2/movie/${type}?start=${index}&count=${count}`,
    // url: `/db/j/search_subjects?type=movie&tag=${tag}&sort=time&page_limit=${count}`,
    cancelBefore: false,
    getHeader: {
        'Content-Type': 'json',
    },
})
const movieDetail = (url) => ajax({
    url: url,
    getHeader: {'Content-Type': 'json'}
})
const commonHttp = (url, method = 'GET', data) => ajax({
    url: url,
    getHeader: {'Content-Type': 'json'},
    method: method,
    data: data
})
const bdyData = (keyword, pageIndex, code) => ajax({
    url: `https://api.nidhsd.top/search?keyword=${keyword}&page=${pageIndex}&invitecode=${code}`,
    getHeader: {'Content-Type': 'json'}
})
export {
    navJsonData,
    listJsonData,
    dbJsonData,
    movieDetail,
    commonHttp,
    bdyData
}
