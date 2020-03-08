<template lang="pug">
  div.course(v-if="isLoad")
    DetailsContent(
      :contentList="contentList"
      @videoPlay="videoPlay"
      @jumpLink="jumpLink"
    )
    div.course__footer
      div.amount
        p.price {{courseDetailsInfo.price}}
        p.original(v-if="courseDetailsInfo.originalPrice")
          span.original-text 限时特惠
          span.original-price 原价{{courseDetailsInfo.originalPrice}}元
      div.btns
        template(v-if="!isObtain")
          button.btn.immediately(type="button" @click="immediately") 立即购买
          button.btn.free(type="button" @click="free") 免费获取
        button.obtain(v-else @click="free") 已免费获取
    CustomerServicePopup(
      v-if="isCustomerServicePopup"
      :customer="customerServiceData"
      @close="isCustomerServicePopup = false"
      )
    WarmPromptPopup(
      v-if="isWarmPromptPopup"
      :number="WarmPromptNumber"
      @close="isWarmPromptPopup = false"
      @invite="invite"
    )
    CommonSharePopup(
      :fromUid="uid"
      :isCommonSharePopup="commonShareInfo.isCommonSharePopup"
      :changePopupNumber="commonShareInfo.changePopupNumber"
    )

</template>

<script>
  import DetailsContent from '../../components/community/DetailsContent'
  import CommonSharePopup from '../../components/community/CommonSharePopup'
  import CustomerServicePopup from '../../components/community/CustomerServicePopup'
  import WarmPromptPopup from '../../components/community/WarmPromptPopup'
  import weixinConfig from '../../mixin/weixinConfig'
  import {
    getCourseDetail
  } from '../../services/community'
  import {
    getServiceInfo
  } from '../../services'
  export default {
    name: 'CourseDetails',
    components: {
      DetailsContent,
      CustomerServicePopup,
      WarmPromptPopup,
      CommonSharePopup
    },
    mixins: [weixinConfig],
    watch: {
      isCustomerServicePopup (val) {
        // true 显示弹框 false 关闭弹框
        this.$root.$emit('toggleModal', Boolean(val))
      },
      isWarmPromptPopup (val) {
        this.$root.$emit('toggleModal', Boolean(val))
      },
      isLoadGuestInfo () {
        this.main()
      },
      sceneService () {
        this.getSceneValue()
      },
      uid () {
        this.configShareInfo()
      }
    },
    computed: {
      courseId () {
        return this.$route.params.courseId
      },
      // 访客
      isGuest () {
        return this.$store.state.guest
      },
      // 是否加载访客信息
      isLoadGuestInfo () {
        return this.$store.state.isLoadGuestInfo
      },
      // 客服场景值
      sceneService () {
        return this.$store.state.sceneInfo.customer.activity_curriculum
      },
      uid () {
        return this.$store.state.personalInfo.uid
      }
    },
    data () {
      return {
        isLoad: false,
        isSceneService: false, // 客服固定场景值是否加载
        courseDetailsInfo: {
          price: '', // 价格
          originalPrice: '' // 原价
        },
        contentList: [], // 内容
        isObtain: false, // 是否获取课程
        isCustomerServicePopup: false, // 客服二维码弹框
        customerServiceData: { // 客服弹框公共(客服和课程)
          differentiate: 0,
          content: '',
          codeSrc: '' // 客服二维码
        }, // 群弹框
        courseServiceData: { // 课程二维码弹框
          differentiate: 1,
          content: '',
          codeSrc: ''
        },
        serviceData: { // 客服固定的
          differentiate: 0,
          content: '',
          codeSrc: '' // 客服二维码
        },
        isWarmPromptPopup: false, // 是否已经达到免费获取资格
        WarmPromptNumber: 0, // 提示还需多少个人
        commonShareInfo: {
          isCommonSharePopup: false,
          changePopupNumber: 0
        },
        shareInfo: null
      }
    },
    created () {
      if (this.isLoadGuestInfo) { // 访客跳转到社群详情
        this.main()
      }
    },
    methods: {
      main () {
        if (this.isGuest) {
          this.$router.replace({ name: '404' })
          return
        }
        this.isLoad = true
        this.mine()
      },
      mine () {
        let that = this
        getCourseDetail({ id: this.courseId }).then(res => {
          if (res.data.code === 1) {
            let data = res.data.data
            let courseInfo = data.course_info
            let relationInfo = data.relation_info

            document.title = courseInfo.title

            that.shareInfo = data.share_info
            that.configShareInfo()
            that.courseDetailsInfo = {
              price: Number.isInteger(+courseInfo.price) ? parseInt(courseInfo.price) : courseInfo.price,
              originalPrice: Number.isInteger(+courseInfo.old_price) ? parseInt(courseInfo.old_price) : courseInfo.old_price
            }

            that.contentList = that.transformContentList(courseInfo.content)

            that.isObtain = data.status === 2

            if (data.status === 4) { // 课程结束
              that.$router.replace({
                name: 'end'
              })
            }

            that.courseServiceData.content = relationInfo.customer_text
            that.courseServiceData.codeSrc = relationInfo.customer_qr_code

            that.WarmPromptNumber = relationInfo.rest_invite_number

            that.getSceneValue()
          }
        })
      },
      /**
       * 配置分享信息
       */
      configShareInfo () {
        if (this.uid && this.shareInfo) {
          this.getWeiXinConfig({
            desc: this.shareInfo.content,
            img: this.shareInfo.img_url,
            title: this.shareInfo.title,
            link: `${location.origin}/particulars/from/${this.uid}`
          }).then(this.setWeiXinConfig)
        }
      },
      getSceneValue () {
        let that = this
        if (!this.isSceneService && this.sceneService) {
          this.isSceneService = true
          getServiceInfo({ scene: this.sceneService }).then(res => {
            if (res.data.code === 1) {
              let data = res.data.data
              that.serviceData.codeSrc = data.qr_code
            }
          })
        }
      },
      /**
       * 视频播放
       * @param itemIndex { Number } 选择视频父元素的角标
       * @param videoIndex { Number } 选择播放视频当前的角标
       * @param video {Object} 视频播放
       */
      videoPlay (itemIndex, videoIndex, video) {
        this.contentList[itemIndex].videoList[videoIndex].isVideoPlay = true
        video.play()
      },
      /**
       * 跳转链接
       * @param url {String} 跳转链接
       */
      jumpLink (url) {
        this.$_.entryOtherPage(url)
      },
      // 立即购买
      immediately () {
        this.changeCustomerCommon(0)
      },
      // 免费获取
      free () {
        if (this.isObtain) {
          this.changeCustomerCommon(1)
        } else {
          this.isWarmPromptPopup = true
        }
      },
      // 立即邀请
      invite () {
        this.isWarmPromptPopup = false
        this.commonShareInfo.isCommonSharePopup = true
        this.commonShareInfo.changePopupNumber++
      },
      // 重新加载
      reload () {
        this.mine()
      },
      /**
       * 客服弹框和课程弹框公共部分修改对应的值
       * @param differentiate {Number} 区分是那个0客服，1课程
       */
      changeCustomerCommon (differentiate) {
        if (differentiate === 0) { // 客服
          this.customerServiceData = this.serviceData
        } else { // 课程
          this.customerServiceData = this.courseServiceData
        }
        this.isCustomerServicePopup = true
      },
      /**
       * 转换内容数据
       * @param source {Object} 需要转换的数据源
       * @return {Object} 转换后可以直接使用的结构
       */
      transformContentList (source) {
        let list = []
        source.forEach(item => {
          list.push({
            videoList: this.transformVideoList(item.list_data), // 视频列表/多个链接
            type: item.mark_format, // 类型 1图片 2文本 3单个视频 4多个视频 6多链接
            title: item.title, // 标题
            text: item.resource // 文本内容
          })
        })
        return list
      },
      /**
       * 转换视频列表数据
       * @param source {Object} 需要转换的数据源
       * @return {Object} 转换后可以直接使用的结构
       */
      transformVideoList (source) {
        let list = []
        source.forEach(item => {
          list.push({
            src: item.url, // 视频路径
            cover: item.img_url, // 封面图
            text: item.title,
            isVideoPlay: false
          })
        })
        return list
      }
    }
  }
