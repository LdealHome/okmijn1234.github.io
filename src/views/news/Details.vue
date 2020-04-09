<template lang="pug">
  div.whole
    ul
      li.item(v-for="item in 10")
        p.title 开播提醒
        p.content 测啊是否
          span.link 老是
        p.time 10分钟
    MorePupup
</template>

<script>
  import MorePupup from '../../components/MorePupup'
  export default {
    name: 'Details',
    components: {
      MorePupup
    }
  }
</script>

<style scoped lang="less">
  .whole {
    min-height: 100vh;
    padding-bottom: .3rem;
  }

  .item {
    margin: .3rem .3rem 0;
    background: #fff;
    border-radius: .08rem;
    padding: .26rem .3rem;
  }

  .title {
    font-size: .34rem;
    color: #333;
    font-weight: bold;
  }

  .content {
    font-size: .28rem;
    line-height: .4rem;
    color: #999;
    margin-top: .12rem;
  }

  .link {
    color: #4eb9fd;
    position: relative;
    white-space: nowrap;

    &::after {
      position: absolute;
      content: '';
      height: 1px;
      bottom: -1px;
      background: #4eb9fd;
      left: 0;
      right: 0;
    }
  }

  .time {
    margin-top: .22rem;
    font-size: .24rem;
    color: #999;
  }
</style>
