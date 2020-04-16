<!--海报分享-->
<template lang="pug">
  div.poster__bounced
    div.mask(@click="$emit('close')")
    div.content
      div.above 分享朋友圈、群或好友
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
  import { getSharePoster } from '../../services/community'

  let vm = ''
  let drawInvitePoster = {
    data: {
      canvasWidth: 750,
      canvasHeight: 1476,
      portraitSrc: '', // 头像
      nicknameText: '', // 昵称
      codeSrc: '', // 二维码
      templateIndex: -1, // 第几套海报
      nicknameTextWidth: 0,
      nicknameWidth: 200, // 昵称最大宽度
      posterArray: [], // 海报列表
      timeout: 120000,
      timer: null
    },
    /**
     * @param config {Object} 配置信息
     * @param config.portraitSrc {String|require} 头像
     * @param config.nicknameText {String|require} 昵称
     * @param config.codeSrc {String|require} 二维码
     * @param config.templateIndex {Number} 第几套海报
     * @param config.posterArray {String|require}
     * @param config.posterArray.backSrc {String|require}  背景图
     * @param config.posterArray.codeX {Number}  二维码x
     * @param config.posterArray.codeY {Number}  二维码y
     * @param config.posterArray.codeSize {Number} 二维码大小
     * @param config.posterArray.portraitX {Number} 头像x
     * @param config.posterArray.portraitY {Number} 头像y
     * @param config.posterArray.portraitSize {Number} 头像大小
     * @param config.posterArray.portraitBorderColor {String|require} 边框颜色
     * @param config.posterArray.nicknameY {String|require} 昵称y
     * @param config.posterArray.nicknameFont {String|require} 昵称大小
     * @param config.posterArray.nicknameColor {String|require} // 昵称颜色
     * @param config.timeout {Number} 加载图片超时 默认10000(ms)
     * @param callback {Function} 画图成功之后执行的回调
     */
    init (config, callback) {
      let { portraitSrc, nicknameText, codeSrc, posterArray } = config
      if (posterArray && portraitSrc && nicknameText && codeSrc) {
        this.data = { ...this.data, ...config }
        canvasWrapText()
        this.callback = callback
        $_.Indicator.open({
          text: '正在加载...',
          spinnerType: 'fading-circle'
        })
        drawInvitePoster.data.posterArray = posterArray
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
          nicknameWidth
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
          backImg.src = drawInvitePoster.data.posterArray[templateIndex].backSrc
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
            nicknameColor
          } = drawInvitePoster.data.posterArray[templateIndex]
          ctx.save()
          ctx.font = nicknameFont
          ctx.fillStyle = nicknameColor
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
          } = drawInvitePoster.data.posterArray[templateIndex]
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
          } = drawInvitePoster.data.posterArray[templateIndex]
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
      fromUid: { // 分享人的uid
        type: [String, Number],
        required: true,
        default: 0
      }
    },
    mixins: [generateQR],
    components: {
      SwiperCommon
    },
    data () {
      return {
        portraitSrc: 'http://hskimgtest.smsqmx.com/upload/head_img/2020_03_07/34173cb38f07f89ddbebc2ac9128303f.png', // 头像
        nicknameText: '你好世界', // 昵称
        codeSrc: 'http://community-web.xy22.cn/particulars/from/30', // 二维码
        generateList: [], // 监听生成过的图片不在重新生成
        imgArr: [], // 生成海报的图片
        currentIndex: 0, // 海报选择的哪一个
        posterArray: [], // 海报数组
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
      vm.main()
    },
    methods: {
      main () {
        getSharePoster({ uid: vm.fromUid }).then(res => {
          if (res.data.code === 1) {
            let data = res.data.data
            let memberInfo = data.member_info
            vm.portraitSrc = memberInfo.head_img
            vm.nicknameText = memberInfo.nick_name

            if (vm.posterArray.length === 0) {
              vm.posterArray = this.transformPosterList(data.list)
            }
            vm.generateQR(memberInfo.qr_code).then(res => {
              vm.codeSrc = res
              vm.posterArray.forEach(item => {
                vm.imgArr.push(item.backSrc)
              })
              // 生成第一张海报
              vm.generateList = vm.imgArr
              vm.generatePosterArray(vm.currentIndex)
            })
          }
        })
      },
      /**
       * 海报切换的角标
       */
      generatePosterArray (index) {
        if (/^data:/.test(vm.generateList[index])) { // 已经生成海报
          return
        }
        vm.currentIndex = index
        drawInvitePoster.init({
          portraitSrc: vm.portraitSrc, // 头像
          nicknameText: vm.nicknameText, // 昵称
          codeSrc: vm.codeSrc, // 二维码
          templateIndex: vm.currentIndex,
          posterArray: vm.posterArray
        }, function (res) {
          vm.generateList.splice(index, 1, res)
        })
      },
      /**
       * 转换海报格式
       */
      transformPosterList (source) {
        let list = []
        source.forEach(item => {
          list.push({
            backSrc: item.img, // 背景图
            codeX: item.qr_code_x, // 二维码x轴
            codeY: item.qr_code_y, // 二维码y轴
            codeSize: item.qr_code_w, // 二维码大小
            portraitX: item.head_img_x, // 头像x轴
            portraitY: item.head_img_y, // 头像y轴
            portraitSize: item.head_img_w, // 头像大小
            portraitBorderColor: item.img_border_color, // 头像边框颜色
            nicknameY: item.nick_name_y, // 昵称y轴
            nicknameWidth: 200, // 昵称的最大宽
            nicknameFont: item.nick_name_size, // 昵称大小
            nicknameColor: item.nick_name_color // 昵称颜色
          })
        })
        return list
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
