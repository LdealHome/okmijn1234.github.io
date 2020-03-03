import Vue from 'vue'
import Router from 'vue-router'
import routes from './routes'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  base: '/',
  routes: [...routes],
  scrollBehavior (to, from, savedPosition) {
    return { x: 0, y: 0 }
  }
})

router.beforeEach((to, from, next) => {
  // 除开404页面
  if (to.name !== '404') {
    // 全局通用的字段对照表
    if (!$_.store.state.typeTableLoaded) {
      // $_.store.dispatch('getTypeTable')
      // $_.store.dispatch('getSceneInfo')
    }
    // 全局通用的用户信息(不包含以访客身份访问)
    if (window.$_.memberToken && !$_.store.state.userInfoLoaded) {
      // $_.store.dispatch('getUserInfo')
    }

    // 上报精统计信息
    let statistics = localStorage.getItem('statistics')
    if (statistics) {
      // $_.store.dispatch('postStatistics', JSON.parse(statistics))
    }
    
    // 上传接口响应错误信息
    let errorInfo = localStorage.getItem('errorInfo')
    if (errorInfo) {
      // $_.store.dispatch('postErrorInfo', JSON.parse(errorInfo))
    }
  }
  next()
})

export default router
