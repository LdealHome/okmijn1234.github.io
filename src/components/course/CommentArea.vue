<template lang="pug">
  div
    mt-popup.popup-content(
      position="bottom"
      v-model="isShow"
    )
      P.top-title 讨论区(1002)
      img.close-btn(src="@icon/close/close-reward.png" @click="isShow = false")
      div.comment-back
        ListComment.comment-list
      //- div.comment-bottom
      //-   div.comment-left
      //-     input.comment-input(placeholder="说点什么吧~" v-ios-focus)
      //-     div.problem-btn 提问
      //-   p.send-btn 发送
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
            isShow: false
          }
        }
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
      }
    },
    created () {
      this.isShow = this.isShowPopup
    },
    computed: {
      isShowPopup () {
        return this.data.isShow
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
  }

  .comment-list {
    width: 100%;
    height: 100%;
    overflow: auto;
    -webkit-overflow-scrolling: touch;
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
</style>
