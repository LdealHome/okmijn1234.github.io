<template lang="pug">
  div
    mt-popup.popup-content(
      position="bottom"
      v-model="isShow"
      :modal="false"
      :closeOnClickModal="false"
    )
      ul.chat-list
        li.chat-item(v-for="item in chatInfo.list" :key="item.id")
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
            list: [
              {
                id: 0,
                avatar: '',
                text: '回复问题',
                isAsk: false
              }
            ]
          }
        }
      },
      isShowPopup: {
        type: Boolean,
        required: true,
        default: false
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
    }
  }
</script>

<style scoped lang="less">
  .popup-content {
    margin-bottom: 1.58rem;
    background: none;
    width: 100%;
    text-align: right;
    padding-right: .3rem;
  }

  /deep/ .mint-popup {
    z-index: 10 !important;
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
