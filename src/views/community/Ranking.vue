<template lang="pug">
  div.ranking(v-if="isLoad")
    div.ranking-banner
      SwiperCommon(:slides="bannerList" :swiperOptions="swiperOption")
        template(
          v-for="(item, index) in bannerList"
          :slot="index"
        )
          img.img(:src="item.pic")
    div.ranking-info
      div(:class="{ 'king-view': infoData.isKing }")
        img.portrait(v-lazy="infoData.portrait")
      div.middle
        p.nickname {{infoData.nickname}}
        p.text 集福{{infoData.number}}人
      button.immediately(type="button" @click="isPostersSharePopup = true") 立即集福
    div.ranking-top
      p.title-ranking 排名
      p.title-name 用户
      p.title-course 已有课程
    ul.ranking-list(v-if="list.length")
      li.ranking-item(v-for="(item, index) in list" :key="index")
        div.item-left
          div.item-view
            span(:class="index < 3 ? 'medal_icon_' + index : ''") {{index < 3 ? '' : index + 1}}
          div.item-info
            div(:class="{ 'king-view': item.isKing }")
              img.avatar(v-lazy="item.avatar")
            button.entry(
              type="button"
              v-if="item.isCard"
              @click="jumpCardDetails(item.link)"
              ) 进入名片
          p.item-name {{item.name}}
        div.item-right
          p 已拥有
            span.number {{item.courseNumber}}
            | 门课程
          p 共获收益
            span.number {{item.profitNumber}}
            | 元
          p 已集福
            span.number {{item.inviteNumber}}
            | 人
    NothingCommon(v-else :config="nothingConfig")
    infinite-loading(@infinite="loadMore")
      div(slot="spinner")
      div(slot="no-more")
      div(slot="no-results") {{noResults}}
    VideoPopup(:isShow="isShowVideo" :video="videoInfo" @videoClose="isShowVideo = false")
    PostersSharePopup(
      v-if="isPostersSharePopup"
      :fromUid="uid"
      @close="isPostersSharePopup = false"
      )
    TechnicalSupport
</template>

