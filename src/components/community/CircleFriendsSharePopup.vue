<!--分享到朋友圈-->
<template lang="pug">
  div.friend__bounced
    div.mask(@click="$emit('close')")
    div.content
      div.above 分享朋友圈、群或好友
      div.following
        p.title 推荐朋友圈文案
        p.text(v-html="circleFriendsInfo.content")
        div.btns
          button.btn(type="button" @click="$emit('change', circleFriendsInfo.id)") 换一换
          button.btn.copy(type="button" @click="$emit('copy', circleFriendsInfo.shareContent)") 复制文案
</template>

<script>
  export default {
    name: 'CircleFriendsSharePopup',
    props: {
      circleFriendsInfo: { // 文案
        type: Object,
        required: true,
        default () {
          return {
            id: -1,
            content: '', // 原生内容富文本
            shareContent: '' // 分享内容
          }
        }
      }
    }
  }
</script>

<style scoped lang="less">
  .friend__bounced {
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
      background-color: rgba(0, 0, 0, .5);
    }

    .content {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
    }

    .above {
      display: flex;
      align-items: flex-end;
      justify-content: center;
      color: #fff;
      font-size: .3rem;
      width: 100%;
      height: 2.12rem;
      padding-bottom: .4rem;
      background: url("~@images/community/share-guide.png") no-repeat 5.38rem center;
      background-size: contain;
    }

    .following {
      width: 5.6rem;
      padding-top: .3rem;
      border-radius: .12rem;
      background-color: #fff;
      margin: auto;
    }

    .title {
      color: #333;
      font-size: .34rem;
      padding: .26rem .5rem;
      font-weight: bold;
    }

    .text {
      padding: 0 .52rem;
      max-height: 4.3rem;
      overflow-y: scroll;
      -webkit-overflow-scrolling: touch;
      word-break: break-all;
    }

    .btns {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 1.1rem;
      padding: 0 .68rem;
      margin-top: .3rem;

      &::before {
        .setTopLine(#f5f5f5);
      }
    }

    .btn {
      width: 1.8rem;
      height: .64rem;
      color: #fff;
      font-size: .3rem;
      border-radius: 1rem;
      background: linear-gradient(to right, #ff7606, #fe4006);

      &:active {
        background: linear-gradient(to left, #ff7606, #fe4006);
      }
    }
  }
</style>
