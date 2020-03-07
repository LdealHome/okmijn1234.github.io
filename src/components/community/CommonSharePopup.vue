<!--分享弹框-->
<template lang="pug">
  div
    SharePopup(
      v-if="isSharePopup"
      @close="isSharePopup = false"
      @friendShare="friendShare"
      @posterShare="posterShare"
      @linkShare="linkShare"
    )
    CircleFriendsSharePopup(
      v-if="isCircleFriendsSharePopup"
      :circleFriendsInfo="circleFriendsInfo"
      @close="isCircleFriendsSharePopup = false"
      @change="circleFriendsChange"
      @copy="copyCommonality"
    )
    LinkSharePopup(
      v-if="isLinkSharePopup"
      :linkList="linkShareList"
      @close="isLinkSharePopup = false"
      @copy="copyCommonality"
    )
    PostersSharePopup(
      v-if="isPostersSharePopup"
      :posterInfo="posterInfo"
      @close="isPostersSharePopup = false"
    )
</template>

<script>
  import SharePopup from '../../components/community/SharePopup'
  import CircleFriendsSharePopup from '../../components/community/CircleFriendsSharePopup'
  import LinkSharePopup from '../../components/community/LinkSharePopup'
  import PostersSharePopup from '../../components/community/PostersSharePopup'
  import initClipBoard from '../../mixin/initClipBoard'
  import {
    getShareCircleFriends,
    getShareLink,
    getSharePoster
  } from '../../services/community'

  export default {
    name: 'CommonSharePopup',
    props: {
      isCommonSharePopup: {
        type: Boolean,
        required: true,
        default: false
      },
      changePopupNumber: {
        type: Number,
        required: true,
        default: 0
      },
      fromUid: { // 分享人的uid
        type: [String, Number],
        required: true,
        default: 0
      }
    },
    components: {
      SharePopup,
      CircleFriendsSharePopup,
      PostersSharePopup,
      LinkSharePopup
    },
    mixins: [initClipBoard],
    watch: {
      isSharePopup (val) {
        this.$root.$emit('toggleModal', Boolean(val))
      },
      isCircleFriendsSharePopup (val) {
        this.$root.$emit('toggleModal', Boolean(val))
      },
      isLinkSharePopup (val) {
        this.$root.$emit('toggleModal', Boolean(val))
      },
      isPostersSharePopup (val) {
        this.$root.$emit('toggleModal', Boolean(val))
      },
      changePopupNumber () {
        if (!this.isCommonSharePopup) {
          this.isCircleFriendsSharePopup = true
        }
        this.isSharePopup = this.isCommonSharePopup
      }
    },
    data () {
      return {
        isSharePopup: false,
        isCircleFriendsSharePopup: false, // 分享朋友圈弹框
        isLinkSharePopup: false, // 链接分享弹框
        isPostersSharePopup: false, // 海报分享弹框
        circleFriendsInfo: {
          content: '', // 带富文本的内容
          id: -1,
          shareContent: '' // 分享到朋友圈的文案
        },
        linkShareList: [], // 链接分享弹框列表
        posterInfo: { // 海报分享弹框
          backSrc: '', // 背景
          portraitSrc: '', // 头像
          nicknameText: '', // 昵称
          codeSrc: '' // 二维码
        }
      }
    },
    methods: {
      // 朋友圈分享
      friendShare () {
        this.shareCircleFriends('')
        this.isSharePopup = false
      },
      // 海报分享
      posterShare () {
        let that = this
        getSharePoster({ uid: this.fromUid }).then(res => {
          if (res.data.code === 1) {
            let data = res.data.data
            that.posterInfo = {
              backSrc: data.img_url,
              portraitSrc: data.head_img,
              nicknameText: data.nick_name,
              codeSrc: data.qr_code
            }
            that.isSharePopup = false
            that.isPostersSharePopup = true
          }
        })
      },
      // 链接分享
      linkShare () {
        let that = this
        getShareLink({ uid: this.fromUid }).then(res => {
          if (res.data.code === 1) {
            that.linkShareList = res.data.data.list
            that.isSharePopup = false
            that.isLinkSharePopup = true
          }
        })
      },
      /**
       * 分享朋友圈弹框文案切换
       * @param id {Number} id
       */
      circleFriendsChange (id) {
        this.shareCircleFriends(id)
      },
      /**
       * 一键复制
       * @param text {String} 复制的内容
       */
      copyCommonality (text) {
        let className = '.copy'
        this.initClipBoard(className, text)
      },
      /**
       * 分享到朋友圈
       * @param id { Number | String } id
       */
      shareCircleFriends (id) {
        let that = this
        getShareCircleFriends({ id: id, uid: this.fromUid }).then(res => {
          if (res.data.code === 1) {
            let data = res.data.data
            that.circleFriendsInfo = {
              content: data.content,
              id: data.id,
              shareContent: data.share_content
            }
            if (id === '') {
              this.isCircleFriendsSharePopup = true
            }
          }
        })
      }
    }
  }
</script>
