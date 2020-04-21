<template lang="pug">
  div.whole
    div.item(
      v-for="(item, index) in list"
      :key="index"
      @click="newsClick(index)"
    ) {{item.name}}
      span.news-num(v-if="item.news") {{item.news}}
    MorePupup
</template>

<script>
  import MorePupup from '../../components/MorePupup'
  import { getNewsType } from '../../services/news'
  export default {
    name: 'News',
    components: {
      MorePupup
    },
    data () {
      return {
        list: []
      }
    },
    created () {
      getNewsType().then(res => {
        if (res.data.code === 1 && res.data.data.list) {
          res.data.data.list.forEach(item => {
            this.list.push({
              name: item.name,
              type: item.type,
              news: item.message_num
            })
          })
        }
      })
    },
    methods: {
      newsClick (index) {
        this.$router.push({ name: 'news-details', params: { type: this.list[index].type } })
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
