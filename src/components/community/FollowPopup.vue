<!--邀请人数达标获得课程-->
<template lang="pug">
  div.popup-back
    div.shelter(@click="$emit('cancel')")
    div.popup-content
      div
      div 取消
</template>

<script>
  export default {
    name: 'FollowPopup',
    props: {
      src: { // 公众号二维码地址
        type: String,
        required: true,
        default: ''
      }
    }
  }
</script>

<style scoped lang="less">
  .popup-back {
    width: 100%;
    height: 100vh;
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(0, 0, 0, .5);
    z-index: 10;
  }

  .shelter {
    width: 100%;
    height: 100vh;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
  }

  .popup-content {
    width: 4rem;
    height: 6rem;
    border-radius: .12rem;
    background: #fff;
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    margin: auto;
  }
</style>
