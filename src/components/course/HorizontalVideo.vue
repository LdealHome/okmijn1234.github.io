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
      div.count-down-view
        div.count-down-info
          p.count-down 倒计时
          div.remind-btn 开播提醒我
      div.follow-view
        img.follow-avatar(src="http://hskimgtest.smsqmx.com/upload/head_img/2020_03_07/a87ff679a2f3e71d9181a67b7542122c.png")
        p.follow-text 关注润阳老师
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
  }

  .count-down {
    font-size: .28rem;
    color: #fff;
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
