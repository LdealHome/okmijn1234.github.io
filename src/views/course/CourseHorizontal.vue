<template lang="pug">
  div.whole
    HorizontalVideo(
      :data="data"
      :navBarCurrent="differentiateIndex"
      @switchTab="switchTab"
      @clickSetRemind="$emit('clickSetRemind')"
      @followBtnClick="$emit('followBtnClick')"
    )
    template
      LearningArea(
        v-if="differentiateIndex === 0"
        :studyListInfo="data.studyListInfo"
        :state="data.state"
        @shareBtnClick="$emit('shareBtnClick')"
        @seeVideo="seeVideo"
        @clickItem="clickLearningItem"
        @loadMore="loadMore"
        @cancelComment="cancelComment"
        @changeStudyRollState="changeRollState"
      )
      CommentArea(
        v-show="differentiateIndex === 1"
        :data="data"
        :commentInfo="commentInfo"
        @close="commentInfo.isShow = false"
        @loadMore="loadMore"
        @clickItem="clickLearningItem"
        @changeCommentRollState="changeRollState"
        @commentClick="commentClick"
        @cancelReply="cancelComment"
      )
    BottomView(
      v-show="!isShowEditView"
      :data="bottomInfo"
      :liveInfo="data"
      @clickItem="clickBottomItem"
    )
    EditView(
      v-show="isShowEditView"
      :data="data"
      :isProblem="bottomInfo.isProblem"
      :changeInfo="changeInfo"
      :replyInfo="replyInfo"
      @contentBlur="contentBlur"
      @sendComment="sendComment"
      @clickItem="clickBottomItem"
    )
    PopupMore(
      :isShow="isShowMore"
      @close="isShowMore = false"
      @collect="$emit('collectBtnClick')"
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
  import EditView from '../../components/course/EditView'
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
      PhotoSwipe,
      EditView
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
        isShowEditView: false,
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
        differentiateIndex: 1, // 显示资料区还是互动区0资料区，1互动区
        editContent: '',
        preparedInfo: null,
        replyCacheList: {},
        replyInfo: {
          content: '',
          isReply: false,
          id: 0
        },
        changeInfo: {
          emptyNumber: 0,
          focusNumber: 0
        }
      }
    },
    watch: {
      isShowEditView (val) {
        if (val) {
          this.changeInfo.focusNumber++
        }
      }
    },
    computed: {
      isNotBroadcast () {
        return this.data.state === 0
      },
      // 访客
      isGuest () {
        return this.$store.state.guest
      },
      uid () {
        return this.$store.state.personalInfo.uid
      }
    },
    methods: {
      switchTab (index) {
        this.differentiateIndex = index
      },
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
        case 6:
          // 评论
          this.isShowEditView = true
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
        if (!info.text) {
          if (this.replyInfo.id) {
            this.$_.Toast('请输入评论的内容')
          } else {
            this.isShowEditView = false
          }
          return
        }
        if (this.differentiateIndex === 0 && !this.data.role) {
          this.differentiateIndex = 1
        }
        this.editContent = ''
        this.$emit('sendComment', info)
        this.replyInfo.id && (this.replyCacheList[this.replyInfo.id] = '')
        this.replyInfo = {
          content: '',
          isReply: false
        }
      },
      loadMore (type, res) {
        this.$emit('loadMore', type, res)
      },
      /**
       * 取消评论、取消回复
       */
      cancelComment () {
        if (!this.editContent) {
          if (this.replyInfo.id) {
            this.replyInfo = {
              content: '',
              isReply: false
            }
          } else {
            this.isShowEditView = false
          }
        }
      },
      changeRollState (info) {
        this.$emit('changeRollState', info)
      },
      commentClick (index) {
        if (!this.data.commentListInfo.list[index] ||
          this.data.commentListInfo.list[index].id === this.replyInfo.id ||
          this.data.commentListInfo.list[index].userInfo.uid === this.uid ||
          this.data.commentListInfo.list[index].label
        ) return
        this.isShowEditView = true
        this.preparedInfo = {
          content: this.data.commentListInfo.list[index].content,
          isReply: true,
          id: this.data.commentListInfo.list[index].id,
          name: this.data.commentListInfo.list[index].userInfo.name,
          uid: this.data.commentListInfo.list[index].userInfo.uid,
          isAsk: this.data.commentListInfo.list[index].type === 2,
          defaultText: this.replyCacheList[this.data.commentListInfo.list[index].id] || ''
        }
        // // 让输入框获取焦点
        setTimeout(() => {
          if (this.preparedInfo) {
            this.changeInfo.emptyNumber++
            this.replyInfo = this.preparedInfo
            this.preparedInfo = null
            this.changeInfo.focusNumber++
          }
        }, 100)
      },
      contentBlur (text) {
        this.editContent = text
        if (this.replyInfo.isReply) {
          this.replyCacheList[this.replyInfo.id] = text
        }
        if (this.preparedInfo) {
          this.changeInfo.emptyNumber++
          this.replyInfo = this.preparedInfo
          this.preparedInfo = null
          this.changeInfo.focusNumber++
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
