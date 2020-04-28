const ROUTES_NAME = '/curriculum'
/**
 * 可以分享的页面，meta中添加share字段值为true
 * 禁止游客访问的页面，meta中添加auth字段为true
 * id 直播课程id
 */
export default [
  {
    path: `${ROUTES_NAME}/:id/from/:from`,
    name: 'curriculum',
    component: () => import(/* webpackChunkName: "curriculum" */ '../../views/course/Course.vue'),
    meta: {
      title: '课程',
      share: true
    }
  }
]
