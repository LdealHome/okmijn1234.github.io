<template lang="pug">
  div#footer
    ul.list
      li.item(
        :class="itemClass(1)"
        @click="switchTab(1)"
      )
        span.item-icon.hammer
        span.text 自动集福页
      li.item(
        :class="itemClass(2)"
        @click="switchTab(2)"
      )
        span.item-icon.home
        span.text 集福中心
      li.item(
        :class="itemClass(3)"
        @click="switchTab(3)"
      )
        span.item-icon.study
        span.text 学习中心
</template>

<script>
  export default {
    name: 'FooterCommon',
    props: {
      selectedTab: {
        type: [Number, String],
        required: false,
        default: -1
      }
    },
    computed: {
      itemClass (index) {
        return index => {
          return { 'item-active': index === +this.selectedTab }
        }
      },
      uid () {
        return this.$store.state.personalInfo.uid
      }
    },
    methods: {
      switchTab (index) {
        if (index === +this.selectedTab) {
          return
        }
        switch (index) {
        case 1:
          this.$router.push({ name: 'particulars', params: { from: this.uid } })
          break
        case 2:
          this.$router.push({ name: 'home' })
          break
        case 3:
          this.$router.push({ name: 'mine' })
          break
        default:
          break
        }
      }
    }
  }
</script>

<style scoped lang="less">
  #footer {
    width: 100%;
    position: fixed;
    bottom: 0;
    z-index: 10;
    padding-bottom: env(safe-area-inset-bottom);
    background: #fff;
  }

  .list {
    display: flex;
    box-shadow: 0 -1px 1px 0 rgba(228, 226, 226, 1);
  }

  .item {
    flex: 1;
    height: .98rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-top: .08rem;
    position: relative;
  }

  .item-icon {
    width: .5rem;
    height: .5rem;
    display: inline-block;
  }

  .hammer {
    background: url('~@icon/footer/hammer.png') no-repeat;
    background-size: 100%;
  }

  .home {
    background: url('~@icon/footer/fu.png') no-repeat;
    background-size: 100%;
  }

  .study {
    background: url('~@icon/footer/study.png') no-repeat;
    background-size: 100%;
  }

  .item-active {
    .hammer {
      background: url('~@icon/footer/hammer-active.png') no-repeat;
      background-size: 100%;
    }

    .home {
      background: url('~@icon/footer/fu-active.png') no-repeat;
      background-size: 100%;
    }

    .study {
      background: url('~@icon/footer/study-active.png') no-repeat;
      background-size: 100%;
    }
  }

  .text {
    position: absolute;
    bottom: .06rem;
    font-size: .4rem;
    color: #313131;
    display: block;
    transform: scale(.5);
    transform-origin: 50% 100%;
  }
</style>
