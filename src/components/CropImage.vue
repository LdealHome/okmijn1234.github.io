<template lang="pug">
  div#modal-crop
    div.img-wrap
      img#img-crop(
        crossorigin="anonymous"
        ref="cropper"
        :src="config.src"
      )
    div.operations
      button.btn.cancel(@click="cropCancel") 取消
      button.btn.reset(@click="cropReset") 还原
      button.btn.confirm(@click="cropConfirm") 确定
    button.btn.rotate(@click="cropRotate" ref="rotate")
</template>

<script>
  import 'cropperjs/dist/cropper.css'
  import Cropper from 'cropperjs/dist/cropper'
  import { canvasToBlob } from '../utils/canvas-polyfill'
  import base64ToBlob from '../utils/base64-to-blob'
  import getDeviceSystem from '../utils/get-device-system'
  canvasToBlob()

  export default {
    name: 'CropImage',
    props: {
      config: {
        type: Object,
        required: false,
        default () {
          return {
            src: '' // 裁剪图片地址
          }
        }
      }
    },
    data () {
      return {
        data: {
          timer: null // 裁剪图片时调用原图的加载超时定时器
        },
        defaultConfig: {
          autoCropArea: 0.8, // 默认裁剪区域比例
          timeout: 20000, // 默认生成图片的超时事件
          width: 375, // 默认生成图片的宽度
          aspectRatio: 1, // 默认裁剪图片的横纵比
          quality: 0.96 // 默认裁剪图片的质量
        }
      }
    },
    created () {
      $_.Indicator.open({
        text: '正在加载...',
        spinnerType: 'fading-circle'
      })
    },
    mounted () {
      let crop = this
      let aspectRatio = this.config.aspectRatio || this.defaultConfig.aspectRatio
      let autoCropArea = this.config.autoCropArea || this.defaultConfig.autoCropArea
      let timeout = this.config.timeout || this.defaultConfig.timeout

      this.data.timer = setTimeout(function () {
        $_.Indicator.close()
        crop.destroyCrop()
        $_.Toast('加载图片失败,请重试！')
      }, timeout)

      this.$root.$emit('toggleModal', true)

      this.data.cropper = new Cropper(this.$refs.cropper, {
        aspectRatio,
        viewMode: 1,
        dragMode: 'move',
        modal: true,
        guides: true,
        center: false,
        highlight: false,
        background: false,
        autoCropArea,
        minCropBoxWidth: 50,
        cropBoxMovable: false,
        cropBoxResizable: true,
        toggleDragModeOnDblclick: false,
        ready () {
          crop.data.mask = document.querySelector('#modal-crop .cropper-modal')
          crop.data.cropBox = document.querySelector('#modal-crop .cropper-crop-box')
          crop.data.rotate = crop.$refs.rotate
          crop.data.maskTimer = null
          $_.Indicator.close()
          clearTimeout(crop.data.timer)
          crop.data.initCropBoxData = this.cropper.getCropBoxData()
          crop.data.originsTable = {
            nw: 'se',
            n: 's',
            ne: 'sw',
            e: 'w',
            se: 'nw',
            s: 'n',
            sw: 'ne',
            w: 'e'
          }
        },
        cropstart () {
          clearTimeout(crop.data.maskTimer)
          crop.data.mask.style.opacity = 0.1
          crop.data.cropBox.style.transition = 'unset'
          crop.data.rotate.style.opacity = 0
        },
        cropend (e) {
          let { action } = e.detail
          if (action.length < 3) { // 移动裁剪框,action类型https://github.com/liubolp/cropperjs
            let scaleRatio = crop.getScaleRatio(this)
            let { naturalWidth, width: canvasWidth } = this.cropper.canvasData
            // canvas比例
            let ratio = canvasWidth / naturalWidth
            let origin = crop.getScaleOrigin(action, this)
            this.cropper.setCropBoxData(crop.data.initCropBoxData)
            this.cropper.zoomTo(ratio * scaleRatio, {
              x: origin[0],
              y: origin[1]
            })
          }
          crop.data.cropBox.style.transition = 'all 200ms'
          crop.data.maskTimer = setTimeout(function () {
            crop.data.mask.style.opacity = 0.8
            crop.data.rotate.style.opacity = 1
          }, 1000)
        }
      })
    },
    methods: {
      getCroppedImage () {
        let crop = this
        let width = this.config.width || this.defaultConfig.width
        let quality = this.config.quality || this.defaultConfig.quality
        let canvas = this.data.cropper.getCroppedCanvas({
          width,
          minWidth: 50,
          minHeight: 50,
          maxWidth: 4096,
          maxHeight: 4096,
          fillColor: '#fff',
          checkCrossOrigin: false,
          imageSmoothingEnabled: false,
          imageSmoothingQuality: 'high'
        })
        let isAndroid = getDeviceSystem() === 'android'
        $_.Indicator.open({
          text: '处理中...',
          spinnerType: 'fading-circle'
        })

        if (isAndroid) { // 解决安卓设备多次调用canvasToBlob性能低下
          let dataURL = canvas.toDataURL('image/jpeg', quality)
          let blob = base64ToBlob(dataURL)
          setTimeout(function () {
            $_.Indicator.close()
          }, 200)
          crop.destroyCrop('success', blob, URL.createObjectURL(blob))
        } else {
          canvas.toBlob(function (blob) {
            setTimeout(function () {
              $_.Indicator.close()
            }, 200)
            crop.destroyCrop('success', blob, URL.createObjectURL(blob))
          }, 'image/jpeg', quality)
        }
      },
      getScaleOrigin (action, _this) {
        let { left: x, top: y, width, height } = _this.cropper.getCropBoxData()
        let origins = {
          nw: [x, y],
          n: [x + width / 2, y],
          ne: [x + width, y],
          e: [x + width, y + height / 2],
          se: [x + width, y + height],
          s: [x + width / 2, y + height],
          sw: [x, y + height],
          w: [x, y + height / 2]
        }
        return origins[this.data.originsTable[action]]
      },
      getScaleRatio (_this) {
        return this.data.initCropBoxData.width / _this.cropper.getCropBoxData().width
      },
      /**
       * 销毁裁剪组件实例
       * @param type {String} 裁剪结果（success|cancel）
       * @param blob {Blob} 裁剪后的二进制对象文件
       * @param url {String} 本地预览的地址
       */
      destroyCrop (type, blob, url) {
        this.$root.$emit('toggleModal', false)
        this.data.cropper.destroy()
        if (type === 'success') {
          this.$emit('success', { blob, url })
        } else {
          this.$emit('cancel', { blob, url })
        }
      },
      cropReset () {
        this.data.cropper.reset()
      },
      cropCancel () {
        this.destroyCrop('cancel', null, this.config.src)
      },
      cropRotate () {
        this.data.cropper.rotate(-90)
      },
      cropConfirm () {
        this.getCroppedImage()
      }
    }
  }
