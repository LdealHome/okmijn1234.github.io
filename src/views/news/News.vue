<template lang="pug">
  div.whole
    div.item(@click="newsClick(1)") 服务通知
      span.news-num 18
    div.item(@click="newsClick(2)") 系统消息
    div.item(@click="newsClick(3)") 开播提醒
    div.item(@click="newsClick(4)") 邀约消息
    div.save-btn 保存
    MorePupup
</template>

<script>
  import MorePupup from '../../components/MorePupup'
  export default {
    name: 'News',
    components: {
      MorePupup
    },
    methods: {
      newsClick (type = 1) {
        this.$router.push({ name: 'news-details', params: { type } })
      }
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
    line-height: 1.1rem;
    padding-left: .54rem;
    font-size: .34rem;
    color: #333;
    margin-bottom: 1px;
    background: #fff url('~@icon/mine/right-icon.png') no-repeat right .54rem center;
    background-size: .1rem;
    display: flex;
    align-items: center;
    padding-right: .93rem;
    justify-content: space-between;

    &:active {
      opacity: .8;
    }
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

  .news-num {
    min-width: .64rem;
    height: .64rem;
    line-height: .64rem;
    text-align: center;
    border-radius: .32rem;
    background: #f35151;
    font-size: .4rem;
    transform: scale(.5);
    transform-origin: 100% 50%;
    color: #fff;
    padding: 0 .12rem;
    display: block;
  }
</style>
