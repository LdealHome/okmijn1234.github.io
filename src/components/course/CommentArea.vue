<template lang="pug">
  div.interactive
    div.right-anchor
      span.anchor-top(@click="rollTopClick")
      span.anchor-bottom(@click="rollBottomClick")
    div.comment-back(ref="commentList" @scroll="scrollEvent")
      ListComment.comment-list-back(
        :list="data.commentListInfo.list"
        type="comment"
        :role="data.role"
        :serverTime="data.serverTime"
        @clickItem="clickItem"
        @commentClick="commentClick"
        @showManageView="showManageView"
        @cancelReply="cancelReply"
        @fingersAway="fingersAway"
      )
      infinite-loading(@infinite="loadMore" direction="top" :identifier="identifier")
        div(slot="spinner")
        div(slot="no-more")
        div(slot="no-results")
    div.manage-view(v-show="isShowManageView" :style="manageStyle" ref="manageView")
      p.delete-item(@click="deleteComment") 删除评论
      p.forbidden-words(@click="forbiddenWords" :class="{ 'locking-btn': fingerPosition.role }") {{forbiddenWordsText}}
</template>

<script>
  import ListComment from './ListComment'
  export default {
    name: 'CommentArea',
    components: {
      ListComment
    },
    props: {
      data: {
        type: Object,
        required: true,
        default () {
          return {
            commentListInfo: {
              list: [],
              params: {
                page: 1
              },
              rollBottom: 0,
              forbiddenWordsList: []
            }
          }
        }
      },
      commentInfo: {
        type: Object,
        required: true,
        default () {
          return {
            isShow: false
          }
        }
      }
    },
    data () {
      return {
        isShow: false,
        changeInfo: {
          emptyNumber: 0,
          focusNumber: 0
        },
        editContent: '',
        replyInfo: {
          content: '',
          isReply: false,
          id: 0
        },
        replyCacheList: {},
        isShowManageView: false,
        fingerPosition: {
          x: 0,
          y: 0,
          uid: 0,
          role: 0
        },
        identifier: 0,
        screenInfo: {
          width: 0,
          height: 0
        },
        isBottom: true,
        isClickableManage: false
      }
    },
    created () {
      this.isShow = this.isShowPopup
    },
    mounted () {
      this.screenInfo = {
        width: document.body.clientWidth,
        height: document.body.clientHeight
      }
    },
    watch: {
      isShow (val) {
        this.$root.$emit('toggleModal', Boolean(val))
        if (!val) {
          this.$emit('close')
          this.isShowManageView = false
        }
      },
      isShowPopup (val) {
        if (val) {
          if (!this.data.commentListInfo.list.length) {
            this.identifier++
          }
          this.isShow = true
        }
      },
      rollBottom () {
        this.rollBottomClick()
      }
    },
    computed: {
      isShowPopup () {
        return this.commentInfo.isShow
      },
      rollBottom () {
        return this.data.commentListInfo.rollBottom
      },
      manageStyle () {
        return {
          'left': this.fingerPosition.x + 'px',
          'top': this.fingerPosition.y + 'px'
        }
      },
      uid () {
        return this.$store.state.personalInfo.uid
      },
      forbiddenWordsText () {
        return this.data.commentListInfo.forbiddenWordsList.includes(this.fingerPosition.uid) ? '解除禁言' : '禁言'
      },
      // 访客
      isGuest () {
        return this.$store.state.guest
      }
    },
    methods: {
      /**
       * 滚动监听
       */
      scrollEvent () {
        this.isShowManageView = false
        let scrollTop = this.$refs.commentList.scrollTop
        let scrollHeight = this.$refs.commentList.scrollHeight
        let offsetHeight = this.$refs.commentList.offsetHeight
        // 滚动到底部时告诉父组件，在接受到新的消息时，滚动到新消息位置
        if ((scrollTop + offsetHeight) >= scrollHeight - 1) {
          this.isBottom = true
          this.$emit('changeCommentRollState', { type: 'commentListInfo', state: true })
        } else if (this.isBottom) {
          this.isBottom = false
          this.$emit('changeCommentRollState', { type: 'commentListInfo', state: false })
        }
      },
      rollTopClick () {
        this.$refs.commentList.scrollTop = 0
      },
      rollBottomClick () {
        this.$refs.commentList.scrollTop = this.$refs.commentList.scrollHeight
      },
      loadMore (res) {
        this.$emit('loadMore', 'commentListInfo', res)
      },
      clickItem (info) {
        this.$emit('clickItem', info)
      },
      /**
       * 点击评论。回复处理
       */
      commentClick (index) {
        this.isShowManageView = false
        if (!this.isGuest) this.$emit('commentClick', index)
      },
      /**
       * 取消回复评论，更新状态为普通评论
       */
      cancelReply () {
        this.isShowManageView = false
        this.$emit('cancelReply')
      },
      /**
       * 管理员长按评论，显示删除评论弹窗
       * @param info {Object} { x: 手指按下的x坐标，y: y坐标 }
       */
      showManageView (info) {
        this.isClickableManage = false
        this.fingerPosition = info
        let { x, y } = this.fingerPosition
        this.isShowManageView = true
        this.$nextTick(() => {
          // 更新操作弹窗位置，显示在屏幕内
          let maxXNmber = this.screenInfo.width - this.$refs.manageView.offsetWidth - 10
          this.fingerPosition.x = x < maxXNmber ? x : maxXNmber
          let maxYNmber = this.screenInfo.height - this.$refs.manageView.offsetHeight - 10
          this.fingerPosition.y = y < maxYNmber ? y : maxYNmber
        })
      },
      /**
       * 长按结束后，才能点击禁言/删除评论
       */
      fingersAway () {
        setTimeout(() => {
          this.isClickableManage = true
        }, 100)
      },
      /**
       * 删除评论
       */
      deleteComment () {
        if (!this.isClickableManage) return
        this.isShowManageView = false
        this.$emit('clickItem', {
          type: 101,
          id: this.fingerPosition.id
        })
      },
      /**
       * 禁言/解除禁言
       */
      forbiddenWords () {
        if (this.fingerPosition.role || !this.isClickableManage) return
        this.isShowManageView = false
        this.$emit('clickItem', {
          type: 102,
          uid: this.fingerPosition.uid
        })
      }
    }
  }
