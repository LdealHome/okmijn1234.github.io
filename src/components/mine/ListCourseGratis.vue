<template lang="pug">
  ul
    li.item(v-for="item in list" :key="item.id")
      img.item-cover(item.cover)
      div.item-right
        p.item-name {{item.title}}
        p.item-time {{item.time}}
</template>

<script>
  export default {
    name: 'ListCourseGratis',
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
    padding: .24rem .24rem .48rem .3rem;
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
    flex: 1;
    position: relative;
  }

  .item-name {
    font-size: .32rem;
    color: #1b1b1b;
    font-weight: bold;
    line-height: .4rem;
    .ellipsisLn(2);
  }

  .item-time {
    width: 10rem;
    position: absolute;
    bottom: .04rem;
    left: 0;
    font-size: .4rem;
    color: #ccc;
    transform: scale(.5);
    transform-origin: 0 100%;
  }
</style>
