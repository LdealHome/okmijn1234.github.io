<template lang="pug">
  div.whole
    p.tips-text 长按图片分享
    img.poster-img(:src="posterImg")
</template>

<script>
  import imageFit from '../../utils/image-fit'
  import generateQR from '../../mixin/generateQR'
  import { canvasWrapText } from '../../utils/canvas-polyfill'
  import { getLearningReport } from '../../services/mine'
  canvasWrapText()
  let vm
  let poster = {
    data: {
      canvasWidth: 700,
      canvasHeight: 990,
      backImg: {
        img: require('@images/mine/report-back.png'),
        type: 'back'
      },
      avatar: {
        x: 35,
        y: 55,
        size: 84
      },
      name: {
        color: '#1b1b1b',
        size: '34',
        x: 141,
        y: 61
      },
      cycle: {
        color: '#999',
        size: '24',
        x: 141,
        y: 112
      },
      slogan: {
        img: require('@images/mine/slogan-img.png'),
        type: 'slogan'
      },
      sign: {
        text: '润阳365蜕变营',
        color: '#999',
        size: '28',
        x: 33,
        y: 878
      }
    },
    images: {},
    init (baseInfo, callback) {
      let data = poster.data
      let canvas = document.createElement('canvas')
      let ctx = canvas.getContext('2d')
      poster.canvas = canvas
      canvas.width = data.canvasWidth
      canvas.height = data.canvasHeight
      drawBack()
      // 绘制背景图
      function drawBack () {
        ctx.fillStyle = '#fff'
        ctx.fillRect(0, 0, canvas.width, canvas.height)
        getImage(data.backImg.img, data.backImg.type)
          .then(img => {
            ctx.drawImage(img, 0, 0, data.canvasWidth, data.canvasHeight)
            drawAvatar()
          })
      }
      function drawAvatar () {
        getImage(baseInfo.avatar, 'avatar')
          .then(img => {
            ctx.save()
            ctx.translate(data.avatar.x, data.avatar.y)
            ctx.arc(data.avatar.size / 2, data.avatar.size / 2, data.avatar.size / 2, 0, 2 * Math.PI)
            ctx.clip()
            let { naturalWidth, naturalHeight } = img
            let { x, y, w, h, dx, dy, dw, dh } = imageFit(naturalWidth, naturalHeight, data.avatar.size, data.avatar.size)
            ctx.drawImage(img, x, y, w, h, dx, dy, dw, dh)
            // 绘制头像边框
            ctx.strokeStyle = '#4EB9FD'
            ctx.lineWidth = 1
            ctx.arc(data.avatar.size / 2, data.avatar.size / 2, data.avatar.size / 2, 0, 2 * Math.PI)
            ctx.stroke()
            ctx.restore()
            drawUserInfo()
          })
      }
      // 绘制用户昵称、日期范围
      function drawUserInfo () {
        ctx.fillStyle = data.name.color
        ctx.textBaseline = 'top'
        ctx.textAlign = 'start'
        ctx.font = `bold ${data.name.size}px sans-serif`
        ctx.wrapText(baseInfo.name, data.name.x, data.name.y, 370, 42, 1)

        ctx.fillStyle = data.cycle.color
        ctx.textBaseline = 'top'
        ctx.textAlign = 'start'
        ctx.font = `500 ${data.cycle.size}px sans-serif`
        ctx.fillText(baseInfo.cycle, data.cycle.x, data.cycle.y)
        drawSlogan()
      }
      // 绘制标语
      function drawSlogan () {
        getImage(data.slogan.img, data.slogan.type)
          .then(img => {
            ctx.drawImage(img, 127, 200, 450, 136)
            drawStudyText()
          })
      }
      // 绘制学习数据海报
      function drawStudyText () {
        ctx.fillStyle = '#666'
        ctx.textBaseline = 'top'
        ctx.textAlign = 'start'
        ctx.font = '500 28px sans-serif'
        ctx.fillText('本周学习时长', 221, 397)

        ctx.save()
        ctx.translate(221, 490)
        ctx.fillStyle = '#1b1b1b'
        ctx.textBaseline = 'alphabetic'
        ctx.textAlign = 'start'
        ctx.font = 'bold 40px sans-serif'
        let timeWidth = ctx.measureText(baseInfo.studyTime).width
        ctx.fillText(baseInfo.studyTime, 0, 0)

        ctx.fillStyle = '#1b1b1b'
        ctx.textBaseline = 'alphabetic'
        ctx.textAlign = 'start'
        ctx.font = '500 28px sans-serif'
        ctx.fillText('分钟', timeWidth, 0)
        
        ctx.restore()

        ctx.fillStyle = '#666'
        ctx.textBaseline = 'top'
        ctx.textAlign = 'start'
        ctx.font = '500 28px sans-serif'
        ctx.fillText('本周完成课程', 221, 550)

        ctx.save()
        ctx.translate(221, 645)

        ctx.fillStyle = '#1b1b1b'
        ctx.textBaseline = 'alphabetic'
        ctx.textAlign = 'start'
        ctx.font = 'bold 40px sans-serif'
        let courseNumWidth = ctx.measureText(baseInfo.courseNum).width
        ctx.fillText(baseInfo.courseNum, 0, 0)

        ctx.fillStyle = '#1b1b1b'
        ctx.textBaseline = 'alphabetic'
        ctx.textAlign = 'start'
        ctx.font = '500 28px sans-serif'
        ctx.fillText('节', courseNumWidth, 0)
        
        ctx.restore()

        ctx.fillStyle = '#666'
        ctx.textBaseline = 'top'
        ctx.textAlign = 'start'
        ctx.font = '500 28px sans-serif'
        ctx.fillText('最晚学习时间', 221, 702)

        ctx.save()
        ctx.translate(221, 798)

        let initX = 0 // 初始位置
        ctx.fillStyle = '#1b1b1b'
        ctx.textBaseline = 'alphabetic'
        ctx.textAlign = 'start'
        for (let i = 0; i < baseInfo.latestList.length; i++) {
          let isNumber = (i + 1) % 2 === 0
          ctx.font = `${isNumber ? 'bold' : '500'} ${isNumber ? '40' : '28'}px sans-serif`
          ctx.fillText(baseInfo.latestList[i], initX, 0)
          initX += ctx.measureText(baseInfo.latestList[i]).width
        }
        // ctx.fillText('凌晨03点05分', 0, 0)

        ctx.restore()
        drawSign()
      }
      function drawSign () {
        ctx.fillStyle = data.sign.color
        ctx.textBaseline = 'top'
        ctx.textAlign = 'start'
        ctx.font = `500 ${data.sign.size}px sans-serif`
        ctx.wrapText(data.sign.text, data.sign.x, data.sign.y, 370, 42, 1)
        drawQRCode()
      }
      function drawQRCode () {
        vm.generateQR('http://baidu.com')
          .then(qr => {
            getImage(qr, 'qr')
              .then(img => {
                ctx.drawImage(img, 550, 835, 114, 114)
                callback()
              })
          })
      }
    }
  }

  function getImage (src, key) {
    let target = poster.images
    return new Promise(function (resolve, reject) {
      if (target[key]) {
        resolve(target[key])
      }
      let image = new Image()
      image.setAttribute('crossOrigin', 'anonymous')
      image.src = src
      image.onload = function () {
        target[key] = image
        resolve(image)
      }
      image.onerror = function (e) {
        reject(e)
      }
    })
  }
  export default {
    name: 'LearningReport',
    data () {
      return {
        posterImg: ''
      }
    },
    mixins: [generateQR],
    created () {
      vm = this
      getLearningReport().then(res => {
        if (res.data.code === 1) {
          let data = res.data.data
          poster.init({
            avatar: data.head_img,
            name: data.nick_name,
            cycle: data.cycle,
            studyTime: data.learn_length, // 学习时长
            courseNum: data.complete_course_num, // 课程数量
            latestList: data.latest_time
          }, function () {
            vm.posterImg = poster.canvas.toDataURL('image/jpeg', 1)
          })
        }
      })
    }
  }
</script>

<style scoped lang="less">
  .whole {
    min-height: 100vh;
    background: #fff;
    overflow: hidden;
    padding-bottom: 1.3rem;
    text-align: center;
  }

  .tips-text {
    font-size: .32rem;
    color: #525455;
    height: .88rem;
    line-height: .88rem;
    display: inline-block;
    background: url('~@icon/mine/share-icon.png') no-repeat left center;
    background-size: .28rem;
    padding-left: .46rem;
  }

  .poster-img {
    width: 6.9rem;
    height: 9.8rem;
  }
</style>
