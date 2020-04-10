<template lang="pug">
  ul
    li.special-item(v-for="(item, index) in list" :key="index")
      div.item-info 
        img.item-cover(:src="item.cover")
        div.item-right
          p.name {{item.title}}
          p.item-stage {{item.tips}}
      div.item-describe
        p.describe {{item.name}}
        div.study-btn 去学习
</template>

<script>
  export default {
    name: 'ListSpecial',
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
  .special-item {
    padding: 0 .3rem;
    border-bottom: 1px solid #f5f5f5;
    margin-bottom: .3rem;

    &:last-of-type {
      margin-bottom: 0;
    }
  }

  .item-info {
    display: flex;
    padding: .24rem .48rem .24rem 0;
    border-bottom: 1px solid #f5f5f5;
  }

  .item-cover {
    width: 1.9rem;
    height: 1.32rem;
    border-radius: .08rem;
  }

  .item-right {
    margin-left: .32rem;
    flex-direction: column;
    display: flex;
    justify-content: space-between;
  }

  .data-right {
    margin-left: .2rem;
    flex: 1;
  }

  .name {
    font-size: .32rem;
    line-height: .4rem;
    font-weight: bold;
    color: #1b1b1b;
    .ellipsisLn(2);

    word-break: break-all;
  }

  .item-stage {
    font-size: .24rem;
    font-weight: bold;
    color: #b8b7b7;
  }

  .item-describe {
    display: flex;
    height: 1rem;
    align-items: center;
    padding-left: .5rem;
    background: url('~@icon/mine/video-icon.png') no-repeat left center;
    background-size: .36rem;
  }

  .describe {
    font-size: .28rem;
    color: #b8b7b7;
    flex: 1;
    .ellipsisLn(1);

    word-break: break-all;
  }

  .study-btn {
    margin-left: .3rem;
    width: 1.1rem;
    height: .5rem;
    line-height: .5rem;
    font-size: .24rem;
    color: #fff;
    text-align: center;
    border-radius: .25rem;
    background: #fba627;

    &:active {
      background: darken(#fba627, 5%);
    }
  }
</style>
