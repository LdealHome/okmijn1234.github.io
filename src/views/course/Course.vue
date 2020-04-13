<template lang="pug">
  div.whole
    div 123
    RewardPopup
</template>

<script>
  import RewardPopup from '../../components/course/RewardPopup'
  export default {
    name: 'Course',
    components: {
      RewardPopup
    }
  }
</script>

<style scoped lang="less">
  .whole {
    min-height: 100vh;
  }
</style>
