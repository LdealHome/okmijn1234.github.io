/**
 * global getters
 */
export default {
  // 根据key获取对应的缓存数据
  getLocalCache (state) {
    return (key) => { // key 为业务页面实际存储的键名 通常为$route.fullPath或者$route.name
      // 将数据进行深拷贝，防止处理具体业务时意外修改store中的数据
      let value = state.localCache[key]
      if (typeof value === 'object') {
        return JSON.parse(JSON.stringify(state.localCache[key]))
      } else {
        return value
      }
    }
  }
}
