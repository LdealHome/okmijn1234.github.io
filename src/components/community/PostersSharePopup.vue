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
      canvasWidth: 750,
      canvasHeight: 1476,
      portraitSrc: '', // 头像
      nicknameText: '', // 昵称
      codeSrc: '', // 二维码
      randomNumber: 1, // 随机切换背景
      portraitData: {
        portraitX: 440,
        portraitY: 24,
        portraitSize: 56,
        portraitBorderColor: '#fff'
      },
      nicknameData: {
        nicknameY: 40,
        nicknameFont: '100 26px sans-serif',
        nicknameWidth: 200
      },
      codeData: {
        codeX: 520,
        codeY: 1208,
        codeSize: 176
      },
      timeout: 10000,
      timer: null
    },
    /**
     * @param config {Object} 配置信息
     * @param config.randomNumber {Number|require} 随机数
     * @param config.portraitSrc {String|require} 头像
     * @param config.nicknameText {String|require} 昵称
     * @param config.codeSrc {String|require} 二维码
     * @param config.timeout {Number} 加载图片超时 默认10000(ms)
     * @param callback {Function} 画图成功之后执行的回调
     */
    init (config, callback) {
      let { randomNumber, portraitSrc, nicknameText, codeSrc } = config
      if (randomNumber && portraitSrc && nicknameText && codeSrc) {
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
          portraitSrc,
          nicknameText,
          codeSrc,
          randomNumber
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
          if (randomNumber % 2 === 0) {
            backImg.src = require('../../assets/images/community/poster-img.png')
          } else {
            backImg.src = require('../../assets/images/community/poster-img1.png')
          }

          backImg.onload = function () {
            let { naturalWidth, naturalHeight } = backImg
            let { x, y, w, h, dx, dy, dw, dh } = imageFit(naturalWidth, naturalHeight, canvasWidth, canvasHeight)
            ctx.drawImage(backImg, x, y, w, h, dx, dy, dw, dh)
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
            nicknameY,
            nicknameFont,
            nicknameWidth
          } = drawInvitePoster.data.nicknameData
          ctx.save()
          ctx.font = nicknameFont
          if (randomNumber % 2 === 0) {
            ctx.fillStyle = '#fff'
          } else {
            ctx.fillStyle = '#181717'
          }
          let testWidth = ctx.measureText(nicknameText).width > nicknameWidth ? nicknameWidth : ctx.measureText(nicknameText).width
          ctx.textBaseline = 'top'
          ctx.wrapText(nicknameText, canvasWidth - 36 - testWidth, nicknameY, nicknameWidth, 30, 1)
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
          ctx.fillStyle = '#c6eafd'
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
            randomNumber: '', // 随机数不需要传当前页面生成
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
      let randomNumber = 0
      let getRandom = this.getRandom()
      if (getRandom) {
        randomNumber = getRandom
      } else {
        randomNumber = Math.floor(Math.random() * 100)
        this.setRandom(randomNumber, 0.5)
      }
      that.generateQR(this.posterInfo.codeSrc).then(res => {
        this.posterInfo.codeSrc = res
        this.posterInfo.randomNumber = randomNumber
        drawInvitePoster.init(this.posterInfo, function (res) {
          that.imgSrc = res
        })
      })
    },
    methods: {
      /**
       * 缓存随机值
       * @param number {Number} 存储在本地的随机数
       * @param expires {Number} 随机数randomNumber的过期时间（小时数，默认为30分钟）
       */
      setRandom (number, expires = 0.5) {
        let exp = new Date()
        exp.setTime(exp.getTime() + expires * 60 * 60 * 1000)
        localStorage.setItem('randomNumber', JSON.stringify({
          number,
          expires: exp.getTime()
        }))
      },
      // 获取随机值
      getRandom () {
        let data = JSON.parse(localStorage.getItem('randomNumber') || '{}')
        let timestamp = Date.now()
        if (data.number && timestamp <= data.expires) {
          return data.number
        } else {
          return null
        }
      }
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
      display: flex;
      align-items: center;
      flex-direction: column;
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
      width: 3.52rem;
      height: 6.94rem;
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
