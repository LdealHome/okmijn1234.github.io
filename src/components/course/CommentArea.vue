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
          @clickItem="clickItem"
        )
        div.right-anchor
          span.anchor-top(@click="rollTopClick")
          span.anchor-bottom(@click="rollBottomClick")
      EditView(
        :isProblem="isProblem"
        :data="data"
        @problemClick="$emit('problemClick', 5)"
        @sendComment="sendComment"
      )
      infinite-loading(@infinite="loadMore" direction="top")
        div(slot="spinner")
        div(slot="no-more")
        div(slot="no-results")
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
              }
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
        isShow: false
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
          this.isShow = true
        }
      },
      page (val) {
        if (val === 2) {
          this.rollBottomClick()
        }
      }
    },
    created () {
      this.isShow = this.isShowPopup
    },
    computed: {
      isShowPopup () {
        return this.commentInfo.isShow
      },
      page () {
        return this.data.commentListInfo.params.page
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
        this.$('loadMore', 'commentListInfo', res)
      },
      sendComment (text) {
        if (!text) {
          this.$_.Toast('请输入评论的内容')
          return
        }
        this.$emit('sendComment', text)
      },
      clickItem (info) {
        this.$emit('clickItem', info)
      }
    }
  }
</script>

<style scoped lang="less">
  .popup-content {
    max-height: 84%;
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
    z-index: 10;
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
</style>