</script>

<style scoped lang="less">
  // 图片裁剪
  #modal-crop {
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    z-index: 20;

    .img-wrap {
      width: 100%;
      height: 100%;
      background: #000;
    }

    .operations {
      position: absolute;
      left: 0;
      bottom: 0;
      width: 100%;
      height: 1rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-top: 1px solid rgba(255, 255, 255, .2);
      padding: 0 .4rem;
      box-sizing: border-box;
    }

    .btn {
      font-size: .3rem;
      color: #fff;
      background: none;
      border: 0;
      outline: 0;

      &:active {
        color: #007aff;
      }
    }

    .rotate {
      position: absolute;
      left: .5rem;
      bottom: 1.4rem;
      width: .4rem;
      height: .4rem;
      background: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAACB0lEQVRYR+2WTahNURTHf/98TE1IPaIQI2JGSRTRK8lEPkcMDBigfIyYYMRAr0yMfJYMJPIx8QYPJSkDxeBJSkoMTIW/1mtd7jvOc++593InZ9fp3O7ee63fWuu/91miz0N99k9HALY3A1eAR5LWdRNEZYB0fh2YDLyRNP+/AdheC9wDJgFfgafAa+B9Pu+AJ5K+tAtVKQO2zwN7WxgPsDvAOUnDrUCqAiwARoCZwLf8HVmYCyzPd7PP+8ARSS8mAqkEEEZszwMeJ8Q4DdheDAwCm4AV6dTAEHBA0vciSGWAhFgYJwC4KOlQWXS2l0UZgJU5fwPYWoToCKBVXRvztuOkhG725H9DkvY37y8FsD0NWAqd3RPAD2BUUpyOKNsFYHc63iHpagNiHEA6PgvsBKa2G+lf1sUp2AZ8TMGGLj4AcySFiH9HaHsK8AxY0gPHzSbuShpMTTzPiV2SLhcBQrk3c8E+4GUXIBHMYSAurhizoxy2TwEHgS2SbhUBjgGx4JOkGV04H9tqO+6Gt2lnvaQHZTZ/acD2CeB41EjSQA8AwsaYCIGNkm7XAHUG6gzUGagz0CoDR4HTwGdJ03twFS8CXlX5FqwGHuaGS9HzdwmxBliVNgYkRR/wxyg2JAEQIL0c1yRtn8hgWUd0BtgAzOqCIjrhUSAyebKsG27Y/qdNaTsB9B3gJz8JATAUAfINAAAAAElFTkSuQmCC") no-repeat center;
      background-size: contain;
      transition: opacity 300ms ease-in-out;
      opacity: 1;

      &:active {
        transform: scale(1.05);
      }
    }
  }

  #img-crop {
    visibility: hidden;
  }

  // rewrite cropper default
  /deep/ .cropper-container {
    .cropper-modal {
      transition: opacity 300ms ease-in-out;
      opacity: 0.8;
    }

    .cropper-line {
      background-color: transparent;
    }

    .cropper-view-box {
      outline: 1px solid #fff;
    }

    .cropper-point {
      background-color: transparent;
      opacity: 1;
      width: 20px;
      height: 20px;

      &::before,
      &::after {
        content: '';
        position: absolute;
        background: #fff;
        opacity: 1;
      }
    }

    .point-nw {
      &::before {
        top: 0;
        left: 0;
        width: 15px;
        height: 2px;
      }

      &::after {
        top: 0;
        left: 0;
        width: 2px;
        height: 15px;
      }
    }

    .point-ne {
      &::before {
        top: 0;
        right: 0;
        width: 15px;
        height: 2px;
      }

      &::after {
        top: 0;
        right: 0;
        width: 2px;
        height: 15px;
      }
    }

    .point-sw {
      &::before {
        left: 0;
        bottom: 0;
        width: 2px;
        height: 15px;
      }

      &::after {
        left: 0;
        bottom: 0;
        width: 15px;
        height: 2px;
      }
    }

    .point-se {
      &::before {
        right: 0;
        bottom: 0;
        width: 2px;
        height: 15px;
      }

      &::after {
        right: 0;
        bottom: 0;
        width: 15px;
        height: 2px;
      }
    }
  }
</style>
