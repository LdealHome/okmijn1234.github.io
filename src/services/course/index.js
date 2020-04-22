import Vue from 'vue'
/**
 * 获取课程基础信息
 * @param params {Object<course_single_id>} 课程id
 * @returns {AxiosPromise<any>}
 */
export function getCourseInfo (params) {
  return Vue.axios.get('/course/live/room/info', { params })
}

/**
 * 设置/取消开播提醒
 * @param data {Object<remind>} 修改类型 1设置提醒 2取消提醒
 * @returns {AxiosPromise<any>}
 */
export function postChangeRemindState (data) {
  return Vue.axios.post('/course/set/remind', data)
}

/**
 * 新增浏览量
 * @param data {Object<course_single_id>} 直播单课id
 * @returns {AxiosPromise<any>}
 */
export function postAddVisits (data) {
  return Vue.axios.post('/course/single/increment', data)
}
