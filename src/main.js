import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import axios from 'axios'
import VueAxios from 'vue-axios'
import VueWechatTitle from 'vue-wechat-title'
import VueLazyLoad from 'vue-lazyload'
import InfiniteLoading from 'vue-infinite-loading'

import {
  mapState,
  mapGetters,
  mapMutations,
  mapActions
} from 'vuex'
import {
  Toast,
  Indicator,
  Popup
} from 'mint-ui'

import '@reset/reset'
import './common/vip'

import {
  entryOtherPage,
  Loading,
  isLastPage,
  getCurrentRoute,
  getFromId,
  getLocalToken,
  setLocalToken,
  removeLocalToken
} from './utils'

import * as commits from './store/mutation-type'
import fixIosFocus from './directives/fixIosFocus'

Vue.config.productionTip = false
Vue.config.performance = process.env.NODE_ENV !== 'production'
Vue.config.errorHandler = (err, vm, info) => {
  console.error('you have a error')
  console.log('err', err)
  console.log('vm', vm)
  console.log('info', info)
}
Vue.config.warnHandler = (msg, vm, trace) => {
  console.warn('you have a warn')
  console.log('msg', msg)
  console.log('vm', vm)
  console.log('trace', trace)
}

Vue.component(Popup.name, Popup)
Vue.directive('ios-focus', fixIosFocus)

Vue.prototype.$_ = window.$_ = {
  store,
  mapState,
  mapGetters,
  mapMutations,
  mapActions,
  entryOtherPage,
  getCurrentRoute,
  getFromId,
  getLocalToken,
  setLocalToken,
  removeLocalToken,
  isLastPage,
  Toast,
  Indicator,
  Loading,
  commits
}

// 解决ios设备:active伪类无效
document.body.addEventListener('touchstart', function () {})
// 解决ios设备音频自动播放
document.addEventListener('WeixinJSBridgeReady', function () {
  let audio = window.__audio = new Audio()
  audio.play()
  let video = document.getElementById('player')
  video && video.play()
}, false)

// debugger 模式
if (process.env.VUE_APP_DEBUGGER === 'debugger') {
  setLocalToken(process.env.VUE_APP_MEMBER_TOKEN)
}

const CancelToken = axios.CancelToken
const currentRoute = getCurrentRoute(location.pathname, router.options.routes)
let getToken = process.env.VUE_APP_GET_TOKEN + encodeURIComponent(encodeURI(location.href))

// 判断是否已经授权
let isAuth = location.search.match(/token=([^&]+)/)
if (isAuth && isAuth[1]) {
  setLocalToken(isAuth[1])
  location.replace(location.pathname)
}

// 匹配到当前路由信息
if (currentRoute) {
  const memberToken = getLocalToken()
  let fromId = getFromId(location.pathname)
  
  // 有分享人的uid
  if (fromId) {
    // 将分享人的uid写入到授权地址的fuid中
    getToken = getToken.replace(/\d+\?/, function () {
      return `${fromId}?`
    })
  }
  
  // 有登录凭证
  if (memberToken) {
    window.$_.memberToken = memberToken
    axios.defaults.headers.common['member-auth'] = memberToken
    // from为默认值时将其赋值为登录用户的uid
    let uid = localStorage.getItem('USER_ID')
    if (fromId && fromId < 2 && uid && +uid !== +fromId) {
      let pathname = location.pathname.replace(/\/from\/\d+/, function () {
        return `/from/${uid}`
      })
      location.replace(location.origin + pathname)
    }
  // 没有读取到凭证
  } else {
    entryOtherPage(getToken)
  }
}

axios.defaults.baseURL = process.env.VUE_APP_BASE_URL
axios.defaults.timeout = process.env.VUE_APP_TIME_OUT
axios.interceptors.request.use(function (config) {
  config.$_requestTime = new Date().getTime()
  let authenticated = config.headers.common['member-auth']
  // Do something before request is sent
  if (!authenticated || $_.Loading.hasRequest(config.baseURL + config.url)) { // 没有权限或者队列里有相同的请求，就取消本次请求
    config.cancelToken = new CancelToken(function (cancel) {
      config.$_cancel = cancel
    })
    let cancelInfo = authenticated ? 'repeat request: ' : 'disabled: '
    config.$_cancel(cancelInfo + config.baseURL + config.url)
  } else { // 将请求加入队列
    $_.Loading.add(config.baseURL + config.url, config.$_hideLoading) // 请求成功之后config里的url是请求发送之前config里的baseURL+url
    if (!config.$_hideLoading) { // 没有设置取消加载提示框，就打开加载提示框
      $_.Indicator.open({
        text: '正在加载...',
        spinnerType: 'fading-circle'
      })
    }
  }
  return config
}, function (error) {
  // Do something with request error
  $_.Loading.clear()
  $_.Indicator.close()
  $_.Toast({
    message: '请求发送错误',
    duration: 2e3
  })
  return Promise.reject(error)
})
axios.interceptors.response.use(function (response) {
  // Do something with response data
  $_.Loading.remove(response.config.url) // 请求返回成功后更新请求队列
  let loadingList = $_.Loading.queue.filter(item => !item.$_hideLoading)
  if (!loadingList.length) { // 队列没有需要显示loading动画的数据时关闭提示
    $_.Indicator.close()
  }
  switch (response.data.code) {
    case 500: // token 无效
      entryOtherPage(getToken)
      break
    case 501: // 填写推荐码
      break
    case 502: // 进入到关注页面
      break
    case 503: // 账号被锁定
      store.dispatch('setAccessStatus', 'locked')
      break
    case 504: // 账号被删除
      store.dispatch('setAccessStatus', 'deleted')
      break
    case 599: // 关站维护
      sessionStorage.setItem('maintenance', JSON.stringify(response.data.data.content))
      router.replace({
        name: 'notice'
      })
      break
    default:
      break
  }
  // 如果明确指定取消错误提示，就不显示错误提示
  if (!response.config.$_cancelNotice && response.data.code === 0) {
    $_.Toast({
      message: response.data.msg,
      duration: 2e3
    })
  }
  return response
}, function (error) {
  // Do something with response error
  if (!axios.isCancel(error)) { // 不是取消的请求
    $_.Loading.clear()
    $_.Indicator.close()
    // 将错误信息上报到服务器
    let { url, method, headers, data, params } = error.config
    let result = {
      url,
      request_header: headers,
      request_body: method.toLowerCase() === 'get' ? (params || null) : (data ? JSON.parse(data) : null),
      request_time: error.config.$_requestTime,
      response_time: new Date().getTime(),
      http_status_code: error.response ? error.response.status : 500
    }
    // 过滤上报错误信息接口，避免request_body参数循环对象
    if (!error.config.$_errorFilter) {
      localStorage.setItem('errorInfo', JSON.stringify(result))
    }
    /**
     * router 里的代码要先于前面判断
     * 解决初次进入页面时全局用户信息报错的问题
     */
    if (headers['member-auth']) {
      // 如果请求还未完成就通过location.href 跳入到其他页面会提示Network Error
      if (error.message !== 'Network Error') {
        $_.Toast({
          message: `网络错误(${error.message})`,
          duration: 2e3
        })
      }
    }
  }
  return Promise.reject(error)
})

Vue.use(VueWechatTitle)
Vue.use(VueAxios, axios)
Vue.use(VueLazyLoad, {
  preLoad: 1.3,
  error: require('@assets/default.jpg'),
  loading: require('@assets/default.jpg'),
  attempt: 1
})
Vue.use(InfiniteLoading)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
