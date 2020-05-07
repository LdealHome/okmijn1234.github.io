<template lang="pug">
  div.whole
    HorizontalVideo(
      :data="data"
      @clickSetRemind="$emit('clickSetRemind')"
      @followBtnClick="$emit('followBtnClick')"
    )
    LearningArea(
      :studyListInfo="data.studyListInfo"
      :chatInfo="data.chatInfo"
      @shareBtnClick="$emit('shareBtnClick')"
      @seeVideo="seeVideo"
      @clickItem="clickLearningItem"
      @loadMore="loadMore"
      @cancelComment="cancelComment"
      @showCommentPopup="commentInfo.isShow = true"
    )
    BottomView(
      :data="bottomInfo"
      :liveInfo="data"
      :changeEditState="changeEditState"
      @clickItem="clickBottomItem"
      @sendComment="sendComment"
    )
    PopupMore(
      :isShow="isShowMore"
      @close="isShowMore = false"
      @collect="$emit('collectBtnClick')"
    )
    CommentArea(
      :data="data"
      :commentInfo="commentInfo"
      :isProblem="bottomInfo.isProblem"
      @close="commentInfo.isShow = false"
      @problemClick="clickBottomItem"
      @loadMore="loadMore"
      @sendComment="sendComment"
      @clickItem="clickLearningItem"
    )
    PhotoSwipe(
      :photoSwipeInit="photoSwipeInit"
      :photoSwipeData="photoSwipeData"
      @close="photoSwipeInit = false"
    )
</template>

<script>
  import PopupMore from '../../components/course/PopupMore'
  import HorizontalVideo from '../../components/course/HorizontalVideo'
  import LearningArea from '../../components/course/LearningArea'
  import BottomView from '../../components/course/BottomView'
  import CommentArea from '../../components/course/CommentArea'
  import PhotoSwipe from '../../components/PhotoSwipe'
  
  export default {
    name: 'CourseHorizontal',
    components: {
      PopupMore,
      HorizontalVideo,
      LearningArea,
      BottomView,
      CommentArea,
      PhotoSwipe
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
          isProblem: false
        },
        commentInfo: {
          isShow: false
        },
        photoSwipeData: { // 图片预览的数据结构
          list: [],
          target: null
        },
        photoSwipeInit: false, // 是否显示图片预览
        changeEditState: 0
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
       * 点击学习区各种消息类型
       * @param info {Object} 消息信息
       * @param info.type {Number} 消息类型 1: 普通评论 2提问的评论 3: 回复普通评论 4: 回复提问评论 5: 打赏信息 6: 视频资料 7: 图片资料 8分享记录 100 :撤回 101: 删除评论 101: 禁言、解除禁言
       */
      clickLearningItem (info) {
        switch (info.type) {
        case 1:
          break
        case 5:
          // 打赏
          this.$emit('clickReward')
          break
        case 6:
          // 查看视频
          this.$emit('seeVideo', {
            type: 2,
            videoInfo: info.videoInfo
          })
          break
        case 7:
          // 查看资料图片
          this.photoSwipeData.target = info.e.target
          this.photoSwipeData.list = document.querySelectorAll('.picture-item[lazy=loaded]')
          this.photoSwipeInit = true
          break
        case 8:
          // 显示分享海报弹窗
          this.$emit('shareBtnClick')
          break
        case 100:
        case 101:
        case 102:
          this.$emit('changeMessage', info)
          break
        default:
          break
        }
      },
      /**
       * 发送评论
       */
      sendComment (info) {
        this.$emit('sendComment', info)
      },
      loadMore (type, res) {
        this.$emit('loadMore', type, res)
      },
      cancelComment () {
        this.changeEditState++
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
