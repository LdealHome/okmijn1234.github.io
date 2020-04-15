<template lang="pug">
  div
    mt-popup.popup-content(
      position="top"
      v-model="isShowPopup"
    )
      div.popup-view
        p 点击
        div.spot
          span.spot-item
          span.spot-item
          span.spot-item
        p.tips-text 选择
        p 收藏即可
</template>

<script>
  export default {
    name: 'GuideCollection',
    props: {
      isShow: {
        type: Boolean,
        required: true,
        default: false
      }
    },
    data () {
      return {
        isShowPopup: true
      }
    },
    watch: {
      isShowPopup (val) {
        this.$root.$emit('toggleModal', Boolean(val))
        if (!val) {
          this.$emit('close')
        }
      },
      isShow (val) {
        if (val) {
          this.isShowPopup = true
        }
      }
    },
    created () {
      this.isShowPopup = this.isShow
    }
  }
</script>

<style scoped lang="less">
  .popup-content {
    width: 100%;
    background: no-repeat;
    text-align: right;
    padding-top: .26rem;
    padding-right: .3rem;
  }

  .popup-view {
    height: .68rem;
    display: flex;
    align-items: center;
    float: right;
    background: #fff;
    border-radius: .08rem;
    padding: 0 .18rem;
    font-size: .28rem;
    color: #090909;
    position: relative;

    &::after {
      position: absolute;
      width: .22rem;
      height: .22rem;
      border-radius: .04rem;
      background: #fff;
      content: '';
      right: .08rem;
      transform: rotate(45deg);
      top: -.08rem;
      z-index: -1;
    }
  }

  .tips-text {
    padding-right: .7rem;
    background: url('~@icon/course/collect.png') no-repeat right .16rem center;
    background-size: .38rem;
  }

  .spot {
    width: .54rem;
    display: flex;
    justify-content: center;
  }

  .spot-item {
    display: block;
    width: .08rem;
    height: .08rem;
    border-radius: 50%;
    background: #000;
    margin: 0 1px;
  }
</style>
