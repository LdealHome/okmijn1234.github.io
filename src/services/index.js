import Vue from 'vue'

/**
 * 获取七牛云token
 * @param scene {String} 获取token携带的场景值
 * @returns {AxiosPromise<any>}
 */
export function getQiniuToken (scene) {
  return Vue.axios.get('/pub/qiniu/ticket', { params: { scene } })
}

/**
 * 获取用户基础信息
 * @return {AxiosPromise<any>}
 */
export function getUserInfo () {
  return Vue.axios.get('/member/info')
}

/**
 * 获取全局通用的类型对照关系表
 * @return {AxiosPromise<any>}
 */
export function getTypeTable () {
  return Vue.axios.get('/pub/contrast')
}

/**
 * 获取公用场景值
 * @return {AxiosPromise<any>}
 */
export function getSceneInfo () {
  return Vue.axios.get('/pub/scene/contrast')
}

/**
 * 发送精准统计信息
 * @param data {Object<{input_openid,master_uid,source_id,time_length,type_id}>} 发送的信息
 * @return {AxiosPromise<any>}
 */
export function postStatistics (data) {
  return Vue.axios.post('/visit/record', data, { $_hideLoading: true, $_cancelNotice: true })
}

/**
 * 微信分享成功回调
 * @param data {Object<{cate,data}>}
 * @return {AxiosPromise<any>}
 */
export function postShareSuccess (data) {
  return Vue.axios.post('/visit/record/share', data, { $_hideLoading: true, $_cancelNotice: true })
}
/**
 * 获取微信授权信息
 * @param data {Object} 微信分享配置信息
 * @return {AxiosPromise<any>}
 */
export function getWeixinConfig (data) {
  return Vue.axios.get('/pub/wx/jssdk')
}

/**
 * 获取手机验证码
 * @param data {Object} 请求携带的参数 { telephone: 手机号码, sms_cate: 发送类型 }
 * @returns {AxiosPromise<any>}
 */
export function postVerifyCode (data) {
  return Vue.axios.post('/pub/send/sms', data)
}

/**
 * 发送接口响应错误信息
 * @param data {Object}
 * @return {AxiosPromise<any>}
 */
export function postErrorInfo (data) {
  return Vue.axios.post('/pub/api/error/record', data, { $_hideLoading: true, $_cancelNotice: true, $_errorFilter: true })
}
/**
 * 邀请注册专属推广海报
 * @returns {AxiosPromise<any>}
 */
export function getInviteRegisterPoster () {
  return Vue.axios.get('/radio/share/extension/poster')
}
/**
 * 邀请注册专属推广链接
 * @returns {AxiosPromise<any>}
 */
export function getInviteRegisterLink () {
  return Vue.axios.get('/radio/share/extension/link')
}

/**
 * 根据场景值获取教程
 * @param params {Object<scene>} 场景值
 * @return {AxiosPromise<any>}
 */
export function getVideoTutorial (params) {
  return Vue.axios.get('/pub/get/tutorials', { params })
}

/**
 * 获取关注二维码信息
 * @param params {Object<fuid>} 上级uid,对应from
 * @return {AxiosPromise<any>}
 */
export function getFollowInfo (params) {
  return Vue.axios.get('/pub/invite/qr_code', { params })
}
/**
 * 根据场景值获取banner图
 * @param params {Object} 请求携带的参数 { type: 场景值, uid: 来自谁的uid}
 * @return {AxiosPromise<any>}
 */
export function getBanner (params) {
  return Vue.axios.get('/ads/manage/list', { params })
}
/**
 * 根据场景值获取客服信息
 * @param params {Object<scene>} 场景值
 * @return {AxiosPromise<any>}
 */
export function getServiceInfo (params) {
  return Vue.axios.get('/pub/get/customer/service', { params })
}

/**
 * 获取消息中心未读消息条数
 * @returns {AxiosPromise<any>}
 */
export function getUnreadCount () {
  return Vue.axios.get('/radio/message/unread/count')
}

/**
 * 根据场景值获取协议内容
 * @param params {Object<scene>} 对应协议场景值
 * @return {AxiosPromise<any>}
 */
export function getAgreementContent (params) {
  return Vue.axios.get('/pub/agreement/get', { params })
}

/**
 * 获取首页数据
 * @return {AxiosPromise<any>}
 */
export function getHks () {
  return Vue.axios.get('/radio/info/index')
}

/**
 * 获取首页列表
 */
export function getHksList (params) {
  return Vue.axios.get('/radio/info/index/list', { params })
}

/**
 * 获取我的频道
 * @return {AxiosPromise<any>}
 */
export function getChannel () {
  return Vue.axios.get('/member/channel')
}

/**
 * 获取频道的推荐频道
 * @return {AxiosPromise<any>}
 */
export function getRecommend () {
  return Vue.axios.get('/member/surplus/channel')
}

/**
 * 用户选择频道
 * @param data {Array} 请求携带的参数 { channel_id: 我的频道的所有数据 }
 * @return {AxiosPromise<any>}
 */
export function postSelectChannel (data) {
  return Vue.axios.post('/member/bind/channel', data, { $_hideLoading: true })
}

/**
 * 用户选择频道
 * @return {AxiosPromise<any>}
 */
export function getDiscountInfo () {
  return Vue.axios.get('/pub/activity/info')
}
