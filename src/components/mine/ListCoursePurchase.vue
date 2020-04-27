<template lang="pug">
  ul
    li.item(v-for="item in list" :key="item.id" @click="$router.push({ name: 'column-details' })")
      div.item-info
        img.item-cover(:src="item.cover")
        div.item-right
          p.item-name {{item.title}}
          p.item-time {{item.time}}
      p.item-tips {{item.newest}}
</template>

<script>
  export default {
    name: 'ListCoursePurchase',
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
  .item {
    margin: .3rem .3rem 0;
    border-radius: .1rem;
    box-shadow: 1px 1px .06rem 0 rgba(240, 240, 240, .8);
    padding: .24rem .24rem .2rem .3rem;
  }

  .item-info {
    display: flex;
  }

  .item-cover {
    width: 1.9rem;
    height: 1.32rem;
    border-radius: .08rem;
    margin-right: .32rem;
  }

  .item-right {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    position: relative;
    flex: 1;
  }

  .item-name {
    font-size: .32rem;
    color: #1b1b1b;
    font-weight: bold;
    .ellipsisLn(2);

    line-height: .4rem;
  }

  .item-time {
    width: 10rem;
    position: absolute;
    bottom: .1rem;
    left: 0;
    font-size: .4rem;
    color: #ccc;
    transform: scale(.5);
    transform-origin: 0 100%;
  }

  .item-tips {
    margin-left: 2.22rem;
    font-size: .22rem;
    color: #999;
    margin-right: .2rem;
    .ellipsisLn(1);
  }
</style>
