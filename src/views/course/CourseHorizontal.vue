<template lang="pug">
  div.whole
    HorizontalVideo(
      :data="data"
      @clickSetRemind="$emit('clickSetRemind')"
      @followBtnClick="$emit('followBtnClick')"
    )
    LearningArea(
      @shareBtnClick="$emit('shareBtnClick')"
      @seeVideo="seeVideo"
    )
    BottomView(
      :data="bottomInfo"
      @clickBulletChat="bottomInfo.isShow = !bottomInfo.isShow"
      @clickReward="$emit('clickReward')"
      @clickMore="isShowMore = true"
      @clickComment="commentInfo.isShow = true"
    )
    PopupChat(:chatInfo="chatInfo" :isShowPopup="bottomInfo.isShow")
    PopupMore(
      :isShow="isShowMore"
      @close="isShowMore = false"
      @collect="$emit('collectBtnClick')"
    )
    CommentArea(:data="commentInfo" @close="commentInfo.isShow = false")
</template>

<script>
  import PopupChat from '../../components/course/PopupChat'
  import PopupMore from '../../components/course/PopupMore'
  import HorizontalVideo from '../../components/course/HorizontalVideo'
  import LearningArea from '../../components/course/LearningArea'
  import BottomView from '../../components/course/BottomView'
  import CommentArea from '../../components/course/CommentArea'
  
  export default {
    name: 'CourseHorizontal',
    components: {
      PopupChat,
      PopupMore,
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
          return {}
        }
      }
    },
    data () {
      return {
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
        bottomInfo: {
          isShow: true
        },
        commentInfo: {
          isShow: false
        }
      }
    },
    methods: {
      seeVideo (info) {
        this.$emit('seeVideo', info)
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
