<!--社群详情和课程详情内容-->
<template lang="pug">
  div.content
    template(v-for="(item, itemIndex) in contentList")
      // 图片
      div.module__img(v-if="item.type === 1")
        h2.title(v-show="item.title") {{item.title}}
        img.img(:src="item.text")
      // 文本
      div.module__text(v-if="item.type === 2")
        h2.title(v-show="item.title") {{item.title}}
        p.text(v-html="item.text")
      // 单视频
      div.module__video(v-if="item.type === 3")
        // h2.title(v-show="item.title") {{item.title}}
        template(v-for="(video, videoIndex) in item.videoList")
          div.cover(v-if="!video.isVideoPlay")
            img.img(:src="video.cover")
            p.pause(@click="$emit('videoPlay', itemIndex, videoIndex)")
          video.video(
            v-else
            autoplay
            :src="video.src"
            controls="controls"
            :poster="video.cover"
            )
          p.text(v-show="video.text") {{video.text}}
      // 多视频
      div.module__video(v-if="item.type === 4")
        // h2.title(v-show="item.title") 多视频标题
        ul.list
          li.item(v-for="(video, videoIndex) in item.videoList" :key="videoIndex")
            div.item-cover
              template
                img.item-img(:src="video.cover")
                p.pause(@click="$emit('videoPlay', itemIndex, videoIndex)")
              //- video.item-video(
              //-   v-else
              //-   autoplay
              //-   :src="video.src"
              //-   controls="controls"
              //-   :poster="video.cover"
              //-   )
            p.item-text(v-show="video.text") {{video.text}}
      // 链接跳转
      ul.module__link(v-if="item.type === 6")
        li.item(v-for="(video, videoIndex) in item.videoList" @click="$emit('jumpLink', video.src)" :key="videoIndex")
          img.img(:src="video.cover")
          span.name {{video.text}}
      // 倒计时
      div.module__countdown(v-if="item.type === 7")
        h2.headline {{item.title}}
        div.countdown
          p.countdown-number
            span.number {{countdownData.day[0]}}
            span.number {{countdownData.day[1]}}
          p.countdown-text 天
          p.countdown-number
            span.number {{countdownData.hour[0]}}
            span.number {{countdownData.hour[1]}}
          p.countdown-text 时
          p.countdown-number
            span.number {{countdownData.minute[0]}}
            span.number {{countdownData.minute[1]}}
          p.countdown-text 分
          p.countdown-number
            span.number {{countdownData.second[0]}}
            span.number {{countdownData.second[1]}}
          p.countdown-text 秒
</template>

<script>
  export default {
    name: 'DetailsContent',
    props: {
      contentList: {
        type: Array,
        required: true,
        default () {
          return []
        }
      },
      countdownData: { // 倒计时社群详情页
        type: Object,
        required: false,
        default () {
          return {
            day: [], // 天
            hour: [], // 时
            minute: [], // 分
            second: [] // 秒
          }
        }
      }
    }
  }
</script>

<style scoped lang="less">
  .title {
    color: #f28900;
    font-size: .44rem;
    text-align: center;
    height: 1.34rem;
    line-height: 1.34rem;
    font-weight: initial;
  }

  .module {
    &__img {
      width: 100%;
      margin-bottom: .1rem;

      .img {
        width: 100%;
      }
    }

    &__text {
      color: #333;
      font-size: .28rem;
      margin-bottom: .1rem;

      .text {
        padding: 0 .2rem;
      }
    }

    &__video {
      width: 100%;
      margin-bottom: .1rem;

      .cover {
        position: relative;
        width: 100%;
        height: 4.2rem;
      }

      .img {
        width: 100%;
        height: 4.2rem;
      }

      .pause {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, .4) url("~@icon/community/pause.png") no-repeat center;
        background-size: 1.04rem;
      }

      .list {
        display: flex;
        flex-wrap: wrap;
        padding: 0 .4rem;
      }

      .item {
        width: 3.2rem;
        margin-bottom: .2rem;

        &:nth-of-type(even) {
          margin-left: .3rem;

          .item-cover {
            background: linear-gradient(to left, #78d0ef, #fff);
          }
        }

        &:nth-of-type(odd) {
          .item-cover {
            background: linear-gradient(to right, #e3c030, #fff);
          }
        }

        &-cover {
          position: relative;
          width: 100%;
          height: 1.88rem;
          border-radius: .3rem;
          padding: .04rem;
          overflow: hidden;
        }

        &-img {
          width: 3.12rem;
          height: 1.8rem;
          border-radius: .3rem;
        }

        &-video {
          width: 100%;
          height: 1.8rem;
          border-radius: .3rem;
        }

        &-text {
          text-align: center;
          margin-top: .26rem;
          .ellipsisLn(1);
        }

        .pause {
          top: .04rem;
          right: .04rem;
          bottom: .04rem;
          left: .04rem;
          border-radius: .3rem;
          background-size: .54rem;
        }
      }

      .video {
        width: 100%;
        height: 4.2rem;
      }

      .text {
        text-align: center;
        margin-top: .18rem;
      }
    }

    &__link {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      padding: .28rem .4rem;

      .item {
        position: relative;
        height: .47rem;
        margin-right: .1rem;
        margin-bottom: .1rem;

        &:nth-child(3n) {
          margin-right: 0;
        }
      }

      .img {
        width: auto;
        height: .47rem;
      }

      .name {
        position: absolute;
        top: 50%;
        left: .06rem;
        right: .2rem;
        color: #fff;
        text-align: center;
        font-size: .24rem;
        font-weight: bold;
        transform: scale(.9) translateY(-50%);
      }
    }

    &__countdown {
      display: flex;
      flex-direction: column;
      align-items: center;
      position: relative;
      width: 6.9rem;
      height: 1.56rem;
      margin: .3rem auto 0 auto;
      background-color: #fde9a5;

      &::before {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        content: '';
        height: .08rem;
        border-radius: .04rem;
        background: linear-gradient(to right, #fc8d18, #fa4809);
      }

      .headline {
        color: #f74a05;
        font-size: .3rem;
        text-align: center;
        padding: .2rem 0 .1rem 0;
      }

      .countdown {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        color: #fa4909;
        font-size: .26rem;
        height: .72rem;
        padding-left: .16rem;
        border: .04rem solid #fde9a5;
        border-radius: .12rem;
        background-color: #fff;

        &-number {
          display: inline-flex;
          align-items: center;
        }

        &-text {
          width: .48rem;
          text-align: center;
        }
      }

      .number {
        display: inline-block;
        width: .4rem;
        height: .5rem;
        line-height: .5rem;
        color: #fff;
        text-align: center;
        font-size: .34rem;
        font-weight: bold;
        margin: 0 .02rem;
        border-radius: .04rem;
        background: linear-gradient(to top, #fec901, #ff9104);
      }
    }
  }
</style>
