<template lang="pug">
  div.top-view
    div.video-back(
      v-show="isOpenVideo"
      :class="videoBackClass"
      @click="clickVideo"
    )
      VideoPlayer(
        v-if="isShowVideo"
        :options="options"
        @play="videoPlayEvent"
        @pause="videoPauseEvent"
        @ended="videoEnded"
        @canplay="videoCanplay"
      )
      img.video-poster(:src="options.poster" v-show="notBroadcast")
      div.count-down-view(v-show="notBroadcast")
        div.count-down-info
          p.count-down 倒计时: 
            span.count-down-num {{data.countDownList[0]}}
            span.count-down-unit 天
            span.count-down-num {{data.countDownList[1]}}
            span.count-down-unit 时
            span.count-down-num {{data.countDownList[2]}}
            span.count-down-unit 分
            span.count-down-num {{data.countDownList[3]}}
            span.count-down-unit 秒
          div.remind-btn(@click="$emit('clickSetRemind')" v-show="!isGuest") {{remindBtnText}}
      div.follow-view(v-if="!data.isFollow" @click="$emit('followBtnClick')")
        img.follow-avatar(:src="data.followBtnAvatar")
        p.follow-text 关注润阳老师)
      div.occlusion-layer(v-show="!self")
    div.live-broadcast-info
      p.state.not-started(:class="liveBroadcastClass") {{liveBroadcastState}}
        span.interval |
        span {{data.personTime}}人次
      img.retract-btn(
        src="@icon/course/retract-icon.png"
        @click="changeOpenState"
        :class="retractClass"
      )
</template>

