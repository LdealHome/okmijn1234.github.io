<template lang="pug">
  div hello...
</template>

<script>
  export default {
    name: 'Reset',
    created () {
      $_.removeLocalToken()
    }
  }
</script>
