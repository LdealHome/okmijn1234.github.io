<template lang="pug">
  div.whole(v-if="isLoad")
    div.top-banner
      SwiperCommon(:slides="bannerList" :swiperOptions="swiperOption")
        template(
          v-for="(item, index) in bannerList"
          :slot="index"
        )
          img.banner-img(:src="item.pic")
    div.wallet
      img.avatar(v-lazy="mBean.avatar")
      div.profit
        p.invitation-text 共集福
          span.invitation-number {{mBean.invitationNumber}}
          | 人
        p.awarded 已免费获得
          span.awarded-number {{mBean.courseNumber}}
          | 门课程
      img.withdraw-btn(src="~@images/community/home-btn.png" @click="jumpParticulars")
    p.title 成长银行
    p.tips-text （邀请新用户集福达标即可
      span.free 免费
      | 获得一门课程）
    ul.course-list
      li.course-item(v-for="(item, index) in mBean.courseList" :key="index" @click="jumpDetails(item)")
        img.item-img(:src="item.img")
        div.locking-cover(v-if="!item.isUnlock")
          p.locking-text 集
            span.locking-number {{item.number}}
            span 福
          p.locking-text 即可解锁
          div.details-btn 了解详情
        p.item-name {{item.name}}
    p.title 推广指南
    ul.extension(v-if="extensionList.length")
      li.extension-item(v-for="item in extensionList" :key="item.id")
        div.extension-left(@click="videoPlay(item)")
          img.cover(v-lazy="item.cover")
          i.icon-video
        div.extension-right
          p.headline {{item.title}}
          p.text {{item.text}}
    NothingCommon(v-else :config="nothingConfig")
    div.follow-btn(v-if="!mBean.isFollow" @click="showFollowPopup")
      img.static-btn(v-show="isRollPage" src="~@images/community/follow-btn.png")
      img.dynamic-btn(v-show="!isRollPage" src="~@images/community/follow-btn.gif")
    infinite-loading(@infinite="loadMore")
      div(slot="spinner")
      div(slot="no-more")
      div(slot="no-results")
    VideoPopup(:isShow="isShowVideo" :video="videoInfo" @videoClose="isShowVideo = false")
    ObtainCoursePopup(
      v-if="isObtainCoursePopup"
      :courseInfo="courseInfo"
      @close="isObtainCoursePopup = false"
      @invite="obtainCourseInvite"
      @service="obtainCourseService"
    )
    CustomerServicePopup(
      v-if="isCustomerServicePopup"
      :customer="customerServiceData"
      @close="isCustomerServicePopup = false"
    )
    CourseCustomerServicePopup(
      v-if="isCourseCustomerServicePopup"
      @close="isCourseCustomerServicePopup = false"
    )
    PostersSharePopup(
      v-if="isPostersSharePopup"
      :fromUid="uid"
      @close="isPostersSharePopup = false"
    )
    TechnicalSupport
    FooterCommon(:selectedTab="2")
</template>

