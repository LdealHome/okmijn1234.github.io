<!--联系客服、领取课程(群二维码)、关注公众号-->
<template lang="pug">
  div.customer__bounced
    div.mask
    div.content
      div.above
        p.back(:class="{course: customer.differentiate === 1, follow: customer.differentiate === 2}")
        p.title {{differentiate}}
        div.text(v-if="customer.differentiate === 0")
          p 请识别下方二维码
          p 立即联系客服购买课程
        div.text(v-if="customer.differentiate === 1" v-html="customer.content")
        div.text(v-if="customer.differentiate === 2")
          p 长按关注公众号获取社群动态
          p 365天见证自己的成长
        img.img(:src="customer.codeSrc")
        button.btn(type="button") 长按识别二维码
      p.close(@click="$emit('close')") 稍后再说
</template>

<script>
  export default {
    name: 'CustomerServicePopup',
    props: {
      customer: {
        type: Object,
        required: true,
        default () {
          return {
            differentiate: 0, // 0客服二维码，1领取课程
            content: '', // 说明
            codeSrc: '' // 二维码
          }
        }
      }
    },
    computed: {
      differentiate () {
        return this.customer.differentiate === 0 ? '一对一金牌服务' : this.customer.differentiate === 1 ? '领取课程' : '关注公众号'
      }
    }
  }
</script>

<style scoped lang="less">
  .customer__bounced {
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
      width: 5.8rem;
    }

    .above {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      width: 5.8rem;
      border-radius: .12rem;
      background-color: #fff;
      padding-bottom: 1.7rem;
      z-index: 1;

      &::before {
        position: absolute;
        top: -.32rem;
        left: .1rem;
        right: .1rem;
        content: '';
        width: 5.6rem;
        height: .32rem;
        background: url("~@images/community/customer-top.png") no-repeat center;
        background-size: contain;
      }

      &::after {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        content: '';
        width: 100%;
        height: 2.18rem;
        background: url("~@images/community/customer-bottom.png") no-repeat center;
        background-size: contain;
        z-index: -1;
      }
    }

    .back {
      width: 100%;
      height: 1.78rem;
      background: url("~@images/community/customer-img.png") no-repeat center;
      background-size: contain;

      &.course {
        background-image: url("~@images/community/customer-img-course.png");
      }

      &.follow {
        background-image: url("~@images/community/follow-img.png");
      }
    }

    .title {
      color: #333;
      font-size: .34rem;
      font-weight: bold;
      margin-bottom: .1rem;
    }

    .text {
      color: #666;
      font-size: .28rem;
      line-height: 1.4;
      text-align: center;
    }

    .img {
      width: 1.78rem;
      height: 1.78rem;
      border: .04rem solid #e9ebed;
      border-radius: .08rem;
      margin-top: .36rem;
    }

    .btn {
      position: absolute;
      bottom: .2rem;
      width: 3.1rem;
      height: .78rem;
      line-height: .78rem;
      color: #333;
      font-size: .32rem;
      background: url("~@images/community/customer-btn.png") no-repeat center;
      background-size: contain;
    }

    .close {
      color: #ccc;
      font-size: .28rem;
      text-align: center;
      margin-top: .44rem;
    }
  }
</style>