<script>
  import SwiperCommon from '../../components/SwiperCommon'
  import NothingCommon from '../../components/NothingCommon'
  import VideoPopup from '../../components/VideoPopup'
  import PostersSharePopup from '../../components/community/PostersSharePopup'
  import TechnicalSupport from '../../components/TechnicalSupport'
  import {
    getRankingList
  } from '../../services/community'
  import {
    getBannerList,
    getVideoInfo
  } from '../../services'
  let vm
  export default {
    name: 'Ranking',
    components: {
      SwiperCommon,
      NothingCommon,
      VideoPopup,
      PostersSharePopup,
      TechnicalSupport
    },
    data () {
      return {
        isLoad: false,
        bannerList: [], // banner
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
        isLoadBanner: false,
        isPostersSharePopup: false, // 邀请海报
        list: [], // 排行榜
        params: {
          page: 1,
          limit: 20
        },
        isShowVideo: false, // 视频弹框
        videoInfo: { // 视频弹框值
          imgSrc: '',
          videoUrl: ''
        },
        videoSceneInfo: {}, // 加载过的视频信息
        nothingConfig: {
          tips: '暂时没有数据哦～'
        }
      }
    },
    watch: {
      isLoadGuestInfo () {
        this.main()
      },
      isShowVideo (val) {
        this.$root.$emit('toggleModal', Boolean(val))
      },
      bannerScene () {
        this.getBannerList()
      },
      uid () {
        this.getBannerList()
      }
    },
    computed: {
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
      },
      noResults () {
        return this.list.length ? '没有更多了哦' : ''
      },
      // banner的场景值
      bannerScene () {
        return this.$store.state.sceneInfo.ad.community_course_rank
      },
      infoData () {
        return {
          portrait: this.$store.state.personalInfo.avatar, // 头像
          nickname: this.$store.state.personalInfo.nickname, // 用户昵称
          number: this.$store.state.personalInfo.inviteNum, // 集福人数
          isKing: this.$store.state.personalInfo.isKing // 是否是福王
        }
      }
    },
    created () {
      vm = this
      if (this.isLoadGuestInfo) {
        this.main()
      }
    },
    methods: {
      main () {
        if (this.isGuest) {
          return
        }
        this.isLoad = true
        this.getBannerList()
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
          this.getBannerVideo(this.$store.state.sceneInfo.video_course.community_course_rank)
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
       * 获取邀请的好友列表
       */
      getList () {
        return getRankingList(this.params)
          .then(res => {
            if (res.data.code === 1) {
              let list = res.data.data.list || []
              this.list.push(...this.transformRankingList(list))
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
       * 跳转到链脉名片
       * @param link{String} 跳转链接地址
       */
      jumpCardDetails (link) {
        this.$_.entryOtherPage(link)
      },
      /**
       * 排行榜列表数据转换
       * @param source {Object} 需要转换的数据源
       * @return {Object} 转换后可以直接使用的结构
       */
      transformRankingList (source) {
        let list = []
        source.forEach(item => {
          list.push({
            uid: item.uid,
            avatar: item.img_url,
            isCard: !!item.card_url,
            link: item.card_url,
            name: item.nick_name,
            courseNumber: item.course_number,
            profitNumber: item.amount,
            inviteNumber: item.invite_number,
            isKing: item.is_mr_king // 是否是福王
          })
        })
        return list
      }
    }
  }
</script>

<style scoped lang="less">
  .ranking {
    min-height: 100vh;
    background-color: #fff;

    &-banner {
      width: 7.1rem;
      height: 1.8rem;
      margin: auto;
      border-bottom-left-radius: .22rem;
      border-bottom-right-radius: .22rem;
      overflow: hidden;

      .img {
        width: 100%;
        height: 100%;
        border-bottom-left-radius: .22rem;
        border-bottom-right-radius: .22rem;
      }
    }

    &-info {
      display: flex;
      align-items: center;
      width: 7rem;
      margin: .48rem auto;
      height: 1.4rem;
      padding: 0 .22rem;
      box-shadow: 0 1px 4px 0 rgba(204, 204, 204, .35);
      border-radius: .08rem;

      .portrait {
        width: .74rem;
        height: .74rem;
        border-radius: 1rem;
      }

      .middle {
        flex: 1;
        margin-left: .2rem;
        line-height: 1.4;
      }

      .nickname {
        color: #333;
        font-size: .34rem;
        .ellipsis(2.8rem);
      }

      .text {
        color: #999;
        font-size: .28rem;
      }

      .immediately {
        color: #fff;
        font-size: .3rem;
        width: 1.8rem;
        height: .5rem;
        border-radius: 1rem;
        margin-right: .14rem;
        background: linear-gradient(to right, #fec901, #ff9104);

        &:active {
          background: linear-gradient(to left, #fec901, #ff9104);
        }
      }
    }

    &-top {
      height: .9rem;
      display: flex;
      align-items: center;
      background: #fff;
      border-radius: .22rem .22rem 0 0;
      font-size: .32rem;
      color: #666;
      text-align: center;
    }
    &-list { border-top: 1px solid #e4e4e4; }

    &-item {
      position: relative;
      display: flex;
      padding: .24rem 0 .42rem 0;

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
  }

  .title {
    &-ranking {
      width: 1.04rem;
    }

    &-name {
      flex: 1;
      padding-left: .8rem;
    }

    &-course {
      width: 2.9rem;
    }
  }

  .item {
    &-left {
      flex: 1;
      display: flex;
      align-items: center;
    }

    &-view {
      width: 1rem;
      font-size: .3rem;
      color: #666;
      font-weight: bold;
      text-align: center;
    }

    &-info {
      position: relative;
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-right: .06rem;
      min-width: 1.2rem;

      .avatar {
        width: .8rem;
        height: .8rem;
        border-radius: 50%;
      }

      .entry {
        position: absolute;
        bottom: -.32rem;
        left: 0;
        color: #fbbc05;
        font-size: .24rem;
        transform: scale(.84);
        border: 1px solid #fbbc05;
        border-radius: .04rem;
        padding: .02rem .06rem;
        line-height: 1.4;
        box-shadow: 0 1px 2px 0 rgba(179, 123, 3, .48);
        background-color: #fff;

        &:active {
          background-color: darken(#fff, 5%);
        }
      }
    }

    &-right {
      color: #999;
      font-size: .26rem;
      text-align: right;
      padding-right: .3rem;

      .number {
        color: #ff4c49;
      }
    }

    &-name {
      font-size: .3rem;
      color: #333;
      .ellipsis(2.4rem);
    }
  }

  .medal_icon_0,
  .medal_icon_1,
  .medal_icon_2 {
    display: block;
    width: .5rem;
    height: .58rem;
    background-repeat: no-repeat;
    background-position: center;
    background-size: contain;
    margin: auto;
  }

  .medal_icon_0 {
    background-image: url('~@icon/community/medal_icon_1.png');
  }

  .medal_icon_1 {
    background-image: url('~@icon/community/medal_icon_2.png');
  }

  .medal_icon_2 {
    background-image: url('~@icon/community/medal_icon_3.png');
  }

  .king-view {
    padding: .03rem;
    border: .02rem solid #ff4c49;
    border-radius: 50%;
    position: relative;

    &::after {
      width: .42rem;
      height: .3rem;
      background: url('~@icon/mine/king-icon.png') no-repeat;
      background-size: 100%;
      content: '';
      position: absolute;
      left: 0;
      right: 0;
      top: -.29rem;
      margin: 0 auto;
      z-index: 1;
    }

    .portrait,
    .avatar {
      border: 1px solid #ff4c49;
    }
  }
</style>
