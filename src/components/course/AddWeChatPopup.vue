<!--老师微信弹框-->
<template lang="pug">
  div.weChat__bounced
    div.mask
    div.content
      p.title 老师微信
      img.code(:src="addWeChatSrc")
      p.text 长按微信加润阳老师微信哦
      button.close(@click="$emit('close')") 关闭
</template>

<script>
  export default {
    name: 'AddWeChatPopup',
    props: {
      addWeChatSrc: {
        type: String,
        require: true,
        default: ''
      }
    }
  }
</script>

<style scoped lang="less">
  .weChat__bounced {
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
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 6rem;
      height: 5.7rem;
      border-radius: .2rem;
      background-color: #fff;
      overflow: hidden;
    }

    .title {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #333;
      font-size: .3rem;
      padding-top: .3rem;
      padding-bottom: .5rem;

      &::after,
      &::before {
        width: .3rem;
        height: .16rem;
        content: '';
        background: url("~@icon/course/weChat-back.png") no-repeat center;
        background-size: contain;
      }

      &::before {
        margin-right: .18rem;
      }

      &::after {
        margin-left: .18rem;
      }
    }

    .code {
      width: 2.32rem;
      height: 2.32rem;
    }

    .text {
      color: #333;
      font-size: .24rem;
      margin: .3rem 0 .5rem 0;
    }

    .close {
      height: .98rem;
      width: 100%;
      color: #707070;
      font-size: .3rem;
      font-weight: bold;
      border-top: 1px solid #f5f5f5;
      background-color: transparent;

      &:active {
        background-color: darken(#fff, 5%);
      }
    }
  }
</style>
