<template lang="pug">
  div.learning-area-back
    div.content
      div.fu-center
        div.fu-text
          img.fu-text-img(src="@images/course/fu-text.png")
        img.fortune-bag(src="@icon/course/fortune-bag.png")
        p.click-tips 点击福字，了解分享后好处
        div.tips-btn 分享课程，为课程点赞
      ul
        li
          div
            p 用户昵称
            p 赞赏了一个
          CommentItem 
</template>

<script>
  import CommentItem from './CommentItem'
  export default {
    name: 'LearningArea',
    components: {
      CommentItem
    }
  }
</script>

<style scoped lang="less">
  .learning-area-back {
    flex: 1;
    overflow: auto;
  }

  .content {
    width: 100%;
    height: 100%;
    overflow: auto;
    -webkit-overflow-scrolling: touch;
  }

  .fu-center {
    width: 6.44rem;
    padding: .2rem 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    background: #fff;
    border-radius: .12rem;
    margin: .1rem auto;
  }

  .fu-text {
    padding-right: .36rem;
    background: url('~@icon/course/fu-text-right.png') no-repeat right center;
    background-size: .15rem;
  }

  .fu-text-img {
    width: 2.64rem;
    height: .67rem;
  }

  .fortune-bag {
    width: .85rem;
    height: .9rem;
    margin-top: .27rem;
  }

  .click-tips {
    font-size: .26rem;
    color: #ff4c49;
    margin-top: .34rem;
    margin-bottom: .26rem;
  }
  
  .tips-btn {
    width: 4.4rem;
    height: .68rem;
    line-height: .68rem;
    border-radius: .34rem;
    background: #f9d400;
    box-shadow: 0 0 .1rem 0 rgba(249, 212, 0, 1);
    text-align: center;
    font-size: .3rem;
    color: #313131;
  }
</style>
