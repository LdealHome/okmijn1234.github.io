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
      img.avatar(v-lazy="mBean.avatar" @click="jumpHomePage(mBean.homepageUrl)")
      div.profit
        p.profit-text
          span 累计收益
          span.profit-number {{mBean.profit}}
          span 元
        p.invitation-text 共邀请{{mBean.invitationNumber}}人，已免费获得{{mBean.courseNumber}}门课程
      img.withdraw-btn(src="~@icon/community/withdraw-btn.png" @click="withdrawal")
    p.my-course 我的课程
    p.tips-text （邀请新用户达标即可免费获得一门课程）
    ul.course-list
      li.course-item(v-for="(item, index) in mBean.courseList" :key="index" @click="jumpDetails(item)")
        img.item-img(:src="item.img")
        div.locking-cover(v-if="!item.isUnlock")
          p.locking-text 邀请
            span.locking-number {{item.number}}
            span 人
          p.locking-text 即可解锁
          div.details-btn 了解详情
        p.item-name {{item.name}}
    div.btns-view
      div.ranking-btn(@click="$router.push({ name: 'community-ranking' })")  排行榜
      div.invitation-btn(@click="inviteFriends") 邀请好友
    p.invitation-title 已邀请用户
    ul(v-if="friendList.length")
      li.friend-item(v-for="item in friendList" :key="item.uid")
        img.friend-avatar(v-lazy="item.avatar" @click="jumpHomePage(item.link)")
        div.friend-right
          div.friend-info
            p.friend-name {{item.name}}
            p.register-time {{item.time}}
          p.friend-course 已拥有{{item.number}}门课程
    NothingCommon(v-else :config="nothingConfig")
    infinite-loading(@infinite="loadMore")
      div(slot="spinner")
      div(slot="no-more")
      div(slot="no-results")
    VideoPopup(:isShow="isShowVideo" :video="videoInfo" @videoClose="isShowVideo = false")
    CommonSharePopup(
      :fromUid="uid"
      :isCommonSharePopup="commonShareInfo.isCommonSharePopup"
      :changePopupNumber="commonShareInfo.changePopupNumber"
      )
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
</template>

