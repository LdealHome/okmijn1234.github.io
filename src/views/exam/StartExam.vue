<template lang="pug">
  div.exam
    ul.exam__above
      li.item
        span.item-icon.time
        span.item-text {{duration}}
      li.item
        span.item-icon.topic
        span.item-text 共10题
      li.item
        span.item-icon.total
        span.item-text 合计10分
    div.exam__content(ref="indexWrap"  @scroll="onListWrapScroll")
      ul.exam__list
        li.exam__item(
          v-for="item in examList"
          :key="item.id"
          ref="indexGroup"
          )
          div.item(:class="{active: item.isChoose}")
            p.title {{item.title}}
            p.question-type ({{item.type === 1 ? `判断题：${item.typeText}分` : item.type === 2 ? `单选题：${item.typeText}分` : `多选题：${item.typeText}分`}})
            template(v-for="itm in item.list")
              label.choose(:for="`choose${itm.id}`" :key="itm.id")
                span.choose-text {{itm.text}}
                input.choose-type(:type="item.type !== 3 ? 'radio' : 'checkbox'" :id="`choose${itm.id}`" :value="itm.text" v-model='item.choose')
      TechnicalSupport
    button.exam__determine(type="button" @click="determine") 提交试卷
    MorePupup
</template>

<script>
  import MorePupup from '../../components/MorePupup'
  import TechnicalSupport from '../../components/TechnicalSupport'
  import {
    MessageBox
  } from 'mint-ui'
  import {
    getStartExamList,
    postSubmitPapers
  } from '../../services/exam'
  export default {
    name: 'StartExam',
    components: {
      MorePupup,
      TechnicalSupport
    },
    watch: {
      // 考试时间是否用完
      timeOut () {
        if (this.isTimeOut) {
          MessageBox({
            message: '考试时间已结束，不能再继续答题，请提交试卷提交试卷',
            confirmButtonText: '提交试卷'
          }).then(action => {
            this.determine()
          })
        }
      }
    },
    computed: {
      timeOut () {
        return this.isTimeOut
      },
      // 本地缓存使用的key值
      cacheKey () {
        return this.$route.fullPath
      },
      // 取出缓存数据
      getLocalCache () {
        return this.$store.getters.getLocalCache(this.cacheKey)
      },
      // 课程id
      liveVideoId () {
        return this.$route.params.liveVideoId
      }
    },
    data () {
      return {
        duration: '00:00:00', // 考试时长
        durationRush: 900, // 考试时间戳
        topicNumber: 10, // 题目量
        totalScore: 10, // 总分
        examList: [], // 试题列表
        listHeight: [],
        scrollTimer: null,
        isRoll: false, // 是否已经找到未答题的题目
        isTimeOut: false, // 答题时间是否到
        timer: null
      }
    },
    beforeRouteLeave (to, from, next) {
      if (this.isRoll) {
        MessageBox({
          message: '你还没有提交试卷，退出后再次进入会从当前的时间继续开始，保存已做的考试题目，确认要退出吗？',
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          showCancelButton: true
        }).then(action => {
          if (action === 'confirm') { // 确认的回调
            clearInterval(this.timer)
            this.$store.commit($_.commits.SET_LOCAL_CACHE, {
              key: this.cacheKey,
              value: {
                storageTime: this.timeRush
              }
            })
            next()
          } else {
            console.log(1)
          }
        })
      } else {
        clearInterval(this.timer)
        next()
      }
    },
    destroyed () {
      clearTimeout(this.scrollTimer)
    },
    mounted () {
      this.calculateHeight()
    },
    created () {
      this.mine()
    },
    methods: {
      mine () {
        getStartExamList({ course_single_id: this.liveVideoId }).then(res => {
          if (res.data.code === 1) {
            let that = this
            let data = res.data.data
            document.title = data.exam_title
            let duration
            // 考试未完成是否离开过页面
            if (that.getLocalCache) {
              duration = that.getLocalCache.storageTime
              console.log(duration)
              // 清空缓存
              this.$store.commit($_.commits.REMOVE_LOCAL_CACHE, that.cacheKey)
            } else {
              duration = data.answer_length
            }
            that.durationRush = duration // 考试时长秒
            this.topicNumber = data.answer_number // 考试题目量
            this.totalScore = data.grade // 总分
            that.timeCountDown()
            that.examList = that.transformExamList(data.list)
          }
        })
      },
      // 考试时间倒计时
      timeCountDown () {
        let that = this
        // 考试时间
        that.timer = setInterval(() => {
          // 时
          let hour = that.durationRush / 3600
          hour = hour > 9 ? Math.floor(hour) : '0' + Math.floor(hour)
          // 分
          let minute = that.durationRush % 3600 / 60
          minute = minute > 9 ? Math.floor(minute) : '0' + Math.floor(minute)
          // 秒
          let second = that.durationRush % 60
          second = second > 9 ? Math.floor(second) : '0' + Math.floor(second)
          if (that.durationRush < 0) {
            clearInterval(this.timer)
            this.isTimeOut = true
          } else {
            that.durationRush--
            this.duration = `${hour}:${minute}:${second}`
          }
        }, 1000)
      },
      // 提交试卷
      determine () {
        let list = []
        let that = this
        this.isRoll = false
        this.examList.forEach((item, index) => {
          item.isChoose = false
          if (item.choose.length === 0 && !this.isTimeOut) {
            item.isChoose = true
            if (!this.isRoll) {
              this.$refs.indexWrap.scrollTop = that.listHeight[index]
              that.isRoll = true
            }
          }
          item.list.forEach(itm => {
            list.push({
              option_id: itm.id,
              q_id: itm.subjectId
            })
          })
        })
        if (!that.isRoll) { // 全部答完或者答题时间到
          let params = {
            list: list,
            s_id: that.liveVideoId
          }
          console.log(params)
          postSubmitPapers(params).then(res => {
            if (res.data.code === 1) {
              that.$router.push({
                name: 'accomplish-exam',
                params: {
                  liveVideoId: that.liveVideoId
                }
              })
            }
          })
        }
      },
      calculateHeight () {
        this.listHeight = []
        const list = this.$refs.indexGroup
        let height = 0
        this.listHeight.push(height)
        for (let i = 0; i < list.length; i++) {
          let item = list[i]
          height += item.clientHeight
          this.listHeight.push(height)
        }
      },
      // 滚动到未答题的地方
      onListWrapScroll () {
        clearTimeout(this.scrollTimer)
        this.scrollTimer = setTimeout(() => {
          let scrollTop = this.$refs.indexWrap.scrollTop
          const listHeight = this.listHeight
          for (let i = 0; i < listHeight.length - 1; i++) {
            if (
              scrollTop <= listHeight[i + 1] - 30 &&
              scrollTop >= listHeight[i]
            ) {
              return
            }
          }
        }, 20)
      },
      /**
       * 转换考试列表
       * @param source {Object} 需要转换的数据源
       * @return {Object} 转换后可以直接使用的结构
       */
      transformExamList (source) {
        let list = []
        source.forEach(item => {
          list.push({
            id: item.id, // 题目id
            courseId: item.s_id, // 单课id
            title: item.title,
            type: item.type_mark, // 1判断题 2单选题 3多选题
            typeText: item.fraction,
            choose: [], // 作答选项
            isChoose: false, // 是否作答
            list: this.transformOptionList(item.option_list)
          })
        })
        return list
      },
      /**
       * 转换考试选项列表
       * @param source {Object} 需要转换的数据源
       * @return {Object} 转换后可以直接使用的结构
       */
      transformOptionList (source) {
        let list = []
        source.forEach(item => {
          list.push({
            id: item.id, // 选项id
            subjectId: item.q_id, // 题目id
            text: item.title // 选项标题
          })
        })
        return list
      }
    }
  }
