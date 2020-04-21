<template lang="pug">
  ul
    li.comment-list-item(:class="{ 'own-comment': false }")
      p.time 02-16 10:46
      div.comment-item
        div.user-info
          img.avatar(src="https://dss2.bdstatic.com/6Ot1bjeh1BF3odCf/it/u=3519054227,2972329840&fm=173&app=49&f=JPEG?w=218&h=146&s=B288944F1640014F4405B0B80300E019")
          p.user-label 班长
          p.name 链脉名片
        div.media-view.video-back
          img.media-img(src="https://dss0.baidu.com/73F1bjeh1BF3odCf/it/u=211696413,4128556846&fm=85&s=71225C7ED6B61D82079DD0B003009017")
        p.comment-content 测试
        div.reply-view.problem-reply-view
          p.reply-problem 测试用户：这个是个问题请回复这个是个问题请回复这个是个问题请回复这个是个问题请回复这个是个问题请回复这个是个问题请回复
          p.reply-content 这个是回复
      p.reward-item 用户昵称 赞赏了一个 
        span.amount 6.6元红包
</template>

<script>
  export default {
    name: 'ListComment'
  }
</script>

<style scoped lang="less">
  .comment-list-item {
    overflow: hidden;
  }

  .time {
    font-size: .4rem;
    color: #999;
    transform: scale(.5);
    transform-origin: 0 100%;
    margin: 0 .99rem;
  }

  .reward-item {
    height: .4rem;
    line-height: .4rem;
    padding: 0 .12rem 0 .44rem;
    font-size: .22rem;
    color: #bb864c;
    background: #fff5a7 url('~@icon/course/red-packet.png') no-repeat left .14rem center;
    background-size: .2rem;
    border-radius: .08rem;
    margin-left: .87rem;
    float: left;
  }

  .amount { color: #ff3d4c; }
  
  .comment-item {
    width: 5.8rem;
    margin-bottom: .14rem;
  }

  .user-info {
    display: flex;
    padding-left: .2rem;
    align-items: center;
  }

  .avatar {
    width: .6rem;
    height: .6rem;
    border-radius: 50%;
    margin-right: .2rem;
    border: 1px solid #fed20f;
  }

  .user-label {
    background: #c28ff2;
    height: .28rem;
    line-height: .28rem;
    border-radius: .04rem;
    font-size: .24rem;
    color: #fff;
    padding: 0 .1rem;
  }

  .name {
    font-size: .32rem;
    color: #2b2b2b;
    font-weight: bold;
    margin-left: .12rem;
    .ellipsis(3rem);
  }

  .comment-content {
    font-size: .28rem;
    color: #333;
    line-height: .44rem;
    padding: .16rem .24rem .18rem .2rem;
    background: #fff;
    border-radius: .12rem;
    margin-left: .87rem;
    margin-top: .04rem;
    display: inline-block;
    text-align: left;
  }

  .comment-content,
  .reply-view {
    position: relative;

    &::after {
      width: .26rem;
      height: .26rem;
      content: '';
      position: absolute;
      background: #fff;
      transform: rotate(65deg);
      left: -.1rem;
      top: .02rem;
      border-radius: .1rem;
    }
  }

  .media-view {
    width: 4.5rem;
    border-radius: .12rem;
    overflow: hidden;
    margin-left: 1.07rem;
    margin-top: .24rem;
  }

  .video-back {
    position: relative;

    &::before {
      width: 100%;
      height: 100%;
      content: '';
      position: absolute;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      background: rgba(0, 0, 0, .5);
    }

    &::after {
      width: .58rem;
      height: .58rem;
      content: '';
      position: absolute;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      background: url('~@icon/course/play-btn.png') no-repeat;
      background-size: 100%;
      margin: auto;
      z-index: 2;
    }
  }

  .media-img {
    width: 100%;
  }

  .reply-view {
    font-size: .28rem;
    color: #333;
    line-height: .44rem;
    background: #fff;
    border-radius: .12rem;
    margin-left: .87rem;
    margin-top: .04rem;
    padding: .2rem 0 .36rem 0;
  }

  .problem-reply-view {
    &::before {
      width: .42rem;
      height: .42rem;
      border-radius: 50%;
      position: absolute;
      content: '';
      left: .2rem;
      top: .13rem;
      background: url('~@icon/course/ask-comment.png') no-repeat;
      background-size: 100%;
    }
  }

  .reply-problem {
    padding: 0 .24rem .18rem .2rem;
    text-indent: .5rem;
  }

  .reply-content {
    padding: .24rem .24rem 0 .2rem;
    border-top: 1px dashed #ccc;
  }

  .own-comment {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    
    .time { transform-origin: 100% 100%; }

    .user-info {
      flex-direction: row-reverse;
      padding-right: .2rem;
      padding-left: 0;
    }

    .avatar { margin: 0 0 0 .2rem; }

    .user-label { margin: 0 0 0 .12rem; }

    .name {
      text-align: right;
      margin: 0;
    }

    .comment-item {
      text-align: right;
    }

    .comment-content {
      background: #f0f0f0;
      margin: .04rem .87rem 0 0;

      &::after {
        width: .2rem;
        height: .2rem;
        content: '';
        position: absolute;
        background: #f0f0f0;
        transform: rotate(-72deg);
        left: auto;
        right: -.06rem;
        top: .02rem;
        border-radius: .08rem;
      }
    }
  }
</style>
