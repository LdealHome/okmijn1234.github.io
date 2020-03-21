<!--海报分享-->
<template lang="pug">
  div.poster__bounced
    div.mask(@click="$emit('close')")
    div.content
      div.above
        p 分享朋友圈、群或好友
        p.be-careful (注意：有效期30天)
      div.following
        div.following-img
          SwiperCommon(:slides="generateList" :swiperOptions="swiperOption")
            template(
              v-for="(item, index) in generateList"
              :slot="index"
            )
              img.img(v-lazy="item")
        p.prompt 长按可保存到手机相册或分享给好友
      div.close(@click="$emit('close')")
</template>

<script>
  import SwiperCommon from '../../components/SwiperCommon'
  import generateQR from '../../mixin/generateQR'
  import imageFit from '../../utils/image-fit'
  import { canvasWrapText } from '../../utils/canvas-polyfill'

  let vm = ''
  let drawInvitePoster = {
    data: {
      canvasWidth: 750,
      canvasHeight: 1476,
      portraitSrc: '', // 头像
      nicknameText: '', // 昵称
      codeSrc: '', // 二维码
      templateIndex: -1, // 第几套海报
      backSrc: '', // 背景图
      nicknameTextWidth: 0,
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
      timeout: 120000,
      timer: null
    },
    /**
     * @param config {Object} 配置信息
     * @param config.templateIndex {Number|require} 第几套海报
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
          portraitSrc,
          nicknameText,
          codeSrc,
          templateIndex,
          backSrc
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
          backImg.onerror = function () {
            $_.Indicator.close()
            clearTimeout(drawInvitePoster.data.timer)
            $_.Toast('图片错误')
          }
          backImg.onload = function () {
            let { naturalWidth, naturalHeight } = backImg
            let { x, y, w, h, dx, dy, dw, dh } = imageFit(naturalWidth, naturalHeight, canvasWidth, canvasHeight)
            ctx.drawImage(backImg, x, y, w, h, dx, dy, dw, dh)
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
          if (templateIndex === 0) {
            ctx.fillStyle = '#fff'
          } else {
            ctx.fillStyle = '#181717'
          }
          drawInvitePoster.data.nicknameTextWidth = ctx.measureText(nicknameText).width > nicknameWidth ? nicknameWidth : ctx.measureText(nicknameText).width
          ctx.textBaseline = 'top'
          ctx.wrapText(nicknameText, canvasWidth - 36 - drawInvitePoster.data.nicknameTextWidth, nicknameY, nicknameWidth, 30, 1)
          ctx.restore()
          drawPortrait()
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
            let flexiblePortraitX = drawInvitePoster.data.nicknameTextWidth > 199 ? portraitX : portraitX + 186 - drawInvitePoster.data.nicknameTextWidth
            let { naturalWidth, naturalHeight } = portrait
            let { x, y, w, h, dx, dy, dw, dh } = imageFit(naturalWidth, naturalHeight, portraitSize, portraitSize)
            ctx.translate(flexiblePortraitX, portraitY)
            ctx.beginPath()
            ctx.arc(portraitSize / 2, portraitSize / 2, portraitSize / 2, 0, 2 * Math.PI)
            ctx.lineWidth = 2
            ctx.strokeStyle = portraitBorderColor
            ctx.stroke()
            ctx.clip()
            ctx.drawImage(portrait, x, y, w, h, dx, dy, dw, dh)
            // 恢复画布
            ctx.restore()
            drawCode()
          }
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
            portraitSrc: '', // 头像
            nicknameText: '', // 昵称
            codeSrc: '', // 二维码
            templateIndex: '', // 第几套海报不用传
            backSrc: '' // 背景图不用传
          }
        }
      }
    },
    mixins: [generateQR],
    components: {
      SwiperCommon
    },
    data () {
      return {
        generateList: [],
        currentIndex: 0, // 海报选择的哪一个
        backgroundList: [
          require('../../assets/images/community/draw-img.png'),
          require('../../assets/images/community/draw-img-back.png')
        ], // 海报背景
        swiperOption: {
          speed: 500, // 切换速度
          watchOverflow: true, // 当没有足够的slide切换时，例如只有1个slide（非loop），swiper会失效且隐藏导航等。默认不开启这个功能。
          loop: false, // 开启循环模式
          slidesPerView: 1,
          spaceBetween: 30,
          preventClicksPropagation: true, // 阻止click冒泡。拖动Swiper时阻止click事件。
          simulateTouch: false, // 鼠标模拟手机触摸。默认为true，Swiper接受鼠标点击、拖动。
          centeredSlides: true,
          initialSlide: 0,
          swiperButton: true,
          navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev'
          },
          on: {
            slideChange () {
              vm.generatePosterArray(this.activeIndex)
            }
          }
        }
      }
    },
    created () {
      vm = this
      vm.generateList = vm.backgroundList
      vm.generateQR(this.posterInfo.codeSrc).then(res => {
        vm.posterInfo.codeSrc = res
        vm.posterInfo.templateIndex = vm.currentIndex
        vm.generatePosterArray(vm.currentIndex)
      })
    },
    methods: {
      /**
       * 海报切换的角标
       */
      generatePosterArray (index) {
        if (/^data:/.test(vm.generateList[index])) { // 已经生成海报
          return
        }
        vm.posterInfo.backSrc = vm.backgroundList[index]
        vm.posterInfo.templateIndex = index
        drawInvitePoster.init(this.posterInfo, function (res) {
          vm.generateList.splice(index, 1, res)
        })
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

      &-img {
        width: 5.18rem;
        height: 6.94rem;
        text-align: center;
        border-radius: .12rem;
        background-color: #000;
      }
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
    }

    .prompt {
      color: #ebebeb;
      font-size: .28rem;
      text-align: center;
      margin: .2rem 0;
    }
  }

  /deep/ .swiper-button-prev,
  /deep/ .swiper-button-next {
    width: .6rem;
    height: .6rem;
    background-repeat: no-repeat;
    background-position: center;
    background-size: contain;
    outline: none;

    &:active {
      transform: scale(1.06);
    }
  }

  /deep/ .swiper-button-prev {
    left: .06rem;
    background-image: url("~@icon/community/arrow-left-circular.png");
  }

  /deep/ .swiper-button-next {
    right: .06rem;
    background-image: url("~@icon/community/arrow-right-circular.png");
  }

</style>
