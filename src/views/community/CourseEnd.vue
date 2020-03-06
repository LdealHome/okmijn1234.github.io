<!--课程活动已经结束-->
<template lang="pug">
  div.page
    img.page__img(src="@images/community/end.png")
    p 啊哦！活动已经结束啦~
</template>

<script>
  export default {
    name: 'CourseEnd'
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
    font-size: .28rem;
    background-color: #fff;

    &__img {
      width: 4.16rem;
      height: 2.16rem;
      margin-bottom: .16rem;
    }
  }
</style>
