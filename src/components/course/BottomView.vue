<template lang="pug">
  div.bottom-back
    div.comment-view
      input.comment-input(placeholder="说点什么吧~" v-model.trim="commentContent" v-ios-focus)
      div.problem-btn(:class="{ 'problem-active': isProblem }" @click="isProblem = !isProblem") 提问
    img.bullet-chat(:src="bulletChatSrc" @click="$emit('clickBulletChat')")
    img.comment-btn(src="@icon/course/comment-btn.png" @click="$emit('clickComment')")
    img.reward-btn(src="@icon/course/reward.png" @click="$emit('clickReward')")
    img.more-btn(src="@icon/course/more.png" @click="$emit('clickMore')")
</template>

<script>
  export default {
    name: 'BottomView',
    props: {
      data: {
        type: Object,
        required: true,
        default () {
          return {
            isShow: 1
          }
        }
      }
    },
    data () {
      return {
        commentContent: '',
        isProblem: false
      }
    },
    computed: {
      bulletChatSrc () {
        return this.data.isShow ? require('@icon/course/bullet-chat.png') : require('@icon/course/bullet-chat-close.png')
      }
    }
  }
</script>

<style scoped lang="less">
  .bottom-back {
    height: .98rem;
    background: #fff;
    display: flex;
    align-items: center;
    box-shadow: 0 0 .03rem 0 rgba(206, 202, 202, 1);
    padding: 0 .22rem 0 .42rem;
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

  .comment-input {
    flex: 1;
    width: 1rem;
    background: none;
    font-size: .28rem;
    color: #a3a3a3;
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