<script>
  import SwiperCommon from '../components/SwiperCommon'
  import PostersSharePopup from '../components/community/PostersSharePopup'
  import ObtainCoursePopup from '../components/community/ObtainCoursePopup'
  import CustomerServicePopup from '../components/community/CustomerServicePopup'
  import CourseCustomerServicePopup from '../components/community/CourseCustomerServicePopup'
  import VideoPopup from '../components/VideoPopup'
  import NothingCommon from '../components/NothingCommon'
  import TechnicalSupport from '../components/TechnicalSupport'
  import FooterCommon from '../components/FooterCommon'
  import weixinConfig from '../mixin/weixinConfig'
  import {
    getCommunityInfo,
    postReadTips,
    getExtensionList
  } from '../services/community'
  import { getBannerList, getVideoInfo } from '../services'

  let vm
  export default {
    name: 'Home',
    components: {
      SwiperCommon,
      PostersSharePopup,
      ObtainCoursePopup,
      CustomerServicePopup,
      CourseCustomerServicePopup,
      VideoPopup,
      NothingCommon,
      TechnicalSupport,
      FooterCommon
    },
    mixins: [weixinConfig],
    data () {
      return {
        isLoad: false,
        swiperOption: {
          // 轮播设置对应属性
          autoplay: true,
          speed: 500, // 切换速度
          watchOverflow: false, // 当没有足够的slide切换时，例如只有1个slide（非loop），swiper会失效且隐藏导航等
          loop: true, // 开启循环模式
          slidesPerView: 1,
          preventClicksPropagation: true, // 阻止click冒泡。拖动Swiper时阻止click事件。
          simulateTouch: false, // 鼠标模拟手机触摸。默认为true，Swiper接受鼠标点击、拖动。
          on: {
            click () {
              vm.clickBanner(this.realIndex)
            }
          }
        },
        bannerList: [],
        isLoadBanner: false,
        mBean: {
          avatar: '', // 头像
          invitationNumber: '', // 邀请人数
          courseNumber: '', // 获得课程数
          courseList: [],
          isFollow: true,
          QRCode: ''
        },
        nothingConfig: {
          tips: '暂时没有数据哦～'
        },
        extensionList: [], // 推广指南
        isObtainCoursePopup: false, // 是否已经免费获得课程弹框
        isCourseCustomerServicePopup: false, // 课程客服弹框
        courseInfo: {
          // 获取课程
          name: '',
          imgSrc: '',
          id: 0
        },
        isCustomerServicePopup: false, // 关注公众号弹框
        customerServiceData: {
          // 关注公众号
          differentiate: 2,
          content: '',
          codeSrc: ''
        },
        params: {
          // 请求的数据
          page: 1,
          limit: 10
        },
        isShowVideo: false, // 视频弹框
        videoInfo: {
          imgSrc: '',
          videoUrl: ''
        },
        videoSceneInfo: {}, // 加载过的视频信息
        isPostersSharePopup: false,
        shareInfo: null,
        isShowWaitPopup: false,
        isRollPage: false,
        showFollowBtnTimer: null
      }
    },
    // beforeRouteLeave (to, from, next) {
    //   window.removeEventListener('scroll', this.handleScroll)
    //   if (this.showFollowBtnTimer) {
    //     clearTimeout(this.showFollowBtnTimer)
    //   }
    //   next()
    // },
    watch: {
      isCustomerServicePopup (val) {
        // true 显示弹框 false 关闭弹框
        this.$root.$emit('toggleModal', Boolean(val))
        if (!val) {
          if (this.customerServiceData.differentiate === 2) {
            localStorage.setItem('isLoadFollow', true)
          }
          if (this.isShowWaitPopup) {
            this.isObtainCoursePopup = true
          }
        }
      },
      isCourseCustomerServicePopup (val) {
        this.$root.$emit('toggleModal', Boolean(val))
        if (!val && this.isShowWaitPopup) this.isObtainCoursePopup = true
      },
      isObtainCoursePopup (val) {
        this.$root.$emit('toggleModal', Boolean(val))
        if (!val) {
          postReadTips({ id: this.courseInfo.id }).then(res => {
            if (res.data.code === 1 && res.data.data.is_give === 2) {
              let data = res.data.data.give_info
              this.courseInfo = {
                name: data.title,
                imgSrc: data.img_url,
                id: data.id
              }
              if (
                this.isPostersSharePopup ||
                this.isCustomerServicePopup ||
                this.isCourseCustomerServicePopup
              ) {
                this.isShowWaitPopup = true
              } else {
                this.isObtainCoursePopup = true
              }
            }
          })
        } else {
          this.isShowWaitPopup = false
        }
      },
      isLoadGuestInfo () {
        this.main()
      },
      uid () {
        this.configShareInfo()
        this.getBannerList()
      },
      bannerScene () {
        this.getBannerList()
      },
      isPostersSharePopup (val) {
        this.$root.$emit('toggleModal', Boolean(val))
        if (!val && this.isShowWaitPopup) this.isObtainCoursePopup = true
      }
    },
    created () {
      console.log(1231313)
      
      vm = this
      if (this.isLoadGuestInfo) {
        // 访客跳转到社群详情
        this.main()
      }
    },
    computed: {
      bannerScene () {
        return this.$store.state.sceneInfo.ad.community_course_home
      },
      uid () {
        return this.$store.state.personalInfo.uid
      },
      // 访客
      isGuest () {
        return this.$store.state.guest
      },
      // 是否加载访客信息
      isLoadGuestInfo () {
        return this.$store.state.isLoadGuestInfo
      }
    },
    methods: {
      main () {
        if (this.isGuest) {
          return
        }
        this.isLoad = true
        this.getBannerList()
        getCommunityInfo().then(res => {
          if (res.data.code === 1) {
            let data = res.data.data
            let giveInfo = data.give_info
            this.shareInfo = data.share_info
            this.configShareInfo()
            this.mBean = {
              avatar: data.member_info.img_url, // 头像
              invitationNumber: data.member_info.invite_number, // 邀请人数
              courseNumber: data.member_info.course_number, // 获得课程数
              courseList: this.transformCourseList(data.course_list || []),
              isFollow: data.member_info.is_subscribe === 2,
              QRCode: data.member_info.subscribe_qr_code
            }
            if (!this.mBean.isFollow && !localStorage.getItem('isLoadFollow')) {
              this.showFollowPopup()
              this.isShowWaitPopup = giveInfo.is_give === 2
            } else {
              this.isObtainCoursePopup = giveInfo.is_give === 2
            }
            this.courseInfo = {
              name: giveInfo.title,
              imgSrc: giveInfo.img_url,
              id: giveInfo.give_course_id
            }

            this.customerServiceData.codeSrc = data.member_info.subscribe_qr_code
          }
        })
        window.addEventListener('scroll', this.handleScroll)
      },
      handleScroll () {
        this.isRollPage = true
        if (this.showFollowBtnTimer) {
          clearTimeout(this.showFollowBtnTimer)
        }
        this.showFollowBtnTimer = setTimeout(() => {
          this.isRollPage = false
        }, 1000)
      },
      /**
       * 配置分享信息
       */
      configShareInfo () {
        if (this.uid && this.shareInfo) {
          this.getWeiXinConfig({
            desc: this.shareInfo.content,
            img: this.shareInfo.img_url,
            title: this.shareInfo.title,
            link: `${location.origin}/particulars/from/${this.uid}`
          }).then(this.setWeiXinConfig)
        }
      },
      /**
       * 获取邀请的好友列表
       */
      getExtensionList () {
        return getExtensionList(this.params).then(res => {
          if (res.data.code === 1) {
            let list = res.data.data.list || []
            this.extensionList.push(...this.transformExtensionList(list))
            return list
          }
        })
      },
      async loadMore (res) {
        const that = this
        let isLastPage = false
        if (
          isLastPage ||
          (that.extensionList.length > 0 &&
          that.extensionList.length < that.params.limit)
        ) {
          // 不满一页
          res.complete()
          return
        }
        await that.getExtensionList().then(list => {
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
       * 课程列表数据转换
       * @param source {Object} 需要转换的数据源
       * @return {Object} 转换后可以直接使用的结构
       */
      transformCourseList (source) {
        let list = []
        source.forEach(item => {
          list.push({
            id: item.id,
            name: item.title, // 课程名称
            img: item.img_url, // 封面
            isUnlock: item.is_lock === 2, // 是否解锁
            number: item.invite_number // 需邀请人数
          })
        })
        return list
      },
      /**
       * 邀请好友列表数据转换
       * @param source {Object} 需要转换的数据源
       * @return {Object} 转换后可以直接使用的结构
       */
      transformExtensionList (source) {
        let list = []
        source.forEach(item => {
          list.push({
            id: item.id,
            videoSrc: item.video_src, // 视频地址
            cover: item.poster, // 封面图
            title: item.title,
            text: item.desc_content
          })
        })
        return list
      },
      // 跳转到自动集福页
      jumpParticulars () {
        this.$router.push({
          name: 'particulars',
          params: {
            from: this.uid
          }
        })
      },
      getBannerList () {
        if (!this.isLoadBanner && this.bannerScene && this.uid) {
          getBannerList({
            scene: this.bannerScene,
            uid: this.uid
          }).then(res => {
            if (res.data.code === 1) {
              this.bannerList = res.data.data.list
              this.isLoadBanner = true
            }
          })
        }
      },
      /**
       * 点击banner图
       * @param index {Number} 点击的banner图索引
       */
      clickBanner (index) {
        switch (this.bannerList[index].category) {
        case 1: // 链接地址
          this.$_.entryOtherPage(this.bannerList[index].url)
          break
        case 2: // 视频
          this.getBannerVideo(
            this.$store.state.sceneInfo.video_course.community_course_home
          )
          break
        default:
          break
        }
      },
      /**
       * 获取banner视频信息
       * @param scene {String} 视频场景值
       */
      getBannerVideo (scene) {
        if (this.videoSceneInfo[scene]) {
          this.videoInfo = this.videoSceneInfo[scene]
          this.isShowVideo = true
        } else {
          getVideoInfo({ scene }).then(res => {
            if (res.data.code === 1) {
              let mBean = res.data.data
              let data = {
                imgSrc: mBean.poster, // 封面图
                videoUrl: mBean.path // 视频地址
              }
              this.videoSceneInfo[scene] = data
              this.videoInfo = data
              this.isShowVideo = true
            }
          })
        }
      },
      /**
       * 跳转详情
       * @param item {Object} 对应的数据
       */
      jumpDetails (item) {
        this.$router.push({
          name: 'course',
          params: {
            courseId: item.id
          }
        })
      },
      /**
       * 推广指南视频播放
       * @param item {Object} 对应的数据
       */
      videoPlay (item) {
        this.videoInfo = {
          imgSrc: item.cover,
          videoUrl: item.videoSrc
        }
        this.isShowVideo = true
      },
      // 课程邀请好友
      obtainCourseInvite () {
        this.isObtainCoursePopup = false
        this.isPostersSharePopup = true
      },
      // 联系客服
      obtainCourseService () {
        this.isCourseCustomerServicePopup = true
        this.isObtainCoursePopup = false
      },
      showFollowPopup () {
        this.isCustomerServicePopup = true
      }
    }
  }
</script>

<style scoped lang="less">
  .whole {
    min-height: 100vh;
    background: #fff;
    padding-bottom: 1.2rem;
  }

  .top-banner {
    margin: 0 0.2rem 0.4rem 0.2rem;
    height: 1.8rem;
    border-radius: 0 0 0.22rem 0.22rem;
    overflow: hidden;
  }

  .banner-img {
    width: 100%;
    height: 100%;
    border-bottom-left-radius: 0.22rem;
    border-bottom-right-radius: 0.22rem;
  }

  .wallet {
    display: flex;
    align-items: center;
    width: 7.1rem;
    height: 1.16rem;
    border-radius: 1rem;
    border: 1px solid #f0f0f0;
    box-shadow: 0 1px 4px 0 rgba(205, 192, 202, 0.35);
    background-color: #fff;
    margin: auto;
  }

  .avatar {
    width: 0.78rem;
    height: 0.78rem;
    border-radius: 50%;
    margin-left: 0.12rem;
    margin-right: 0.22rem;
  }

  .profit {
    flex: 1;
  }

  .invitation {
    &-text {
      color: #333;
      font-size: 0.28rem;
    }

    &-number {
      color: #ff4c49;
      font-size: 0.34rem;
    }
  }

  .awarded {
    color: #999;
    font-size: 0.24rem;

    &-number {
      color: #ff4c49;
    }
  }

  .withdraw-btn {
    width: 2.96rem;
    height: 0.76rem;
    margin-right: 0.1rem;

    &:active {
      transform: scale(1.02);
    }
  }

  .title {
    position: relative;
    color: #333;
    font-size: 0.34rem;
    font-weight: bold;
    text-align: center;
    margin-top: 0.5rem;

    &::after,
    &::before {
      display: inline-block;
      content: "";
      width: 1.6rem;
      height: 0.12rem;
      background: url("~@images/community/home-arrow-right.png") no-repeat center;
      background-size: contain;
      vertical-align: middle;
    }

    &::after {
      padding-left: 0.16rem;
    }

    &::before {
      padding-right: 0.16rem;
      background-image: url("~@images/community/home-arrow-left.png");
    }
  }

  .tips-text {
    font-size: 0.26rem;
    color: #666;
    text-align: center;
    margin-bottom: 0.26rem;
  }

  .free {
    color: #fc3a1b;
  }

  .course-list {
    padding: 0 0.34rem;
    overflow: hidden;
  }

  .course-item {
    width: 2.14rem;
    float: left;
    margin-bottom: 0.2rem;
    margin-right: 0.2rem;
    position: relative;

    &:nth-child(3n) {
      margin-right: 0;
    }
  }

  .item-img {
    width: 100%;
    height: 2.86rem;
    border-radius: 0.12rem;
  }

  .locking-cover {
    width: 100%;
    height: 2.86rem;
    border-radius: 0.12rem;
    background:
      rgba(0, 0, 0, 0.6) url("~@icon/community/lock.png") no-repeat top
      0.38rem center;
    background-size: 0.36rem;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    padding-top: 0.92rem;
  }

  .locking-text {
    font-size: 0.3rem;
    color: #ebebeb;
    text-align: center;
  }

  .locking-number {
    color: #fc4a17;
    font-weight: bold;
  }

  .details-btn {
    width: 1.5rem;
    height: 0.48rem;
    line-height: 0.48rem;
    font-size: 0.28rem;
    color: #fff;
    border-radius: 0.24rem;
    border: 1px solid #fff;
    margin: 0.2rem auto;
    text-align: center;
  }

  .item-name {
    font-size: 0.26rem;
    color: #333;
    .ellipsis(1.9rem);

    text-align: center;
    margin-top: 0.1rem;
    height: 0.36rem;
    line-height: 0.36rem;
  }

  .follow-btn {
    position: fixed;
    bottom: 2.16rem;
    right: 0;
    width: 2.4rem;
    display: flex;
    flex-direction: row-reverse;
  }

  .static-btn {
    width: 0.58rem;
    height: 1.12rem;
  }

  .dynamic-btn {
    width: 2.4rem;
    height: 2.4rem;
  }

  .extension {
    margin: 0.3rem 0.3rem 0 0.3rem;

    &-item {
      display: flex;
      padding: 0.24rem 0.24rem 0.34rem 0.3rem;
      border-radius: 0.1rem;
      box-shadow: 1px 1px 6px 0 rgba(240, 240, 240, 0.8);
      margin-bottom: 0.3rem;

      &:last-child {
        margin-bottom: 0;
      }
    }

    &-left {
      position: relative;
      width: 1.9rem;
      height: 1.32rem;
      border-radius: 0.08rem;
      overflow: hidden;

      .cover {
        width: 100%;
        height: 100%;
      }

      .icon-video {
        position: absolute;
        bottom: 0;
        right: 0;
        width: 0.54rem;
        height: 0.28rem;
        background:
          rgba(0, 0, 0, 0.5) url("~@icon/community/pause.png") no-repeat
          0.26rem top;
        background-size: 0.22rem;
        border-top-left-radius: 0.08rem;
        border-bottom-left-radius: 0.08rem;
      }
    }

    &-right {
      flex: 1;
      padding-left: 0.34rem;
      line-height: 1.4;

      .headline {
        color: #1b1b1b;
        font-size: 0.32rem;
        font-weight: bold;
        margin-bottom: 0.1rem;
        .ellipsisLn(2);
      }

      .text {
        color: #999;
        font-size: 0.22rem;
        transform: scale(0.92) translateX(-0.16rem);
        .ellipsisLn(3);
      }
    }
  }
</style>
