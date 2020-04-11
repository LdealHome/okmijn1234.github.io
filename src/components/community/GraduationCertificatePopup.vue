<!--毕业证书弹框-->
<template lang="pug">
  div.certificate__bounced
    div.mask
    div.content#content
      p.close(@click="$emit('close')")
      p.text 长按保存图片或分享微信好友和微信群
      //canvas#canvas
      img.img(v-lazy="imgSrc")
</template>

<script>
  import imageFit from '../../utils/image-fit'
  import { canvasWrapText } from '../../utils/canvas-polyfill'

  let drawCertificate = {
    data: {
      canvasWidth: 670,
      canvasHeight: 1144,
      portraitSrc: '', // 头像
      nicknameText: '', // 昵称
      curriculumText: '', // 课程名称
      taskNumber: 9, // 完成任务多少项
      learningCurriculum: 2, // 学习课程
      dailyAttendance: 2222, // 连续打卡天数
      numberExaminations: 22, // 考试次数
      codeSrc: '', // 二维码
      sentenceText: '', // 励志语
      technicalSupportText: '链脉云提供技术支持', // 技术支持
      crownData: { // 皇冠
        crownY: 125,
        crownWidth: 64,
        crownHeight: 38
      },
      titleData: { // 毕业证书
        titleY: 178,
        titleWidth: 190,
        titleHeight: 46
      },
      portraitData: { // 头像
        portraitY: 253,
        portraitSize: 100,
        portraitBorderColor: '#4eb9f4'
      },
      nicknameData: { // 昵称
        nicknameY: 389,
        nicknameFont: '100 32px sans-serif',
        nicknameWidth: 360,
        nicknameColor: '#333'
      },
      curriculumData: { // 课程
        curriculumY: 439,
        curriculumFont: '100 24px sans-serif',
        curriculumWidth: 540,
        curriculumColor: '#666'
      },
      taskData: { // 任务完成项
        taskX: 224,
        taskY: 510,
        taskColor: '#333',
        taskTextFont: 'bold 28px sans-serif',
        taskNumberFont: 'bold 32px sans-serif'
      },
      durationData: { // 学习课程、完成打卡、参与考试
        durationNumberColor: '#333',
        durationNumberFont: 'bold 50px sans-serif',
        durationNumberWidth: 110,
        durationNumberY: 644, // 数字Y轴
        durationTextY: 572, // 文字Y轴
        durationTextColor: '#999',
        durationTextFont: '100 28px sans-serif',
        learningX: 96, // 学习课程
        numberExaminationsX: 279, // 参与考试
        dailyAttendanceX: 463 // 完成打卡
      },
      sentenceData: { // 励志语
        sentenceY: 740,
        sentenceColor: '#999',
        sentenceFont: '100 28px sans-serif'
      },
      codeData: { // 二维码
        codeY: 851,
        codeSize: 128
      },
      codeNameData: { // 二维码昵称
        codeNameY: 1001,
        codeNameFont: '100 28px sans-serif',
        codeNameColor: '#999'
      },
      technicalSupportData: {
        technicalSupportY: 1099,
        technicalSupportColor: '#ccc',
        technicalSupportFont: '100 24px sans-serif'
      },
      timeout: 120000,
      timer: null
    },
    /**
     * @param config {Object} 配置信息
     * @param config.portraitSrc {String|require} 头像
     * @param config.nicknameText {String|require} 昵称
     * @param config.curriculumText {String|require} 课程名称
     * @param config.taskNumber {Number} 完成任务多少项
     * @param config.learningCurriculum {Number} 学习课程
     * @param config.dailyAttendance  {Number} 连续打卡天数
     * @param config.numberExaminations {Number}: 考试次数
     * @param config.codeSrc  {String|require} 二维码
     * @param config.sentenceText {String|require} 励志语
     * @param config.technicalSupportText {String|require} 技术支持
     * @param config.timeout {Number} 加载图片超时 默认10000(ms)
     * @param callback {Function} 画图成功之后执行的回调
     */
    init (config, callback) {
      let {
        portraitSrc,
        nicknameText,
        curriculumText,
        taskNumber,
        learningCurriculum,
        dailyAttendance,
        numberExaminations,
        codeSrc,
        sentenceText,
        technicalSupportText
      } = config
      if (portraitSrc && nicknameText && curriculumText && taskNumber && learningCurriculum && dailyAttendance && numberExaminations && codeSrc && sentenceText && technicalSupportText) {
        this.data = { ...this.data, ...config }
        canvasWrapText()
        this.callback = callback
        $_.Indicator.open({
          text: '正在加载...',
          spinnerType: 'fading-circle'
        })
        canvasWrapText()
        let image = new Image()
        image.setAttribute('crossOrigin', 'anonymous')
        image.src = drawCertificate.data.codeSrc
        image.onload = function () {
          drawCertificate.data.codeSrc = image
          drawCertificate.methods.drawImage()
        }
      } else {
        $_.Toast('缺少必需参数，无法生成海报图')
      }
    },
    methods: {
      drawImage () {
        let {
          canvasWidth,
          canvasHeight,
          portraitSrc,
          nicknameText,
          curriculumText,
          taskNumber,
          learningCurriculum,
          dailyAttendance,
          numberExaminations,
          sentenceText,
          codeSrc,
          technicalSupportText
        } = drawCertificate.data
        let canvas = document.createElement('canvas')
        canvas.width = canvasWidth
        canvas.height = canvasHeight
        let ctx = canvas.getContext('2d')
        ctx.width = canvasWidth
        ctx.height = canvasHeight
        ctx.fillStyle = 'transparent'
        ctx.fillRect(0, 0, canvasWidth, canvasHeight)

        // 限制绘制的时间
        drawCertificate.data.timer = setTimeout(function () {
          $_.Indicator.close()
          $_.Toast('加载图片失败!')
          console.log(1)
        }, drawCertificate.data.timeout)

        // 背景图
        function drawBack () {
          let backImg = new Image()
          backImg.setAttribute('crossOrigin', 'anonymous')
          backImg.src = require('../../assets/images/community/column-certificate.png')
          backImg.onload = function () {
            let { naturalWidth, naturalHeight } = backImg
            let { x, y, w, h, dx, dy, dw, dh } = imageFit(naturalWidth, naturalHeight, canvasWidth, canvasHeight)
            ctx.drawImage(backImg, x, y, w, h, dx, dy, dw, dh)

            drawCrown()
          }
        }

        // 皇冠
        function drawCrown () {
          let {
            crownY,
            crownWidth,
            crownHeight
          } = drawCertificate.data.crownData
          let crownImg = new Image()
          crownImg.setAttribute('crossOrigin', 'anonymous')
          crownImg.src = require('../../assets/images/community/column-certificate-crown.png')
          crownImg.onload = function () {
            ctx.save()
            let { naturalWidth, naturalHeight } = crownImg
            let { x, y, w, h, dx, dy, dw, dh } = imageFit(naturalWidth, naturalHeight, crownWidth, crownHeight)
            ctx.translate((canvasWidth - crownWidth) / 2, crownY)
            ctx.drawImage(crownImg, x, y, w, h, dx, dy, dw, dh)
            ctx.restore()

            drawTitle()
          }
        }

        // 毕业证书
        function drawTitle () {
          let {
            titleWidth,
            titleHeight,
            titleY
          } = drawCertificate.data.titleData
          let crownImg = new Image()
          crownImg.setAttribute('crossOrigin', 'anonymous')
          crownImg.src = require('../../assets/images/community/column-certificate-title.png')
          crownImg.onload = function () {
            ctx.save()
            let { naturalWidth, naturalHeight } = crownImg
            let { x, y, w, h, dx, dy, dw, dh } = imageFit(naturalWidth, naturalHeight, titleWidth, titleHeight)
            ctx.translate((canvasWidth - titleWidth) / 2, titleY)
            ctx.drawImage(crownImg, x, y, w, h, dx, dy, dw, dh)
            ctx.restore()

            drawPortrait()
          }
        }

        // 头像
        function drawPortrait () {
          let {
            portraitY,
            portraitSize,
            portraitBorderColor
          } = drawCertificate.data.portraitData
          let portraitImg = new Image()
          portraitImg.setAttribute('crossOrigin', 'anonymous')
          portraitImg.src = portraitSrc
          portraitImg.onload = function () {
            ctx.save()
            let { naturalWidth, naturalHeight } = portraitImg
            let { x, y, w, h, dx, dy, dw, dh } = imageFit(naturalWidth, naturalHeight, portraitSize, portraitSize)
            ctx.translate((canvasWidth - portraitSize) / 2, portraitY)
            ctx.beginPath()
            ctx.arc(portraitSize / 2, portraitSize / 2, portraitSize / 2, 0, 2 * Math.PI)
            ctx.lineWidth = 1
            ctx.strokeStyle = portraitBorderColor
            ctx.stroke()
            ctx.clip()
            ctx.drawImage(portraitImg, x, y, w, h, dx, dy, dw, dh)
            ctx.restore()

            drawNickname()
          }
        }
        // 昵称
        function drawNickname () {
          let {
            nicknameY,
            nicknameFont,
            nicknameWidth,
            nicknameColor
          } = drawCertificate.data.nicknameData
          ctx.save()
          ctx.font = nicknameFont
          ctx.fillStyle = nicknameColor
          ctx.textBaseline = 'top'
          let nicknameTextWidth = ctx.measureText(nicknameText).width > nicknameWidth ? nicknameWidth : ctx.measureText(nicknameText).width
          ctx.wrapText(nicknameText, (canvasWidth - nicknameTextWidth) / 2, nicknameY, nicknameWidth, 30, 1)
          ctx.restore()

          drawCurriculum()
        }

        // 课程
        function drawCurriculum () {
          let {
            curriculumY,
            curriculumColor,
            curriculumFont,
            curriculumWidth
          } = drawCertificate.data.curriculumData
          ctx.save()
          ctx.font = curriculumFont
          ctx.fillStyle = curriculumColor
          ctx.textBaseline = 'top'
          let splicing = `恭喜你完成了润阳老师${curriculumText}课程`
          let curriculumTextWidth = ctx.measureText(splicing).width > curriculumWidth ? curriculumWidth : ctx.measureText(splicing).width
          ctx.wrapText(splicing, (canvasWidth - curriculumTextWidth) / 2, curriculumY, curriculumWidth, 30, 1)
          ctx.restore()

          drawTask()
        }

        // 完成任务项
        function drawTask () {
          let {
            taskX,
            taskY,
            taskColor,
            taskTextFont,
            taskNumberFont
          } = drawCertificate.data.taskData

          ctx.fillStyle = taskColor
          ctx.textBaseline = 'middle'

          let completeText, task

          // 完成
          ctx.save()
          ctx.font = taskTextFont
          completeText = ctx.measureText('完成').width + taskX
          ctx.fillText('完成', taskX, taskY)
          ctx.restore()

          ctx.save()
          ctx.font = taskNumberFont
          task = ctx.measureText(taskNumber + '项').width + completeText
          ctx.fillText(taskNumber + '项', completeText + 10, taskY)
          ctx.restore()

          ctx.save()
          ctx.font = taskTextFont
          ctx.fillText('任务', task + 20, taskY)
          ctx.restore()

          drawDurationText()
        }

        // 学习课程、完成打卡、参与考试
        function drawDurationText () {
          let {
            durationTextColor,
            durationTextFont,
            durationTextY,
            dailyAttendanceX,
            learningX,
            numberExaminationsX
          } = drawCertificate.data.durationData

          ctx.font = durationTextFont
          ctx.fillStyle = durationTextColor
          ctx.textBaseline = 'top'

          // 学习课程
          ctx.save()
          ctx.fillText('学习课程', learningX, durationTextY)
          ctx.restore()

          // 参与考试
          ctx.save()
          ctx.fillText('参与考试', numberExaminationsX, durationTextY)
          ctx.restore()

          // 完成打卡
          ctx.save()
          ctx.fillText('集福人数', dailyAttendanceX, durationTextY)
          ctx.restore()

          drawDurationNumber()
        }

        function drawDurationNumber () {
          let {
            durationNumberY,
            durationNumberFont,
            durationNumberColor,
            dailyAttendanceX,
            learningX,
            numberExaminationsX
          } = drawCertificate.data.durationData

          ctx.font = durationNumberFont
          ctx.fillStyle = durationNumberColor
          ctx.textBaseline = 'top'
          ctx.textAlign = 'center'

          // 学习课程
          ctx.save()
          let learningText = Number(ctx.measureText(learningCurriculum).width.toFixed(2))
          let learningCurriculumLength = learningCurriculum.toString().length
          let learningTextX = learningX + (learningText / learningCurriculumLength) + 12
          ctx.fillText(learningCurriculum, learningTextX, durationNumberY)
          ctx.restore()

          // 参与考试
          ctx.save()
          let numberExaminationsText = Number(ctx.measureText(numberExaminations).width.toFixed(2))
          let numberExaminationsLength = numberExaminations.toString().length
          let numberExaminationsTextX = numberExaminationsX + (numberExaminationsText / numberExaminationsLength) + 12
          ctx.fillText(numberExaminations, numberExaminationsTextX, durationNumberY)
          ctx.restore()

          // 完成打卡
          ctx.save()
          let dailyAttendanceText = Number(ctx.measureText(dailyAttendance).width.toFixed(2))
          let dailyAttendanceLength = dailyAttendance.toString().length
          let dailyAttendanceTextX = dailyAttendanceX + (dailyAttendanceText / dailyAttendanceLength) + 12
          ctx.fillText(dailyAttendance, dailyAttendanceTextX, durationNumberY)
          ctx.restore()

          drawSentence()
        }

        // 励志语
        function drawSentence () {
          let {
            sentenceY,
            sentenceColor,
            sentenceFont
          } = drawCertificate.data.sentenceData
          ctx.save()
          ctx.font = sentenceFont
          ctx.fillStyle = sentenceColor
          ctx.textBaseline = 'top'
          ctx.textAlign = 'left'
          let sentenceTextWidth = ctx.measureText(sentenceText).width
          ctx.fillText(sentenceText, (canvasWidth - sentenceTextWidth) / 2, sentenceY)
          ctx.restore()

          drawCode()
        }

        // 二维码
        function drawCode () {
          let {
            codeY,
            codeSize
          } = drawCertificate.data.codeData

          ctx.save()
          ctx.drawImage(codeSrc, (canvasWidth - codeSize) / 2, codeY, codeSize, codeSize)
          ctx.restore()

          drawCodeName()
        }

        // 润阳365蜕变营
        function drawCodeName () {
          let {
            codeNameY,
            codeNameColor,
            codeNameFont
          } = drawCertificate.data.codeNameData

          ctx.save()
          ctx.font = codeNameFont
          ctx.fillStyle = codeNameColor
          ctx.textBaseline = 'top'
          ctx.textAlign = 'left'
          let codeNameText = `润阳${curriculumText}`
          let codeNameWidth = ctx.measureText(codeNameText).width
          ctx.fillText(codeNameText, (canvasWidth - codeNameWidth) / 2, codeNameY)
          ctx.restore()

          drawTechnicalSupport()
        }

        // 技术支持
        function drawTechnicalSupport () {
          let {
            technicalSupportY,
            technicalSupportColor,
            technicalSupportFont
          } = drawCertificate.data.technicalSupportData

          ctx.save()
          ctx.font = technicalSupportFont
          ctx.fillStyle = technicalSupportColor
          ctx.textBaseline = 'top'
          ctx.textAlign = 'left'
          let technicalSupportTextWidth = ctx.measureText(technicalSupportText).width
          ctx.fillText(technicalSupportText, (canvasWidth - technicalSupportTextWidth) / 2, technicalSupportY)
          ctx.restore()

          generate()
        }

        function generate () {
          let url = canvas.toDataURL()
          $_.Indicator.close()
          drawCertificate.callback(url)
          clearTimeout(drawCertificate.data.timer)
        }

        drawBack()
      }
    }
  }
  export default {
    name: 'GraduationCertificatePopup',
    data () {
      return {
        drawCertificateInfo: {
          portraitSrc: 'http://hskimgtest.smsqmx.com/upload/head_img/2020_03_07/34173cb38f07f89ddbebc2ac9128303f.png', // 头像
          nicknameText: '复杂人生', // 昵称
          curriculumText: '365蜕变营', // 课程名称
          taskNumber: 9, // 完成任务多少项
          learningCurriculum: 2, // 学习课程
          dailyAttendance: 2222, // 连续打卡天数
          numberExaminations: 22, // 考试次数
          codeSrc: 'http://hskimgtest.smsqmx.com/upload/head_img/2020_03_07/34173cb38f07f89ddbebc2ac9128303f.png', // 二维码
          sentenceText: '每天成长一小步，人生成长一大步', // 励志语
          technicalSupportText: '链脉云提供技术支持' // 技术支持
        },
        imgSrc: ''
      }
    },
    mounted () {
      let that = this
      drawCertificate.init(this.drawCertificateInfo, function (res) {
        that.imgSrc = res
      })
    }
  }
</script>

<style scoped lang="less">
  .certificate__bounced {
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
      background-color: rgba(0, 0, 0, .5);
    }

    .content {
      position: absolute;
      top: 0;
      left: 50%;
      transform: translateX(-50%);
    }

    .close {
      margin: .3rem auto;
      width: .58rem;
      height: .58rem;
      background: url("~@icon/community/close-circular.png") no-repeat center;
      background-size: contain;

      &:active {
        transform: scale(1.06);
      }
    }

    .text {
      color: #fff;
      font-size: .28rem;
      text-align: center;
    }
  }

  .img {
    width: 5.08rem;
    height: 8.68rem;
    border-radius: .08rem;
    margin-top: .1rem;
  }
</style>
