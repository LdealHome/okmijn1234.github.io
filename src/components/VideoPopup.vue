<template lang="pug">
  div.video__bounced(v-show="isShow")
    div.mask
    div.content
      video.play(
      :src="video.videoUrl"
      :poster="video.imgSrc"
      controls
      x5-playsinline
      playsinline
      webkit-playsinline
      ref="video"
      )
      span.close(@click="$emit('videoClose')")
</template>

<script>
  export default {
    name: 'VideoPopup',
    props: {
      isShow: {
        type: Boolean,
        required: true,
        default: false
      },
      video: {
        type: Object,
        required: true,
        default () {
          return {
            videoUrl: '',
            imgSrc: ''
          }
        }
      }
    },
    watch: {
      isShow (val) {
        // true 显示弹框 false 关闭弹框
        this.$root.$emit('toggleModal', Boolean(val))
        // 隐藏视频时停止播放
        if (val) {
          this.$refs.video.play()
        } else {
          this.$refs.video.pause()
        }
      }
    }
  }
</script>

<style scoped lang="less">
  .video {
    &__bounced {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      width: 100%;
      height: 100%;
      z-index: 30;

      .mask {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: rgba(0, 0, 0, .7);
      }

      .content {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 6.9rem;
        text-align: center;
      }
    }
  }

  .play {
    width: 6.9rem;
    height: 10rem;
    border-radius: .08rem;
  }

  .close {
    display: inline-block;
    margin-top: .64rem;
    width: .5rem;
    height: .5rem;
    background: url("~@assets/icon/close.png") no-repeat center;
    background-size: contain;
  }

</style>
