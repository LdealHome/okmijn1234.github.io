<!--404-->
<template lang="pug">
  div.page
    img.page__img(src="@images/community/404.png")
    p 网页好像走丢啦~
</template>

<script>
  export default {
    name: 'NotFound'
  }
</script>

<style scoped lang="less">
  .page {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    width: 100vw;
    height: 100vh;
    color: #888;
    font-size: .24rem;
    background-color: #fff;

    &__img {
      width: 3.82rem;
      height: 2.22rem;
      margin-bottom: .4rem;
    }
  }
</style>
