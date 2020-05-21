<template lang="pug">
  div.exam
    div.exam__above
      img.cover(v-lazy="examInfo.cover")
      div.share(@click="isShowPostersShare = true") 分享
      div.following
        p.text {{examInfo.title}}
        div.portrait(v-if="examInfo.portraitList.length")
          img.portrait-img(v-for="item in examInfo.portraitList" :src="item.img_url")
          span.portrait-text 等人参与考试
    div.exam__info
      h2.title 考试信息
      ul.info-list
        li.info-item
          p.numbers
            span.number {{examInfo.duration}}
            span.small 分钟
          p.text 考试时长
        li.info-item
          p.numbers
            span.number {{examInfo.topicNumber}}
            span.small 题
          p.text 题目量
        li.info-item
          p.numbers
            span.number {{examInfo.totalScore}}
            span.small 分
          p.text 总分
    div.exam__details(v-if="examInfo.encourage")
      h2.title 考试详情
      p.text {{examInfo.encourage}}
    div.exam__course
      h2.title 关联课程
      RouterLink(:to="{name: 'column-details'}").course
        img.course-cover(v-lazy="courseInfo.img")
        div.course-describe
          p.text {{courseInfo.title}}
          p.number {{courseInfo.number}}人正在学习
    // 邀请海报
    PostersSharePopup(
      v-if="isShowPostersShare"
      :fromUid="fromUid"
      @close="isShowPostersShare = false"
    )
    MorePupup(
      @collectionClick="isShowCollection = true"
    )
    GuideCollection(
      :isShow="isShowCollection"
      @close="isShowCollection = false"
    )
    TechnicalSupport
    RouterLink.jump-exam(:to="{name: 'accomplish-exam', params: { liveVideoId: liveVideoId }}" v-if="isExamination") 查看成绩
    RouterLink.jump-exam(:to="{name: 'start-exam', params: { liveVideoId: liveVideoId }}" v-else) 开始考试
</template>

<script>
  import PostersSharePopup from '../../components/community/PostersSharePopup'
  import MorePupup from '../../components/MorePupup'
  import GuideCollection from '../../components/course/GuideCollection'
  import TechnicalSupport from '../../components/TechnicalSupport'
  import {
    getExam
  } from '../../services/exam'
  export default {
    name: 'Examination',
    components: {
      PostersSharePopup,
      MorePupup,
      GuideCollection,
      TechnicalSupport
    },
    computed: {
      fromUid () {
        return this.$store.state.personalInfo.uid
      },
      liveVideoId () {
        return this.$route.params.liveVideoId
      }
    },
    data () {
      return {
        isExamination: false, // 是否已经考试
        examInfo: {
          cover: '', // 封面图
          title: '', // 标题
          portraitList: [], // 考试最新的头像
          duration: 0, // 考试时长
          topicNumber: 0, // 题目量
          totalScore: 0, // 总分
          encourage: '' // 考前勉励
        },
        courseInfo: { // 关联课程
          id: 0, // 课程id
          img: '',
          title: '',
          number: 0 // 学习人数
        },
        isShowPostersShare: false, // 邀请海报弹框
        isShowCollection: false // 收藏弹框
      }
    },
    created () {
      this.mine()
    },
    methods: {
      mine () {
        getExam({ course_single_id: this.liveVideoId })
          .then(res => {
            if (res.data.code === 1) {
              let data = res.data.data
              let courseInfo = data.course_info
              this.courseInfo = {
                id: courseInfo.course_id,
                img: courseInfo.cover,
                title: courseInfo.title,
                number: courseInfo.study_number
              }
              this.examInfo = {
                title: data.title,
                portraitList: data.take_member,
                cover: data.cover,
                encourage: data.description,
                duration: data.answer_length,
                topicNumber: data.answer_number,
                totalScore: data.grade
              }
              this.isExamination = data.is_examination === 1
            }
          })
      }
    }
  }
</script>

