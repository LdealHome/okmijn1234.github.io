const ROUTES_NAME = '/exam'
export default [
  {
    path: `${ROUTES_NAME}/`,
    name: 'exam',
    component: () => import(/* webpackChunkName: "exam" */ '../../views/exam/Examination.vue'),
    meta: {
      title: '考试'
    }
  },
  {
    path: `${ROUTES_NAME}/start`,
    name: 'start-exam',
    component: () => import(/* webpackChunkName: "start-exam" */ '../../views/exam/StartExam.vue'),
    meta: {
      title: '第二课课后考试'
    }
  },
  {
    path: `${ROUTES_NAME}/accomplish`,
    name: 'accomplish-exam',
    component: () => import(/* webpackChunkName: "accomplish-exam" */ '../../views/exam/AccomplishExam.vue'),
    meta: {
      title: '第二课课后考试'
    }
  }
]
