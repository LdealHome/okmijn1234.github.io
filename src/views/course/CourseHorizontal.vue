<template lang="pug">
  div.whole
    HorizontalVideo(:data="videoInfo")
    LearningArea
    BottomView(
      :data="bottomInfo"
      @clickBulletChat="bottomInfo.isShow = !bottomInfo.isShow"
      @clickReward="rewardInfo.isShow = true"
      @clickMore="isShowMore = true"
      @clickComment="commentInfo.isShow = true"
    )
    RewardPopup(:rewardInfo="rewardInfo" @close="rewardInfo.isShow = false")
    PopupChat(:chatInfo="chatInfo" :isShowPopup="bottomInfo.isShow")
    PopupMore(
      :isShow="isShowMore"
      @close="isShowMore = false"
      @collect="isShowCollect = true"
    )
    GuideCollection(:isShow="isShowCollect" @close="isShowCollect = false")
    CommentArea(:data="commentInfo" @close="commentInfo.isShow = false")
</template>

<script>
  import RewardPopup from '../../components/course/RewardPopup'
  import PopupChat from '../../components/course/PopupChat'
  import PopupMore from '../../components/course/PopupMore'
  import GuideCollection from '../../components/course/GuideCollection'
  import HorizontalVideo from '../../components/course/HorizontalVideo'
  import LearningArea from '../../components/course/LearningArea'
  import BottomView from '../../components/course/BottomView'
  import CommentArea from '../../components/course/CommentArea'
  
  export default {
    name: 'CourseHorizontal',
    components: {
      RewardPopup,
      PopupChat,
      PopupMore,
      GuideCollection,
      HorizontalVideo,
      LearningArea,
      BottomView,
      CommentArea
    },
    data () {
      return {
        videoInfo: {
          video: {
            src: 'http://ugcydzd.qq.com/uwMROfz2r5zEIaQXGdGnC2dfJ7xlHUZLN7WLSNBHzUj-9W46/s0554ze0ism.p712.1.mp4?sdtfrom=v1010&guid=de0aa55dc85e5c91571fb88b9cbf7e56&vkey=26D795CC2749B740DFB446744191E454467C179044FE51E97EAF13C9D729691798DD12CA3D7B67A1D78A0C3AC7E137B1E5BF1415DEDF6A25C48BB212F278548C38E465C942C68AFB845CF1C1E0AEEAA313F8C970C6FAA38A04068E396D8DD6C24CE3199A39858EBB7F502545CFCC95EE6E1D83B35901AF18B660382A962A310E#t=37',
            poster: 'https://ss0.bdstatic.com/94oJfD_bAAcT8t7mm9GUKT-xh_/timg?image&quality=100&size=b4000_4000&sec=1587019804&di=17125ec28a30508c4150b7b144cd4529&src=http://www.jinmen.cc/data/attachment/forum/201410/26/124432kjqjnryjtvnzj6ia.jpg'
          },
          state: 0, // 直播状态 0: 未开始 1:直播中 2:回放
          personTime: 0, // 人次
          time: 60
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
        isShowMore: false, // 是否显示更多弹窗
        isShowCollect: false, // 是否显示收藏引导弹窗
        bottomInfo: {
          isShow: true
        },
        commentInfo: {
          isShow: true
        }
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
