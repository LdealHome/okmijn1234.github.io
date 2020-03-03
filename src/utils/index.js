/**
 * 跳入其他页面（非app子路由）
 * @param href {String} 要跳转的路径
 */
export function entryOtherPage (href) {
  location.href = href
}

/**
 * 获取本地token
 * @return {String}
 */
export function getLocalToken () {
  let data = JSON.parse(localStorage.getItem('sq_auth') || '{}')
  let timestamp = Date.now()
  if (data.token && timestamp <= data.expires) {
    return data.token
  } else {
    return null
  }
}

/**
 * 设置本地token
 * @param token {String} 存储在本地的token值
 * @param expires {Number} token的过期时间（小时数，默认为8小时）
 */
export function setLocalToken (token, expires = 8) {
  let exp = new Date()
  exp.setTime(exp.getTime() + expires * 60 * 60 * 1000)
  localStorage.setItem('sq_auth', JSON.stringify({
    token,
    expires: exp.getTime()
  }))
}

/**
 * 删除本地token信息
 */
export function removeLocalToken () {
  localStorage.removeItem('sq_auth')
}

/**
 * 检查是否为最后一页
 * @param limit {Number} 每页显示的条数
 * @param list {Array} 本次请求返回的列表数据
 * @return {boolean}
 */
export function isLastPage (limit, list) {
  return (list.length >= 0 && list.length < limit)
}

/**
 * 通过pathname获取当前页面的路由信息
 * @param pathname {String} 当前页面的pathname
 * @param routes {Array} Vue初始化时的router信息
 * @return {*} 如果有匹配到路由就返回该路由，未匹配到就返回undefined
 */
export function getCurrentRoute (pathname, routes) {
  // 处理根路由
  if (pathname === '/') {
    return routes.find(route => route.path === pathname)
  }

  let pathnameArray = pathname.split('/').filter((item) => item)
  let length = pathnameArray.length

  return routes.find(function (route) {
    let pathArray = route.path.split('/').filter((item) => item)

    for (let i = 0; i < length; i++) {
      // 过滤掉路由中的参数，逐级匹配每级路径是否相等
      if (!/^:/.test(pathArray[i]) && (pathArray[i] !== pathnameArray[i])) {
        return false
      }
    }
    return true
  })
}

/**
 * 获取fuid信息
 * @param pathname {String} 当前页面的pathname
 * @return {null|string}
 */
export function getFromId (pathname) {
  let result = pathname.match(/\/from\/([^/]+)/)
  return result ? result[1] : null
}

/**
 * 异步loading队列
 */
export const Loading = {
  queue: [],
  clear () {
    this.queue = []
  },
  hasRequest (url) {
    return this.queue.filter(item => item.url === url).length
  },
  add (url, hideLoading = false) {
    this.queue.push({
      timestamp: +new Date(),
      url: url,
      $_hideLoading: hideLoading
    })
  },
  remove (url) {
    this.queue = this.queue.filter(item => item.url !== url)
  }
}
