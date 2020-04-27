<template lang="pug">
  div.whole
    HorizontalVideo(
      :data="data"
      @clickSetRemind="$emit('clickSetRemind')"
      @followBtnClick="$emit('followBtnClick')"
    )
    LearningArea(
      :list="data.studyList"
      :chatInfo="data.chatInfo"
      @shareBtnClick="$emit('shareBtnClick')"
      @seeVideo="seeVideo"
      @contentBackClick=""
    )
    BottomView(
      :data="bottomInfo"
      :state="data.state"
      :isShowChat="data.chatInfo.isShow"
      @clickItem="clickBottomItem"
      @sendComment="sendComment"
    )
    PopupMore(
      :isShow="isShowMore"
      @close="isShowMore = false"
      @collect="$emit('collectBtnClick')"
    )
    CommentArea(
      :data="commentInfo"
      :list="data.commentList"
      :isProblem="bottomInfo.isProblem"
      @close="commentInfo.isShow = false"
      @problemClick="clickBottomItem"
    )
</template>

<script>
  import PopupMore from '../../components/course/PopupMore'
  import HorizontalVideo from '../../components/course/HorizontalVideo'
  import LearningArea from '../../components/course/LearningArea'
  import BottomView from '../../components/course/BottomView'
  import CommentArea from '../../components/course/CommentArea'
  
  export default {
    name: 'CourseHorizontal',
    components: {
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
        isShowMore: false, // 是否显示更多弹窗
        bottomInfo: {
          isShow: true,
          isProblem: false
        },
        commentInfo: {
          isShow: false
        }
      }
    },
    computed: {
      isNotBroadcast () {
        return this.data.state === 0
      }
    },
    methods: {
      seeVideo (info) {
        this.$emit('seeVideo', info)
      },
      /**
       * 点击课程底部操作逻辑
       */
      clickBottomItem (type) {
        if (this.isNotBroadcast && type !== 4) {
          return
        }
        switch (type) {
        case 1:
          // 显示、隐藏弹幕
          this.$emit('clickChat')
          break
        case 2:
          // 点击讨论区
          this.commentInfo.isShow = true
          break
        case 3:
          // 打赏
          this.$emit('clickReward')
          break
        case 4:
          // 更多
          this.isShowMore = true
          break
        case 5:
          // 选择、取消提问
          this.bottomInfo.isProblem = !this.bottomInfo.isProblem
          break
      
        default:
          break
        }
      },
      /**
       * 发送评论
       */
      sendComment (text) {
        this.$emit('sendComment', text)
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
