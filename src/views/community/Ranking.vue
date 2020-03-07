<template lang="pug">
  div.whole(v-if="isLoad")
    div.ranking-top
      p.title-ranking 排名
      p.title-name 用户
      p.title-course 已有课程
    ul.ranking-list(v-if="list.length")
      li.ranking-item(v-for="(item, index) in list" :key="index")
        div.ranking-view
          span(:class="index < 3 ? 'medal_icon_' + index : ''") {{index < 3 ? '' : index + 1}}
        img.avatar(:src="item.avatar" @click="jumpHomePage(item.link)")
        div.item-right
          p.item-name {{item.name}}
          div.item-date
            p.course-number 已拥有{{item.courseNumber}}门课程
            p.invite-number 已邀请{{item.inviteNumber}}人
    NothingCommon(v-else :config="nothingConfig")
    infinite-loading(@infinite="loadMore")
      div(slot="spinner")
      div(slot="no-more")
      div(slot="no-results")
</template>

<script>
  import NothingCommon from '../../components/NothingCommon'
  import {
    getRankingList
  } from '../../services/community'
  export default {
    name: 'Ranking',
    components: {
      NothingCommon
    },
    data () {
      return {
        isLoad: false,
        list: [],
        params: {
          page: 1,
          limit: 20
        },
        nothingConfig: {
          tips: '暂时没有数据哦～'
        }
      }
    },
    watch: {
      isLoadGuestInfo () {
        this.main()
      }
    },
    computed: {
      uid () {
        return this.$store.state.personalInfo.uid
      },
      // 访客
      isGuest () {
        return this.$store.state.guest
      },
      // 是否加载访客信息
      isLoadGuestInfo () {
        return this.$store.state.isLoadGuestInfo
      }
    },
    created () {
      if (this.isLoadGuestInfo) {
        this.main()
      }
    },
    methods: {
      main () {
        if (this.isGuest) {
          this.$router.replace({ name: '404' })
          return
        }
        this.isLoad = true
      },
      /**
       * 获取邀请的好友列表
       */
      getList () {
        return getRankingList(this.params)
          .then(res => {
            if (res.data.code === 1) {
              let list = res.data.data.list || []
              this.list.push(...this.transformRankingList(list))
              return list
            }
          })
      },
      async loadMore (res) {
        const that = this
        let isLastPage = false
        await that.getList().then(list => {
          isLastPage = that.$_.isLastPage(that.params.limit, list)
        })
        if (isLastPage) {
          that.isLockingLoadMore = true
          res.complete()
        } else {
          res.loaded()
          that.params.page++
        }
      },
      // 跳转个人主页
      jumpHomePage (url) {
        this.$_.entryOtherPage(url)
      },
      /**
       * 排行榜列表数据转换
       * @param source {Object} 需要转换的数据源
       * @return {Object} 转换后可以直接使用的结构
       */
      transformRankingList (source) {
        let list = [] 
        source.forEach(item => {
          list.push({
            uid: item.uid,
            avatar: item.img_url,
            link: item.home_url,
            name: item.nick_name,
            courseNumber: item.course_number,
            inviteNumber: item.invite_number
          })
        })
        return list
      }
    }
  }
</script>

<style scoped lang="less">
  .whole {
    min-height: 100vh;
    overflow: hidden;
    background: #fff url('~@images/community/community-ranking-back.png') no-repeat top center;
    background-size: auto 3.16rem;
  }

  .ranking-top {
    margin-top: 2.96rem;
    height: .9rem;
    display: flex;
    align-items: center;
    background: #fff;
    border-radius: .22rem .22rem 0 0;
    font-size: .32rem;
    color: #666;
    text-align: center;
  }

  .title-ranking { width: 1.04rem; }

  .title-name {
    flex: 1;
    padding-left: .8rem;
  }

  .title-course { width: 2.9rem; }

  .ranking-list { border-top: 1px solid #e4e4e4; }

  .ranking-item {
    position: relative;
    height: 1.46rem;
    display: flex;
    align-items: center;

    &::after {
      position: absolute;
      bottom: 0;
      left: 1rem;
      right: 0;
      content: '';
      border-bottom: 1px dashed #ebebeb;
      transform: scaleY(.5);
    }
  }

  .ranking-view {
    width: 1.04rem;
    text-align: center;
    font-size: .3rem;
    color: #666;
    font-weight: bold;
  }

  .avatar {
    width: .8rem;
    height: .8rem;
    border-radius: 50%;
  }

  .item-right {
    flex: 1;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .item-name {
    font-size: .3rem;
    color: #333;
    .ellipsis(2.4rem);

    margin-left: .2rem;
  }

  .item-date {
    width: 2.94rem;
    text-align: center;
    font-size: .3rem;
    color: #999;
  }

  .medal_icon_0 {
    display: block;
    width: .5rem;
    height: .58rem;
    background: url('~@icon/community/medal_icon_1.png') no-repeat;
    background-size: 100%;
    margin: .06rem auto 0;
  }

  .medal_icon_1 {
    display: block;
    width: .5rem;
    height: .58rem;
    background: url('~@icon/community/medal_icon_2.png') no-repeat;
    background-size: 100%;
    margin: .06rem auto 0;
  }

  .medal_icon_2 {
    display: block;
    width: .5rem;
    height: .58rem;
    background: url('~@icon/community/medal_icon_3.png') no-repeat;
    background-size: 100%;
    margin: .06rem auto 0;
  }
</style>
