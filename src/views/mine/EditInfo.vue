<template lang="pug">
  div.whole
    div.item.item-avatar
      span.text 头像
      img.avatar()
    div.item
      span.text 昵称
      input.item-input(placeholder="请输入昵称")
    div.item
      span.text 真实姓名
      input.item-input(placeholder="请输入真实姓名")
    div.item
      span.text 手机号
      input.item-input(placeholder="请输入手机号")
    div.item
      span.text 验证码
      div.verified-back
        input.verified-input(placeholder="请输入验证码")
        div.send-btn.send-btn-active 获取验证码
    div.save-btn 保存
    MorePupup
</template>

<script>
  import MorePupup from '../../components/MorePupup'
  export default {
    name: 'EditInfo',
    components: {
      MorePupup
    }
  }
</script>

<style scoped lang="less">
  .whole {
    min-height: 100vh;
    background: #eeeeed;
  }

  .item {
    height: 1.1rem;
    background-color: #fff;
    margin-bottom: 1px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 .54rem;
  }

  .item-avatar {
    background: #fff url('~@icon/mine/right-icon.png') no-repeat right .54rem center;
    background-size: .1rem;
  }

  .text {
    font-size: .34rem;
    color: #333;
  }

  .avatar {
    width: .7rem;
    height: .7rem;
    border-radius: .04rem;
    margin-right: .3rem;
  }

  .item-input {
    width: 4.1rem;
    font-size: .32rem;
    color: #999;
    text-align: right;
  }

  .verified-back {
    flex: 1;
    display: flex;
    justify-content: space-between;
    margin-left: .88rem;
  }

  .verified-input {
    width: 2.4rem;
    font-size: .32rem;
    color: #333;
  }

  .send-btn {
    width: 1.5rem;
    height: .44rem;
    line-height: .44rem;
    text-align: center;
    border-radius: .22rem;
    font-size: .24rem;
    color: #fffefe;
    background: #fba627;
  }

  .send-btn-active {
    background: #ccc;
    color: #fffefe;
  }

  .save-btn {
    width: 5.8rem;
    height: .78rem;
    line-height: .78rem;
    border-radius: .39rem;
    text-align: center;
    background: #f9d400;
    font-size: .3rem;
    color: #313131;
    position: fixed;
    bottom: .56rem;
    left: 0;
    right: 0;
    margin: 0 auto;
    box-shadow: 0 0 .1rem 0 rgba(249, 212, 0, 1);

    &:active {
      background: darken(#f9d400, 5%);
    }
  }
</style>
