<template lang="pug">
  div.whole
    RewardPopup(:rewardInfo="rewardInfo" @close="rewardInfo.isShow = false")
    PopupChat(:chatInfo="chatInfo")
    PopupMore(
      :isShow="isShowMore"
      @close="isShowMore = false"
      @collect="isShowCollect = true"
    )
    GuideCollection(:isShow="isShowCollect" @close="isShowCollect = false")
</template>

<script>
  import RewardPopup from '../../components/course/RewardPopup'
  import PopupChat from '../../components/course/PopupChat'
  import PopupMore from '../../components/course/PopupMore'
  import GuideCollection from '../../components/course/GuideCollection'
  export default {
    name: 'CouresHorizontal',
    components: {
      RewardPopup,
      PopupChat,
      PopupMore,
      GuideCollection
    },
    data () {
      return {
        rewardInfo: {
          isShow: false,
          title: '喜欢讲师',
          avatar: '',
          name: '册撒发给'
        },
        chatInfo: {
          isShow: true,
          list: [
            {
              id: 0,
              avatar: '',
              text: '回复问题',
              isAsk: false
            },
            {
              id: 1,
              avatar: '',
              text: '回复问题',
              isAsk: true
            }
          ]
        },
        isShowMore: true,
        isShowCollect: false
      }
    }
  }
</script>

<style scoped lang="less">
  .whole {
    // min-height: 100vh;
    // overflow: hidden;
  }
</style>
