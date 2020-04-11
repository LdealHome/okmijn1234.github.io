<template lang="pug">
  div.column
    div.column__above
      div.above
        img.img(:src="courseInfo.imgSrc")
        div.share(@click="isShowPostersShare = true") 分享
        div.countdown
          span 倒计时
          span {{courseInfo.countdown}}
      div.following
        h2.title {{courseInfo.title}}
        p.describe {{courseInfo.describe}}
        p.time 上课时间:{{courseInfo.time}}开始
    // 添加班主任(课程未开始或者未学时显示)
    div.column__headmaster(v-if="!isGraduation")
      p.text 请务必添加班主任，否则无法上课。
      button.see(type="button" @click="isShowCourseCustomerService = true") 查看
    // 课程学习完后显示
    div.column__curriculum(v-else)
      div.curriculum
        p.curriculum-title
        p.curriculum-text 直到今天，你达到的比你想象的还多
      button.see(type="button" @click="isShowCertificate = true") 查看
    // 导航切换
    ul.column__navbar
      li.item(
        v-for="(item, index) in navbarList"
        :key="index"
        :class="{current: currentIndex === index}"
        @click="chooseNav(index)"
        )
        span.item-text {{item}}
    div.more(v-show="currentIndex === 1")
      template(v-if="!isMore")
        ul.more-list
          li.more-item(
            v-for="(item, index) in moreList"
            :key="item.id"
            :class="{active: moreIndex === index}"
            @click="moreChoose(index)"
            ) {{item.text}}
        button.more-text(
          type="button"
          @click="isMore = !isMore"
          ) 更多
      template(v-else)
        ul.choose-list
          li.choose-item(
            v-for="(item, index) in moreList"
            :key="item.id"
            :class="{active: moreIndex === index}"
            @click="moreChoose(index)"
          ) {{item.text}}
        button.up(
          type="button"
          @click="isMore = !isMore"
        ) 更多
    // 课程介绍
    DetailsContent(
      v-show="currentIndex === 0"
      :contentList="contentList"
      @videoPlay="videoPlay"
      @jumpLink="jumpLink"
      )
    // 直播列表
    ul.column__broadcast(v-show="currentIndex === 1")
      li.broadcast-item(v-for="(item, index) in liveBroadcastList" :key="item.id")
        div.broadcast-above
          div.synopsis
            p.title {{item.title}}
            // 进行中
            p.ongoing(v-if="item.isOngoing") 进行中
            // 未开始
            p.date(v-else)
              span.date-text {{item.date}}
              span.date-time {{item.time}}
          i.icon-arrow(
            :class="{up: upIndex === index}"
            @click="toggleArrow(index)"
            )
        ul.broadcast-following(v-show="upIndex === index")
          li.following-item(
            v-for="(itm, index) in item.list"
            :key="index"
            @click="operationBroadcast(item.isUnlock, itm)"
            )
            span.following-state {{itm.isState === 0 ? '直播' : itm.isState === 1 ? '视频' : itm.isState === 2 ? '考试' : '预告'}}
            span.following-text(:class="{unlock: item.isUnlock || itm.isState ===3}") {{itm.text}}
            span.following-lock(v-if="!item.isUnlock && itm.isState !==3")
    // 关注公众号
    div.follow(
      v-if="!isFollow"
      @click="isShowCustomerService = true"
      )
    // 邀请海报
    PostersSharePopup(
      v-if="isShowPostersShare"
      :fromUid="fromUid"
      @close="isShowPostersShare = false"
      )
    // 课程客服弹框
    CourseCustomerServicePopup(
      v-if="isShowCourseCustomerService"
      @close="isShowCourseCustomerService = false"
      )
    // 毕业证书弹框
    GraduationCertificatePopup(
      v-if="isShowCertificate"
      @close="isShowCertificate = false"
      )
    // 视频弹框
    VideoPopup(
      :isShow="isShowVideo"
      :video="videoInfo"
      @videoClose="isShowVideo = false"
      )
    // 关注公众号弹框
    CustomerServicePopup(
      v-if="isShowCustomerService"
      :customer="followInfo"
      @close="isShowCustomerService = false"
      )
    TechnicalSupport
    FooterCommon(:selectedTab="-1")
</template>

