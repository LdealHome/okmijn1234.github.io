<template lang="pug">
  ul
    li.curriculum-item(v-for="item in list" :key="item.id" @click="$emit('courseDetails', item.id)")
      div.curriculum-info
        div.item-cover
          img.item-img(:src="item.cover")
        div.item-right
          p.name {{item.name}}
          div.item-state
            div.live-broadcast(v-if="item.isLiveBroadcast") 直播中
            div.playback(v-else) 回放
            p.study-speed  {{+item.speed < 100 ? `学习${item.speed}%` : '已完成'}}
      div.total-progress
        div.speed-view(:style="{ 'width': `${item.speed}%` }")
</template>

<script>
  export default {
    name: 'ListSingle',
    props: {
      list: {
        type: Array,
        required: true,
        default () {
          return []
        }
      }
    }
  }
</script>

<style scoped lang="less">
  .curriculum-item {
    padding: .24rem .3rem;
    margin-bottom: .3rem;
    box-shadow: 1px 1px .6rem 0 rgba(240, 240, 240, .8);
    border-radius: .1rem;

    &:last-of-type {
      margin-bottom: 0;
    }
  }

  .curriculum-info {
    display: flex;
  }

  .item-cover {
    width: 1.9rem;
    height: 1.32rem;
    border-radius: .08rem;
    position: relative;
    overflow: hidden;

    &::after {
      content: '直播';
      position: absolute;
      bottom: 0;
      right: 0;
      font-size: .4rem;
      color: #fff;
      background: linear-gradient(0deg, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 0) 50%);
      padding: .08rem .1rem .08rem .16rem;
      transform: scale(.5);
      transform-origin: 100% 100%;
      border-radius: .16rem;
    }
  }

  .item-img {
    width: 100%;
    height: 100%;
  }

  .item-right {
    flex: 1;
    margin-left: .32rem;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  .name {
    font-size: .32rem;
    font-weight: bold;
    color: #1b1b1b;
    line-height: .4rem;
    .ellipsisLn(2);

    word-break: break-all;
  }

  .item-state {
    display: flex;
    justify-content: space-between;
    flex-direction: row-reverse;
    position: relative;
  }

  .live-broadcast {
    font-size: .4rem;
    position: absolute;
    color: #fba627;
    border: 1px solid #fba627;
    padding: .02rem .1rem;
    transform: scale(.5);
    transform-origin: 0 100%;
    left: 0;
    bottom: 0;
  }
  
  .playback {
    font-size: .4rem;
    position: absolute;
    color: #999;
    border: 1px solid #999;
    padding: .02rem .1rem;
    transform: scale(.5);
    transform-origin: 0 100%;
    left: 0;
    bottom: 0;
  }

  .study-speed {
    font-size: .22rem;
    color: #999;
  }

  .total-progress {
    margin-left: 2.22rem;
    height: .04rem;
    border-radius: .02rem;
    background: #f5f5f5;
    margin-top: .2rem;
    overflow: hidden;
  }

  .speed-view {
    height: 100%;
    background: #fba627;
  }
</style>
