<!--温馨提示还需邀约多少人-->
<template lang="pug">
  div.prompt__bounced
    div.mask
    div.content
      h4.content__title 温馨提示
      p.content__text 您还需邀请
        span.number {{number}}
        | 名新用户
      p.content__text 即可免费获取该视频
      div.content__btn
        button.btn.cancel(type="button" @click="$emit('close')") 取消
        button.btn.invite(type="button" @click="$emit('invite')") 立即邀请
</template>

<script>
  export default {
    name: 'WarmPromptPopup',
    props: {
      number: {
        type: Number,
        required: true,
        default: 0
      }
    }
  }
</script>

<style scoped lang="less">
  .prompt__bounced {
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
      width: 5.4rem;
      transform: translate(-50%, -50%);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      border-radius: .32rem;
      background-color: #fff;
      overflow: hidden;

      &__title {
        color: #090909;
        font-size: .34rem;
        height: 1.08rem;
        line-height: 1.08rem;
      }

      &__text {
        color: #545454;
        font-size: .3rem;
        line-height: 1.4;
      }

      &__btn {
        position: relative;
        display: flex;
        width: 100%;
        margin-top: .4rem;

        &::before {
          .setTopLine(#f0f0f0);
        }
      }
    }

    .number {
      color: #f85824;
      font-size: .4rem;
      font-weight: bold;
    }

    .btn {
      flex: 1;
      font-size: .3rem;
      height: .88rem;
      background-color: initial;

      &:active {
        background-color: darken(#fff, 5%);
      }
    }

    .cancel {
      color: #545454;
    }

    .invite {
      color: #f85824;
      font-weight: bold;
      border-left: 1px solid #f0f0f0;
    }
  }
</style>