<script>
  import DetailsContent from '../../components/community/DetailsContent'
  import PostersSharePopup from '../../components/community/PostersSharePopup'
  import CourseCustomerServicePopup from '../../components/community/CourseCustomerServicePopup'
  import CustomerServicePopup from '../../components/community/CustomerServicePopup'
  import GraduationCertificatePopup from '../../components/community/GraduationCertificatePopup'
  import VideoPopup from '../../components/VideoPopup'
  import TechnicalSupport from '../../components/TechnicalSupport'
  import FooterCommon from '../../components/FooterCommon'
  export default {
    name: 'ColumnDetails',
    components: {
      DetailsContent,
      PostersSharePopup,
      CourseCustomerServicePopup,
      CustomerServicePopup,
      GraduationCertificatePopup,
      VideoPopup,
      TechnicalSupport,
      FooterCommon
    },
    computed: {
      fromUid () {
        return this.$store.state.personalInfo.uid
      }
    },
    data () {
      return {
        courseInfo: {
          imgSrc: 'http://imgtest.qiniu.xy22.cn/upload/aiyin/bg/2020/01/14/202001145e1d7ccce0634605402868.jpg', // 封面
          countdown: '02天22时22分22秒', // 倒计时
          title: '演说蜕变营的标题', // 标题
          describe: '演说蜕变营的描述', // 描述
          time: '02月22日' // 时间
        }, // 课程相关信息
        isShowPostersShare: false, // 邀请海报弹框
        isShowCourseCustomerService: false, // 客服弹框
        isGraduation: false, // 是否毕业
        isShowCertificate: false, // 毕业证书弹框
        navbarList: ['课程介绍', '直播列表'], // 导航
        currentIndex: 0, // 导航默认选择
        moreList: [
          {
            id: 0,
            text: '1~30'
          },
          {
            id: 1,
            text: '1~30'
          },
          {
            id: 2,
            text: '1~30'
          },
          {
            id: 3,
            text: '1~30'
          },
          {
            id: 4,
            text: '1~30'
          },
          {
            id: 5,
            text: '1~30'
          },
          {
            id: 6,
            text: '1~30'
          },
          {
            id: 7,
            text: '1~30'
          },
          {
            id: 8,
            text: '1~30'
          },
          {
            id: 9,
            text: '1~30'
          },
          {
            id: 10,
            text: '1~30'
          },
          {
            id: 11,
            text: '1~30'
          }
        ], // 更多日期选择
        isMore: false, // 是否点击更多日期选择
        moreIndex: 0, // 选择日期角标
        contentList: [], // 课程介绍
        liveBroadcastList: [
          {
            id: 22,
            title: '社群学习第几阶段社群学习第几阶段社群学习第几阶段社群学习第几阶段',
            date: '2月22日',
            time: '2天后',
            isOngoing: true, // 是否正在直播
            isUnlock: true, // 是否解锁
            list: [
              {
                isState: 0, // 0表示直播，1表示视频，2表示考试，3预告
                text: '标题社群学习第几阶段社群学习第几阶段社群学习第几阶段社群学习第几阶段',
                videoUrl: '', // 视频路径
                cover: '' // 封面图
              },
              {
                isState: 1,
                text: '标题',
                videoUrl: '',
                cover: ''
              },
              {
                isState: 2,
                text: '标题',
                videoUrl: '',
                cover: ''
              },
              {
                isState: 3,
                text: '标题',
                videoUrl: '',
                cover: ''
              }
            ]
          },
          {
            id: 12,
            title: '社群学习第几阶段',
            date: '2月22日',
            time: '2天后',
            isOngoing: false, // 是否正在直播
            isUnlock: false, // 是否解锁
            list: [
              {
                isState: 1,
                text: '标题',
                videoUrl: '',
                cover: ''
              },
              {
                isState: 2,
                text: '标题',
                videoUrl: '',
                cover: ''
              },
              {
                isState: 3,
                text: '标题',
                videoUrl: '',
                cover: ''
              }
            ]
          }
        ], // 直播列表
        upIndex: 0, // 展示隐藏列表的角标
        isShowVideo: false, // 视频弹框
        videoInfo: { // 视频弹框
          videoUrl: '',
          imgSrc: ''
        },
        isFollow: false, // 是否关注公众号
        isShowCustomerService: false, // 关注公众号弹框
        followInfo: {
          differentiate: 2, // 0客服二维码，2关注公众号
          codeSrc: 'http://imgtest.qiniu.xy22.cn/upload/aiyin/bg/2020/01/14/202001145e1d7ccce0634605402868.jpg' // 二维码
        }
      }
    },
    methods: {
      /**
       * 导航切换
       * @param index {Number} 选择的角标
       */
      chooseNav (index) {
        this.currentIndex = index
      },
      /**
       * 视频播放
       * @param itemIndex { Number } 选择视频父元素的角标
       * @param videoIndex { Number } 选择播放视频当前的角标
       */
      videoPlay (itemIndex, videoIndex) {
        this.contentList[itemIndex].videoList[videoIndex].isVideoPlay = true
      },
      /**
       * 跳转链接
       * @param url {String} 跳转链接
       */
      jumpLink (url) {
        this.$_.entryOtherPage(url)
      },
      /**
       * 选择日期
       * @param index {Number} 选择的角标
       */
      moreChoose (index) {
        this.moreIndex = index
      },
      /**
       * 直播列表的收起和展开
       * @param index {Number} 选择的角标
       */
      toggleArrow (index) {
        if (index === this.upIndex) {
          this.upIndex = -1
        } else {
          this.upIndex = index
        }
      },
      /**
       * 直播列表点击直播、视频、考试
       * @param isUnlock {Boolean} 是否解锁
       * @param item {Object} 对应数据
       */
      operationBroadcast (isUnlock, item) {
        let that = this
        // 0表示直播，1表示视频，2表示考试，3预告
        switch (item.isState) {
        case 0: // 直播
          console.log('跳转直播页')
          break
        case 2: // 考试
          if (isUnlock) {
            console.log('跳转到考试页')
          } else {
            this.$_.Toast('还没到该课程的学习时间不能参加哦~')
          }
          break
        default: // 视频、预告
          that.videoInfo = {
            videoUrl: item.videoUrl,
            imgSrc: item.cover
          }
          that.isShowVideo = true
          break
        }
      }
    }
  }
