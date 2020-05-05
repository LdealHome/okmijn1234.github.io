<template lang="pug">
  div
    mt-popup.popup-content(
      position="bottom"
      v-model="isShow"
    )
      P.top-title 讨论区({{data.totalComments}})
      img.close-btn(src="@icon/close/close-reward.png" @click="isShow = false")
      div.comment-back(ref="commentList")
        ListComment(
          :list="data.commentListInfo.list"
          type="comment"
          :role="data.role"
          :serverTime="data.serverTime"
          @clickItem="clickItem"
          @commentClick="commentClick"
          @showManageView="showManageView"
          @cancelReply="cancelReply"
        )
        div.right-anchor
          span.anchor-top(@click="rollTopClick")
          span.anchor-bottom(@click="rollBottomClick")
        infinite-loading(@infinite="loadMore" direction="top" :identifier="identifier")
          div(slot="spinner")
          div(slot="no-more")
          div(slot="no-results")
      EditView(
        :isProblem="isProblem"
        :data="data"
        :replyInfo="replyInfo"
        :changeInfo="changeInfo"
        @problemClick="$emit('problemClick', 5)"
        @sendComment="sendComment"
        @contentBlur="contentBlur"
      )
    div.manage-view(v-show="isShowManageView" :style="manageStyle")
      p.delete-item 删除评论
      p.forbidden-words 禁言
</template>

<script>
  import ListComment from './ListComment'
  import EditView from './EditView'
  export default {
    name: 'CommentArea',
    components: {
      ListComment,
      EditView
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
              rollBottom: 0
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
      },
      isProblem: {
        type: Boolean,
        required: true,
        default: false
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
          y: 0
        },
        identifier: 0
      }
    },
    watch: {
      isShow (val) {
        this.$root.$emit('toggleModal', Boolean(val))
        if (!val) {
          this.$emit('close')
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
    created () {
      this.isShow = this.isShowPopup
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
      }
    },
    methods: {
      rollTopClick () {
        this.$refs.commentList.scrollTop = 0
      },
      rollBottomClick () {
        this.$refs.commentList.scrollTop = this.$refs.commentList.scrollHeight
      },
      loadMore (res) {
        this.$emit('loadMore', 'commentListInfo', res)
      },
      sendComment (text) {
        if (!text) {
          this.$_.Toast('请输入评论的内容')
          return
        }
        this.$emit('sendComment', {
          text,
          isProblem: this.isProblem,
          replyInfo: {
            id: this.replyInfo.id,
            uid: this.replyInfo.uid,
            content: this.replyInfo.content,
            name: this.replyInfo.name
          }
        })
      },
      clickItem (info) {
        this.$emit('clickItem', info)
      },
      /**
       * 点击评论。回复处理
       */
      commentClick (index) {
        this.isShowManageView = false
        if (!this.data.commentListInfo.list[index] ||
          this.data.commentListInfo.list[index].id === this.replyInfo.id ||
          this.data.commentListInfo.list[index].userInfo.uid === this.uid
        ) return
        this.replyInfo = {
          content: this.data.commentListInfo.list[index].content,
          isReply: true,
          id: this.data.commentListInfo.list[index].id,
          name: this.data.commentListInfo.list[index].userInfo.name,
          uid: this.data.commentListInfo.list[index].userInfo.name
        }
        this.changeInfo.emptyNumber++
        setTimeout(() => {
          this.changeInfo.focusNumber++
        }, 300)
      },
      /**
       * 取消回复评论，更新状态为普通评论
       */
      cancelReply () {
        this.isShowManageView = false
        if (!this.editContent) {
          this.replyInfo = {
            content: '',
            isReply: false
          }
        }
      },
      contentBlur (text) {
        this.editContent = text
        // if (this.replyInfo.id) {
        //   this.replyCacheList[this.replyInfo.id] = this.replyInfo
        // }
      },
      /**
       * 管理员长按评论，显示删除评论弹窗
       * @param info {Object} { x: 手指按下的x坐标，y: y坐标 }
       */
      showManageView (info) {
        this.fingerPosition = info
        this.isShowManageView = true
      }
    }
  }
</script>

<style scoped lang="less">
  /deep/ .mint-popup {
    z-index: 20 !important;
  }

  /deep/ .v-modal {
    z-index: 19 !important;
  }

  .popup-content {
    height: 84%;
    width: 100%;
    border-radius: .12rem .12rem 0 0;
    display: flex;
    flex-direction: column;
  }

  .top-title {
    font-size: .32rem;
    color: #2b2b2b;
    padding: .4rem;
    text-align: center;
  }

  .close-btn {
    position: absolute;
    width: .24rem;
    height: .24rem;
    padding: .1rem;
    right: .5rem;
    top: .38rem;
    box-sizing: content-box;
  }

  .comment-back {
    flex: 1;
    overflow: auto;
    -webkit-overflow-scrolling: touch;
    padding-bottom: .2rem;
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
    height: 1.35rem;
    position: absolute;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    top: 0;
    bottom: 0;
    margin: auto 0;
    right: .3rem;
    z-index: 21;
  }

  .anchor-top,
  .anchor-bottom {
    width: .5rem;
    height: .5rem;

    &:active {
      opacity: .8;
    }
  }

  .anchor-top {
    background: url('~@icon/course/top-arrow.png') no-repeat;
    background-size: 100%;
  }

  .anchor-bottom {
    background: url('~@icon/course/bottom-arrow.png') no-repeat;
    background-size: 100%;
  }

  .manage-view {
    position: fixed;
    display: flex;
    background: rgba(5, 0, 1, .7);
    border-radius: .08rem;
    font-size: .24rem;
    color: #fff;
    left: 1rem;
    top: 1.4rem;
    z-index: 30;
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
</style>
