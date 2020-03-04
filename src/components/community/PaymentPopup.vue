<!--微信支付-->
<template lang="pug">
  div.payment__bounced
    div.mask(@click="$emit('close')")
    div.content
      p.title 立即抢购
      p.text 选择支付方式
      div.list
        div.item.weChat
          span.item-text 微信支付
          label.label
            input.radio(type="radio" checked)
        div.item.card(@click="$emit('jumpCamiloPayment')")
          span.item-text 卡密支付
          span.icon
      button.determine(type="button" @click="$emit('determine')") 确认支付￥19.9
</template>

<script>
  export default {
    name: 'PaymentPopup'
  }
</script>

<style scoped lang="less">
  .payment__bounced {
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
      padding: .35rem 0;
      text-align: center;
    }

    .text {
      color: #999;
      font-size: .28rem;
      padding-left: .46rem;
      margin-bottom: .1rem;
    }

    .list {
      padding: 0 .36rem 0 .46rem;
    }

    .item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 1.2rem;
      padding-left: .74rem;
      background-position: left center;
      background-repeat: no-repeat;
      background-size: .52rem;

      &.weChat {
        position: relative;
        background-image: url("~@icon/community/weChat-pay.png");

        &::after {
          .setBottomLine(#f9f9f8);
        }

        .item-text {
          color: #333;
        }
      }

      &.card {
        background-image: url("~@icon/community/card.png");

        .item-text {
          color: #ff6e06;
        }
      }

      &-text {
        font-size: .28rem;
      }
    }

    .label {
      width: .36rem;
      height: .36rem;
    }

    .radio {
      width: .36rem;
      height: .36rem;

      &:checked {
        background: url("~@icon/community/radio-checked.png") no-repeat center;
        background-size: contain;
      }
    }

    .icon {
      width: .12rem;
      height: .22rem;
      background: url("~@icon/community/arrow-right.png") no-repeat center;
      background-size: contain;
    }

    .determine {
      display: block;
      color: #fff;
      font-size: .28rem;
      font-weight: bold;
      width: 6.8rem;
      height: .76rem;
      margin: .2rem auto;
      border-radius: 1rem;
      background: linear-gradient(to right, #ff7606, #fe4006);

      &:active {
        background: linear-gradient(to left, #ff7606, #fe4006);
      }
    }
  }

</style>
