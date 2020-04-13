const ROUTES_NAME = '/course'
/**
 * 可以分享的页面，meta中添加share字段值为true
 * 禁止游客访问的页面，meta中添加auth字段为true
 */
export default [
  {
    path: `${ROUTES_NAME}/`,
    name: 'course',
    component: () => import(/* webpackChunkName: "course" */ '../../views/course/Course.vue'),
    meta: {
      title: '课程'
    }
  }
]
