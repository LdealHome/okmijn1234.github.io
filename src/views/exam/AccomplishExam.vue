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
            p.headline {{item.title}}
            p.question-type {{item.typeText}}
            div.choose(v-for="itm in item.list")
              label.choose-label
                span.choose-text {{itm.text}}
                input.choose-type(
                  :type="item.type !== 2 ? 'radio' : 'checkbox'"
                  :value="itm.text"
                  :checked="itm.isCheck"
                  disabled
                  )
              span.choose-icon(v-if="itm.isCheck" :class="{error: !itm.isCorrectIcon}")
          div.following
            div.answer
              p.answer-left
                span.answer-state 回答正确
                span.answer-icon(:class="{error: !item.isCorrect}")
              p.answer-text (得分: 1分)
            div.analysis 解析： 大雨后的车站大雪后的场景我都梦的见
    MorePupup
    TechnicalSupport
</template>

<script>
  import MorePupup from '../../components/MorePupup'
  import TechnicalSupport from '../../components/TechnicalSupport'
  export default {
    name: 'AccomplishExam',
    components: {
      MorePupup,
      TechnicalSupport
    },
    data () {
      return {
        infoData: {
          portraitSrc: 'http://imgtest.qiniu.xy22.cn/upload/aiyin/bg/2020/01/14/202001145e1d7ccce0634605402868.jpg', // 头像
          nickname: '用户昵称', // 用户昵称
          time: '2020.02.22', // 时间
          fraction: '99' // 成绩
        },
        courseInfo: { // 关联课程
          img: 'http://imgtest.qiniu.xy22.cn/upload/aiyin/bg/2020/01/14/202001145e1d7ccce0634605402868.jpg',
          title: '课程标题',
          number: 222 // 学习人数
        },
        accomplishList: [
          {
            id: 2,
            title: '1、擦过多少肩在时间尽头我也会守在你的身后',
            type: 0, // 0判断题，1单选题，2多选题
            typeText: '(判断题：1分)',
            isCorrect: false,
            list: [
              {
                id: 0,
                text: '正确',
                isCheck: true,
                isCorrectIcon: false
              },
              {
                id: 1,
                text: '错误',
                isCheck: false,
                isCorrectIcon: false
              }
            ]
          },
          {
            id: 22,
            title: '2、我的心早已被你愈合加快的脉搏你小心翼翼对我说永远在说身后唱喜欢的我唱心动的歌',
            type: 2, // 0判断题，1单选题，多选题
            typeText: '(多选题：1分)',
            isCorrect: false,
            list: [
              {
                id: 3,
                text: '复杂人生',
                isCheck: true,
                isCorrectIcon: true
              },
              {
                id: 4,
                text: '旅程',
                isCheck: true,
                isCorrectIcon: true
              },
              {
                id: 5,
                text: '不变',
                isCheck: true,
                isCorrectIcon: false
              },
              {
                id: 6,
                text: '没有到不了的地方',
                isCheck: true,
                isCorrectIcon: true
              },
              {
                id: 7,
                text: '哈喽',
                isCheck: true,
                isCorrectIcon: false
              }
            ]
          },
          {
            id: 222,
            title: '3、曾经多少个牵肠挂肚的何必那真心与寂寞去纠缠',
            type: 1, // 0判断题，1单选题，2多选题
            typeText: '(单选题：1分)',
            isCorrect: true,
            list: [
              {
                id: 8,
                text: '早安',
                isCheck: false,
                isCorrectIcon: true
              },
              {
                id: 9,
                text: '晚安',
                isCheck: true,
                isCorrectIcon: false
              }
            ]
          },
          {
            id: 2222,
            title: '4、蓝色的天空轻轻的亲吻着晚霞雪花落下你看见了吗紧握这你的手也不会害怕',
            type: 1, // 0判断题，1单选题，2多选题
            typeText: '(单选题：1分)',
            isCorrect: true, // 是否回答正确
            list: [
              {
                id: 10,
                text: '早安',
                isCheck: true,
                isCorrectIcon: true
              },
              {
                id: 11,
                text: '晚安',
                isCheck: false,
                isCorrectIcon: false
              }
            ]
          }
        ]
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
