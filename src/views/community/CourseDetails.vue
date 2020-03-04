<template lang="pug">
  div.course
    template(v-if="isCourseState === 1 || isCourseState === 2")
      div.course__content(v-html="courseDetailsInfo.content") 内容区
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
          button.obtain(v-else) 已免费获取
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
        :courseId="+courseId"
        :isCommonSharePopup="commonShareInfo.isCommonSharePopup"
        :changePopupNumber="commonShareInfo.changePopupNumber"
      )
    // 课程结束
    CourseEnd(v-if="isCourseState === 4")
    // 重新加载
    LoadError(v-if="isCourseState === 3" @reload="reload")

</template>

<script>
  import CustomerServicePopup from '../../components/community/CustomerServicePopup'
  import WarmPromptPopup from '../../components/community/WarmPromptPopup'
  import CommonSharePopup from '../../components/community/CommonSharePopup'
  import weixinConfig from '../../mixin/weixinConfig'
  import CourseEnd from '../../components/community/CourseEnd'
  import LoadError from '../../components/community/LoadError'
  import {
    getCourseDetail
  } from '../../services/community'
  export default {
    name: 'CourseDetails',
    components: {
      CustomerServicePopup,
      WarmPromptPopup,
      CommonSharePopup,
      CourseEnd,
      LoadError
    },
    mixins: [weixinConfig],
    watch: {
      isCustomerServicePopup (val) {
        // true 显示弹框 false 关闭弹框
        this.$root.$emit('toggleModal', Boolean(val))
      },
      isWarmPromptPopup (val) {
        this.$root.$emit('toggleModal', Boolean(val))
      }
    },
    computed: {
      courseId () {
        return this.$route.params.courseId
      }
    },
    data () {
      return {
        courseDetailsInfo: {
          content: '',
          price: '', // 价格
          originalPrice: '' // 原价
        },
        isObtain: false, // 是否获取课程
        isCourseState: 1, // 课程状态 1未获取 2已获取 3课程不存在或者加载失败 4.活动课程过期
        isCustomerServicePopup: false, // 客服二维码弹框
        customerServiceData: {
          differentiate: 0,
          content: '',
          codeSrc: '' // 客服二维码
        },
        isWarmPromptPopup: false, // 是否已经达到免费获取资格
        WarmPromptNumber: 0, // 提示还需多少个人
        commonShareInfo: {
          isCommonSharePopup: false,
          changePopupNumber: 0
        }
      }
    },
    created () {
      this.mine()
    },
    methods: {
      mine () {
        let that = this
        getCourseDetail({ id: this.courseId }).then(res => {
          if (res.data.code === 1) {
            let data = res.data.data
            let courseInfo = data.course_info
            let relationInfo = data.relation_info
            let shareInfo = data.share_info
            that.courseDetailsInfo = {
              content: courseInfo.content,
              price: courseInfo.price, // 价格
              originalPrice: courseInfo.old_price // 原价
            }

            that.isObtain = data.status === 2
            that.isCourseState = data.status

            that.customerServiceData.content = relationInfo.customer_text
            that.customerServiceData.codeSrc = relationInfo.customer_qr_code

            that.WarmPromptNumber = relationInfo.rest_invite_number

            // 分享配置信息
            that.getWeiXinConfig({
              desc: shareInfo.content,
              img: shareInfo.img_url,
              title: shareInfo.title,
              link: shareInfo.link
            }).then(this.setWeiXinConfig)
          }
        })
      },
      // 立即购买
      immediately () {
        this.isCustomerServicePopup = true
      },
      // 免费获取
      free () {
        if (!this.isObtain) {
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
      }
    }
  }
</script>

<style scoped lang="less">
  .course {
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
        width: 2rem;
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
