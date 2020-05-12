<template lang="pug">
  div.video-player
    video.video-js.vjs-fluid.vjs-big-play-centered(
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
        this.on('pause', function () {
          self.$emit('pause', this)
        })
        this.on('end', function () {
          self.$emit('end', this)
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
</style>
