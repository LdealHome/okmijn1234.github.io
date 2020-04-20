import Vue from 'vue'
/**
 * 获取所有类型消息信息
 * @returns {AxiosPromise<any>}
 */
export function getNewsType () {
  return Vue.axios.get('/user/message/type/list')
}

/**
 * 获取消息列表
 * @param params {Object} 请求携带的参数 { type: 类型, page: 页码, limit: 每页请求条数 }
 * @returns {AxiosPromise<any>}
 */
export function getNewsList (params) {
  return Vue.axios.get('/user/message/list', { params })
}
