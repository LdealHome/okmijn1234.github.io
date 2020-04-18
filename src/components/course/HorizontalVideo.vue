<template lang="pug">
  div
    div.video-back(v-show="isOpenVideo")
      video.video(
        :src="data.video.src"
        :poster="data.video.poster"
        x5-playsinline
        playsinline
        webkit-playsinline
        id="video"
      )
      img.play-btn(src="@icon/course/play-btn.png" @click="playVideo" v-show="!isPlayVideo")
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
            time: 0 // 如果state为0，则是开始倒计时，1为直播播放的位置。单位秒，
          }
        }
      }
    },
    data () {
      return {
        isPlayVideo: false, // 是否在播放视频
        isOpenVideo: true // 是否显示视频
      }
    },
    computed: {
      liveBroadcastState () {
        let list = ['未开始', '直播中', '回放']
        return list[this.data.state]
      },
      liveBroadcastClass () {
        return {
          'not-started': this.data.state === 0,
          'started': this.data.state > 0
        }
      },
      retractClass () {
        return { 'retract-open': this.isOpenVideo }
      }
    },
    methods: {
      playVideo () {
        let video = document.getElementById('video')
        video.currentTime = this.data.time
        video.play()
        this.isPlayVideo = true
      }
    }
  }
</script>

<style scoped lang="less">
  .video-back {
    margin: .3rem .3rem 0;
    border-radius: .12rem;
    overflow: hidden;
    position: relative;
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
  }

  .live-broadcast-info {
    height: .78rem;
    background: #fff;
    display: flex;
    align-items: center;
    justify-content: space-between;
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
</style>
