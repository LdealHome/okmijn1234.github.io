<!--课程客服弹框-->
<template lang="pug">
  div.course__bounced
    div.mask
    div.content
      div.close(@click="$emit('close')")
      div.above
        div.above-top
          p.text 恭喜你加入
          h4.name {{courseData.name}}
        div.above-content(v-html="courseData.content")
        div.above-img
          img.img(v-lazy="courseData.codeSrc")
          p.prompt 请务必关注，否则讲无法学习
      a.dial(:href="'tel:'+ courseData.dial") 一键拨号
</template>

<script>
  import {
    getCourseServe
  } from '../../services'
  export default {
    name: 'CourseCustomerServicePopup',
    data () {
      return {
        courseData: {
          content: '',
          name: '',
          dial: '',
          codeSrc: ''
        }
      }
    },
    created () {
      let that = this
      getCourseServe().then(res => {
        if (res.data.code === 1) {
          let data = res.data.data
          that.courseData = {
            content: data.customer_text,
            name: data.title,
            dial: data.customer_mobile,
            codeSrc: data.customer_qr_code
          }
        }
      })
    }
  }
</script>

<style scoped lang="less">
  .course__bounced {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    width: 100%;
    height: 100%;
    z-index: 11;

    .mask {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, .5);
    }

    .content {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 5.8rem;
    }

    .close {
      position: absolute;
      top: -.96rem;
      right: 0;
      width: .96rem;
      height: .96rem;
      background: url("~@icon/community/close-white.png") no-repeat center right;
      background-size: .48rem;

      &:active {
        transform: scale(1.06);
      }
    }

    .above {
      display: flex;
      align-items: center;
      flex-direction: column;
      padding: .8rem 0;
      width: 5.8rem;
      border-radius: .12rem;
      background: #fff url("~@images/community/course-top.png") no-repeat center top;
      background-size: auto 1.68rem;

      &-top {
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        width: 3.4rem;
        height: 1.48rem;
        line-height: 1.4;
        border-radius: .08rem;
        box-shadow: 0 2px 9px 0 rgba(182, 171, 172, .5);
        background-color: rgba(255, 255, 255, .9);

        &::before {
          position: absolute;
          top: -.2rem;
          left: 0;
          right: 0;
          content: '';
          width: 100%;
          height: .22rem;
          background: url("~@images/community/course-img.png") no-repeat center;
          background-size: contain;
        }
      }

      &-content {
        margin: .28rem;
        text-align: center;
        line-height: 1.4;
      }

      &-img {
        display: flex;
        align-items: center;
        flex-direction: column;
      }
    }

    .name {
      color: #f25622;
      font-size: .4rem;
    }

    .text {
      color: #333;
      font-size: .34rem;
      font-weight: bold;
    }

    .img {
      width: 2rem;
      height: 2rem;
      border-radius: .08rem;
    }

    .prompt {
      color: #f25622;
      font-size: .24rem;
      font-weight: bold;
      transform: scale(.83);
      margin-top: .24rem;
    }

    .dial {
      display: block;
      margin: .25rem auto;
      width: 3.3rem;
      height: .54rem;
      color: #000;
      line-height: .54rem;
      text-align: center;
      font-size: .28rem;
      background: url("~@images/community/course-btn.png") no-repeat center;
      background-size: contain;

      &:active {
        transform: scale(1.06);
      }
    }
  }
</style>