</script>

<style scoped lang="less">
  .course {
    padding-bottom: 1.2rem;
    background-color: #fff;

    &__footer {
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      display: flex;
      align-items: center;
      height: 1.2rem;
      padding: 0 .1rem;
      background-color: #fff;

      .amount {
        display: flex;
        align-items: center;

        /* width: 2.86rem; */
        flex: 1;
      }

      .price {
        color: #fe5832;
        font-size: .44rem;
        font-weight: bold;

        &::before {
          content: '￥';
          font-size: .28rem;
          font-weight: bold;
        }
      }

      .original {
        display: flex;
        align-items: center;
        flex-direction: column;
        font-size: .24rem;
        transform: scale(.84);
        margin-left: .1rem;

        &-text {
          color: #fff;
          padding: .02rem .1rem;
          border-radius: .08rem;
          background: linear-gradient(to right, #fe5933, #ff8016);
        }

        &-price {
          color: #7f7f7f;
          text-decoration: line-through;
        }
      }

      .btns {
        flex: 1;
        display: flex;
        align-items: center;
      }

      .btn {
        flex: 1;
        height: .8rem;
        color: #fff;
        font-size: .32rem;
      }

      .immediately {
        border-top-left-radius: 1rem;
        border-bottom-left-radius: 1rem;
        background: linear-gradient(to right, #fec911, #ff960f);

        &:active {
          background: linear-gradient(to left, #fec911, #ff960f);
        }
      }

      .free {
        border-top-right-radius: 1rem;
        border-bottom-right-radius: 1rem;
        background: linear-gradient(to right, #ff7606, #fe4006);

        &:active {
          background: linear-gradient(to left, #ff7606, #fe4006);
        }
      }

      .obtain {
        color: #999;
        font-size: .32rem;
        width: 4rem;
        height: .8rem;
        border-radius: 1rem;
        background-color: #ebebeb;
      }
    }
  }
</style>