<script>
  import SwiperCommon from '../components/SwiperCommon'
  import CommonSharePopup from '../components/community/CommonSharePopup'
  import ObtainCoursePopup from '../components/community/ObtainCoursePopup'
  import CustomerServicePopup from '../components/community/CustomerServicePopup'
  import VideoPopup from '../components/VideoPopup'
  import NothingCommon from '../components/NothingCommon'
  import weixinConfig from '../mixin/weixinConfig'
  import {
    getCommunityInfo,
    getInviteList,
    postReadTips
  } from '../services/community'
  import {
    getBannerList,
    getVideoInfo
  } from '../services'

  let vm
  export default {
    name: 'Home',
    components: {
      SwiperCommon,
      CommonSharePopup,
      ObtainCoursePopup,
      CustomerServicePopup,
      VideoPopup,
      NothingCommon
    },
    mixins: [weixinConfig],
    data () {
      return {
        isLoad: false,
        swiperOption: { // 轮播设置对应属性
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
          homepageUrl: '', // 个人主页地址
          profit: '', // 收益
          invitationNumber: '', // 邀请人数
          courseNumber: '', // 获得课程数
          courseList: []
        },
        nothingConfig: {
          tips: '暂时没有数据哦～'
        },
        friendList: [],
        commonShareInfo: {
          isCommonSharePopup: false,
          changePopupNumber: 0
        },
        isObtainCoursePopup: false, // 是否已经免费获得课程弹框
        courseInfo: { // 获取课程
          name: '',
          imgSrc: '',
          id: 0
        },
        isCustomerServicePopup: false, // 客服二维码弹框
        customerServiceData: { // 客服弹框值
          differentiate: 1,
          content: '',
          codeSrc: ''
        },
        params: {
          page: 1,
          limit: 20
        },
        isShowVideo: false, // 视频弹框
        videoInfo: {
          imgSrc: '',
          videoUrl: ''
        },
        videoSceneInfo: {}, // 加载过的视频信息
        shareInfo: null
      }
    },
    watch: {
      isCustomerServicePopup (val) {
        // true 显示弹框 false 关闭弹框
        this.$root.$emit('toggleModal', Boolean(val))
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
              this.isObtainCoursePopup = true
            }
          })
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
      }
    },
    created () {
      vm = this
      if (this.isLoadGuestInfo) { // 访客跳转到社群详情
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
          this.$router.replace({ name: '404' })
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
              homepageUrl: data.link.home,
              profit: data.member_info.amount, // 收益
              invitationNumber: data.member_info.invite_number, // 邀请人数
              courseNumber: data.member_info.course_number, // 获得课程数
              courseList: this.transformCourseList(data.course_list || [])
            }

            this.isObtainCoursePopup = giveInfo.is_give === 2
            this.courseInfo = {
              name: giveInfo.title,
              imgSrc: giveInfo.img_url,
              id: giveInfo.give_course_id
            }

            this.customerServiceData.content = giveInfo.customer_text
            this.customerServiceData.codeSrc = giveInfo.customer_qr_code
          }
        })
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
      getList () {
        return getInviteList(this.params)
          .then(res => {
            if (res.data.code === 1) {
              let list = res.data.data.list || []
              this.friendList.push(...this.transformInviteList(list))
              return list
            }
          })
      },
      async loadMore (res) {
        const that = this
        let isLastPage = false
        await that.getList().then(list => {
          isLastPage = that.$_.isLastPage(that.params.limit, list)
        })
        if (isLastPage) {
          that.isLockingLoadMore = true
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
      transformInviteList (source) {
        let list = []
        source.forEach(item => {
          list.push({
            uid: item.uid,
            avatar: item.img_url,
            link: item.home_url,
            name: item.nick_name,
            time: item.create_time,
            number: item.course_number
          })
        })
        return list
      },
      // 跳转个人主页
      jumpHomePage (url) {
        this.$_.entryOtherPage(url)
      },
      // 提现
      withdrawal () {
        this.$_.Toast('即将上线，敬请期待！')
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
          this.getBannerVideo(this.$store.state.sceneInfo.video_course.community_course_home)
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
      // 邀请好友
      inviteFriends () {
        this.commonShareInfo.isCommonSharePopup = true
        this.commonShareInfo.changePopupNumber++
      },
      // 课程邀请好友
      obtainCourseInvite () {
        this.isObtainCoursePopup = false
        this.commonShareInfo.changePopupNumber++
      },
      // 联系客服
      obtainCourseService () {
        this.isObtainCoursePopup = false
        this.isCustomerServicePopup = true
      }
    }
  }
</script>

<style scoped lang="less">
  .whole {
    min-height: 100vh;
    overflow: hidden;
    background: #fff;
  }

  .top-banner {
    margin: 0 .2rem .4rem .2rem;
    height: 1.8rem;
    border-radius: 0 0 .22rem .22rem;
    overflow: hidden;
  }

  .banner-img {
    width: 100%;
    height: 100%;
  }

  .wallet {
    background: linear-gradient(90deg, rgba(255, 118, 6, 1), rgba(254, 64, 6, 1));
    margin: 0 .2rem;
    height: 1.16rem;
    border-radius: .58rem;
    display: flex;
    align-items: center;
    margin-bottom: .54rem;
  }

  .avatar {
    width: .78rem;
    height: .78rem;
    border-radius: 50%;
    margin-left: .12rem;
    margin-right: .18rem;
  }

  .profit { flex: 1; }

  .profit-text {
    font-size: .32rem;
    color: #fff;
  }

  .profit-number {
    font-size: .34rem;
    color: #ffee2d;
  }

  .invitation-text {
    font-size: .24rem;
    color: #f0f3f4;
  }

  .withdraw-btn {
    width: 1.04rem;
    height: 1.04rem;
    margin-right: .1rem;
  }

  .my-course {
    font-size: .34rem;
    color: #333;
    font-weight: bold;
    text-align: center;
  }

  .tips-text {
    font-size: .26rem;
    color: #666;
    text-align: center;
    margin-bottom: .26rem;
  }

  .course-list {
    padding: 0 .34rem;
    overflow: hidden;
  }

  .course-item {
    width: 2.14rem;
    float: left;
    margin-bottom: .2rem;
    margin-right: .2rem;
    position: relative;

    &:nth-child(3n) {
      margin-right: 0;
    }
  }

  .item-img {
    width: 100%;
    height: 2.86rem;
    border-radius: .12rem;
  }

  .locking-cover {
    width: 100%;
    height: 2.86rem;
    border-radius: .12rem;
    background: rgba(0, 0, 0, .6) url('~@icon/community/lock.png') no-repeat top .38rem center;
    background-size: .36rem;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    padding-top: .92rem;
  }

  .locking-text {
    font-size: .3rem;
    color: #ebebeb;
    text-align: center;
  }

  .locking-number {
    color: #fc4a17;
    font-weight: bold;
  }

  .details-btn {
    width: 1.5rem;
    height: .48rem;
    line-height: .48rem;
    font-size: .28rem;
    color: #fff;
    border-radius: .24rem;
    border: 1px solid #fff;
    margin: .2rem auto;
    text-align: center;
  }

  .item-name {
    font-size: .26rem;
    color: #333;
    .ellipsis(1.9rem);

    text-align: center;
    margin-top: .1rem;
    height: .36rem;
    line-height: .36rem;
  }

  .btns-view {
    display: flex;
    justify-content: center;
    margin-top: .3rem;
    margin-bottom: .5rem;
  }

  .ranking-btn,
  .invitation-btn {
    width: 2.8rem;
    height: .74rem;
    border-radius: .37rem;
    border: 2px solid #f9480c;
    margin: 0 .19rem;
    font-size: .3rem;
    color: #ff7506;
    display: flex;
    align-items: center;
    justify-content: center;

    &:active {
      opacity: .7;
    }
  }

  .ranking-btn {
    background: url('~@icon/community/ranking.png') no-repeat right .66rem center;
    background-size: .5rem;
    padding-right: .66rem;
  }

  .invitation-btn {
    background: url('~@icon/community/invitation.png') no-repeat right .5rem center;
    background-size: .5rem;
    padding-right: .5rem;
  }

  .invitation-title {
    font-size: .34rem;
    color: #333;
    text-align: center;
  }

  .friend-item {
    position: relative;
    height: 1.46rem;
    display: flex;
    padding: 0 .34rem;
    align-items: center;

    &::after {
      position: absolute;
      bottom: 0;
      left: 1rem;
      right: 0;
      content: '';
      border-bottom: 1px dashed #ebebeb;
      transform: scaleY(.5);
    }
  }

  .friend-avatar {
    width: .8rem;
    height: .8rem;
    border-radius: 50%;
    margin-right: .2rem;
  }

  .friend-right {
    display: flex;
    align-items: center;
    flex: 1;
  }

  .friend-info {
    flex: 1;
  }

  .friend-name {
    font-size: .3rem;
    color: #333;
    .ellipsis(2.5rem);
  }

  .register-time {
    font-size: .22rem;
    color: #ccc;
  }

  .friend-course {
    font-size: .32rem;
    color: #999;
  }
</style>
