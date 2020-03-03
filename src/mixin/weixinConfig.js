import wx from 'weixin-js-sdk'
import { getWeixinConfig } from '../services/index'
import getDeviceSystem from '../utils/get-device-system'
let isIOS = getDeviceSystem() === 'ios'
window.wx = wx // 解决通过微信调用本地文件报wx undefined

export default {
  data () {
    return {
      shareConfig: {},
      wx: wx
    }
  },
  /**
   * 解决ios设备微信wx.config报invalid signature
   */
  beforeRouteEnter (to, from, next) {
    if (isIOS && to.path !== location.pathname) {
      location.assign(to.fullPath)
    } else {
      next()
    }
  },
  beforeRouteUpdate (to, form, next) {
    if (isIOS && to.path !== location.pathname) {
      location.assign(to.fullPath)
    } else {
      next()
    }
  },
  methods: {
    /**
     * 获取后台返回的微信配置信息
     * @param res {Object<desc,img,link,title>} 传递的参数
     * @return {AxiosPromise<any>}
     */
    getWeiXinConfig (res) {
      let { desc, img, link, title } = res
      link = link || location.href.split('#')[0]
      this.shareConfig = { desc, img, link, title }
      let list = sessionStorage.getItem('wxConfigList')
      if (isIOS && list && JSON.parse(list).includes(link)) {
        return Promise.reject(new Error('已经配置过信息'))
      } else {
        return getWeixinConfig(this.shareConfig)
      }
    },
    /**
     * 设置微信配置信息
     * @param config {Object}
     * @param callback {Function}
     */
    setWeiXinConfig (config, callback) {
      return new Promise((resolve, reject) => {
        wx.config(config.data.data)
        wx.ready(() => {
          // 配置成功记录当前配置页面，避免二次配置导致ios报错签名错误
          let list = sessionStorage.getItem('wxConfigList')
          let url = config.data.data.url
          list = list ? JSON.parse(list) : [url]
          list.includes(url) || list.push(url)
          sessionStorage.setItem('wxConfigList', JSON.stringify(list))
          
          let baseConfig = { ...this.shareConfig }
          baseConfig.imgUrl = baseConfig.img
          if (typeof callback === 'function') {
            baseConfig.success = res => {
              callback.call(this, res)
            }
            wx.onMenuShareTimeline(baseConfig)
            wx.onMenuShareAppMessage(baseConfig)
            wx.onMenuShareQQ(baseConfig)
            wx.onMenuShareQZone(baseConfig)
          } else {
            wx.checkJsApi({
              jsApiList: ['updateTimelineShareData'],
              success: res => {
                // 验证是否支持最新的分享接口，否则使用原来的分享接口
                if (res.checkResult.updateTimelineShareData) {
                  wx.updateAppMessageShareData(baseConfig)
                  wx.updateTimelineShareData(baseConfig)
                } else {
                  wx.onMenuShareTimeline(baseConfig)
                  wx.onMenuShareAppMessage(baseConfig)
                  wx.onMenuShareQQ(baseConfig)
                  wx.onMenuShareQZone(baseConfig)
                }
              }
            })
          }
          resolve()
        })
        wx.error(res => {
          // 过滤掉ios按返回键时报签名错误
          if (isIOS && res.errMsg.includes('signature')) {
            localStorage.setItem('configErrorList', JSON.stringify(config.data.data))
            console.error(res.errMsg)
          } else {
            $_.Toast(res.errMsg)
          }
          reject(res.errMsg)
        })
      })
    },
    /**
     * 强制将当前页重新配置
     */
    updateWXConfig () {
      let href = location.href.split('#')[0]
      let list = sessionStorage.getItem('wxConfigList')
      list = list ? JSON.parse(list) : []
      if (list.includes(href)) {
        let _list = list.filter(item => item !== href)
        sessionStorage.setItem('wxConfigList', JSON.stringify(_list))
      }
    }
  }
}
