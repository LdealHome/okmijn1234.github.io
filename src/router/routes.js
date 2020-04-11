/**
 * 可以分享的页面，meta中添加share字段值为true
 * 禁止游客访问的页面，meta中添加auth字段为true
 * from 分享人的uid
 * courseId 课程id
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
    path: '/reset',
    name: 'reset',
    component: () => import(/* webpackChunkName: "404" */ '../views/Reset.vue'),
    meta: {
      title: 'reset'
    }
  },
  {
    path: '/',
    name: 'main',
    redirect: {
      name: 'home'
    }
  },
  {
    path: '/home',
    name: 'home',
    component: () => import(/* webpackChunkName: "home" */ '../views/Home.vue'),
    meta: {
      title: '集福中心'
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
      title: '福报榜'
    }
  },
  {
    path: `/particulars/from/:from`,
    name: 'particulars',
    component: () => import(/* webpackChunkName: "particulars" */ '../views/community/Particulars.vue'),
    meta: {
      title: '社群详情',
      share: true
    }
  },
  {
    path: `/course/:courseId`,
    name: 'course',
    component: () => import(/* webpackChunkName: "course" */ '../views/community/CourseDetails.vue'),
    meta: {
      title: '润阳演说力'
    }
  },
  {
    path: `/column`,
    name: 'column-details',
    component: () => import(/* webpackChunkName: "column-details" */ '../views/community/ColumnDetails.vue'),
    meta: {
      title: '润阳365蜕变营'
    }
  },
  {
    path: `/end`,
    name: 'end',
    component: () => import(/* webpackChunkName: "default" */ '../views/community/CourseEnd.vue'),
    meta: {
      title: '课程已结束'
    }
  },
  {
    path: `/error`,
    name: 'error',
    component: () => import(/* webpackChunkName: "default" */ '../views/community/LoadError.vue'),
    meta: {
      title: '365课程'
    }
  }
]
