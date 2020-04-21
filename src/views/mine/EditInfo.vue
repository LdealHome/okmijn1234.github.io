<template lang="pug">
  div.whole
    div.item.item-avatar
      span.text 头像
      img.avatar(:src="avatar" @click="avatarClick")
    div.item
      span.text 昵称
      input.item-input(placeholder="请输入昵称" v-model.trim="name" v-ios-focus)
    div.item
      span.text 真实姓名
      input.item-input(placeholder="请输入真实姓名" v-model.trim="realName" v-ios-focus)
    div.item
      span.text 手机号
      input.item-input(placeholder="请输入手机号" v-model.trim="phone" maxlength="11" v-ios-focus)
    div.item(v-show="isShowObtainBtn")
      span.text 验证码
      div.verified-right
        div.verified-back
          input.verified-input(placeholder="请输入验证码" v-model.trim="code" v-ios-focus)
          img.empty-btn(v-show="code" src="@icon/mine/delete-icon.png" @click="code = ''")
        div.send-btn(
          :class="{ 'send-btn-active': !isClickableObtainBtn }"
          @click="obtainCodeClick"
        ) {{obtainBtnText}}
    div.save-btn(@click="saveBtnClick") 保存
    MorePupup(
      @collectionClick="isShowCollect = true"
    )
    GuideCollection(:isShow="isShowCollect" @close="isShowCollect = false")
</template>

<script>
  import MorePupup from '../../components/MorePupup'
  import GuideCollection from '../../components/course/GuideCollection'
  import qiniuUpload from '../../mixin/qiniuUpload'
  import wexinConfig from '../../mixin/weixinConfig'
  import {
    getEditInfo,
    postSaveEditInfo
  } from '../../services/mine'
  import { postSendVerificationCode } from '../../services'
  export default {
    name: 'EditInfo',
    components: {
      MorePupup,
      GuideCollection
    },
    mixins: [wexinConfig, qiniuUpload],
    data () {
      return {
        avatar: '',
        name: '',
        realName: '',
        phone: '',
        code: '',
        originalPhone: '',
        countDown: 60,
        timer: null,
        avatarData: null,
        isShowCollect: false
      }
    },
    beforeRouteLeave (to, from, next) {
      if (this.timer) {
        clearInterval(this.timer)
      }
      next()
    },
    created () {
      // 获取微信配置信息
      this.getWeiXinConfig({ desc: '', img: '', title: '' })
        .then(this.setWeiXinConfig)
      this.main()
    },
    computed: {
      isShowObtainBtn () {
        return this.originalPhone !== this.phone
      },
      isClickableObtainBtn () {
        return this.countDown >= 60
      },
      obtainBtnText () {
        return this.isClickableObtainBtn ? '获取验证码' : `${this.countDown}s`
      },
      avatarScene () {
        return this.$store.state.sceneInfo.img.head_img
      }
    },
    methods: {
      main () {
        // 设置上传图片的环境
        this.$store.dispatch('getQiniuToken', [this.avatarScene])
        getEditInfo().then(res => {
          if (res.data.code === 1) {
            let data = res.data.data
            this.avatar = data.head_img
            this.realName = data.real_name
            this.phone = data.mobile
            this.originalPhone = data.mobile
            this.name = data.nick_name
          }
        })
      },
      saveBtnClick () {
        if (!this.name) {
          this.$_.Toast('昵称不能为空')
          return
        }
        if (!this.realName) {
          this.$_.Toast('真实姓名不能为空')
          return
        }
        if (!this.phone) {
          this.$_.Toast('手机号不能为空')
          return
        }
        if (this.isShowObtainBtn && !this.code) {
          this.$_.Toast('验证码不能为空')
          return
        }
        this.uploadAvatarImg().then(img => {
          postSaveEditInfo({
            code: this.isShowObtainBtn ? this.code : '',
            head_img: img,
            mobile: this.phone,
            nick_name: this.name,
            real_name: this.realName
          })
            .then(res => {
              if (res.data.code === 1) {
                this.$_.Toast('保存成功')
                this.$router.go(-1)
              }
            })
        })
      },
      uploadAvatarImg () {
        return new Promise((resolve, reject) => {
          if (/^blob:/.test(this.avatar)) {
            let imgList = [{
              scene: this.avatarScene,
              blob: this.avatarData.blob
            }]
            this.uploadImages(imgList).then(list => {
              resolve(list[0].url)
            })
          } else {
            resolve(this.avatar)
          }
        })
      },
      avatarClick () {
        this.getChooseImageData(1)
          .then(list => {
            let data = list[0]
            this.avatarData = data
            this.avatar = data.url
          })
      },
      /**
       * 点击获取短信验证码
       */
      obtainCodeClick () {
        if (this.isClickableObtainBtn) {
          postSendVerificationCode().then(res => {
            if (res.data.code === 1) {
              this.countDown--
              this.timer = setInterval(() => {
                if (this.countDown <= 1) {
                  clearInterval(this.timer)
                  this.timer = null
                } else {
                  this.countDown--
                }
              }, 1000)
            }
          })
        }
      }
    }
  }
</script>

<style scoped lang="less">
  .whole {
    min-height: 100vh;
    background: #eeeeed;
  }

  .item {
    height: 1.1rem;
    background-color: #fff;
    margin-bottom: 1px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 .54rem;
  }

  .item-avatar {
    background: #fff url('~@icon/mine/right-icon.png') no-repeat right .54rem center;
    background-size: .1rem;
  }

  .text {
    font-size: .34rem;
    color: #333;
  }

  .avatar {
    width: .7rem;
    height: .7rem;
    border-radius: .04rem;
    margin-right: .3rem;
  }

  .item-input {
    width: 4.1rem;
    font-size: .32rem;
    color: #999;
    text-align: right;
  }

  .verified-right {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-left: .88rem;
  }

  .verified-back {
    display: flex;
    align-items: center;
  }

  .empty-btn {
    width: .3rem;
    height: .3rem;
    padding: .1rem 0 .1rem .1rem;
    box-sizing: content-box;

    &:active {
      transform: scale(1.1);
    }
  }

  .verified-input {
    width: 2.3rem;
    font-size: .32rem;
    color: #333;
  }

  .send-btn {
    width: 1.5rem;
    height: .44rem;
    line-height: .44rem;
    text-align: center;
    border-radius: .22rem;
    font-size: .24rem;
    color: #fffefe;
    background: #fba627;
  }

  .send-btn-active { background: #ccc; }

  .save-btn {
    width: 5.8rem;
    height: .78rem;
    line-height: .78rem;
    border-radius: .39rem;
    text-align: center;
    background: #f9d400;
    font-size: .3rem;
    color: #313131;
    position: fixed;
    bottom: .56rem;
    left: 0;
    right: 0;
    margin: 0 auto;
    box-shadow: 0 0 .1rem 0 rgba(249, 212, 0, 1);

    &:active {
      background: darken(#f9d400, 5%);
    }
  }
</style>