<script>
  import getDeviceSystem from '../../utils/get-device-system'
  import VideoPlayer from '../VideoPlayer'
  export default {
    name: 'HorizontalVideo',
    components: {
      VideoPlayer
    },
    props: {
      data: {
        type: Object,
        required: true,
        default () {
          return {
            video: {
              src: '',
              poster: ''
            },
            state: 0, // 直播状态 0: 未开始 1:直播中 2:回放
            personTime: 0, // 人次
            time: 0, // 如果state为0，则是开始倒计时，1为直播播放的位置。单位秒，
            isSetReminders: true, // 是否设置开播提醒
            countDownList: [], // 开播倒计时数组 [天、时、分、秒]
            isFollow: false
          }
        }
      }
    },
    data () {
      return {
        isShowVideo: false,
        options: {
          controls: true,
          poster: '',
          src: '',
          isLive: true
        },
        isOpenVideo: true, // 是否显示视频
        isEnded: false,
        videoCurrent: 0, // 视频播放的进度
        studyTime: 0, // 学习时长
        videoDuration: 0, // 视频总时长
        state: 0,
        videoHeight: 'auto',
        stopInfo: {
          timer: null,
          surplusTime: 0
        },
        currentTime: 0,
        isCanplay: false,
        isShowVideoControl: false,
        showControlTimer: null,
        doubleClick: {
          timer: null
        },
        self: null
      }
    },
    watch: {
      courseState (val) {
        this.options.poster = this.data.video.poster
        this.options.src = this.data.video.src
        switch (val) {
        case 1:
          // 储存进入页面时，直播开始后等待的开始时间
          // 用于计算点击开始播放后，调整视频的播放位置
          sessionStorage.setItem('waitTime', new Date().getTime())
          this.videoCurrent = this.data.time
          this.isShowVideo = true
          break
        case 2:
          this.options.isLive = false
          this.isShowVideo = true
          break
        default:
          break
        }
        this.state = val
      }
    },
    created () {
      window.addEventListener('offline', this.eventHandle)
      window.addEventListener('online', this.eventHandle)
    },
    beforeDestroy () {
      if (this.stopInfo.timer) {
        clearInterval(this.stopInfo.timer)
      }
      window.removeEventListener('offline', this.eventHandle)
      window.removeEventListener('online', this.eventHandle)
    },
    computed: {
      liveBroadcastState () {
        let list = ['未开始', '直播中', '直播回放']
        return this.isShowEnded ? '直播结束' : list[this.state]
      },
      liveBroadcastClass () {
        return {
          'not-started': this.notBroadcast,
          'started': !this.notBroadcast
        }
      },
      retractClass () {
        return { 'retract-open': this.isOpenVideo }
      },
      notBroadcast () {
        return this.courseState === 0
      },
      remindBtnText () {
        return this.data.isSetReminders ? '已设置开播提醒' : '开播提醒我'
      },
      courseState () {
        return this.data.state
      },
      videoBackClass () {
        return { 'ended-video': this.isShowEnded }
      },
      isShowEnded () {
        return this.isEnded && this.state === 1
      },
      // 访客
      isGuest () {
        return this.$store.state.guest
      }
    },
    methods: {
      eventHandle (event) {
        // 如果在直播状态时，断网后暂停播放视频
        if (event.type === 'offline' && this.state === 1 && !this.isEnded) {
          this.self.pause()
        }
      },
      videoEnded () {
        // 直播中，课程结束后更新状态
        if (this.state === 1) {
          this.isEnded = true
          this.isShowVideo = false
        }
        if (this.isGuest) return
        let time = new Date()
        let videoPlayTime = sessionStorage.getItem('videoPlayTime')
        if (videoPlayTime) {
          sessionStorage.removeItem('videoPlayTime')
          this.studyTime += Math.floor((time - videoPlayTime) / 1000)
        }
        if (this.data.isStatistics) {
          this.$_.store.dispatch('postStudyStatistics', {
            course_single_id: this.data.id,
            study_duration: this.studyTime,
            study_close_time: Math.floor(time.getTime() / 1000),
            play_length: this.videoDuration,
            play_over: 1,
            key: this.data.key
          })
        }
      },
      /**
       * 直播中进入页面后或暂停直播后监听直播是否结束
       * @param timer {Number} 距离直播结束剩余的时长 s
       */
      startLiveEndMonitor (time) {
        if (this.stopInfo.timer) {
          clearInterval(this.stopInfo.timer)
        }
        this.stopInfo.surplusTime = time
        this.stopInfo.timer = setInterval(() => {
          if (--this.stopInfo.surplusTime <= 0) {
            clearInterval(this.stopInfo.timer)
            this.stopInfo.timer = null
            this.videoEnded()
          }
        }, 1000)
      },
      /**
       * 视频播放事件
       */
      videoPlayEvent () {
        let time = new Date().getTime()
        if (this.state === 1) {
          // 如果是直播时，更新当前直播对应的位置
          // 暂停期间的时长 + 暂停时播放的位置
          let startTime = sessionStorage.getItem('waitTime') || time
          this.currentTime = Math.floor((time - startTime) / 1000) + this.videoCurrent
          if (getDeviceSystem() === 'ios') {
            this.isCanplay && this.self.currentTime(this.currentTime)
          } else {
            this.self.currentTime(this.currentTime)
          }
          // 关闭直播结束判断定时器
          if (this.stopInfo.timer) {
            clearInterval(this.stopInfo.timer)
            this.stopInfo.timer = null
          }
        }
        sessionStorage.removeItem('waitTime')
        // 游客不做访问时长统计
        if (this.isGuest) return
        sessionStorage.setItem('videoPlayTime', time)
        this.setStudyStatistics()
      },
      /**
       * 视频暂停监听
       */
      videoPauseEvent () {
        let time = new Date().getTime()
        if (this.state === 1) {
          // 储存暂停时的时间
          // 用于计算点击开始播放后，调整视频的播放位置
          sessionStorage.setItem('waitTime', time)
          // 处理直播暂停期间，如果直播结束更新状态
          this.startLiveEndMonitor(Math.floor(this.videoDuration - this.self.currentTime()))
        }
        // 获取暂停时视频播放的进度
        this.videoCurrent = this.self.currentTime()
        let videoPlayTime = sessionStorage.getItem('videoPlayTime')
        if (videoPlayTime) {
          sessionStorage.removeItem('videoPlayTime')
          this.studyTime += Math.floor((time - videoPlayTime) / 1000)
          this.setStudyStatistics()
        }
      },
      /**
       * 视频加载完成事件
       * 获取视频总时长
       * 开启定时器，判断直播是否结束
       */
      videoCanplay (self, duration) {
        this.self = self
        if (this.isEnded) {
          this.isEnded = false
          this.self.play()
        }
        this.videoDuration = duration
        if (this.courseState === 1) {
          this.startLiveEndMonitor(duration - this.videoCurrent)
          if (getDeviceSystem() === 'ios') {
            this.isCanplay = true
            this.self.currentTime(this.currentTime)
          }
        }
      },
      /**
       * 缓存课程访问统计
       */
      setStudyStatistics () {
        if (!this.data.isStatistics || !this.self) return
        let time = new Date().getTime()
        localStorage.setItem('studyStatistics', JSON.stringify({
          course_single_id: this.data.id,
          study_duration: this.studyTime,
          study_close_time: Math.floor(time / 1000),
          play_length: this.self.currentTime(),
          play_over: 2,
          key: this.data.key
        }))
      },
      /**
       * 打开、收起视频
       */
      changeOpenState () {
        this.isOpenVideo = !this.isOpenVideo
      },
      clickVideo () {
        if (this.isEnded) {
          // 更新直播结束状态
          this.state = 2
          this.options.isLive = false
          this.isShowVideo = true
        }
      }
    }
  }
