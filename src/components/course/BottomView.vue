<template lang="pug">
  div.bottom-back
    div.default-view(v-show="true")
      div.comment-view
        p.comment-edit {{editTips}}
        div.problem-btn(v-show="isShowProblemBtn" :class="{ 'problem-active': isProblem }" @click="isProblem = !isProblem") 提问
      img.bullet-chat(:src="bulletChatSrc" @click="$emit('clickBulletChat')")
      img.comment-btn(src="@icon/course/comment-btn.png" @click="$emit('clickComment')")
      img.reward-btn(src="@icon/course/reward.png" @click="$emit('clickReward')")
      img.more-btn(src="@icon/course/more.png" @click="$emit('clickMore')")
    EditView(v-show="false")
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
            isShow: 1, // 是否显示弹幕弹窗
            isAdministrators: false, // 是否是管理员
            isForbidcomment: false // 是否禁止评论
          }
        }
      }
    },
    data () {
      return {
        commentContent: '',
        isProblem: false // 是否中提问
      }
    },
    computed: {
      bulletChatSrc () {
        return this.data.isShow ? require('@icon/course/bullet-chat.png') : require('@icon/course/bullet-chat-close.png')
      },
      isShowProblemBtn () {
        return !this.data.isAdministrators && !this.data.isForbidcomment
      },
      editTips () {
        return this.data.isForbidcomment ? '已被管理员禁言' : '说点什么吧~'
      }
    }
  }
</script>

<style scoped lang="less">
  .bottom-back {
    background: #fff;
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
  }

  .reward-btn {
    width: .54rem;
    height: .54rem;
    padding: .1rem;
    box-sizing: content-box;
  }

  .more-btn {
    width: .56rem;
    height: .56rem;
    padding: .09rem;
    box-sizing: content-box;
  }
</style>
