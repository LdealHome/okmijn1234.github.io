<!--海报分享-->
<template lang="pug">
  div.poster__bounced
    div.mask(@click="$emit('close')")
    div.content
      div.above
        p 分享朋友圈、群或好友
        p.be-careful (注意：有效期30天)
      div.following
        img.img(v-lazy="imgSrc")
        p.prompt 长按可保存到手机相册或分享给好友
      div.close(@click="$emit('close')")
</template>

<script>
  import generateQR from '../../mixin/generateQR'
  import imageFit from '../../utils/image-fit'
  import { canvasWrapText } from '../../utils/canvas-polyfill'

  let drawInvitePoster = {
    data: {
      canvasWidth: 518,
      canvasHeight: 692,
      backSrc: '', // 背景
      portraitSrc: '', // 头像
      nicknameText: '', // 昵称
      codeSrc: '', // 二维码
      portraitData: {
        portraitX: 20,
        portraitY: 616,
        portraitSize: 56,
        portraitBorderColor: '#fff'
      },
      nicknameData: {
        nicknameX: 94,
        nicknameY: 631,
        nicknameFont: '100 26px sans-serif',
        nicknameWidth: 226
      },
      codeData: {
        codeX: 398,
        codeY: 572,
        codeSize: 100
      },
      timeout: 10000,
      timer: null
    },
    /**
     * @param config {Object} 配置信息
     * @param config.backSrc {String|require} 背景图
     * @param config.portraitSrc {String|require} 头像
     * @param config.nicknameText {String|require} 昵称
     * @param config.codeSrc {String|require} 二维码
     * @param config.timeout {Number} 加载图片超时 默认10000(ms)
     * @param callback {Function} 画图成功之后执行的回调
     */
    init (config, callback) {
      let { backSrc, portraitSrc, nicknameText, codeSrc } = config
      if (backSrc && portraitSrc && nicknameText && codeSrc) {
        this.data = { ...this.data, ...config }
        canvasWrapText()
        this.callback = callback
        $_.Indicator.open({
          text: '正在加载...',
          spinnerType: 'fading-circle'
        })
        let image = new Image()
        image.setAttribute('crossOrigin', 'anonymous')
        image.src = drawInvitePoster.data.codeSrc
        image.onload = function () {
          drawInvitePoster.data.codeSrc = image
          drawInvitePoster.methods.drawImage()
        }
      } else {
        $_.Toast('缺少必需参数，无法生成海报图')
      }
    },
    methods: {
      drawImage () {
        let canvas = document.createElement('canvas')
        // let canvas = document.getElementById('canvas')
        let ctx = canvas.getContext('2d')
        let {
          canvasWidth,
          canvasHeight,
          backSrc,
          portraitSrc,
          nicknameText,
          codeSrc
        } = drawInvitePoster.data
        canvas.width = canvasWidth
        canvas.height = canvasHeight
        ctx.fillStyle = 'transparent'
        ctx.fillRect(0, 0, canvasWidth, canvasHeight)

        // 限制绘制的时间
        drawInvitePoster.data.timer = setTimeout(function () {
          $_.Indicator.close()
          $_.Toast('加载图片失败!')
          console.log(1)
        }, drawInvitePoster.data.timeout)

        // 背景图
        function drawBack () {
          let backImg = new Image()
          backImg.setAttribute('crossOrigin', 'anonymous')
          backImg.src = backSrc
          backImg.onload = function () {
            let { naturalWidth, naturalHeight } = backImg
            let { x, y, w, h, dx, dy, dw, dh } = imageFit(naturalWidth, naturalHeight, canvasWidth, canvasHeight)
            ctx.drawImage(backImg, x, y, w, h, dx, dy, dw, dh)
            drawRectangle()
          }
        }

        // 矩形渐变
        function drawRectangle () {
          let backImg = new Image()
          backImg.setAttribute('crossOrigin', 'anonymous')
          backImg.src = require('../../assets/images/community/rectangle.png')
          backImg.onload = function () {
            ctx.drawImage(backImg, 0, 608, 518, 84)
            drawPortrait()
          }
        }

        // 头像
        function drawPortrait () {
          let {
            portraitX,
            portraitY,
            portraitSize,
            portraitBorderColor
          } = drawInvitePoster.data.portraitData
          let portrait = new Image()
          portrait.setAttribute('crossOrigin', 'anonymous')
          portrait.src = portraitSrc
          portrait.onload = function () {
            ctx.save()
            let { naturalWidth, naturalHeight } = portrait
            let { x, y, w, h, dx, dy, dw, dh } = imageFit(naturalWidth, naturalHeight, portraitSize, portraitSize)
            ctx.translate(portraitX, portraitY)
            ctx.beginPath()
            ctx.arc(portraitSize / 2, portraitSize / 2, portraitSize / 2, 0, 2 * Math.PI)
            ctx.lineWidth = 2
            ctx.strokeStyle = portraitBorderColor
            ctx.stroke()
            ctx.clip()
            ctx.drawImage(portrait, x, y, w, h, dx, dy, dw, dh)
            // 恢复画布
            ctx.restore()
            drawNickName()
          }
        }

        // 昵称
        function drawNickName () {
          let {
            nicknameX,
            nicknameY,
            nicknameFont,
            nicknameWidth
          } = drawInvitePoster.data.nicknameData
          ctx.save()
          ctx.font = nicknameFont
          ctx.fillStyle = '#fff'
          ctx.textBaseline = 'top'
          ctx.wrapText(nicknameText, nicknameX, nicknameY, nicknameWidth, 30, 1)
          ctx.restore()
          drawCode()
        }

        // 二维码
        function drawCode () {
          let {
            codeX,
            codeY,
            codeSize
          } = drawInvitePoster.data.codeData
          ctx.save()
          ctx.fillStyle = '#fff'
          ctx.fillRect(codeX - 2, codeY - 2, codeSize + 4, codeSize + 4)
          ctx.drawImage(codeSrc, codeX, codeY, codeSize, codeSize)
          ctx.restore()
          generate()
        }
        function generate () {
          let url = canvas.toDataURL()
          $_.Indicator.close()
          drawInvitePoster.callback(url)
          clearTimeout(drawInvitePoster.data.timer)
        }
        drawBack()
      }
    }
  }
  export default {
    name: 'PostersSharePopup',
    props: {
      posterInfo: {
        type: Object,
        required: true,
        default () {
          return {
            backSrc: '', // 背景
            portraitSrc: '', // 头像
            nicknameText: '', // 昵称
            codeSrc: '' // 二维码
          }
        }
      }
    },
    mixins: [generateQR],
    data () {
      return {
        imgSrc: ''
      }
    },
    created () {
      let that = this
      that.generateQR(this.posterInfo.codeSrc).then(res => {
        this.posterInfo.codeSrc = res
        drawInvitePoster.init(this.posterInfo, function (res) {
          that.imgSrc = res
        })
      })
    }
  }
</script>

<style scoped lang="less">
  .poster__bounced {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    width: 100%;
    height: 100%;
    z-index: 11;

    .mask {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, .5);
    }

    .content {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
    }

    .above {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      flex-direction: column;
      color: #fff;
      font-size: .3rem;
      width: 100%;
      height: 2.12rem;
      padding-bottom: .26rem;
      background: url("~@images/community/share-guide.png") no-repeat 5.38rem center;
      background-size: contain;
    }

    .be-careful {
      font-size: .24rem;
    }

    .following {
      width: 5.18rem;
      margin: -.04rem auto auto;
    }

    .close {
      margin: auto;
      width: .76rem;
      height: .76rem;
      background: url("~@icon/community/close-white.png") no-repeat center;
      background-size: .48rem;

      &:active {
        transform: scale(1.06);
      }
    }

    .img {
      width: 5.18rem;
      height: 6.92rem;
      border-radius: .12rem;
    }

    .prompt {
      color: #ebebeb;
      font-size: .28rem;
      text-align: center;
      margin: .2rem 0;
    }
  }
</style>
