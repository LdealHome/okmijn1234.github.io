<template lang="pug">
  div.whole
    div.top-back
      p.ranking 福报榜
        span.ranking-num NO.200
      img.news-btn(src="@icon/mine/news.png" @click="newsClick")
      div.data-info(@click="editInfoClick")
        img.avatar(src="")
        div.data-right
          p.info-name 测试昵称
          p.edit-btn 编辑个人资料
            span.edit-right
      div.data-account
        div.account-item(@click="growthAccount")
          p.data-number 18
          p.account-name 成长账户
        div.account-item(@click="blessingAccount")
          p.data-number 18
          p.account-name 福报账户
        div.account-item
          p.data-number 18
          p.account-name 银行账户
    div.content
      div.go-home
        p.name 传爱集福
        p.tips 赚一生福报
      div.learning-data
        p.cumulative-learning 累计学习
          span.cumulative-time 146
          span 分钟
        div.learning-report 学习报告
      div.learning-type
        div.learning-item
          p.item-time 18
            span.item-company 天
          p.item-type 今日学习
        div.learning-item
          p.item-time 18
            span.item-company 天
          p.item-type 今日学习
        div.learning-item
          p.item-time 18
            span.item-company 天
          p.item-type 今日学习
      p.curriculum-text 在学课程
      div.curriculum-type
        div.curriculum-item(
          :class="{ 'curriculum-active': curriculumType === 1 }"
          @click="curriculumType = 1"
        ) 专栏
        div.curriculum-item(
          :class="{ 'curriculum-active': curriculumType === 2 }"
          @click="curriculumType = 2"
        ) 单课
      ListSpecial(:list="list")
      ListSingle(:list="list")
      p.bottom-tips 链脉云提供技术支持
    FooterCommon(selectedTab="3")
</template>

<script>
  import ListSpecial from '../../components/mine/ListSpecial'
  import ListSingle from '../../components/mine/ListSingle'
  import FooterCommon from '../../components/FooterCommon'
  export default {
    name: 'Mine',
    components: {
      ListSpecial,
      ListSingle,
      FooterCommon
    },
    data () {
      return {
        curriculumType: 1,
        list: [
          {
            id: 1
          }
        ]
      }
    },
    methods: {
      editInfoClick () {
        this.$router.push({ name: 'edit-info' })
      },
      newsClick () {
        this.$router.push({ name: 'news' })
      },
      growthAccount () {
        this.$router.push({ name: 'account-growth' })
      },
      blessingAccount () {
        this.$router.push({ name: 'account-blessing' })
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
    width: .4rem;
    height: .4rem;
    top: .4rem;
    right: .8rem;
  }

  .ranking {
    margin-left: .26rem;
    font-size: .28rem;
    color: #fb496f;
    line-height: .42rem;
    position: relative;
    display: inline;

    &::after {
      width: .1rem;
      height: .2rem;
      content: '';
      position: absolute;
      right: -.2rem;
      top: 0;
      bottom: 0;
      margin: auto 0;
      background: url('~@icon/mine/ranking-right.png') no-repeat;
      background-size: 100%;
    }
  }

  .ranking-num {
    font-size: .32rem;
    font-weight: bold;
    margin-left: .18rem;
  }

  .data-info {
    margin-left: .26rem;
    display: flex;
    align-items: center;
    margin-top: .38rem;
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

  .bottom-tips {
    font-size: .28rem;
    color: #b8b7b7;
    text-align: center;
    margin-top: .56rem;
  }
</style>
