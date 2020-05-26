<template lang="pug">
  div.whole
    div.top-back
      p.ranking(@click="rankingClick") 福报榜
        span.ranking-num {{mBean.ranking}}
        span.ranking-right
      div.news-btn
        img.news-btn-img(src="@icon/mine/news.png" @click="newsClick")
        span.news-num(v-if="mBean.newsUnreadNum") {{mBean.newsUnreadNum}}
      div.data-info(@click="editInfoClick")
        div(:class="{ 'king-view': mBean.isKing }")
          img.avatar(:src="mBean.avatar")
        div.data-right
          p.info-name {{mBean.name}}
          p.edit-btn 编辑个人资料
            span.edit-right
      div.data-account
        div.account-item(@click="growthAccount")
          p.data-number {{mBean.growthAccount}}
          p.account-name 成长账户
        div.account-item(@click="blessingAccount")
          p.data-number {{mBean.blessingAccount}}
          p.account-name 福报账户
        div.account-item(@click="bankAccount")
          p.data-number {{mBean.bankAccount}}
          p.account-name 银行账户
    div.content
      div.go-home(@click="toShequnDetails")
        p.name 传爱集福
        p.tips 赚一生福报
      div.learning-data
        p.cumulative-learning 累计学习
          span.cumulative-time {{mBean.studyTime}}
          span 分钟
        div.learning-report(@click="learningReport") 学习报告
      div.learning-type
        div.learning-item
          p.item-time {{mBean.learningToday}}
            span.item-company 分钟
          p.item-type 今日学习
        div.learning-item
          p.item-time {{mBean.continuityDay}}
            span.item-company 天
          p.item-type 连续学习
        div.learning-item
          p.item-time {{mBean.completeCourse}}
            span.item-company 节
          p.item-type 完成课程
      p.curriculum-text 在学课程
      div.curriculum-type
        div.curriculum-item(
          :class="{ 'curriculum-active': curriculumType === 1 }"
          @click="curriculumTypeClick(1)"
        ) 专栏
        div.curriculum-item(
          :class="{ 'curriculum-active': curriculumType === 2 }"
          @click="curriculumTypeClick(2)"
        ) 单课
      component(
        :is="type"
        :list="list"
        @specialDetails="specialDetails"
        @courseDetails="courseDetails"
      )
    TechnicalSupport
    infinite-loading(@infinite="loadMore" :identifier="infinite")
      div(slot="spinner")
      div(slot="no-more")
      div(slot="no-results")
    FooterCommon(selectedTab="3")
</template>

