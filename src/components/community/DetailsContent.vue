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
        h2.title(v-show="item.title") {{item.title}}
        template(v-for="(video, videoIndex) in item.videoList")
          div.cover(v-if="!video.isVideoPlay")
            img.img(:src="video.cover")
            p.pause(@click="$emit('videoPlay', itemIndex, videoIndex, $refs[`video${itemIndex}-${videoIndex}`][0])")
          video.video(
            v-show="video.isVideoPlay"
            :src="video.src"
            controls="controls"
            :poster="video.cover"
            :ref="`video${itemIndex}-${videoIndex}`"
            )
          p.text(v-html="video.text" v-show="video.text")
      // 多视频
      div.module__video(v-if="item.type === 4")
        h2.title(v-show="item.title") 多视频标题
        ul.list
          li.item(v-for="(video, videoIndex) in item.videoList")
            div.item-cover
              template(v-if="!video.isVideoPlay")
                img.item-img(:src="video.cover")
                p.pause(@click="$emit('videoPlay', itemIndex, videoIndex, $refs[`video${itemIndex}-${videoIndex}`][0])")
              video.item-video(
                v-show="video.isVideoPlay"
                :src="video.src"
                controls="controls"
                :poster="video.cover"
                :ref="`video${itemIndex}-${videoIndex}`"
                )
            p.item-text(v-html="video.text" v-show="video.text")

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
  }
</style>
