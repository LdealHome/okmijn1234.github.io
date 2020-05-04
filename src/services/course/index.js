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

/**
 * 用户播放记录
 * @param data {Object} 请求携带的参数{ course_single_id: 课程id, play_length: 播放时长, play_over: 是否播放完成 1 是 2否 }
 * @returns {AxiosPromise<any>}
 */
export function postSubmitViewingRecords (data) {
  return Vue.axios.post('/course/play/record', data, { $_hideLoading: true, $_cancelNotice: true })
}

/**
 * 打赏课程
 * @param data {Object} 请求携带的参数{ amount: 金额, course_single_id: 直播课程id }
 * @returns {AxiosPromise<any>}
 */
export function postRewardCourse (data) {
  return Vue.axios.post('/course/live/reward/save', data)
}

/**
 * 获取评论列表
 * @param params {Object} 请求携带的参数{ first_id: 上一次分页请求的第一条数据id, key: 直播间对应Key, type: 1资料区域 2学习区域, limit, page }
 * @returns {AxiosPromise<any>}
 */
export function getCommentList (params) {
  return Vue.axios.get('/course/live/comments', { params })
}
