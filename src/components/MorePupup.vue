<template lang="pug">
  div
    div.content-back(v-show="isShowMore" @click="isShowMore = false")
      div.hammer-view(@click.stop="$router.push({ name: 'particulars', params: { from: uid } })") 自动成交页
      div.fu-view(@click.stop="$router.push({ name: 'home' })") 集福中心
      div.study-view(@click.stop="$router.push({name: 'mine'})") 学习中心
      div.collection-view(@click.stop="$emit('collectionClick')") 收藏
    img.more-btn(:src="imgSrc" @click="isShowMore = !isShowMore")
</template>

<script>
  export default {
    name: 'MorePupup',
    data () {
      return {
        isShowMore: false
      }
    },
    watch: {
      isShowMore (val) {
        this.$root.$emit('toggleModal', Boolean(val))
      }
    },
    computed: {
      uid () {
        return this.$store.state.personalInfo.uid
      },
      imgSrc () {
        return this.isShowMore ? require('../assets/icon/more/retract.png') : require('../assets/icon/more/more.png')
      }
    }
  }
</script>

<style scoped lang="less">
  .more-btn {
    width: .94rem;
    height: .94rem;
    position: fixed;
    bottom: 3.08rem;
    right: .6rem;
    z-index: 11;
  }

  .content-back {
    width: 100%;
    height: 100vh;
    background: rgba(0, 0, 0, .5);
    position: fixed;
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
    font-size: .24rem;
    color: #fff;
    z-index: 11;
  }

  .hammer-view {
    width: 1.4rem;
    position: absolute;
    background: url('~@icon/more/hammer.png') no-repeat top center;
    background-size: .94rem;
    right: .37rem;
    bottom: 4.76rem;
    text-align: center;
    padding-top: 1rem;
  }

  .fu-view {
    width: 1.4rem;
    position: absolute;
    background: url('~@icon/more/fu.png') no-repeat top center;
    background-size: .94rem;
    right: 2.29rem;
    bottom: 4.34rem;
    text-align: center;
    padding-top: 1rem;
  }

  .study-view {
    width: 1.4rem;
    position: absolute;
    background: url('~@icon/more/study.png') no-repeat top center;
    background-size: .94rem;
    right: 3.07rem;
    bottom: 2.72rem;
    text-align: center;
    padding-top: 1rem;
  }

  .collection-view {
    width: 1.4rem;
    position: absolute;
    background: url('~@icon/more/collection.png') no-repeat top center;
    background-size: .94rem;
    right: 2.21rem;
    bottom: 1.02rem;
    text-align: center;
    padding-top: 1rem;
  }
</style>