</script>

<style scoped lang="less">
  .exam {
    display: flex;
    flex-direction: column;
    width: 100vw;
    height: 100vh;
    background-color: #fff;

    &__above {
      display: flex;
      align-items: center;
      height: 1.98rem;
      background-color: #fff;

      .item {
        flex: 1;
        display: flex;
        flex-direction: column;
        align-items: center;

        &-icon {
          width: .74rem;
          height: .74rem;
          background-position: center;
          background-repeat: no-repeat;
          background-size: contain;

          &.time {
            background-image: url("~@icon/exam/time.png");
          }

          &.topic {
            background-image: url("~@icon/exam/topic.png");
          }

          &.total {
            background-image: url("~@icon/exam/total.png");
          }
        }

        &-text {
          color: #565555;
          font-size: .28rem;
          margin-top: .2rem;
        }
      }
    }

    &__content {
      flex: 1;
      overflow-y: scroll;
      -webkit-overflow-scrolling: touch;
      padding-bottom: 1.2rem;
      border-top: .2rem solid #f3f3f3;
    }

    &__item {
      position: relative;
      padding: 0 .15rem;

      &::after {
        .setBottomLine(#f3f3f3);
      }

      .item {
        padding: .4rem;
      }

      .active {
        border: 1px solid #f35151;
      }

      .title {
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
        padding-right: .56rem;
        margin-bottom: .26rem;

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
      }
    }

    &__determine {
      position: fixed;
      left: 50%;
      transform: translateX(-50%);
      bottom: .2rem;
      width: 5.8rem;
      height: .78rem;
      color: #313131;
      font-size: .3rem;
      box-shadow: 0 0 10px 0 #f9d400;
      background-color: #f9d400;
      border-radius: 1rem;

      &:active {
        background-color: darken(#f9d400, 5%);
      }
    }
  }
</style>
