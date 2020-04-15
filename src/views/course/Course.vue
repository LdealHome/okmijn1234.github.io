<template lang="pug">
  div.whole
    CouresHorizontal
</template>

<script>
  import CouresHorizontal from './CouresHorizontal'
  export default {
    name: 'Course',
    components: {
      CouresHorizontal
    }
  }
</script>

<style scoped lang="less">
  .whole {
    min-height: 100vh;
  }
</style>
