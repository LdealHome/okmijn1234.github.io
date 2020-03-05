import Vue from 'vue'
/**
 * 获取社群首页信息
 * @returns {AxiosPromise<any>}
 */
export function getCommunityInfo () {
  return Vue.axios.get('/community/course/home')
}

/**
 * 获取邀请列表
 * @param params {Object} 请求携带的参数{ limit: 每页显示条数, page: 页码 }
 * @returns {AxiosPromise<any>}
 */
export function getInviteList (params) {
  return Vue.axios.get('/community/invite/list', { params })
}

/**
 * 获取排行榜列表
 * @param params {Object} 请求携带的参数{ limit: 每页显示条数, page: 页码 }
 * @returns {AxiosPromise<any>}
 */
export function getRankingList (params) {
  return Vue.axios.get('/community/course/rank', { params })
}

/**
 * 获取社群详情
 */
export function getParticularsDetail () {
  return Vue.axios.get('/community/course/detail')
}

/**
 * 确认查看免费获得课程提示
 */
export function postReadTips (data) {
  return Vue.axios.post('/community/active/notice', data, { $_hideLoading: true })
}

/**
 * 获取活动课程详情
 * @returns {AxiosPromise<id>} 活动课程id
 */
export function getCourseDetail (params) {
  return Vue.axios.get('/community/active/detail', { params })
}

/**
 * 立即购买
 * @returns {AxiosPromise<id>} 课程id
 */
export function postBuyNow (data) {
  return Vue.axios.post('/community/course/buy', data)
}

/**
 * 支付成功信息填写
 * @param data {Object} 请求携带的参数{ mobile: 手机号, name: 昵称, position: 职位, type: 职位类别 }
 * @returns {AxiosPromise<any>>}
 */
export function postInformation (data) {
  return Vue.axios.post('/community/course/save/data', data)
}

/**
 * 获取分享朋友圈
 * @returns {AxiosPromise<id>>}
 */
export function getShareCircleFriends (params) {
  return Vue.axios.get('/community/share/firend', { params })
}

/**
 * 获取分享链接
 * @returns {AxiosPromise<any>>}
 */
export function getShareLink () {
  return Vue.axios.get('/community/course/share/link')
}

/**
 * 获取海报分享
 * @returns {AxiosPromise<id>>}
 */
export function getSharePoster () {
  return Vue.axios.get('/community/share/poster')
}
