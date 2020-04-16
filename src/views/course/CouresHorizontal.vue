<template lang="pug">
  div.whole
    HorizontalVideo(:data="videoInfo")
    RewardPopup(:rewardInfo="rewardInfo" @close="rewardInfo.isShow = false")
    PopupChat(:chatInfo="chatInfo")
    PopupMore(
      :isShow="isShowMore"
      @close="isShowMore = false"
      @collect="isShowCollect = true"
    )
    GuideCollection(:isShow="isShowCollect" @close="isShowCollect = false")
</template>

<script>
  import RewardPopup from '../../components/course/RewardPopup'
  import PopupChat from '../../components/course/PopupChat'
  import PopupMore from '../../components/course/PopupMore'
  import GuideCollection from '../../components/course/GuideCollection'
  import HorizontalVideo from '../../components/course/HorizontalVideo'
  export default {
    name: 'CouresHorizontal',
    components: {
      RewardPopup,
      PopupChat,
      PopupMore,
      GuideCollection,
      HorizontalVideo
    },
    data () {
      return {
        videoInfo: {
          video: {
            src: 'http://ugcws.video.gtimg.com/uwMROfz2r5zEIaQXGdGnC2dfJ7xlHUZLN7WLSNBHzUj-9W46/s0554ze0ism.p712.1.mp4?sdtfrom=v1010&guid=de0aa55dc85e5c91571fb88b9cbf7e56&vkey=FEE52AA4063548F39465ADB1E159E2F6A6492D50B028B34A93253F99F5A0F772E6CEB6820E467542F595CFE1DAE2108450AACAB27E36B681DA0BF94EF427314156ED74CBCB8CE6DFA69AC577DD38B8E0F85688D5A22C1F05DB86B3DFB2FDFD49F35A1EA262E6706219FE76E166D557C093F7BBC615637382A4626650749BD878',
            poster: 'https://ss0.bdstatic.com/94oJfD_bAAcT8t7mm9GUKT-xh_/timg?image&quality=100&size=b4000_4000&sec=1587019804&di=17125ec28a30508c4150b7b144cd4529&src=http://www.jinmen.cc/data/attachment/forum/201410/26/124432kjqjnryjtvnzj6ia.jpg'
          },
          state: 0, // 直播状态 0: 未开始 1:直播中 2:回放
          personTime: 0 // 人次
        },
        rewardInfo: {
          isShow: false,
          title: '喜欢讲师',
          avatar: '',
          name: '册撒发给'
        },
        chatInfo: {
          isShow: false,
          list: [
            {
              id: 0,
              avatar: '',
              text: '回复问题',
              isAsk: false
            },
            {
              id: 1,
              avatar: '',
              text: '回复问题',
              isAsk: true
            }
          ]
        },
        isShowMore: false,
        isShowCollect: false
      }
    }
  }
</script>

<style scoped lang="less">
  .whole {
    height: 100vh;
    background: #f8f8f8;
    display: flex;
    flex-direction: column;
  }
</style>
