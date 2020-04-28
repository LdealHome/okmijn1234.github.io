<template lang="pug">
  div.bottom-back
    div.default-view(v-show="!isShowEditView" :class="{ 'not-broadcast': isNotStarted }")
      div.comment-view(@click="commentClick")
        p.comment-edit {{editTips}}
        div.problem-btn(v-show="isShowProblemBtn" :class="{ 'problem-active': data.isProblem }" @click.stop="problemClick") 提问
      img.bullet-chat(:src="bulletChatSrc" @click="$emit('clickItem', 1)")
      span.comment-btn(@click="$emit('clickItem', 2)")
      span.reward-btn(@click="$emit('clickItem', 3)")
      img.more-btn(src="@icon/course/more.png" @click="$emit('clickItem', 4)")
    EditView(
      v-show="isShowEditView"
      :isProblem="data.isProblem"
      :changeEdit="changeEditNum"
      @problemClick="problemClick"
      @sendComment="sendComment"
    )
    div.unregistered(v-if="false")
      div.enroll-btn 立即报名
      img.bullet-chat(:src="bulletChatSrc" @click="$emit('clickItem', 1)")
</template>

<script>
  import EditView from './EditView'
  export default {
    name: 'BottomView',
    components: {
      EditView
    },
    props: {
      data: {
        type: Object,
        required: true,
        default () {
          return {
            isAdministrators: false, // 是否是管理员
            isForbidcomment: false // 是否禁止评论
          }
        }
      },
      state: { // 直播状态 0: 未开始 1:直播中 2:回放
        type: Number,
        required: true,
        default: 0
      },
      isShowChat: {
        type: Boolean,
        require: true,
        default: false
      }
    },
    data () {
      return {
        commentContent: '',
        isProblem: false, // 是否中提问
        isShowEditView: false,
        changeEditNum: 0
      }
    },
    computed: {
      bulletChatSrc () {
        return this.isNotStarted ? require('@icon/course/bullet-chat-grey.png') : (this.isShowChat ? require('@icon/course/bullet-chat.png') : require('@icon/course/bullet-chat-close.png'))
      },
      isShowProblemBtn () {
        return !this.data.isAdministrators && !this.data.isForbidcomment
      },
      isNotStarted () {
        return this.state === 0
      },
      editTips () {
        return this.data.isForbidcomment ? '已被管理员禁言' : '说点什么吧~'
      }
    },
    methods: {
      problemClick () {
        if (this.isNotStarted) return
        this.$emit('clickItem', 5)
      },
      clickBulletChat () {
        if (this.isNotStarted) return
        this.$emit('clickBulletChat')
      },
      commentClick () {
        if (this.isNotStarted) return
        this.isShowEditView = true
        this.changeEditNum++
      },
      /**
       * 发送评论
       */
      sendComment (text) {
        if (!text) {
          this.isShowEditView = false
          return
        }
        this.$emit('sendComment', text)
      }
    }
  }
</script>

<style scoped lang="less">
  .bottom-back {
    background: #fff;
    z-index: 10;
  }

  .default-view {
    height: .98rem;
    display: flex;
    align-items: center;
    padding: 0 .22rem 0 .42rem;
    box-shadow: 0 0 .03rem 0 rgba(206, 202, 202, 1);
  }

  .comment-view {
    flex: 1;
    margin-right: .36rem;
    height: .72rem;
    display: flex;
    border-radius: 36rem;
    align-items: center;
    background: #f8f8f8;
    padding-left: .2rem;
  }

  .comment-edit {
    flex: 1;
    font-size: .28rem;
    color: #a3a3a3;
  }

  .forbid-words {
    font-size: .28rem;
    color: #a3a3a3;
    height: .6rem;
    line-height: .6rem;
  }

  .problem-btn {
    font-size: .24rem;
    color: #9c9b9b;
    padding: 0 .2rem 0 .34rem;
    margin-left: .1rem;
    background: url('~@icon/course/default-state.png') no-repeat left center;
    background-size: .24rem;
  }

  .problem-active {
    background: url('~@icon/course/selected-state.png') no-repeat left center;
    background-size: .24rem;
  }

  .bullet-chat {
    width: .54rem;
    height: .54rem;
    padding: .1rem;
    box-sizing: content-box;
  }

  .comment-btn {
    width: .56rem;
    height: .56rem;
    padding: .09rem;
    box-sizing: content-box;
    display: block;
    background: url('~@icon/course/comment-btn.png') no-repeat center center;
    background-size: .56rem;
  }

  .reward-btn {
    width: .54rem;
    height: .54rem;
    padding: .1rem;
    box-sizing: content-box;
    background: url('~@icon/course/reward.png') no-repeat center center;
    background-size: .54rem;
  }

  .more-btn {
    width: .56rem;
    height: .56rem;
    padding: .09rem;
    box-sizing: content-box;
  }

  .unregistered {
    height: .98rem;
    display: flex;
    align-items: center;
    padding: 0 .2rem 0 .3rem;
  }

  .enroll-btn {
    flex: 1;
    height: .7rem;
    line-height: .7rem;
    background: #fdb418;
    font-size: .32rem;
    color: #090909;
    text-align: center;
    border-radius: .35rem;
    margin-right: .1rem;

    &:active {
      background: darken(#fdb418, 5%);
    }
  }

  .not-broadcast {
    .comment-view {
      border: 1px solid #ccc;
      background: #f8f8f8;
      color: #ccc;
    }

    .problem-btn {
      color: #ccc;
    }

    .comment-btn {
      width: .56rem;
      height: .56rem;
      padding: .09rem;
      box-sizing: content-box;
      display: block;
      background: url('~@icon/course/comment-grey.png') no-repeat center center;
      background-size: .56rem;
    }

    .reward-btn {
      width: .54rem;
      height: .54rem;
      padding: .1rem;
      box-sizing: content-box;
      background: url('~@icon/course/reward-grey.png') no-repeat center center;
      background-size: .54rem;
    }
  }
</style>
