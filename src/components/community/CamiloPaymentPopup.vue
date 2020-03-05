<!--卡密支付-->
<template lang="pug">
  div.camilo__bounced
    div.mask(@click="$emit('close')")
    div.content
      p.title 卡密支付
      label.label
        input.write(placeholder="请输入有效卡密" type="text" v-ios-focus v-model="camilo")
      ul.list
        li.list-item(v-for="item in promptList") {{item}}
      button.determine(type="button" @click="payClick") 立即支付
</template>

<script>
  export default {
    name: 'CamiloPaymentPopup',
    data () {
      return {
        camilo: '', // 卡密
        promptList: [
          '1、请尽快使用卡密支付社群课程。',
          '2、卡密输入立即支付后，即购买社群课程。',
          '3、卡密仅可支付1次，支付成功后卡密失效。'
        ]
      }
    },
    methods: {
      payClick () {
        if (!this.camilo) {
          this.$_.Toast('请输入卡密！')
          return
        }
        this.$emit('determine', this.camilo)
      }
    }
  }
</script>

<style scoped lang="less">
  .camilo__bounced {
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
      bottom: 0;
      left: 0;
      right: 0;
      border-top-left-radius: .2rem;
      border-top-right-radius: .2rem;
      background-color: #fff;
    }

    .title {
      color: #333;
      font-size: .36rem;
      height: 1.14rem;
      line-height: 1.14rem;
      text-align: center;
    }

    .label {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 6.8rem;
      height: .76rem;
      border: 1px solid #cdc3c4;
      border-radius: 1rem;
      padding: 0 .3rem;
      margin: auto;
      overflow: hidden;
    }

    .write {
      width: 100%;
      color: #333;
      font-size: .28rem;
      background-color: #fff;

      &::-webkit-input-placeholder {
        color: #ccc;
      }
    }

    .list {
      padding: 0 .35rem;
      margin: .4rem 0;

      &-item {
        color: #999;
        font-size: .26rem;
        margin-bottom: .3rem;
      }
    }

    .determine {
      display: block;
      width: 6.8rem;
      height: .76rem;
      color: #fff;
      font-size: .28rem;
      font-weight: bold;
      border-radius: 1rem;
      margin: .2rem auto;
      background: linear-gradient(to right, #ff7606, #fe4006);

      &:active {
        background: linear-gradient(to left, #ff7606, #fe4006);
      }
    }
  }
</style>