</script>

<style scoped lang="less">
  .interactive {
    flex: 1;
    overflow: auto;
    position: relative;
  }

  .comment-back {
    height: 100%;
    overflow: auto;
    -webkit-overflow-scrolling: touch;
  }

  .comment-list-back {
    height: 100%;
    word-break: break-all;
    -webkit-user-select: none;
    user-select: none;
    -webkit-touch-callout: none;
  }

  .comment-bottom {
    box-shadow: 0 0 .03rem 0 rgba(206, 202, 202, 1);
    height: .98rem;
    padding: 0 .42rem;
    display: flex;
    align-items: center;
  }

  .comment-left {
    display: flex;
    flex: 1;
    height: .72rem;
    align-items: center;
    border-radius: .36rem;
    background: #f8f8f8;
    padding-left: .2rem;
  }

  .send-btn {
    font-size: .28rem;
    color: #262626;
    padding: 0 .2rem 0 .32rem;
  }

  .comment-input {
    font-size: .28rem;
    color: #a3a3a3;
    background: none;
    flex: 1;
    width: 1rem;
  }

  .problem-btn {
    margin-left: .1rem;
    padding: 0 .2rem 0 .34rem;
  }

  .right-anchor {
    height: 1.55rem;
    position: absolute;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    top: 0;
    bottom: 0;
    margin: auto 0;
    right: .3rem;
    z-index: 10;
  }

  .anchor-top,
  .anchor-bottom {
    width: .5rem;
    height: .5rem;
    padding: .1rem;
    box-sizing: content-box;

    &:active {
      transform: scale(1.1);
    }
  }

  .anchor-top {
    background: url('~@icon/course/top-arrow.png') no-repeat center center;
    background-size: .5rem;
  }

  .anchor-bottom {
    background: url('~@icon/course/bottom-arrow.png') no-repeat center center;
    background-size: .5rem;
  }

  .manage-view {
    position: fixed;
    display: flex;
    background: rgba(5, 0, 1, .7);
    border-radius: .08rem;
    font-size: .24rem;
    color: #fff;
    z-index: 30;
    white-space: nowrap;
    word-break: break-all;
    -webkit-user-select: none;
    user-select: none;
    -webkit-touch-callout: none;
  }

  .delete-item,
  .forbidden-words {
    height: .5rem;
    line-height: .5rem;
    padding: 0 .17rem;

    &:active {
      color: #f9d400;
    }
  }

  .forbidden-words {
    position: relative;
    margin-left: .04rem;
    padding-left: .21rem;

    &::after {
      content: '';
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      width: .03rem;
      height: .2rem;
      background: #fff;
      border-radius: .02rem;
      margin: auto 0;
    }
  }
  
  .locking-btn {
    opacity: .7;

    &:active {
      color: #fff;
    }
  }
</style>