<script>
  import ListSpecial from '../../components/mine/ListSpecial'
  import ListSingle from '../../components/mine/ListSingle'
  import TechnicalSupport from '../../components/TechnicalSupport'
  import FooterCommon from '../../components/FooterCommon'
  import { MessageBox } from 'mint-ui'
  import {
    getPersonalInfo,
    getSpecialList,
    getSingleList
  } from '../../services/mine'
  export default {
    name: 'Mine',
    components: {
      ListSpecial,
      ListSingle,
      FooterCommon,
      TechnicalSupport
    },
    data () {
      return {
        curriculumType: 1,
        mBean: {
          ranking: '', // 排名
          avatar: '', // 头像
          name: '', // 昵称
          growthAccount: 0, // 成长账户
          blessingAccount: 0, // 福报账号
          bankAccount: 0, // 银行账户
          studyTime: 0, // 累计学习时长
          learningToday: 0, // 今日学习时长
          continuityDay: 0, // 连续天数
          completeCourse: 0, // 完成课程
          newsUnreadNum: 0 // 新消息数
        },
        list: [],
        params: {
          limit: 20,
          page: 1
        },
        infinite: 0
      }
    },
    created () {
      this.main()
      this.showPerfectInfoTips()
    },
    computed: {
      type () {
        let list = ['ListSpecial', 'ListSingle']
        return list[this.curriculumType - 1]
      },
      uid () {
        return this.$store.state.personalInfo.uid
      },
      userInfoLoaded () {
        return this.$store.state.userInfoLoaded
      },
      isBindPhone () {
        return this.$store.state.personalInfo.isBindPhone
      }
    },
    watch: {
      userInfoLoaded () {
        this.showPerfectInfoTips()
      }
    },
    methods: {
      main () {
        getPersonalInfo().then(res => {
          if (res.data.code === 1) {
            let data = res.data.data
            this.mBean = {
              ranking: data.rank, // 排名
              avatar: data.head_img, // 头像
              name: data.nick_name, // 昵称
              growthAccount: data.grow_up_num, // 成长账户
              blessingAccount: data.fubao_num, // 福报账号
              bankAccount: data.bank, // 银行账户
              studyTime: data.total_learn_time, // 累计学习时长
              learningToday: data.today_learn_time, // 今日学习时长
              continuityDay: data.continuous_learn_day, // 连续天数
              completeCourse: data.complete_course_num, // 完成课程
              newsUnreadNum: data.message_num, // 新消息数
              isKing: data.is_mr_king
            }
          }
        })
      },
      showPerfectInfoTips () {
        if (this.userInfoLoaded && !this.isBindPhone) {
          const that = this
          MessageBox({
            title: '温馨提示',
            message: '为了方便班主任与你联系请尽快完善手机号等相关信息',
            showCancelButton: true
          }).then(function (code) {
            if (code === 'confirm') {
              that.editInfoClick()
            }
          })
        }
      },
      editInfoClick () {
        // 这里跳转编辑页面，query参数type值是没有意义的，用于编辑页面点击保存时跳转处理
        this.$router.push({ name: 'edit-info', query: { type: 'edit' } })
      },
      newsClick () {
        this.$router.push({ name: 'news' })
      },
      growthAccount () {
        this.$router.push({ name: 'account-growth' })
      },
      blessingAccount () {
        this.$router.push({ name: 'account-blessing' })
      },
      bankAccount () {
        this.$_.Toast('即将上线，敬请期待!')
      },
      learningReport () {
        this.$router.push({ name: 'learning-report' })
      },
      specialDetails () {
        this.$router.push({ name: 'column-details' })
      },
      /**
       * 去社群详情页
       */
      toShequnDetails () {
        this.$router.push({ name: 'particulars', params: { from: this.uid } })
      },
      rankingClick () {
        this.$router.push({ name: 'community-ranking' })
      },
      /**
       * 去课程详情页面
       * @param id {Number} 课程id
       */
      courseDetails (id) {
        if (id === 0) { // 开营未开课
          this.specialDetails()
        } else {
          this.$router.push({ name: 'curriculum', params: { id, from: this.uid } })
        }
      },
      async loadMore (res) {
        const that = this
        let isLastPage = false
        await that.getCurriculumList().then(list => {
          isLastPage = that.$_.isLastPage(that.params.limit, list)
        })
        if (isLastPage) {
          res.complete()
        } else {
          res.loaded()
          that.params.page++
        }
      },
      /**
       * 获取课程列表信息
       */
      getCurriculumList () {
        if (this.curriculumType === 1) {
          return getSpecialList(this.params).then(res => {
            if (res.data.code === 1) {
              let list = res.data.data.list || []
              this.list.push(...this.transformSpecialList(list))
              return list
            }
          })
        } else {
          return getSingleList(this.params).then(res => {
            if (res.data.code === 1) {
              let list = res.data.data.list || []
              this.list.push(...this.transformSingleList(list))
              return list
            }
          })
        }
      },
      curriculumTypeClick (type) {
        if (type === this.curriculumType) {
          return
        }
        this.curriculumType = type
        this.list = []
        this.params.page = 1
        this.infinite++
      },
      /**
       * 专栏课程列表数据转换
       * @param source {Object} 需要转换的数据源
       * @return {Object} 转换后可以直接使用的结构
       */
      transformSpecialList (source) {
        let list = []
        source.forEach(item => {
          list.push({
            id: item.id,
            name: item.newest_course,
            cover: item.poster,
            tips: item.stage,
            title: item.title,
            courseId: item.single_id
          })
        })
        return list
      },
      /**
       * 单课课程列表数据转换
       * @param source {Object} 需要转换的数据源
       * @return {Object} 转换后可以直接使用的结构
       */
      transformSingleList (source) {
        let list = []
        source.forEach(item => {
          list.push({
            id: item.id,
            name: item.title,
            cover: item.poster,
            speed: item.speed,
            isLiveBroadcast: item.status === 1
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
    background: #fff;
    padding-bottom: 1.3rem;
  }

  .top-back {
    height: 4.57rem;
    background: url('~@images/mine/info-back.png') no-repeat;
    background-size: 100%;
    padding-top: .3rem;
  }

  .news-btn {
    position: absolute;
    width: .5rem;
    height: .5rem;
    top: .3rem;
    right: .7rem;
  }

  .news-btn-img {
    width: .4rem;
    height: .4rem;
    padding: .1rem;
    box-sizing: content-box;
  }

  .news-num {
    min-width: .64rem;
    height: .64rem;
    line-height: .64rem;
    text-align: center;
    border-radius: .32rem;
    background: #f35151;
    font-size: .4rem;
    color: #fff;
    padding: 0 .12rem;
    transform: scale(.5);
    transform-origin: 0 0;
    display: block;
    position: absolute;
    top: -.06rem;
    left: .5rem;
  }

  .ranking {
    margin-left: .26rem;
    font-size: .28rem;
    color: #fb496f;
    display: flex;
    align-items: center;
  }

  .ranking-num {
    font-size: .32rem;
    font-weight: bold;
    margin-left: .18rem;
  }

  .ranking-right {
    width: .1rem;
    height: .2rem;
    background: url('~@icon/mine/ranking-right.png') no-repeat;
    background-size: 100%;
    margin-left: .16rem;
  }

  .data-info {
    margin-left: .26rem;
    display: flex;
    align-items: center;
    margin-top: .38rem;
  }

  .king-view {
    position: relative;
    width: .96rem;
    height: .96rem;
    border-radius: 50%;
    border: .02rem solid #ff4c49;

    &::after {
      width: .42rem;
      height: .3rem;
      background: url('~@icon/mine/king-icon.png') no-repeat;
      background-size: 100%;
      content: '';
      position: absolute;
      left: 0;
      right: 0;
      top: -.29rem;
      margin: 0 auto;
      z-index: 1;
    }

    .avatar {
      width: 100%;
      height: 100%;
      border: 1px solid #fff;
    }
  }

  .avatar {
    width: .96rem;
    height: .96rem;
    border-radius: 50%;
    border: .03rem solid #fff;
  }

  .data-right {
    margin-left: .3rem;
    display: flex;
    flex-direction: column;
  }

  .info-name {
    font-size: .34rem;
    color: #fff;
    font-weight: bold;
    .ellipsis(4rem);
  }

  .edit-btn {
    font-size: .26rem;
    color: #fff;
    margin-top: .08rem;
    display: flex;
    align-items: center;
  }

  .edit-right {
    width: .1rem;
    height: .2rem;
    background: url('~@icon/mine/edit-right.png') no-repeat;
    background-size: 100%;
    margin-left: .23rem;
  }

  .data-account {
    display: flex;
    margin-top: .2rem;
  }

  .account-item {
    flex: 1;
    padding: .38rem 0 .3rem;
    text-align: center;
  }

  .data-number {
    font-size: .42rem;
    color: #fff;
    font-weight: bold;
  }

  .account-name {
    font-size: .24rem;
    color: #fff;
    margin-top: .04rem;
  }

  .content {
    border-radius: .16rem .16rem 0 0;
    background: #fff;
    margin-top: -.16rem;
    padding: 0 .3rem;
  }

  .go-home {
    height: 1.2rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 .64rem 0 .92rem;
    border-bottom: 1px solid #f0f0f0;
    background: url('~@icon/mine/fu-icon.png') no-repeat left center, url('~@icon/mine/right-icon.png') no-repeat right .3rem center;
    background-size: .68rem, .1rem;

    .name {
      font-size: .34rem;
      font-weight: bold;
      color: #212121;
    }

    .tips {
      font-size: .28rem;
      color: #707070;
    }

    &:active {
      opacity: .8;
    }
  }

  .learning-data {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: .34rem;
    padding: 0 .3rem 0 .57rem;
    background: url('~@icon/mine/study-icon.png') no-repeat left center;
    background-size: .38rem;
  }

  .cumulative-learning {
    font-size: .28rem;
    color: #212121;
  }

  .cumulative-time {
    font-size: .34rem;
    font-weight: bold;
  }

  .learning-report {
    height: .44rem;
    line-height: .44rem;
    padding: 0 .16rem;
    border: 1px solid #4eb9fd;
    border-radius: .08rem;
    font-size: .24rem;
    color: #4eb9fd;

    &:active {
      background: #4eb9fd;
      color: #fff;
    }
  }

  .learning-type {
    display: flex;
    margin-top: .52rem;
    padding-bottom: .4rem;
    border-bottom: .04rem solid #f5f5f5;
  }

  .learning-item {
    flex: 1;
    text-align: center;
  }

  .item-time {
    font-size: .42rem;
    color: #212121;
    font-weight: bold;
  }

  .item-company {
    font-size: .24rem;
    font-weight: 500;
  }

  .item-type {
    font-size: .24rem;
    color: #999;
    margin-top: .02rem;
  }

  .curriculum-text {
    font-size: .34rem;
    color: #212121;
    font-weight: bold;
    margin-top: .4rem;
  }

  .curriculum-type {
    display: flex;
    justify-content: space-around;
    margin-top: .28rem;
    margin-bottom: .3rem;
  }

  .curriculum-item {
    font-size: .32rem;
    color: #5f5f5f;
    padding: .1rem .2rem 0;
  }

  .curriculum-active {
    color: #1b1b1b;
    font-weight: bold;
    position: relative;

    &::after {
      width: .26rem;
      height: .06rem;
      background: #1b1b1b;
      border-radius: .03rem;
      position: absolute;
      content: '';
      bottom: -.05rem;
      left: 0;
      right: 0;
      margin: 0 auto;
    }
  }
</style>
