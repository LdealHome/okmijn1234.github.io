import Vue from 'vue'
/**
 * 获取学习中心个人信息
 * @returns {AxiosPromise<any>}
 */
export function getPersonalInfo () {
  return Vue.axios.get('/api/user/info')
}

/**
 * 获取专栏课程列表
 * @param params {Object} 请求携带的参数 { page: 页码, limit: 每页请求条数 }
 * @returns {AxiosPromise<any>}
 */
export function getSpecialList (params) {
  return Vue.axios.get('/api/course/column/list', { params })
}

/**
 * 获取单课课程列表
 * @param params {Object} 请求携带的参数 { page: 页码, limit: 每页请求条数 }
 * @returns {AxiosPromise<any>}
 */
export function getSingleList (params) {
  return Vue.axios.get('/api/course/single/list', { params })
}

/**
 * 获取编辑资料页面信息
 * @returns {AxiosPromise<any>}
 */
export function getEditInfo () {
  return Vue.axios.get('/api/user/personal/info')
}

/**
 * 保存编辑资料页面信息
 * @param data {Object} 请求携带的参数{ head_img: 头像, mobile: 手机号, nick_name: 昵称, real_name: 真实姓名, code: 验证码 }
 * @returns {AxiosPromise<any>}
 */
export function postSaveEditInfo (data) {
  return Vue.axios.get('/api/user/personal/save', data)
}