</script>

<style scoped lang="less">
  .occlusion-layer {
    width: 100%;
    height: 4.7rem;
    position: absolute;
    z-index: 10;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
  }

  .top-view {
    z-index: 1; // 这里加层级是解决，直播状态栏底部边框样式，会被滚动的内容挡住
  }

  .video-back {
    margin: .3rem .3rem 0;
    border-radius: .12rem;
    overflow: hidden;
    background: #000;
    position: relative;
  }

  .video-poster {
    width: 100%;
    height: 4.7rem;
  }

  .ended-video {
    height: 4.7rem;
    background: #000 url('~@icon/course/play-btn.png') no-repeat center center;
    background-size: .94rem .94rem;

    &::after {
      width: 100%;
      height: 100%;
      position: absolute;
      z-index: 1;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      content: '直播已结束，点击播放按钮可看回放';
      font-size: .26rem;
      color: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      padding-top: .73rem;
    }
  }

  .video {
    width: 100%;
    height: 100%;
    display: block;
  }

  .play-btn {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    margin: auto;
    width: .94rem;
    height: .94rem;
    padding: .3rem;
    box-sizing: content-box;
    z-index: 2;
  }

  .follow-view {
    position: absolute;
    right: 0;
    top: 0;
    background: #f9d400;
    height: .48rem;
    display: flex;
    align-items: center;
  }

  .follow-avatar {
    width: .48rem;
    height: .48rem;
    border-radius: 50%;
    border: 1px solid #fff;
    margin-left: -.24rem;
  }

  .follow-text {
    font-size: .24rem;
    color: #333;
    margin-left: .1rem;
    padding-right: .16rem;
  }

  .count-down-view {
    width: 100%;
    height: 1.15rem;
    background: linear-gradient(0deg, rgba(4, 2, 14, 1) 0%, rgba(4, 2, 14, 0) 100%);
    position: absolute;
    bottom: 0;
    display: flex;
    align-items: flex-end;
    padding: 0 .28rem .14rem;
  }

  .count-down-info {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .count-down {
    font-size: .28rem;
    color: #fff;
  }

  .count-down-num {
    font-size: .3rem;
    font-weight: bold;
  }

  .count-down-unit {
    font-size: .24rem;
  }

  .remind-btn {
    height: .4rem;
    line-height: .4rem;
    font-size: .28rem;
    color: #fff;
    border-radius: .2rem;
    background: #ff4c49;
    box-shadow: 0 0 .1rem 0 rgba(243, 108, 106, 1);
    padding: 0 .2rem;

    &:active {
      background: darken(#ff4c49, 5%);
    }
  }

  .live-broadcast-info {
    height: .78rem;
    background: #fff;
    display: flex;
    align-items: center;
    justify-content: space-between;
    box-shadow: 0 1px 1px 0 rgba(205, 188, 188, .5);
  }

  .video-control {
    width: 100%;
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: .46rem;
    background: rgba(0, 0, 0, .2);
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .video-state {
    width: .12rem;
    height: .18rem;
    padding: .17rem .3rem .17rem .22rem;
    box-sizing: content-box;

    &:active {
      opacity: .8;
    }
  }

  .full-screen {
    width: .26rem;
    height: .26rem;
    padding: .1rem .22rem .1rem .3rem;
    box-sizing: content-box;

    &:active {
      opacity: .8;
    }
  }

  .state {
    margin-left: .32rem;
    padding-left: .26rem;
    font-size: .24rem;
    color: #5b5b5b;
    position: relative;
  }

  .interval {
    color: #9f9b9b;
    margin: 0 .12rem;
  }

  .not-started {
    &::before {
      width: .12rem;
      height: .12rem;
      background: #c3c3c3;
      border-radius: 50%;
      position: absolute;
      content: '';
      top: 0;
      bottom: 0;
      left: 0;
      margin: auto 0;
    }
  }

  .started {
    &::before {
      width: .12rem;
      height: .12rem;
      background: #ff4c49;
      border-radius: 50%;
      position: absolute;
      content: '';
      top: 0;
      bottom: 0;
      left: 0;
      margin: auto 0;
    }
  }

  .retract-btn {
    width: .46rem;
    height: .46rem;
    margin-right: .2rem;
    padding: .1rem;
    box-sizing: content-box;
  }

  .retract-open {
    transform: rotate(180deg);
  }

  .hide-video-controls::-webkit-media-controls-enclosure {
    display: none !important;
  }
</style>
