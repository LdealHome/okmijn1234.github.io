<!--
图片预览组件
-->
<template lang="pug">
  div.pswp(ref="pswp")
    div.pswp__bg
    div.pswp__scroll-wrap
      div.pswp__container
        div.pswp__item
        div.pswp__item
        div.pswp__item
      div.pswp__ui
        div.pswp__counter {{counter}}
</template>

<script>
  import PhotoSwipe from '../lib/photoswipe/photoswipe'
  import '../lib/photoswipe/photoswipe.css'
  export default {
    name: 'PhotoSwipe',
    props: {
      photoSwipeInit: {
        type: Boolean,
        required: true,
        default: false
      },
      photoSwipeData: {
        type: Object,
        required: true,
        default () {
          return {
            list: [], // 需要显示的img DOM列表
            target: null // 当前点击的img DOM元素
          }
        }
      }
    },
    watch: {
      photoSwipeInit (newVal) {
        if (newVal) {
          this.initGallery(this.photoSwipeData.target, this.photoSwipeData.list)
        }
      }
    },
    data () {
      return {
        counter: '',
        gallery: null
      }
    },
    methods: {
      /**
       * 初始化图片预览
       * @param target {Element} 点击开始的DOM
       * @param DOMList {Array} 需要显示的图片DOM列表
       */
      initGallery (target, DOMList) {
        let _index = 0
        let items = []
        let vm = this
        Array.prototype.forEach.call(DOMList, function (item, index) {
          if (item === target) {
            _index = index
          }
          items.push(vm.getImageInfo(item))
        })
        let options = {
          index: _index,
          history: false,
          showHideOpacity: true,
          getThumbBoundsFn (index) {
            let pageYScroll = window.pageYOffset || document.documentElement.scrollTop
            let rect = items[index].target.getBoundingClientRect()
            return { x: rect.left, y: rect.top + pageYScroll, w: rect.width }
          }
        }
        this.gallery = new PhotoSwipe(this.$refs.pswp, false, items, options)
        this.handleGalleryEvent()
        this.gallery.init()
      },
      /**
       * 获取图片属性
       * @param target {Element} img DOM节点
       * @returns {{src: string, msrc: string, w: *, h: *}}
       */
      getImageInfo (target) {
        return {
          src: target.currentSrc, // 高清图
          msrc: target.currentSrc, // 缩略图
          w: target.naturalWidth < 750 ? 750 : target.naturalWidth,
          h: target.naturalWidth < 750 ? 750 / (target.naturalWidth / target.naturalHeight) : target.naturalHeight,
          target: target
        }
      },
      /**
       * 处理画廊相关事件
       */
      handleGalleryEvent () {
        let vm = this
        let pswp = vm.gallery
        pswp.listen('doubleTap', function (point) {
          let initialZoomLevel = pswp.currItem.initialZoomLevel
          if (pswp.getZoomLevel() !== initialZoomLevel) {
            pswp.zoomTo(initialZoomLevel, point, 333)
          } else {
            pswp.zoomTo(pswp.options.getDoubleTapZoom(false, pswp.currItem), point, 333)
          }
        })
        pswp.listen('beforeChange', function () {
          let current = pswp.getCurrentIndex() + 1
          let total = pswp.options.getNumItemsFn()
          vm.counter = current + ' / ' + total
        })
        pswp.listen('close', function () {
          vm.$emit('close')
        })
      }
    }
  }
</script>

<style scoped lang="less">
  .pswp__counter {
    position: absolute;
    top: 0;
    left: 0;
    color: #fff;
    padding: 5px 10px 0;
  }
</style>
