<template lang="pug">
  div.learning-area-back
    div.right-anchor
      span.anchor-top(@click="rollTopClick")
      span.anchor-bottom(@click="rollBottomClick")
    div.content(ref="learningView" @click="$emit('cancelComment')" @scroll="scrollEvent")
      div.fu-center(v-show="isShowTopView")
        div.fu-text(@click="goHomePage")
          img.fu-text-img(src="@images/course/fu-text.png")
        img.fortune-bag(src="@icon/course/fortune-bag.png" @click="seeShareVideo")
        p.click-tips(@click="seeShareVideo") 点击福字，了解分享后好处
        div.tips-btn(@click="$emit('shareBtnClick')") 分享课程，为课程点赞
      ListComment(:list="studyListInfo.list" @clickItem="clickItem")
      infinite-loading(@infinite="loadMore" :direction="studyListInfo.direction")
        div(slot="spinner")
        div(slot="no-more")
        div(slot="no-results")
</template>

<script>
  import ListComment from './ListComment'
  export default {
    name: 'LearningArea',
    components: {
      ListComment
    },
    props: {
      studyListInfo: {
        type: Object,
        required: true,
        default () {
          return {
            list: [],
            params: {
              page: 1
            },
            direction: 'bottom',
            rollBottom: 0
          }
        }
      },
      state: {
        type: Number,
        required: false,
        default: 0
      }
    },
    data () {
      return {
        isBottom: false
      }
    },
    mounted () {
      if (this.studyListInfo.list.length && this.state === 1) {
        this.rollBottomClick()
      }
    },
    watch: {
      rollBottom (val) {
        this.rollBottomClick()
      }
    },
    computed: {
      isShowChat () {
        return this.bottomInfo.isShow && !this.isNotBroadcast
      },
      rollBottom () {
        return this.studyListInfo.rollBottom
      },
      // 是否显示顶部集福中心view
      isShowTopView () {
        return this.studyListInfo.isShowTopView
      },
      // 访客
      isGuest () {
        return this.$store.state.guest
      },
      from () {
        return this.$route.params.from
      }
    },
    methods: {
      scrollEvent () {
        let scrollTop = this.$refs.learningView.scrollTop
        let scrollHeight = this.$refs.learningView.scrollHeight
        let offsetHeight = this.$refs.learningView.offsetHeight
        // 滚动到底部时告诉父组件，在接受到新的消息时，滚动到新消息位置
        if ((scrollTop + offsetHeight) >= scrollHeight) {
          this.isBottom = true
          this.$emit('changeStudyRollState', { type: 'studyListInfo', state: true })
        } else if (this.isBottom) {
          this.isBottom = false
          this.$emit('changeStudyRollState', { type: 'studyListInfo', state: false })
        }
      },
      rollTopClick () {
        this.$refs.learningView.scrollTop = 0
      },
      rollBottomClick () {
        this.$refs.learningView.scrollTop = this.$refs.learningView.scrollHeight
      },
      goHomePage () {
        if (this.isGuest) {
          this.$router.push({ name: 'particulars', params: { from: this.from } })
        } else {
          this.$router.push({ name: 'home' })
        }
      },
      seeShareVideo () {
        this.$emit('seeVideo', { type: 1, scene: this.$store.state.sceneInfo.video_course.share_adv })
      },
      clickItem (info) {
        this.$emit('clickItem', info)
      },
      loadMore (res) {
        if (this.studyListInfo.isLastPage) {
          res.complete()
          return
        }
        this.$emit('loadMore', 'studyListInfo', res)
      }
    }
  }
</script>

<style scoped lang="less">
  .learning-area-back {
    flex: 1;
    overflow: auto;
    position: relative;
  }

  .content {
    width: 100%;
    height: 100%;
    overflow: auto;
    -webkit-overflow-scrolling: touch;
    padding-bottom: .2rem;
  }

  .right-anchor {
    height: 1.55rem;
    position: absolute;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    top: 0;
    bottom: 0;
    margin: auto 0;
    right: .3rem;
    z-index: 10;
  }

  .anchor-top,
  .anchor-bottom {
    width: .5rem;
    height: .5rem;
    padding: .1rem;
    box-sizing: content-box;

    &:active {
      transform: scale(1.1);
    }
  }

  .anchor-top {
    background: url('~@icon/course/top-arrow.png') no-repeat center center;
    background-size: .5rem;
  }

  .anchor-bottom {
    background: url('~@icon/course/bottom-arrow.png') no-repeat center center;
    background-size: .5rem;
  }

  .fu-center {
    width: 6.44rem;
    padding: .2rem 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    background: #fff;
    border-radius: .12rem;
    margin: .1rem auto 0;
  }

  .fu-text {
    padding-right: .36rem;
    background: url('~@icon/course/fu-text-right.png') no-repeat right center;
    background-size: .15rem;
  }

  .fu-text-img {
    width: 2.64rem;
    height: .67rem;
  }

  .fortune-bag {
    width: .85rem;
    height: .9rem;
    margin-top: .27rem;
  }

  .click-tips {
    font-size: .26rem;
    color: #ff4c49;
    margin-top: .34rem;
    margin-bottom: .26rem;
  }
  
  .tips-btn {
    width: 4.4rem;
    height: .68rem;
    line-height: .68rem;
    border-radius: .34rem;
    background: #f9d400;
    box-shadow: 0 0 .1rem 0 rgba(249, 212, 0, 1);
    text-align: center;
    font-size: .3rem;
    color: #313131;
  }
  
  .spinner-tips {
    display: flex;
    align-items: center;
    justify-content: center;
    height: .8rem;
  }

  .spinner-text {
    font-size: .4rem;
    transform: scale(.5);
    transform-origin: 0;
    color: #999;
    margin-left: .6rem;
  }

  @keyframes spin {
    from {
      transform: rotate(0);
    }

    to {
      transform: rotate(359deg);
    }
  }
  
  .circle-border {
    width: .2rem;
    height: .2rem;
    padding: .02rem;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 50%;
    background: linear-gradient(0deg, rgba(153, 153, 153, .1) 33%, rgba(153, 153, 153, 1) 100%);
    animation: spin .8s linear 0s infinite;
    position: relative;
    right: -.5rem;
  }

  .circle-core {
    width: 100%;
    height: 100%;
    background-color: #f8f8f8;
    border-radius: 50%;
  }
</style>
