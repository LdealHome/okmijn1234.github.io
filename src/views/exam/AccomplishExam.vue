<template lang="pug">
  div.accomplish
    div.accomplish__above
      div.back
      div.content
        div.info
          img.portrait(v-lazy="infoData.portraitSrc")
          div.info-right
            p.nickname {{infoData.nickname}}
            p.time {{infoData.time}}
        div.achievement
          div.fraction
            p.fraction-number {{infoData.fraction}}
            p.fraction-text 分
          p.achievement-text 恭喜你完成此次考试
    div.accomplish__course
      h2.title 关联课程
      RouterLink(:to="{name: 'column-details'}").course
        img.course-cover(v-lazy="courseInfo.img")
        div.course-describe
          p.text {{courseInfo.title}}
          p.number {{courseInfo.number}}人正在学习
    div.accomplish__analysis
      p.title 答案解析
      ul.accomplish__list
        li.accomplish__item(
          v-for="item in accomplishList"
          :key="item.id"
        )
          div.above
            p.headline {{item.serialNumber}}、{{item.title}}
            p.question-type ({{item.type === 1 ? `判断题：${item.typeText}分` : item.type === 2 ? `单选题：${item.typeText}分` : `多选题：${item.typeText}分`}})
            div.choose(v-for="itm in item.list" :key="itm.id")
              label.choose-label
                span.choose-text {{itm.text}}
                input.choose-type(
                  :type="item.type !== 3 ? 'radio' : 'checkbox'"
                  :value="itm.text"
                  :checked="itm.isCheck"
                  disabled
                  )
              span.choose-icon(v-if="itm.isCheck || itm.isCorrectIcon" :class="{error: !itm.isCorrectIcon}")
          div.following
            div.answer
              p.answer-left
                span.answer-state(:class="{error: !item.isCorrect}") {{item.isCorrect ? '回答正确' : '回答错误'}}
                span.answer-icon(:class="{error: !item.isCorrect}")
              p.answer-text (得分: {{item.isCorrect ? item.typeText : 0}}分)
            div.analysis
              p 答案：{{item.answer}}
              p 解析： {{item.analysis}}
    MorePupup(
      @collectionClick="isShowCollection = true"
    )
    GuideCollection(
      :isShow="isShowCollection"
      @close="isShowCollection = false"
    )
    TechnicalSupport
</template>

<script>
  import MorePupup from '../../components/MorePupup'
  import GuideCollection from '../../components/course/GuideCollection'
  import TechnicalSupport from '../../components/TechnicalSupport'
  import {
    getAchievement,
    getAnalysisList
  } from '../../services/exam'
  export default {
    name: 'AccomplishExam',
    components: {
      MorePupup,
      GuideCollection,
      TechnicalSupport
    },
    computed: {
      // 直播课程id
      liveVideoId () {
        return this.$route.params.liveVideoId
      }
    },
    data () {
      return {
        infoData: {
          portraitSrc: '', // 头像
          nickname: '', // 用户昵称
          time: '', // 时间
          fraction: '' // 成绩
        },
        courseInfo: { // 关联课程
          id: '', // 课程id
          img: '',
          title: '',
          number: 222 // 学习人数
        },
        accomplishList: [], // 解析列表
        isShowCollection: false // 收藏弹框
      }
    },
    created () {
      this.mine()
    },
    methods: {
      mine () {
        getAchievement({ course_single_id: this.liveVideoId })
          .then(res => {
            if (res.data.code === 1) {
              let data = res.data.data
              let courseInfo = data.course_info
              document.title = data.exam_title
              this.infoData = {
                portraitSrc: data.head_img, // 头像
                nickname: data.user_name, // 用户昵称
                time: data.finish_time, // 时间
                fraction: data.grade // 成绩
              }
              this.courseInfo = {
                id: courseInfo.course_id,
                img: courseInfo.cover,
                title: courseInfo.title,
                number: courseInfo.study_number
              }
            }
          })
        // 试题解析列表
        getAnalysisList({ course_single_id: this.liveVideoId })
          .then(res => {
            if (res.data.code === 1) {
              this.accomplishList = this.transformAccomplishList(res.data.data.list)
            }
          })
      },
      /**
       * 转换考试列表
       * @param source {Object} 需要转换的数据源
       * @return {Object} 转换后可以直接使用的结构
       */
      transformAccomplishList (source) {
        let list = []
        source.forEach(item => {
          list.push({
            id: item.id,
            courseID: item.s_id, // 课程id
            title: item.title,
            serialNumber: item.sort,
            type: item.type_mark, // 1判断题，2单选题，3多选题
            typeText: item.fraction,
            isCorrect: item.is_correct === 1, // 是否回答正确
            answer: item.options_correct,
            analysis: item.analysis_content, // 答案解析
            list: this.transformOptionList(item.option_list)
          })
        })
        return list
      },
      /**
       * 转换考试列表
       * @param source {Object} 需要转换的数据源
       * @return {Object} 转换后可以直接使用的结构
       */
      transformOptionList (source) {
        let list = []
        source.forEach(item => {
          list.push({
            id: item.id,
            text: item.title,
            isCheck: item.is_checked === 1, // 是否选中
            isCorrectIcon: item.is_answer_correct === 1 // 是否正确
          })
        })
        return list
      }
    }
  }
