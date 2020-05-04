<template lang="pug">
  div.edit-back
    div.edit-left
      p.forbid-comment(v-if="data.isForbidComment") 已被管理员禁言，如有疑问请联系客服
      p.edit-content(
        v-else
        ref="content"
        contenteditable="true"
        @focus="contentFocus"
        @blur="contentBlur"
        @input="changeText"
        :data-text="editPlaceholder"
        :class="editContentClass"
        v-ios-focus
      )
      div.ask-btn(v-show="isShowProblem" @click="$emit('problemClick')" :class="{ 'active-ask-btn': isProblem }") 提问
    p.send-btn(:class="{ 'clickable-send': content }" @click="sendClick" v-show="!data.isForbidComment") 发送
</template>

<script>
  import getDeviceSystem from '../../utils/get-device-system'
  let vm
  export default {
    name: 'EditView',
    props: {
      data: {
        type: Object,
        required: true,
        default () {
          return {
            role: 0,
            isForbidComment: false
          }
        }
      },
      isProblem: {
        type: Boolean,
        required: true,
        default: false
      },
      changeEdit: {
        type: Number,
        required: false,
        default: 0
      },
      replyInfo: {
        type: Object,
        required: false,
        default () {
          return {
            content: '',
            isReply: false
          }
        }
      }
    },
    data () {
      return {
        content: '',
        placeholder: '说点什么吧~',
        isFocus: false,
        scrollTimer: null
      }
    },
    beforeDestroy () {
      if (vm.scrollTimer) {
        // clearInterval(vm.scrollTimer)
      }
    },
    watch: {
      changeEdit () {
        this.$refs.content.focus()
        this.content = ''
      }
    },
    created () { vm = this },
    computed: {
      editText () {
        return this.content ? this.content : this.placeholder
      },
      isShowPlaceholder () {
        return !this.content && !this.isFocus
      },
      isShowProblem () {
        return !this.data.isForbidComment && !this.data.role && !this.replyInfo.isReply
      },
      editContentClass () {
        return {
          'content-placeholder': this.isShowPlaceholder || (this.isFocus && !this.content)
        }
      },
      editPlaceholder () {
        return this.replyInfo.isReply ? this.replyInfo.content : this.placeholder
      }
    },
    methods: {
      changeText () {
        this.content = this.$refs.content.innerText
        // 解决ios端输入的内容为空时，没有更新content-placeholder状态
        if (this.content.replace(/\s/g, '').length <= 0) {
          this.content = ''
        }
      },
      sendClick () {
        this.$emit('sendComment', this.content)
        this.content = ''
        this.$refs.content.innerText = ''
      },
      contentFocus () {
        this.isFocus = true
        this.commentFocus()
      },
      contentBlur () {
        this.$emit('contentBlur', this.content)
        this.isFocus = false
        if (this.scrollTimer) {
          clearInterval(this.scrollTimer)
          this.scrollTimer = null
        }
      },
      commentFocus () {
        if (getDeviceSystem() === 'ios') {
          // this.scrollTimer = setInterval(() => {
          //   // document.body.scrollTop = document.body.scrollHeight
          //   window.scrollTo(0, document.body.scrollHeight)
          // }, 400)
        }
      }
    }
  }
</script>

<style scoped lang="less">
  .edit-back {
    padding: .13rem .42rem;
    display: flex;
    align-items: center;
    box-shadow: 0 0 .03rem 0 rgba(206, 202, 202, 1);
  }

  .edit-left {
    flex: 1;
    display: flex;
    align-items: center;
    background: #f8f8f8;
    overflow: hidden;
    border-radius: .36rem;
    padding-left: .2rem;
  }

  .ask-btn {
    height: .72rem;
    line-height: .72rem;
    font-size: .24rem;
    color: #9c9b9b;
    padding: 0 .2rem 0 .34rem;
    margin-left: .1rem;
    background: url('~@icon/course/default-state.png') no-repeat left center;
    background-size: .24rem;
  }

  .active-ask-btn {
    background: url('~@icon/course/selected-state.png') no-repeat left center;
    background-size: .24rem;
  }

  .edit-content {
    flex: 1;
    font-size: .28rem;
    line-height: .4rem;
    max-height: 1.6rem;
    overflow: auto;
    color: #a3a3a3;
    -webkit-user-modify: read-write-plaintext-only;
    margin: .1rem 0;
    outline: none;
    position: relative;

    &::-webkit-scrollbar {
      display: none;
    }
  }

  .forbid-comment {
    flex: 1;
    font-size: .28rem;
    color: #a3a3a3;
    line-height: .4rem;
    text-align: center;
    margin: .1rem 0;
    padding-right: .2rem;
  }

  .content-placeholder::after {
    content: attr(data-text);
    position: absolute;
    top: 0;
    bottom: 0;
    margin: auto 0;
    .ellipsisLn(1);
  }

  .send-btn {
    height: .72rem;
    line-height: .72rem;
    font-size: .28rem;
    color: #262626;
    padding: 0 .2rem 0 .32rem;
  }

  .clickable-send { color: #4eb9fd; }
</style>
