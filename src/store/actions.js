/**
 * global actions
 */
import {
  getQiniuToken,
  getUserInfo,
  getTypeTable,
  getSceneInfo,
  postShareSuccess,
  postErrorInfo,
  getServiceInfo,
  getPayCommunity
} from '../services'
import {
  SET_USER_INFO,
  SET_QINIU_TOKEN,
  SET_TABLE_INFO,
  SET_SCENE_INFO,
  SET_ACCESS_STATUS,
  SET_GUEST_INFO
} from './mutation-type'

export default {
  // 获取七牛云上传token
  getQiniuToken ({ commit }, payload) {
    return getQiniuToken(payload).then(res => {
      if (res.data.code === 1) {
        commit(SET_QINIU_TOKEN, res.data.data)
      }
    })
  },
  // 获取用户信息
  getUserInfo ({ commit }) {
    return getUserInfo().then(res => {
      if (res.data.code === 1) {
        let data = res.data.data
        commit(SET_USER_INFO, data)
        // 将用户信息存储到本地，解决某些页面需要异步获取信息
        // todo
        localStorage.setItem('USER_ID', data.member_info.uid)
      }
    })
  },
  // 获取类型字段对照表
  getTypeTable ({ commit }) {
    let tableInfo = sessionStorage.getItem('tableInfo')
    if (tableInfo) {
      commit(SET_TABLE_INFO, JSON.parse(tableInfo))
      return Promise.resolve()
    } else {
      return getTypeTable().then(res => {
        if (res.data.code === 1) {
          sessionStorage.setItem('tableInfo', JSON.stringify(res.data.data.contrast))
          commit(SET_TABLE_INFO, res.data.data.contrast)
        }
      })
    }
  },
  /**
   * 获取场景值信息
   */
  getSceneInfo ({ commit }) {
    let sceneInfo = sessionStorage.getItem('sceneInfo')
    if (sceneInfo) {
      commit(SET_SCENE_INFO, JSON.parse(sceneInfo))
      return Promise.resolve()
    } else {
      return getSceneInfo().then(res => {
        sessionStorage.setItem('sceneInfo', JSON.stringify(res.data.data))
        commit(SET_SCENE_INFO, res.data.data)
      })
    }
  },
  /**
   * 判断token是否购买社群
   */
  getPayCommunityState ({ dispatch, commit }) {
    return getPayCommunity().then(res => {
      if (res.data.code === 1) {
        commit(SET_GUEST_INFO, !res.data.data.is_register)
        if (res.data.data.is_register) {
          dispatch('getUserInfo')
        }
      }
    })
  },
  // 分享成功上报
  postShareSuccess ({ commit }, payload) {
    return postShareSuccess(payload)
  },
  // 上报接口响应错误信息
  postErrorInfo ({ commit }, payload) {
    return postErrorInfo(payload).then(res => {
      if (res.data.code === 1) {
        localStorage.removeItem('errorInfo')
      }
    })
  },
  // 设置登录限制
  setAccessStatus ({ state, commit }, payload) {
    let info = {
      restrict: true,
      desc: ''
    }
    commit(SET_ACCESS_STATUS, info)
    let scene = state.sceneInfo.customer[payload === 'locked' ? 'is_lock' : 'is_del']
    if (!scene) {
      return Promise.resolve()
    }
    return getServiceInfo({ scene }).then(res => {
      if (res.data.code === 1) {
        let phone = res.data.data ? res.data.data.telephone : ''
        let desc = ''
        if (payload === 'locked') {
          desc = `<div>您的账号已被冻结，暂时无法登录，</br>如有疑问请联系<a href="tel:${phone}">${phone}</a></div>`
        } else {
          desc = `<div>您的账号已被删除，如有疑问请联系<a href="tel:${phone}">${phone}</a></div>`
        }
        info.desc = desc
        commit(SET_ACCESS_STATUS, info)
      }
    })
  }
}
