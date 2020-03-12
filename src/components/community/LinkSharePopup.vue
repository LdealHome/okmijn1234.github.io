<!--分享-->
<template lang="pug">
  div.link__bounced
    div.mask
    div.content
      p.close(@click="$emit('close')")
      div.details
        p.title 链接分享
        ul.details-list
          li.details-item(v-for="item in linkList")
            div(v-html="item.content")
            button.copy(type="button" @click="$emit('copy', item.share_content)") 一键复制
</template>

<script>
  export default {
    name: 'LinkSharePopup',
    props: {
      linkList: {
        type: Array,
        required: true,
        default () {
          return []
        }
      }
    }
  }
</script>

<style scoped lang="less">
  .link__bounced {
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
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, .7);
    }

    .content {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 6rem;
    }

    .close {
      position: absolute;
      top: -.96rem;
      right: 0;
      width: .96rem;
      height: .96rem;
      background: url("~@icon/community/close-white.png") no-repeat center;
      background-size: .48rem;

      &:active {
        transform: scale(1.06);
      }
    }

    .details {
      width: 6rem;
      border-radius: .12rem;
      overflow: hidden;

      &-list {
        max-height: 7rem;
        padding: 0 .35rem;
        background-color: #f8f8f8;
        overflow-y: scroll;
        -webkit-overflow-scrolling: touch;
        border-bottom-left-radius: .12rem;
        border-bottom-right-radius: .12rem;
      }

      &-item {
        padding: .38rem 0;
        border-bottom: 1px dashed #dbe3e3;
        word-break: break-all;

        &:last-child {
          border-bottom: none;
        }
      }
    }

    .title {
      color: #333;
      font-size: .36rem;
      height: .88rem;
      line-height: .88rem;
      text-align: center;
      background-color: #fff;
    }

    .copy {
      display: block;
      width: 4rem;
      height: .68rem;
      color: #fff;
      font-size: .32rem;
      border-radius: 1rem;
      margin: .38rem auto 0 auto;
      background: linear-gradient(to right, #ff7606, #fe4006);

      &:active {
        background: linear-gradient(to left, #ff7606, #fe4006);
      }
    }
  }
</style>
