import Vue from 'vue'
/**
 * 获取课程基础信息
 * @param params {Object<course_single_id>} 课程id
 * @returns {AxiosPromise<any>}
 */
export function getCourseInfo (params) {
  return Vue.axios.get('/course/live/room/info', { params })
}
