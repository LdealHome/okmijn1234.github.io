<template lang="pug">
  div.whole
    ul
      li.item(v-for="(item, index) in list" :key="item.id")
        p.title {{item.title}}
        p.content(v-html="item.content" @click="contentClick(index)")
        p.time {{item.time}}
    div(v-show="!list.length")
      div.empty-tips 你还没有获得任何消息
    infinite-loading(@infinite="loadMore")
      div(slot="spinner")
      div(slot="no-more")
      div(slot="no-results")
    MorePupup(
      @collectionClick="isShowCollect = true"
    )
    GuideCollection(:isShow="isShowCollect" @close="isShowCollect = false")
</template>

<script>
  import MorePupup from '../../components/MorePupup'
  import GuideCollection from '../../components/course/GuideCollection'
  import { getNewsList } from '../../services/news'
  export default {
    name: 'Details',
    components: {
      MorePupup,
      GuideCollection
    },
    data () {
      return {
        params: {
          limit: 20,
          page: 1
        },
        list: [],
        isShowCollect: false
      }
    },
    computed: {
      type () {
        return this.$route.params.type
      }
    },
    methods: {
      async loadMore (res) {
        const that = this
        let isLastPage = false
        await that.getList().then(list => {
          isLastPage = that.$_.isLastPage(that.params.limit, list)
        })
        if (isLastPage) {
          res.complete()
        } else {
          res.loaded()
          that.params.page++
        }
      },
      getList () {
        return getNewsList({ ...this.params, type: this.type }).then(res => {
          if (res.data.code === 1) {
            let list = res.data.data.list || []
            list.forEach(item => {
              this.list.push({
                ...item,
                link: item.url
              })
            })
            return list
          }
        })
      },
      contentClick (index) {
        this.list[index].link && this.$_.entryOtherPage(this.list[index].link)
      }
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

  .time {
    margin-top: .22rem;
    font-size: .24rem;
    color: #999;
  }

  .empty-tips {
    font-size: .28rem;
    color: #999;
    text-align: center;
    background: url('~@images/mine/empty-news-img.png') no-repeat top center;
    background-size: 2.54rem;
    margin-top: 3.9rem;
    padding-top: 1.8rem;
  }
</style>
