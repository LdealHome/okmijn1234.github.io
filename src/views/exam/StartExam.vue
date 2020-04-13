<template lang="pug">
  div.exam
    ul.exam__above
      li.item
        span.item-icon.time
        span.item-text {{time}}
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
            p.question-type {{item.typeText}}
            template(v-for="itm in item.list")
              label.choose(:for="`choose${itm.id}`" :key="itm.id")
                span.choose-text {{itm.text}}
                input.choose-type(:type="item.type !== 2 ? 'radio' : 'checkbox'" :id="`choose${itm.id}`" :value="itm.text" v-model='item.choose')
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
      }
    },
    data () {
      return {
        time: '', // 考试时间
        timeRush: 900000, // 考试时间戳
        examList: [
          {
            id: 2,
            title: '1、擦过多少肩在时间尽头我也会守在你的身后',
            type: 0, // 0判断题，1单选题，2多选题
            typeText: '(判断题：1分)',
            choose: [], // 选择的选项
            isChoose: false,
            list: [
              {
                id: 0,
                text: '正确'
              },
              {
                id: 1,
                text: '错误'
              }
            ]
          },
          {
            id: 22,
            title: '2、我的心早已被你愈合加快的脉搏你小心翼翼对我说永远在说身后唱喜欢的我唱心动的歌',
            type: 2, // 0判断题，1单选题，多选题
            typeText: '(多选题：1分)',
            choose: [],
            isChoose: false,
            list: [
              {
                id: 3,
                text: '复杂人生'
              },
              {
                id: 4,
                text: '旅程'
              },
              {
                id: 5,
                text: '不变'
              },
              {
                id: 6,
                text: '没有到不了的地方'
              },
              {
                id: 7,
                text: '哈喽'
              }
            ]
          },
          {
            id: 222,
            title: '3、曾经多少个牵肠挂肚的何必那真心与寂寞去纠缠',
            type: 1, // 0判断题，1单选题，2多选题
            typeText: '(单选题：1分)',
            choose: [], // 选择的选项
            isChoose: false,
            list: [
              {
                id: 8,
                text: '早安'
              },
              {
                id: 9,
                text: '晚安'
              }
            ]
          },
          {
            id: 2222,
            title: '4、蓝色的天空轻轻的亲吻着晚霞雪花落下你看见了吗紧握这你的手也不会害怕',
            type: 1, // 0判断题，1单选题，2多选题
            typeText: '(单选题：1分)',
            choose: [], // 选择的选项
            isChoose: false,
            list: [
              {
                id: 10,
                text: '早安'
              },
              {
                id: 11,
                text: '晚安'
              }
            ]
          }
        ],
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
      let that = this
      // 考试未完成是否离开过页面
      if (this.getLocalCache) {
        that.timeRush = that.getLocalCache.storageTime
        // 清空缓存
        this.$store.commit($_.commits.REMOVE_LOCAL_CACHE, this.cacheKey)
      }
      // 考试时间
      that.timer = setInterval(() => {
        // 分
        let minute = (that.timeRush / 1000) % 3600 / 60
        minute = minute > 9 ? Math.floor(minute) : '0' + Math.floor(minute)
        // 秒
        let second = (that.timeRush / 1000) % 60
        second = second > 9 ? Math.floor(second) : '0' + Math.floor(second)
        if (that.timeRush < 0) {
          clearInterval(this.timer)
          this.isTimeOut = true
        } else {
          that.timeRush = that.timeRush - 1000
          this.time = `00:${minute}:${second}`
        }
      }, 1000)
    },
    methods: {
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
              this.isRoll = true
            }
          }
          list.push(item.choose)
        })
        if (!this.isRoll) { // 全部答完或者答题时间到
          console.log(list)
          this.$router.push({
            name: 'accomplish-exam'
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
