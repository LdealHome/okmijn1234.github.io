const ROUTES_NAME = '/mine'
/**
 * 可以分享的页面，meta中添加share字段值为true
 * 禁止游客访问的页面，meta中添加auth字段为true
 */
export default [
  {
    path: `${ROUTES_NAME}/`,
    name: 'mine',
    component: () => import(/* webpackChunkName: "mine" */ '../../views/mine/Mine.vue'),
    meta: {
      title: '学习中心'
    }
  },
  {
    path: `${ROUTES_NAME}/edit-info`,
    name: 'edit-info',
    component: () => import(/* webpackChunkName: "mine-edit" */ '../../views/mine/EditInfo.vue'),
    meta: {
      title: '个人信息'
    }
  },
  {
    path: `${ROUTES_NAME}/account-growth`,
    name: 'account-growth',
    component: () => import(/* webpackChunkName: "mine-account-growth" */ '../../views/mine/AccountGrowth.vue'),
    meta: {
      title: '成长账户'
    }
  },
  {
    path: `${ROUTES_NAME}/account-blessing`,
    name: 'account-blessing',
    component: () => import(/* webpackChunkName: "mine-account-blessing" */ '../../views/mine/AccountBlessing.vue'),
    meta: {
      title: '福报账户'
    }
  },
  {
    path: `${ROUTES_NAME}/learning-report`,
    name: 'learning-report',
    component: () => import(/* webpackChunkName: "mine-learning-report" */ '../../views/mine/LearningReport.vue'),
    meta: {
      title: '学习报告'
    }
  }
]
