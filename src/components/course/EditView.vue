<template lang="pug">
  div.edit-back
    div.edit-left
      textarea.edit-content()
      div.ask-btn 提问
    p.send-btn.clickable-send 发送
</template>

<script>
  export default {
    name: 'EditView'
  }
</script>

<style scoped lang="less">
  .edit-back {
    padding: .13rem .42rem;
    display: flex;
    box-shadow: 0 0 .03rem 0 rgba(206, 202, 202, 1);
  }

  .edit-left {
    flex: 1;
    display: flex;
    background: #f8f8f8;
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

  .edit-content {
    flex: 1;
    background: none;
    resize: none;
    font-size: .28rem;
    color: #a3a3a3;
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
