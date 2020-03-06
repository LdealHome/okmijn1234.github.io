<!--网络出错,请求数据超时-->
<template lang="pug">
  div.page
    img.page__img(src="@images/community/error.png")
    p 网络好像出错了，重新加载试试~
    button.page__again(type="button" @click="$emit('reload')") 重新加载
</template>

<script>
  export default {
    name: 'LoadError'
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
      width: 2.98rem;
      height: 3.4rem;
      margin-bottom: .2rem;
    }

    &__again {
      width: 3.46rem;
      height: .58rem;
      color: #fff;
      font-size: .28rem;
      border-radius: 1rem;
      margin-top: .46rem;
      background: linear-gradient(to right, #ff7606, #fe4006);

      &:active {
        background: linear-gradient(to left, #ff7606, #fe4006);
      }
    }
  }
</style>