<style scoped lang="less">
  .exam {
    min-height: 100vh;
    background-color: #fff;
    padding-top: .3rem;
    padding-bottom: 1.2rem;

    &__above {
      position: relative;
      margin: auto;
      width: 6.9rem;
      height: 4.7rem;
      border-radius: .12rem;
      overflow: hidden;

      .cover {
        width: 6.9rem;
        height: 4.7rem;
      }

      .share {
        position: absolute;
        top: .1rem;
        right: 0;
        display: flex;
        align-items: center;
        width: 1.32rem;
        height: .6rem;
        color: #2b2b2b;
        font-size: .24rem;
        padding-left: .66rem;
        border-top-left-radius: .1rem;
        border-bottom-left-radius: .1rem;
        background: rgba(255, 255, 255, .8) url("~@icon/community/column-share.png") no-repeat .2rem center;
        background-size: .28rem;

        &:active {
          background-color: darken(#fff, 5%);
        }
      }

      .following {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        display: flex;
        align-items: flex-end;
        justify-content: space-between;
        height: 1.15rem;
        padding: 0 .3rem .2rem .3rem;
        background: linear-gradient(to top, rgba(4, 2, 14, 1), rgba(4, 2, 14, .02));
      }

      .text {
        color: #fff;
        font-size: .32rem;
        font-weight: bold;
        .ellipsis(3rem);
      }

      .portrait {
        display: flex;
        align-items: center;

        &-img {
          width: .46rem;
          height: .46rem;
          border-radius: 1rem;
          border: 1px solid #fff;
          box-shadow: 0 0 3px #fff;
          margin-left: -.14rem;
        }

        &-text {
          color: #fff;
          font-size: .24rem;
          margin-left: .15rem;
        }
      }
    }

    &__info {
      padding: 0 .3rem;
      margin-top: .36rem;

      .info {
        &-list {
          display: flex;
          align-items: center;
          height: 1.5rem;
        }

        &-item {
          flex: 1;
          text-align: center;
        }
      }

      .numbers {
        color: #2b2b2b;
        font-weight: bold;
      }

      .number {
        font-size: .36rem;
      }

      .small {
        font-size: .24rem;
      }

      .text {
        color: #b5b5b7;
        font-size: .26rem;
      }
    }

    &__details {
      padding: 0 .3rem;
      margin-top: .24rem;

      .text {
        color: #666;
        font-size: .26rem;
        margin-top: .3rem;
      }
    }

    &__course {
      padding: 0 .3rem;
      margin-top: .6rem;

      .course {
        position: relative;
        display: flex;
        align-items: center;
        padding: .24rem .12rem .24rem 0;
        margin-top: .3rem;

        &::before {
          .setTopLine(#d7d5d5);
        }

        &::after {
          .setBottomLine(#d7d5d5);
        }

        &-cover {
          width: 1.9rem;
          height: 1.32rem;
          border-radius: .08rem;
        }

        &-describe {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          height: 1.38rem;
          padding-left: .54rem;
          padding-right: .3rem;
          background: url("~@icon/mine/right-icon.png") no-repeat right center;
          background-size: .1rem .2rem;
        }
      }

      .text {
        color: #1b1b1b;
        font-size: .32rem;
        font-weight: bold;
        .ellipsisLn(2);
      }

      .number {
        color: #b8b7b7;
        font-size: .24rem;
      }
    }
  }

  .title {
    color: #2b2b2b;
    font-size: .36rem;
    font-weight: bold;
  }

  .jump-exam {
    position: fixed;
    left: 50%;
    transform: translateX(-50%);
    bottom: .2rem;
    width: 5.8rem;
    height: .78rem;
    text-align: center;
    line-height: .78rem;
    color: #313131;
    font-size: .3rem;
    box-shadow: 0 0 10px 0 #f9d400;
    background-color: #f9d400;
    border-radius: 1rem;

    &:active {
      background-color: darken(#f9d400, 5%);
    }
  }

  .more {
    position: fixed;
    bottom: 3.08rem;
    right: .6rem;
    width: .94rem;
    height: .94rem;
    background: url("~@icon/more/more.png") no-repeat center;
    background-size: contain;

    &:active {
      transform: scale(1.02);
    }
  }
</style>
