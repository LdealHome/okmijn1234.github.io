/**
 * 可以分享的页面，meta中添加share字段值为true
 * 禁止游客访问的页面，meta中添加auth字段为true
 */
export default [
  {
    path: '*',
    name: '404',
    component: () => import(/* webpackChunkName: "404" */ '../components/NotFound.vue'),
    meta: {
      title: '404'
    }
  },
  {
    path: '/',
    name: 'home',
    component: () => import(/* webpackChunkName: "home" */ '../views/Home.vue'),
    meta: {
      title: '社群中心'
    }
  },
  {
    path: '/notice',
    name: 'notice',
    component: () => import(/* webpackChunkName: "notice" */ '../views/Notice.vue'),
    meta: {
      title: '社群'
    }
  },
  {
    path: `/ranking`,
    name: 'community-ranking',
    component: () => import(/* webpackChunkName: "community-ranking" */ '../views/community/Ranking.vue'),
    meta: {
      title: '排行榜'
    }
  },
  {
    path: `/particulars/:courseId/from/:from`,
    name: 'particulars',
    component: () => import(/* webpackChunkName: "particulars" */ '../views/community/Particulars.vue'),
    meta: {
      title: '社群详情'
    }
  },
  {
    path: `/course/:courseId/from/:from`,
    name: 'course',
    component: () => import(/* webpackChunkName: "course" */ '../views/community/CourseDetails.vue'),
    meta: {
      title: '润阳演说力'
    }
  }
]
