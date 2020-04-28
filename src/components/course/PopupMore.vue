<template lang="pug">
  div
    mt-popup.popup-content(
      position="bottom"
      v-model="isShowMore"
    )
      p.more-text 更多
      img.close(@click="isShowMore = false" src="@icon/close/close-reward.png")
      ul.list
        li.item(@click="$router.push({ name: 'particulars', params: { from: uid } })")
          img.item-icon(src="@icon/more/course-hammer.png")
          p.text 自动成交页
        li.item(@click="$router.push({ name: 'home' })")
          img.item-icon(src="@icon/more/course-fu.png")
          p.text 集福中心
        li.item(@click="$router.push({ name: 'mine' })")
          img.item-icon(src="@icon/more/course-study.png")
          p.text 学习中心
        li.item(@click="$emit('collect')")
          img.item-icon(src="@icon/more/course-collection.png")
          p.text 收藏
</template>

<script>
  export default {
    name: 'PopupMore',
    props: {
      isShow: {
        type: Boolean,
        required: true,
        default: false
      }
    },
    data () {
      return {
        isShowMore: true
      }
    },
    watch: {
      isShowMore (val) {
        this.$root.$emit('toggleModal', Boolean(val))
        if (!val) {
          this.$emit('close')
        }
      },
      isShow (val) {
        if (val) {
          this.isShowMore = true
        }
      }
    },
    created () {
      this.isShowMore = this.isShow
    },
    computed: {
      uid () {
        return this.$route.params.from
      }
    }
  }
</script>

<style scoped lang="less">
  .popup-content {
    width: 100%;
    border-radius: .22rem .22rem 0 0;
    height: 3.8rem;
    background: #fff;
    text-align: center;
  }

  .more-text {
    font-size: .32rem;
    font-weight: bold;
    color: #2b2b2b;
    padding-top: .4rem;
    margin-bottom: .5rem;
  }

  .close {
    width: .24rem;
    height: .24rem;
    padding: .1rem;
    box-sizing: content-box;
    position: absolute;
    right: .2rem;
    top: .4rem;

    &:active {
      transform: scale(1.1);
    }
  }

  .list {
    display: flex;
  }

  .item {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .item-icon {
    width: 1.18rem;
    height: 1.18rem;
    margin-bottom: .14rem;
  }

  .text {
    font-size: .24rem;
    color: #3b3b3b;
  }
</style>
