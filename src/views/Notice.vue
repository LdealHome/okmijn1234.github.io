<template lang="pug">
  div.notice
    div.notice-content
      div.content
        div.text
          div.title
          div.explain(v-html="content")
</template>

<script>
  export default {
    name: 'Notice',
    data () {
      return {
        content: JSON.parse(sessionStorage.getItem('maintenance')) || ''
      }
    }
  }
</script>

<style scoped lang="less">
  .notice {
    width: 100vw;
    height: 100vh;
    margin-bottom: -2.2rem;
    background: url("~@assets/images/notice/notice-back.png");
    background-size: contain;

    &-content {
      width: 100%;
      height: 100%;
      padding: .36rem .6rem 1.18rem .6rem;

      .content {
        position: relative;
        border: 1px solid #fff;
        padding: .16rem;
        width: 100%;
        height: 100%;
        border-radius: 2px;

        &::before {
          position: absolute;
          top: .16rem;
          right: .16rem;
          width: 1.92rem;
          height: 1.08rem;
          content: '';
          background: url("~@assets/images/notice/notice-top.png") no-repeat center;
          background-size: contain;
        }

        &::after {
          position: absolute;
          top: .16rem;
          left: .16rem;
          width: 1.37rem;
          height: .65rem;
          content: '';
          background: url("~@assets/images/notice/notice-text.png") no-repeat center;
          background-size: contain;
        }
      }

      .text {
        position: relative;
        display: flex;
        flex-direction: column;
        background-color: rgba(255, 255, 255, .6);
        width: 100%;
        height: 100%;
        padding: 1.3rem .3rem;
        border-radius: 2px;

        &::after {
          position: absolute;
          bottom: .06rem;
          left: -.6rem;
          width: 1.2rem;
          height: .62rem;
          content: '';
          background: url("~@assets/images/notice/notice-bottom.png") no-repeat center;
          background-size: contain;
        }

        &::before {
          position: absolute;
          bottom: 3.85rem;
          right: .3rem;
          content: '';
          width: .56rem;
          height: .45rem;
          background: url("~@assets/images/notice/notice-middle.png") no-repeat center;
          background-size: contain;
        }
      }

      .title {
        width: 100%;
        height: .64rem;
        background: url("~@assets/images/notice/notice-title.png") no-repeat center;
        background-size: 1.22rem .64rem;
        margin-bottom: .3rem;
      }

      .explain {
        flex: 1;
        overflow: auto;
        -webkit-overflow-scrolling: touch;
      }
    }
  }
</style>
