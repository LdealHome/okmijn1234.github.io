<template lang="pug">
  div
    mt-popup.popup-content(
      position="right"
      v-model="isShow"
      :modal="false"
      :closeOnClickModal="false"
    )
      ul.chat-list
        li.chat-item(v-for="item in chatInfo.list.slice(-3)" :key="item.id")
          div.chat-info(:class="{ 'ask-chat': item.isAsk }")
            p.item-text {{item.text}}
            img.item-avatar(:src="item.avatar")
</template>

<script>
  export default {
    name: 'PopupChat',
    props: {
      chatInfo: {
        type: Object,
        required: true,
        default () {
          return {
            list: []
          }
        }
      }
    },
    data () {
      return {
        isShow: true
      }
    },
    created () {
      this.isShow = this.isShowPopup
    },
    watch: {
      isShowPopup (val) {
        this.isShow = val
      }
    },
    computed: {
      isShowPopup () {
        return this.chatInfo.isShow
      }
    }
  }
</script>

<style scoped lang="less">
  .popup-content {
    background: none;
    padding-right: .3rem;
    height: 1.64rem;
    bottom: -.22rem;
    position: absolute;
    top: auto;
  }

  /deep/ .mint-popup {
    z-index: 9 !important;
  }

  .chat-list {
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
  }

  .chat-item {
    display: flex;
    justify-content: flex-end;
    margin-bottom: .1rem;

    &:last-of-type {
      margin-bottom: 0;
    }
  }

  .chat-info {
    height: .48rem;
    border-radius: .08rem;
    background: rgba(203, 205, 204, .8);
    padding: 0 .12rem;
    display: flex;
    align-items: center;
  }

  .ask-chat {
    padding-left: .5rem;
    position: relative;

    &::after {
      width: .26rem;
      height: .27rem;
      background: url('~@icon/course/ask-chat.png') no-repeat;
      background-size: 100%;
      content: '';
      position: absolute;
      top: 0;
      bottom: 0;
      margin: auto 0;
      left: .11rem;
    }
  }
  
  .item-text {
    max-width: 4.12rem;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    word-wrap: normal;
    font-size: .28rem;
    color: #2c2c2c;
  }

  .item-avatar {
    width: .44rem;
    height: .44rem;
    border-radius: 50%;
    margin-left: .13rem;
  }
</style>