</script>

<style scoped lang="less">
  .column {
    min-height: 100vh;
    padding-bottom: 1.2rem;
    background-color: #fff;

    &__above {
      padding: .3rem;

      .above {
        position: relative;
        width: 6.89rem;
        height: 4.7rem;
        border-radius: .12rem;
        overflow: hidden;
      }

      .img {
        width: 100%;
        height: 100%;
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

      .countdown {
        position: absolute;
        left: 0;
        bottom: .1rem;
        color: #2b2b2b;
        font-size: .28rem;
        height: .54rem;
        line-height: .54rem;
        border-top-left-radius: 1rem;
        border-top-right-radius: 1rem;
        border-bottom-right-radius: 1rem;
        background-color: rgba(255, 255, 255, .8);
        padding: 0 .14rem;
      }

      .following {
        color: #b5b5b7;
        font-size: .28rem;
        padding-top: .2rem;
        line-height: 1.4;
      }

      .title {
        color: #2b2b2b;
        font-size: .36rem;
        font-weight: bold;
        margin-top: .1rem;
        .ellipsisLn(2);
      }

      .describe {
        margin-top: .1rem;
        .ellipsisLn(3);
      }

      .time {
        margin-top: .1rem;
      }
    }

    &__headmaster {
      display: flex;
      align-items: center;
      width: 6.9rem;
      height: .82rem;
      margin: auto;
      padding: 0 .3rem 0 .68rem;
      border-radius: .08rem;
      background: #faf6ef url("~@icon/community/column-people.png") no-repeat .3rem center;
      background-size: .3rem .34rem;

      .text {
        flex: 1;
        color: #ffa641;
        font-size: .26rem;
      }
    }

    &__curriculum {
      display: flex;
      align-items: center;
      width: 6.9rem;
      height: 1.2rem;
      margin: auto;
      padding: 0 .3rem 0 .8rem;
      border-radius: .08rem;
      background: #faf6ef url("~@icon/community/column-cup.png") no-repeat .3rem center;
      background-size: .36rem;

      .curriculum {
        flex: 1;

        &-title {
          width: 2.54rem;
          height: .31rem;
          background: url("~@images/community/column-cup-text.png") no-repeat left center;
          background-size: contain;
        }

        &-text {
          color: #ffa641;
          font-size: .24rem;
          transform: scale(.92) translateX(-.2rem);
        }
      }
    }

    &__navbar {
      display: flex;
      align-items: center;

      .item {
        flex: 1;
        color: #5f5f5f;
        font-size: .32rem;
        text-align: center;
        padding: .4rem 0;

        &.current {
          font-weight: bold;

          .item-text {
            color: #1b1b1b;
            position: relative;

            &::after {
              position: absolute;
              bottom: -.06rem;
              left: 50%;
              width: .26rem;
              height: .06rem;
              content: '';
              transform: translateX(-50%);
              background-color: #1b1b1b;
              border-radius: .04rem;
            }
          }
        }
      }
    }

    &__broadcast {
      margin: .44rem .3rem;

      .broadcast {
        &-item {
          padding: 0 .2rem;
          margin-bottom: .24rem;
          border-radius: .08rem;
          background-color: #faf9f9;
        }

        &-above {
          display: flex;
          align-items: center;
          padding: .34rem 0;

          .title {
            color: #1b1b1b;
            font-size: .32rem;
            font-weight: bold;
            margin-bottom: .14rem;
            .ellipsis(5.3rem);
          }

          .ongoing {
            display: inline-block;
            color: #fba627;
            font-size: .24rem;
            font-weight: bold;
            transform: scale(.82) translateX(-.1rem);
            padding: 0 .1rem;
            border: 1px solid #fba627;
            border-radius: .04rem;
          }

          .date {
            color: #b8b7b7;
            font-size: .24rem;

            &-text,
            &-time {
              transform: scale(.82);
            }

            &-time {
              margin-left: .35rem;
              padding-left: .35rem;
              background: url("~@icon/community/column-time.png") no-repeat left center;
              background-size: .24rem;
            }
          }
        }

        &-following {
          position: relative;
          padding: .34rem 0;

          &::after {
            .setTopLine(#e2e2e2);
          }
        }
      }

      .following {
        &-item {
          display: flex;
          align-items: center;
          margin-bottom: .16rem;

          &:last-child {
            margin-bottom: 0;
          }
        }

        &-state {
          color: #4eb9fd;
          font-size: .24rem;
          padding: 0 .06rem;
          transform: scale(.82) translateX(-.06rem);
          border: 1px solid #4eb9fd;
          border-radius: .04rem;
        }

        &-text {
          flex: 1;
          color: #989898;
          font-size: .28rem;
          padding: 0 .3rem 0 .1rem;
          .ellipsisLn(1);

          &.unlock {
            color: #333;
          }
        }

        &-lock {
          width: .2rem;
          height: .26rem;
          background: url("~@icon/community/column-lock.png") no-repeat right center;
          background-size: contain;
        }
      }

      .synopsis {
        flex: 1;
      }

      .icon-arrow {
        width: .6rem;
        height: .6rem;
        background: url("~@icon/community/column-down.png") no-repeat right center;
        background-size: .22rem .1rem;

        &.up {
          background-image: url("~@icon/community/column-up.png");
        }
      }
    }
  }

  .see {
    width: 1.1rem;
    height: .5rem;
    color: #fff;
    font-size: .24rem;
    border-radius: 1rem;
    background-color: #fba627;

    &:active {
      background-color: darken(#fba627, 5%);
    }
  }

  .more {
    position: relative;
    display: flex;

    &-list {
      display: flex;
      align-items: center;
      padding: 0 .3rem;
      width: 100%;
      overflow-x: scroll;
      -webkit-overflow-scrolling: touch;
    }

    &-item {
      flex-shrink: 0;
      width: 1.34rem;
      height: .6rem;
      text-align: center;
      line-height: .6rem;
      color: #2a2b2d;
      font-size: .26rem;
      margin-right: .58rem;
      border-radius: .08rem;
      background-color: #f5f7f9;

      &.active {
        color: #fff;
        background-color: #fba627;
      }
    }

    &-text {
      position: relative;
      top: 0;
      right: 0;
      width: 1.6rem;
      height: .6rem;
      color: #686868;
      font-size: .28rem;
      text-align: left;
      padding-left: .06rem;
      background: #fff url("~@icon/community/column-more-down.png") no-repeat .78rem center;
      background-size: .16rem .08rem;
    }

    .up {
      position: absolute;
      top: 0;
      right: .2rem;
      width: 1.34rem;
      height: .6rem;
      color: #686868;
      font-size: .28rem;
      text-align: left;
      padding-left: .06rem;
      background: #fff url("~@icon/community/column-more-up.png") no-repeat .78rem center;
      background-size: .16rem .08rem;
    }
  }

  .choose {
    &-list {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      padding: 0 .3rem;
      box-shadow: 0 6px 10px 0 rgba(189, 188, 188, .4);
    }

    &-item {
      flex-shrink: 0;
      width: 1.34rem;
      height: .6rem;
      text-align: center;
      line-height: .6rem;
      color: #2a2b2d;
      font-size: .26rem;
      margin-right: .5rem;
      border-radius: .08rem;
      background-color: #f5f7f9;
      margin-bottom: .2rem;

      &:nth-child(4n-1) {
        margin-right: 0;
      }

      &:nth-child(3) {
        margin-right: .5rem;
      }

      &.active {
        color: #fff;
        background-color: #fba627;
      }
    }
  }

  .follow {
    position: fixed;
    bottom: 1.76rem;
    right: 0;
    width: 2.2rem;
    height: 2.06rem;
    background: url("~@images/community/column-follow-img.png") no-repeat center;
    background-size: contain;
  }
</style>
