<template lang="pug">
  div#app(@click="handleClick") 我的修改的next分支
    transition(:css="isTransition")
      router-view(v-wechat-title='$route.meta.title' v-if="!restrict") 撒大大阿萨达萨达
</template>

<script>
  import { MessageBox } from 'mint-ui'
  import weixinConfig from './mixin/weixinConfig'
  export default {
    name: 'App',
    data () {
      return {
        timer: null,
        usePrimitiveUploader: false,
        clickCount: 0
      }
    },
    mixins: [weixinConfig],
    computed: {
      isTransition () {
        return this.$route.meta.transition === true
      },
      uid () {
        return this.$store.state.personalInfo.uid
      },
      restrict () {
        return this.$store.state.accessStatus.restrict
      },
      desc () {
        return this.$store.state.accessStatus.desc
      },
      shareInfo () {
        return this.$store.state.globalInfo.share_info
      },
      isAccessibleVisit () {
        return this.$store.state.globalInfo.is_open
      },
      accessiblePageList () {
        return this.$store.state.globalInfo.route_list
      },
      routerMeta () {
        return this.$route.meta || {}
      },
      isLoadGuestInfo () {
        return this.$store.state.isLoadGuestInfo
      },
      isGuest () {
        return this.$store.state.guest
      },
      typeTableLoaded () {
        return this.$store.state.typeTableLoaded
      }
    },
    watch: {
      // 解决第一次登录时更新分享人信息
      uid (id) {
        let fromId = this.$_.getFromId(location.pathname)
        if (fromId && fromId < 2 && +id !== +fromId) {
          let pathname = location.pathname.replace(/\/from\/\d+/, function () {
            return `/from/${id}`
          })
          location.replace(location.origin + pathname)
        }
        this.baseWeixinShare()
      },
      desc (val) {
        if (val) {
          MessageBox.alert(val, '登录限制').then(() => {
            window.opener = null
            window.close()
            if (window.WeixinJSBridge) {
              window.WeixinJSBridge.call('closeWindow')
            }
          })
        }
      },
      $route () {
        // 路由更新后，获取分享信息
        this.baseWeixinShare()
        // 解决页面在显示弹窗时，直接关闭页面或跳转页面后，无法滚动问题
        this.handleToggleModal(false)
        this.guestHandle()
      },
      shareInfo () {
        this.baseWeixinShare()
      },
      isLoadGuestInfo () {
        this.guestHandle()
      },
      typeTableLoaded () {
        this.pageAccessible()
      }
    },
    created () {
      // 全局处理模态框滚动穿透的问题
      // this.$root.$on('toggleModal', this.handleToggleModal)
    },
    methods: {
      handleToggleModal (isShow) {
        if (isShow) {
          this.scrollTop = document.scrollingElement.scrollTop
          document.scrollingElement.style = `position:fixed;width:100%;top:-${this.scrollTop}px;`
        } else {
          window.$_.scrollY = this.scrollTop
          document.scrollingElement.removeAttribute('style')
          document.scrollingElement.scrollTop = this.scrollTop || 0
        }
      },
      handleClick () {
        if (this.usePrimitiveUploader) return
        if (this.timer) {
          this.clickCount += 1
          if (this.clickCount >= 5) {
            clearTimeout(this.timer)
            this.timer = null
            sessionStorage.setItem('usePrimitiveUploader', true)
            this.usePrimitiveUploader = true
            this.$_.Toast('上传方式更换成功')
          }
        } else {
          this.clickCount = 1
          this.timer = setTimeout(() => {
            clearTimeout(this.timer)
            this.timer = null
          }, 1e3)
        }
      },
      baseWeixinShare () {
        if (this.routerMeta.share || !this.shareInfo || !this.uid) return
        let link = `${location.origin}/particulars/from/${this.uid}`
        this.updateWXConfig(link)
        this.getWeiXinConfig({
          desc: this.shareInfo.content,
          img: this.shareInfo.img_url,
          title: this.shareInfo.title,
          link: link
        })
          .then(this.setWeiXinConfig)
      },
      guestHandle () {
        if (this.isLoadGuestInfo && this.isGuest && this.$route.name && !this.routerMeta.share && this.$route.name !== '404') {
          this.$router.replace({ name: 'particulars', params: { from: 1 } })
          return
        }
        this.pageAccessible()
      },
      /**
       * 添加访问权限限制
       */
      pageAccessible () {
        // 判断没有权限的用户，访问限制页面跳转404
        if (this.typeTableLoaded && this.$route.name && !this.isAccessibleVisit && this.accessiblePageList.includes(this.$route.name)) {
          this.$router.replace({ name: '404' })
        }
      }
    }
  }
</script>

<style lang="less">
  .v-enter {
    opacity: 0;
  }

  .v-leave-to {
    opacity: 0;
  }

  .v-enter-active,
  .v-leave-active {
    will-change: transform;
    transition: all .5s;
    width: 100%;
    height: 100vh;
    position: absolute;
  }
</style>
