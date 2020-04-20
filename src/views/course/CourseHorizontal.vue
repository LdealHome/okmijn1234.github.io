<template lang="pug">
  div.whole
    HorizontalVideo(:data="data")
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
    props: {
      data: {
        type: Object,
        required: true,
        default () {
          return {
            id: 0, // 课程id
            video: { // 视频信息
              src: '',
              poster: ''
            },
            state: '', // 直播状态 0: 未开始 1:直播中 2:回放
            personTime: '', // 人次
            time: 0 // state对应不同时间 state：0距离直播开始时间 1直播播放的位置 
          }
        }
      }
    },
    data () {
      return {
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
          isShow: false
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