</script>

<style scoped lang="less">
  .accomplish {
    min-height: 100vh;
    background-color: #fff;

    &__above {
      position: relative;
      height: 4.96rem;

      .back {
        width: 100%;
        height: 3.57rem;
        background: linear-gradient(to right, #ffa304, #fee012);
      }

      .content {
        position: absolute;
        top: .56rem;
        left: 50%;
        transform: translateX(-50%);
        width: 6.6rem;
        height: 4rem;
        border-radius: .12rem;
        box-shadow: 0 0 6px 0 rgba(254, 198, 12, .5);
        background-color: #faf6ef;
      }

      .info {
        display: flex;
        align-items: center;
        padding: .24rem .24rem 0 .24rem;

        &-right {
          flex: 1;
          padding-left: .3rem;
        }
      }

      .portrait {
        width: .9rem;
        height: .9rem;
        border-radius: 1rem;
      }

      .nickname {
        color: #2b3032;
        font-size: .34rem;
        font-weight: bold;
        .ellipsis(3rem);
      }

      .time {
        color: #797c7d;
        font-size: .24rem;
      }

      .achievement {
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        padding-right: .68rem;

        &-text {
          color: #2b3032;
          font-size: .28rem;
          margin-top: .3rem;
        }
      }

      .fraction {
        display: flex;
        align-items: flex-end;
        justify-content: center;
        width: 2.64rem;
        height: 1.7rem;
        background: url("~@images/exam/accomplish-fraction.png") no-repeat center;
        background-size: contain;

        &-number {
          color: #030504;
          font-size: .64rem;
          font-weight: bold;
          line-height: 1.2;
        }

        &-text {
          color: #2b3032;
          font-size: .28rem;
          font-weight: bold;
        }
      }
    }

    &__course {
      padding: 0 .3rem;
      margin-top: .3rem;

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

    &__analysis {
      margin-top: .64rem;

      .title {
        padding: 0 .3rem;
      }
    }

    &__item {
      border-bottom: .14rem solid #f3f3f3;

      .above {
        position: relative;
        padding: .4rem .3rem;

        &::after {
          .setBottomLine(#f3f3f3);
        }
      }

      .headline {
        color: #1b1b1b;
        font-size: .32rem;
        font-weight: bold;
      }

      .question-type {
        color: #656565;
        font-size: .28rem;
        margin: .26rem 0 .36rem 0;
      }

      .choose {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: .26rem;

        &-label {
          width: 6rem;
          display: flex;
          align-items: center;
        }

        &-text {
          flex: 1;
          padding-right: .2rem;
          color: #1b1b1b;
          font-size: .28rem;
        }

        &-type {
          width: .42rem;
          height: .42rem;
          border: 1px solid #999;
          border-radius: 1rem;

          &:checked {
            border: none;
            background: url("~@icon/exam/check-active.png") no-repeat center;
            background-size: contain;
          }

          &:disabled {
            opacity: 1;
          }
        }

        &-icon {
          width: .34rem;
          height: .34rem;
          background: url("~@icon/exam/correct.png") no-repeat center;
          background-size: contain;

          &.error {
            background-image: url("~@icon/exam/error.png");
          }
        }
      }

      .following {
        padding: .4rem;
      }

      .answer {
        display: flex;
        align-items: center;
        justify-content: space-between;

        &-left {
          flex: 1;
          display: flex;
          align-items: center;
        }

        &-state {
          color: #1b1b1b;
          font-size: .32rem;
          font-weight: bold;
          margin-right: .5rem;

          &.error {
            color: #ff4d4a;
          }
        }

        &-icon {
          display: inline-block;
          width: .54rem;
          height: .54rem;
          background: url("~@icon/exam/correct.png") no-repeat center;
          background-size: contain;

          &.error {
            background-image: url("~@icon/exam/error.png");
          }
        }

        &-text {
          color: #656565;
          font-size: .28rem;
        }
      }

      .analysis {
        color: #656565;
        font-size: .28rem;
        margin-top: .4rem;
      }
    }
  }

  .title {
    color: #2b2b2b;
    font-size: .36rem;
    font-weight: bold;
  }
</style>
