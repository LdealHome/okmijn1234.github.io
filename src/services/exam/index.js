import Vue from 'vue'
/**
 * 考试首页
 * @returns {AxiosPromise<course_single_id>} 直播视频id
 */
export function getExam (params) {
  return Vue.axios.get('/course/examination/info', { params })
}

/**
 * 开始考试(试题列表)
 * @returns {AxiosPromise<course_single_id>} 课程id
 */
export function getStartExamList (params) {
  return Vue.axios.get('/course/question/list', { params })
}

/**
 * 提交考试
 * @param data {Object} 请求携带的参数{ list.option_id: 选项id, list.q_id: 题目id, s_id: 课程id }
 * @returns {AxiosPromise<any>>}
 */
export function postSubmitPapers (data) {
  return Vue.axios.post('/course/examination/save', data)
}

/**
 * 获取成绩
 * @returns {AxiosPromise<course_single_id>} 课程id
 */
export function getAchievement (params) {
  return Vue.axios.get('/course/report/card', { params })
}

/**
 * 试题解析
 * @returns {AxiosPromise<course_single_id>} 课程id
 */
export function getAnalysisList (params) {
  return Vue.axios.get('/course/answer/analysis', { params })
}
