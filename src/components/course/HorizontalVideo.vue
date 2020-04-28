<template lang="pug">
  div.top-view
    div.video-back(
      v-show="isOpenVideo"
      :class="{ 'ended-video': isEnded && !isPlayVideo }"
      :style="{ 'height': videoHeight }"
    )
      video.video(
        :src="data.video.src"
        :poster="data.video.poster"
        x5-playsinline
        playsinline
        webkit-playsinline
        id="video"
      )
      img.play-btn(src="@icon/course/play-btn.png" @click="playVideo" v-show="!isPlayVideo")
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
          div.remind-btn(@click="$emit('clickSetRemind')") {{remindBtnText}}
      div.follow-view(v-if="!data.isFollow" @click="$emit('followBtnClick')")
        img.follow-avatar(:src="data.followBtnAvatar")
        p.follow-text 关注润阳老师
      div.video-control(v-show="isPlayVideo")
        img.video-state(src="@icon/course/stop-icon.png" @click="stopVideo")
        img.full-screen(src="@icon/course/full-screen.png")
    div.live-broadcast-info
      p.state.not-started(:class="liveBroadcastClass") {{liveBroadcastState}}
        span.interval |
        span {{data.personTime}}人次
      img.retract-btn(
        src="@icon/course/retract-icon.png"
        @click="isOpenVideo = !isOpenVideo"
        :class="retractClass"
      )
</template>

<script>
  import {
    postSubmitViewingRecords
  } from '../../services/course'
  export default {
    name: 'HorizontalVideo',
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
    watch: {
      courseState (val) {
        if (val === 1) {
          // this.playVideo()
        }
      }
    },
    data () {
      return {
        isPlayVideo: false, // 是否在播放视频
        isOpenVideo: true, // 是否显示视频
        isEnded: false,
        videoHeight: 'auto'
      }
    },
    computed: {
      liveBroadcastState () {
        let list = ['未开始', '直播中', '直播回放']
        return list[this.courseState]
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
      }
    },
    mounted () {
      let video = document.getElementById('video')
      video.addEventListener('ended', this.videoEnded, false)
      video.addEventListener('loadedmetadata', this.videoLoadedmetadata, false)
    },
    methods: {
      videoEnded () {
        this.isPlayVideo = false
        this.isEnded = true
        postSubmitViewingRecords({
          course_single_id: this.data.id,
          play_length: 1,
          play_over: 1
        })
      },
      videoLoadedmetadata () {
        // 视频加载完后，修改video容器的高度
        // 解决视频加载后底部会多一截问题
        let video = document.getElementById('video')
        this.videoHeight = video.clientHeight + 'px'
      },
      playVideo () {
        if (this.notBroadcast) return
        let video = document.getElementById('video')
        // video.currentTime = this.data.time
        video.currentTime = 100
        video.play()
        this.isPlayVideo = true
        // video.webkitRequestFullScreen()
      },
      stopVideo () {
        let video = document.getElementById('video')
        video.pause()
        this.isPlayVideo = false
      }
    }
  }
</script>

<style scoped lang="less">
  .top-view {
    z-index: 1; // 这里加层级是解决，直播状态栏底部边框样式，会被滚动的内容挡住
  }

  .video-back {
    margin: .3rem .3rem 0;
    border-radius: .12rem;
    overflow: hidden;
    position: relative;
  }

  .ended-video {
    position: relative;

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
      background: rgba(0, 0, 0, .5);
    }
  }

  .video {
    width: 100%;
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

  video::-webkit-media-controls-enclosure {
    display: none !important;
  }
</style>
