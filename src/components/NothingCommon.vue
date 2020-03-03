<template lang="pug">
  div.nothing(:class="backClass")
    p.tips {{config.tips}}
    button.entry(v-if="config.entry" @click="$emit('click', config)") {{config.entry}}
</template>

<script>
  export default {
    name: 'NothingCommon',
    props: {
      config: {
        type: Object,
        required: true,
        default () {
          return {}
        }
      },
      isVideoList: {
        type: Boolean,
        required: false,
        default: false
      }
    },
    computed: {
      // module () {
      //   return this.$route.path.split('/')[1] || ''
      // },
      backClass () {
        return { 'video-back': this.isVideoList }
      }
    }
  }
</script>

<style scoped lang="less">
  .nothing {
    background: url("~@images/nothing.png") no-repeat center top;
    background-size: auto 3.7rem;
    text-align: center;
    padding-top: 4rem;
  }

  .video-back {
    background: url("~@images/default-page.png") no-repeat center top .78rem;
    background-size: 4.55rem;
  }

  .tips {
    padding: .5rem;
    background-size: .28rem;
    color: @fontColorLighten;
  }

  .entry {
    height: .56rem;
    line-height: .56rem;
    color: @themeColor;
    border-radius: .28rem;
    border: 1px solid @themeColor;
    background: #fff;
    font-size: .26rem;
    padding: 0 .6rem;

    &:active {
      background: #ececec;
    }
  }
</style>
