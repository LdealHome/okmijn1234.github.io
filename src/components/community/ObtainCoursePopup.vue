<!--邀请人数达标获得课程-->
<template lang="pug">
  div.obtain__bounced
    div.mask
    div.content
      div.course
        p.text 恭喜您免费获得课程
        p.name 《{{courseInfo.name}}》
        p.close(@click="$emit('close')")
        img.img(:src="courseInfo.imgSrc")
        p.prompt 长按可保存到手机相册
      div.btns
        button.btn(type="button" @click="$emit('invite')") 继续邀请好友
        button.btn(type="button" @click="$emit('service')") 联系客服领取
</template>

<script>
  export default {
    name: 'ObtainCoursePopup',
    props: {
      courseInfo: {
        type: Object,
        required: true,
        default () {
          return {
            name: '', // 课程名称
            imgSrc: '' // 图片路径
          }
        }
      }
    }
  }
</script>

<style scoped lang="less">
  .obtain__bounced {
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
      width: 5.9rem;
    }

    .course {
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      color: #fff;
    }

    .text {
      font-size: .32rem;
    }

    .name {
      font-size: .34rem;
      font-weight: bold;
    }

    .close {
      position: absolute;
      top: .6rem;
      right: .5rem;
      width: .76rem;
      height: .76rem;
      background: url("~@icon/community/close-white.png") no-repeat right center;
      background-size: .48rem;

      &:active {
        transform: scale(1.06);
      }
    }

    .img {
      width: 5.18rem;
      height: 6.92rem;
      border-radius: .12rem;
      margin-top: .3rem;
    }

    .prompt {
      color: #ebebeb;
      font-size: .28rem;
      margin: .2rem 0;
    }

    .btns {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .btn {
      width: 2.8rem;
      height: .74rem;
      color: #fff;
      font-size: .32rem;
      border-radius: 1rem;
      background: linear-gradient(to right, #ff7606, #fe4006);

      &:active {
        background: linear-gradient(to left, #ff7606, #fe4006);
      }
    }
  }
</style>
