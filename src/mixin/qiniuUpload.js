import * as qiniu from 'qiniu-js'
import { compress } from '../utils/image'

export default {
  methods: {
    /**
     * 上传到七牛云
     * @param blob {blob} 文件对象
     * @param scene {string} 文件对应的场景值
     * @return {Promise<any>}
     */
    qiniuUpload (blob, scene) {
      return new Promise(function (resolve, reject) {
        let { path, token } = $_.store.state.qiniuToken
        let key = path[scene] + String(Math.random()).slice(-9) + '.' + blob.type.split('/')[1] // 根据后台规矩拼接key值
        let observable = qiniu.upload(blob, key, token)
        let observer = {
          next (res) {
            $_.Indicator.open({
              text: `已上传${res.total.percent.toFixed(2)}%`,
              spinnerType: 'fading-circle'
            })
          },
          error (err) {
            $_.Indicator.close()
            $_.Toast('上传失败')
            reject(err)
          },
          complete (data) {
            $_.Indicator.close()
            resolve(data)
          }
        }
        observable.subscribe(observer)
      })
    },
    compressImage: compress,
    /**
     * 从系统中获取指定张数的图片数据
     * @param count {Number} 图片的张数
     * @return {Promise<any>}
     */
    getChooseImageData (count) {
      let ua = navigator.userAgent.toLowerCase()
      let isWeiXin = ua.match(/MicroMessenger/i)
      // 解决强制调用原生上传方式
      let usePrimitiveUploader = sessionStorage.getItem('usePrimitiveUploader')
      if (!usePrimitiveUploader && isWeiXin && window.wx) {
        return new Promise((resolve, reject) => {
          window.wx.chooseImage({
            count: count,
            sizeType: ['original', 'compressed'],
            sourceType: ['album', 'camera'],
            success: res => {
              let localIds = res.localIds // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
              let list = []
              localIds.forEach(localId => list.push(this.getImageData(localId)))
              Promise.all(list)
                .then(res => resolve(res))
                .catch(err => reject(err))
            },
            fail: err => reject(err)
          })
        })
      } else {
        return new Promise((resolve, reject) => {
          let input = document.getElementById('custom-uploader')
          if (input) {
            input.multiple = count > 1
            input.click()
          } else {
            input = document.createElement('input')
            input.id = 'custom-uploader'
            input.type = 'file'
            input.accept = 'image/*'
            input.multiple = count > 1
            input.hidden = true
            document.body.appendChild(input).click()
          }
          input.onchange = (e) => {
            let tasks = []
            Array.prototype.forEach.call(e.target.files, item => {
              tasks.push(this.compressImage(item))
            })
            Promise.all(tasks)
              .then(res => resolve(res))
              .catch(err => reject(err))
          }
        })
      }
    },
    /**
     * 根据微信的localId获取图片信息
     * @param localId {String} 微信本地图片id
     * @return {Promise<any>}
     */
    getImageData (localId) {
      return new Promise((resolve, reject) => {
        window.wx.getLocalImgData({
          localId, // 图片的localID
          success: res => {
            let localData = res.localData // localData是图片的base64数据，可以用img标签显示
            if (window.__wxjs_is_wkwebview) { // 如果是IOS，修正图片类型
              localData = localData.replace('jgp', 'jpeg')
            } else { // 如果是安卓添加图片类型
              localData = 'data:image/jpeg;base64,' + localData
            }
            this.compressImage(localData)
              .then(result => resolve(result))
              .catch(err => reject(err))
          },
          fail: res => reject(res)
        })
      })
    },
    /**
     * 同时上传多张图片，成功之后也会返回一个数组对应传入data的上传结果
     * @param data {Array<{blob,scene}>} 需要上传的数据
     * @return {Promise<any[]>}
     */
    uploadImages (data) {
      let tasks = data.map(item => this.qiniuUpload(item.blob, item.scene))
      return Promise.all(tasks)
    }
  }
}
