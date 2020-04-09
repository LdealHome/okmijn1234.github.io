<template lang="pug">
  div.whole
    div.type-back
      div.type-item(:class="typeItemClass(1)" @click="selectedType = 1") 已购课程
      div.type-item(:class="typeItemClass(2)" @click="selectedType = 2") 免费课程
    ul
      li.item
        div.item-info
          img.item-cover
          div.item-right
            p.item-name 测试昵称
            p.item-time 测试昵称
        p.item-tips 最近更新
</template>

<script>
  export default {
    name: 'AccountGrowth',
    data () {
      return {
        selectedType: 1
      }
    },
    computed: {
      typeItemClass (type) {
        return type => {
          return { 'type-active-item': this.selectedType === type }
        }
      }
    }
  }
</script>

<style scoped lang="less">
  .whole {
    min-height: 100vh;
    overflow: hidden;
    background: #fff;
  }

  .type-back {
    display: flex;
    justify-content: space-around;
    height: .88rem;
    align-items: center;
    padding-bottom: .1rem;
    box-shadow: 1px 1px 1px 0 rgba(238, 238, 237, 0.68);
  }

  .type-item {
    font-size: .32rem;
    color: #5f5f5f;
  }

  .type-active-item {
    color: #1b1b1b;
    font-weight: bold;
    position: relative;

    &::after {
      width: .26rem;
      height: .06rem;
      border-radius: .03rem;
      background: #1b1b1b;
      left: 0;
      right: 0;
      bottom: -.06rem;
      margin: 0 auto;
      content: '';
      position: absolute;
    }
  }

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
