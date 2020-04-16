<template lang="pug">
  div.whole
    div.inviter-back
      p.inviter-text 我的传爱天使:
      img.inviter-avatar(:src="superiorInfo.avatar")
      p.inviter-name {{superiorInfo.name}}
    div.list-title
      p.title-text 已邀约好友
      div.title-right
        input.key-input(placeholder="请输入昵称" v-model="searchText" v-ios-focus)
        div.search-btn(@click="searchClick" :style="searchBtnColor") {{searchBtnText}}
    ul
      li.item(v-for="item in list" :key="item.id")
        img.item-avatar(:src="item.avatar")
        div.item-info
          p.item-name {{item.name}}
          p.item-time {{item.time}}
        p.item-course 已免费获取{{item.courseNum}}门课程
    infinite-loading(@infinite="loadMore" :identifier="infinite")
      div(slot="spinner")
      div(slot="no-more")
      div(slot="no-results")
    div.bottom-btn
      div.total-number 共{{inviteNumber}}人
    TechnicalSupport
</template>

<script>
  import TechnicalSupport from '../../components/TechnicalSupport'
  import {
    getInviteList,
    getInviteInfo
  } from '../../services/mine'
  export default {
    name: 'AccountBlessing',
    components: {
      TechnicalSupport
    },
    data () {
      return {
        list: [],
        params: {
          limit: 20,
          page: 1,
          keywords: ''
        },
        superiorInfo: {
          avatar: '',
          name: ''
        },
        searchText: '',
        inviteNumber: 0,
        infinite: 0
      }
    },
    created () {
      // 获取邀请人信息、一共邀请的人数
      getInviteInfo().then(res => {
        if (res.data.code === 1) {
          let data = res.data.data
          this.superiorInfo = {
            avatar: data.parent_head_img,
            name: data.parent_nick_name
          }
          this.inviteNumber = data.count
        }
      })
    },
    computed: {
      isShowCancel () {
        return this.params.keywords === this.searchText && this.searchText
      },
      searchBtnText () {
        return this.isShowCancel ? '取消' : '搜索'
      },
      searchBtnColor () {
        return { 'color': this.isShowCancel ? '#FBA627' : '#333' }
      }
    },
    methods: {
      searchClick () {
        this.list = []
        this.params.page = 1
        if (this.isShowCancel) {
          this.searchText = ''
          this.params.keywords = ''
        } else {
          this.params.keywords = this.searchText
        }
        this.infinite++
      },
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
        return getInviteList(this.params).then(res => {
          if (res.data.code === 1) {
            let list = res.data.data.list || []
            list.forEach(item => {
              this.list.push({
                id: item.uid,
                avatar: item.img_url,
                name: item.nick_name,
                time: item.create_time,
                courseNum: item.course_number
              })
            })
            return list
          }
        })
      }
    }
  }
</script>

<style scoped lang="less">
  .whole {
    min-height: 100vh;
    overflow: hidden;
    background: #fff;
    padding-bottom: .9rem;
  }

  .inviter-back {
    height: 1.1rem;
    border-bottom: .14rem solid #f5f5f5;
    display: flex;
    align-items: center;
    padding: 0 1.2rem 0 .3rem;
  }

  .inviter-text {
    font-size: .32rem;
    color: #666;
    margin-right: .18rem;
  }

  .inviter-avatar {
    width: .56rem;
    height: .56rem;
    border-radius: 50%;
    margin-right: .2rem;
  }

  .inviter-name {
    flex: 1;
    font-size: .32rem;
    color: #333;
    .ellipsisLn(1);
  }

  .list-title {
    height: 1.1rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 .2rem 0 .3rem;
  }

  .title-text {
    font-size: .32rem;
    color: #333;
  }

  .title-right {
    display: flex;
    align-items: center;
  }

  .key-input {
    width: 3rem;
    height: .54rem;
    line-height: .54rem;
    border-radius: .08rem;
    border: 1px solid #f0f0f0;
    font-size: .28rem;
    color: #999;
  }

  .search-btn {
    padding: .1rem;
    margin-left: .08rem;
    font-size: .32rem;
  }

  .item {
    height: 1.4rem;
    display: flex;
    align-items: center;
    padding: 0 .3rem 0 .32rem;
    border-bottom: 1px solid #f5f5f5;
  }

  .item-avatar {
    width: .54rem;
    height: .54rem;
    border-radius: 50%;
    margin-right: .24rem;
  }

  .item-info {
    width: 3rem;
  }

  .item-name {
    font-size: .32rem;
    color: #333;
    .ellipsisLn(1);
  }

  .item-time {
    font-size: .24rem;
    color: #999;
    margin-top: .1rem;
  }

  .item-course {
    flex: 1;
    text-align: right;
    font-size: .26rem;
    color: #999;
  }

  .bottom-btn {
    width: 100%;
    position: fixed;
    bottom: 0;
    z-index: 10;
    padding-bottom: env(safe-area-inset-bottom);
  }

  .total-number {
    height: .74rem;
    line-height: .74rem;
    text-align: center;
    background: #f9d400;
    font-size: .32rem;
    color: #333;
    font-weight: bold;
  }
</style>
