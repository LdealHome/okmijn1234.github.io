<template lang="pug">
  div.video-player
    video.video-js.vjs-fluid.vjs-big-play-centered(
      :class="{'is-live': options.isLive}"
      ref="videoPlayer"
      playsinline="true"
      webkit-playsinline="true"
      x5-video-player-type="h5-page"
    )
      source(:src="computedOptions.src")
</template>
<script>
  import videojs from 'video.js/dist/video'
  import 'video.js/dist/video-js.css'
  export default {
    name: 'VideoPlayer',
    props: {
      options: {
        required: true,
        type: Object,
        default () {
          return {}
        }
      }
    },
    data () {
      return {
        player: null,
        defaultOptions: {
          autoplay: false,
          controls: true,
          height: '',
          loop: false,
          muted: false,
          poster: '',
          preload: 'metadata',
          src: '',
          controlBar: {
            pictureInPictureToggle: false,
            fullscreenToggle: true
          }
        },
        computedOptions: {}
      }
    },
    watch: {
      options: {
        immediate: true,
        deep: true,
        handler: function (newVal, oldVal) {
          Object.assign(this.computedOptions, this.defaultOptions, newVal)
        }
      }
    },
    mounted () {
      let self = this
      this.player = videojs(this.$refs.videoPlayer, this.computedOptions, function onPlayerReady () {
        this.on('play', function () {
          self.$emit('play', this)
        })
        this.on('playing', function () {
          self.$emit('playing', this)
        })
        this.on('pause', function () {
          self.$emit('pause', this)
        })
        this.on('ended', function () {
          self.$emit('ended', this)
        })
        this.on('seeking', function () {
          setTimeout(() => {
            this.handleTechSeeked_()
          }, 3000)
        })
        this.one('canplay', function () {
          self.$emit('canplay', this)
        })
        this.one('timeupdate', function () {
          // 在第一次触发timeupdate事件时，error报网络错误时。处理成直播结束
          // 解决部分手机在直播结束后，重新进入页面，视频播放错误，没有更新直播结束状态
          if (this.error_.code === 2) {
            this.errorDisplay.close()
            self.$emit('liveend')
          } else {
            self.$emit('timeupdate', this)
          }
        })
        this.on('error', function () {
          if (this.error_.code === 4) {
            this.errorDisplay.close()
            self.$emit('liveend')
          }
        })
      })
    },
    beforeDestroy () {
      if (this.player) {
        this.player.dispose()
      }
    }
  }
</script>

<style>
  .vjs-paused .vjs-big-play-button,
  .vjs-paused.vjs-has-started .vjs-big-play-button {
    display: block;
  }

  .video-js .vjs-big-play-button {
    font-size: 2.5em;
    line-height: 2.3em;
    height: 2.5em;
    width: 2.5em;
    border-radius: 2.5em;
    background-color: 'rgba(115,133,159,.5)';
    border-width: 0.15em;
    margin-top: -1.25em;
    margin-left: -1.75em;
  }

  /* 中间的播放箭头 */
  .vjs-big-play-button .vjs-icon-placeholder {
    font-size: 1.63em;
  }

  /* 加载圆圈 */
  .vjs-loading-spinner {
    font-size: 2.5em;
    width: 2em;
    height: 2em;
    border-radius: 1em;
    margin-top: -1em;
    margin-left: -1.5em;
  }

  .video-js.vjs-playing .vjs-tech {
    pointer-events: auto;
  }

  .video-js .vjs-current-time,
  .vjs-no-flex .vjs-current-time {
    display: block;
  }

  .is-live.video-js .vjs-progress-control,
  .is-live.video-js .vjs-fullscreen-control,
  .is-live.video-js .vjs-remaining-time {
    display: none;
  }

  .is-live.video-js .vjs-seek-to-live-control {
    display: block;
  }
  </style>
