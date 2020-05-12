import Vue from 'vue'
/**
 * 获取社群首页信息
 * @returns {AxiosPromise<any>}
 */
export function getCommunityInfo () {
  return Vue.axios.get('/community/course/home')
}

/**
 * 获取推广指南列表
 * @param params {Object} 请求携带的参数 { page: 页码, limit: 每页请求条数 }
 */
export function getExtensionList (params) {
  return Vue.axios.get('/community/promotion/guide', { params })
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
 * @param data {Object} from_uid 分享人uid
 * @returns {AxiosPromise<id>}
 */
export function postBuyNow (data) {
  return Vue.axios.post('/community/course/buy', data)
}

/**
 * 卡密支付
 * @param data {Object} 请求携带的参数{ from_uid: 分享人uid, code: 卡密 }
 * @returns {AxiosPromise<id>}
 */
export function postKalmanPay (data) {
  return Vue.axios.post('/community/course/kalman/buy', data)
}

/**
 * 获取分享朋友圈
 * @returns {AxiosPromise<id, uid>>}
 */
export function getShareCircleFriends (params) {
  return Vue.axios.get('/community/share/friend', { params })
}

/**
 * 获取分享链接
 * @returns {AxiosPromise<uid>>} 分享人的uid
 */
export function getShareLink (params) {
  return Vue.axios.get('/community/share/link', { params })
}

/**
 * 获取海报分享
 * @returns {AxiosPromise<uid>>} 分享人的uid
 */
export function getSharePoster (params) {
  return Vue.axios.get('/community/share/poster', { params })
}

/**
 * 获取365课程详情
 * @returns {AxiosPromise<any>>}
 */
export function getColumnDetails () {
  return Vue.axios.get('/course/expect/info')
}

/**
 * 获取365课程详情直播列表更多
 * @returns {AxiosPromise<any>>}
 */
export function getLiveListMore () {
  return Vue.axios.get('/course/catalogue/list')
}

/**
 * 获取365课程详情直播列表
 * @param params {Object} 请求携带的参数{ limit: 每页显示条数, page: 页码, scope: 范围场景值 }
 * @returns {AxiosPromise<any>>}
 */
export function getLiveBroadcastList (params) {
  return Vue.axios.get('/course/single/live/list', { params })
}

/**
 * 获取毕业证书
 * @return {AxiosPromise<any>>}
 */
export function getGraduationCertificate () {
  return Vue.axios.get('/course/graduate/info')
}

/**
 * 获取所有期数列表
 * @return {AxiosPromise<any>>}
 */
export function getPeriodsList () {
  return Vue.axios.get('/stage/list')
}

/**
 * 设置临时期数
 * @return {AxiosPromise<id>>} 所选期数id
 */
export function postSetPeriods (data) {
  return Vue.axios.post('/stage/setting', data)
}
