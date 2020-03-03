<template lang="pug">
  div.swiper-common
    Swiper(:options="swiperOptions" v-if="slides.length > 0")
      SwiperSlide(v-for="(name,index) in slides" :key="index")
        slot(:name="index")
      div.swiper-pagination(slot="pagination" v-if="swiperOptions.pagination")
      div.swiper-button-prev(slot="button-prev" v-if="swiperOptions.swiperButton")
      div.swiper-button-next(slot="button-next" v-if="swiperOptions.swiperButton")
      // - 其他功能插槽
        div.swiper-button-prev(slot="button-prev")
        div.swiper-button-next(slot="button-next")
        div.swiper-scrollbar(slot="scrollbar")
</template>

<script>
  // require styles
  import 'swiper/dist/css/swiper.css'

  import { swiper, swiperSlide } from 'vue-awesome-swiper'

  export default {
    name: 'SwiperCommon',
    components: {
      Swiper: swiper,
      SwiperSlide: swiperSlide
    },
    props: {
      slides: {
        type: Array,
        required: true,
        default () {
          return []
        }
      },
      swiperOptions: {
        type: Object,
        required: false,
        default () {
          return {}
        }
      }
    }
  }
</script>

<style scoped lang="less">
  .swiper-common {
    width: 100%;
    height: 100%;
    overflow: hidden;

    .swiper-container {
      width: 100%;
      height: 100%;
    }
  }

  /deep/ .swiper-pagination-bullet-active {
    background: @themeColor;
  }

  /deep/ .swiper-pagination {
    bottom: 0;
  }

</style>
