<template lang="pug">
  div.notfound
    img.img(src="~@images/404.png")
    p.text 页面被喵星人抓走了
</template>

<script>
  export default {
    name: 'NotFound'
  }
</script>

<style scoped lang="less">
  .notfound {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    color: rgba(104, 104, 104, .5);
    font-size: .26rem;
    background-color: #fff;
    padding-top: 2.22rem;
    text-align: center;
  }

  .img {
    width: 6.4rem;
    height: 4.76rem;
    margin-bottom: .3rem;
  }
</style>
