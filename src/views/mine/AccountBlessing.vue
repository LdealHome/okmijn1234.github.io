<template lang="pug">
  div.whole
    div.inviter-back
      p.inviter-text 我的传爱天使:
      img.inviter-avatar
      p.inviter-name 测试
    div.list-title
      p.title-text 已邀约好友
      div.title-right
        input.key-input(placeholder="请输入昵称" v-ios-focus)
        div.search-btn 搜索
    ul
      li.item
        img.item-avatar
        div.item-info
          p.item-name 测试
          p.item-time 测试
        p.item-course 已免费获取423门课程
    div.bottom-btn
      div.total-number 共6个人
    TechnicalSupport
</template>

<script>
  import TechnicalSupport from '../../components/TechnicalSupport'
  export default {
    name: 'AccountBlessing',
    components: {
      TechnicalSupport
    }
  }
</script>

<style scoped lang="less">
  .whole {
    min-height: 100vh;
    overflow: hidden;
    background: #fff;
    padding-bottom: .9rem;
  }

  .inviter-back {
    height: 1.1rem;
    border-bottom: .14rem solid #f5f5f5;
    display: flex;
    align-items: center;
    padding: 0 1.2rem 0 .3rem;
  }

  .inviter-text {
    font-size: .32rem;
    color: #666;
    margin-right: .18rem;
  }

  .inviter-avatar {
    width: .56rem;
    height: .56rem;
    border-radius: 50%;
    margin-right: .2rem;
  }

  .inviter-name {
    flex: 1;
    font-size: .32rem;
    color: #333;
    .ellipsisLn(1);
  }

  .list-title {
    height: 1.1rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 .2rem 0 .3rem;
  }

  .title-text {
    font-size: .32rem;
    color: #333;
  }

  .title-right {
    display: flex;
    align-items: center;
  }

  .key-input {
    width: 3rem;
    height: .54rem;
    line-height: .54rem;
    border-radius: .08rem;
    border: 1px solid #f0f0f0;
    font-size: .28rem;
    color: #999;
  }

  .search-btn {
    padding: .1rem;
    margin-left: .08rem;
  }

  .item {
    height: 1.4rem;
    display: flex;
    align-items: center;
    padding: 0 .3rem 0 .32rem;
    border-bottom: 1px solid #f5f5f5;
  }

  .item-avatar {
    width: .54rem;
    height: .54rem;
    border-radius: 50%;
    margin-right: .24rem;
  }

  .item-info {
    width: 3rem;
  }

  .item-name {
    font-size: .32rem;
    color: #333;
    .ellipsisLn(1);
  }

  .item-time {
    font-size: .24rem;
    color: #999;
    margin-top: .1rem;
  }

  .item-course {
    flex: 1;
    text-align: right;
    font-size: .26rem;
    color: #999;
  }

  .bottom-btn {
    width: 100%;
    position: fixed;
    bottom: 0;
    z-index: 10;
    padding-bottom: env(safe-area-inset-bottom);
  }

  .total-number {
    height: .74rem;
    line-height: .74rem;
    text-align: center;
    background: #f9d400;
    font-size: .32rem;
    color: #333;
    font-weight: bold;
  }
</style>
