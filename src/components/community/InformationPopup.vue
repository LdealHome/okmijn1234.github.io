<!--支付成功完善信息-->
<template lang="pug">
  div.information__bounced
    div.mask
    div.content
      div.content__title
        h4.title 填写信息后即可进群
        p.close(@click="$emit('close')")
      ul.content__list
        li.content__item
          p.title 姓名
          label.label
            input.text(
              placeholder="请输入您的姓名"
              type="text"
              v-model.trim="informationData.nickname"
              v-ios-focus
              )
        li.content__item
          p.title 手机号
          label.label
            input.text(
              placeholder="请输入您的手机号"
              type="number"
              v-model.trim="informationData.phone"
              v-ios-focus
              )
        li.content__item
          p.title 职位
          div.list
            label.list-item(v-for="(item, index) in postList" :key="item.key")
              input.choose(
                type="radio"
                name="radio"
                id="item.id"
                :value="item"
                v-model="informationData.post"
                @change="realTimeChange(item)"
                )
              span {{item.name}}
              // 其他显示
              span(v-if="item.key === -1") ：
              input.post(
                v-if="item.key === -1"
                placeholder="请输入您的职位"
                :readonly="isReadonly"
                v-model.trim="informationData.otherPost"
                v-ios-focus
                )
      button.content__determine(type="button" @click="$emit('determine', informationData)") 确认
</template>

<script>
  export default {
    name: 'InformationPopup',
    props: {
      postList: { // 职位列表
        type: Array,
        required: true,
        default () {
          return []
        }
      }
    },
    data () {
      return {
        informationData: {
          nickname: '', // 姓名
          phone: '', // 电话
          post: '', // 职位
          otherPost: '' // 其他职位
        },
        isReadonly: true // 是否可以点击
      }
    },
    methods: {
      realTimeChange (item) {
        this.isReadonly = item.key !== -1
        this.informationData.otherPost = ''
      }
    }
  }
</script>

<style scoped lang="less">
  .information__bounced {
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
      width: 5.8rem;
      border-radius: .12rem;
      transform: translate(-50%, -50%);
      background-color: #fff;

      &__title {
        position: relative;
        text-align: center;
        padding: .4rem 0 .28rem 0;

        .title {
          color: #333;
          font-size: .36rem;
          font-weight: bold;
        }
      }

      &__list {
        padding: 0 .5rem;
      }

      &__item {
        position: relative;
        margin-bottom: .38rem;

        &::after {
          .setBottomLine(#ebebeb);
        }

        &:last-child::after {
          display: none;
        }

        .title {
          color: #333;
          font-size: .32rem;
        }

        .label {
          display: flex;
          align-items: center;
          padding: .2rem 0;
        }

        .text {
          color: #666;
          font-size: .32rem;

          &::-webkit-input-placeholder {
            color: #ccc;
          }
        }
      }

      &__determine {
        display: block;
        margin: .32rem auto;
        width: 3.76rem;
        height: .8rem;
        color: #fff;
        font-size: .32rem;
        border-radius: 1rem;
        background: linear-gradient(to right, #ff7606, #fe4006);

        &:active {
          background: linear-gradient(to left, #ff7606, #fe4006);
        }
      }
    }

    .close {
      position: absolute;
      top: 0;
      right: 0;
      width: .84rem;
      height: .84rem;
      background: url("~@icon/community/close-gray.png") no-repeat center;
      background-size: .44rem;

      &:active {
        transform: scale(1.06);
      }
    }
  }

  .list {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    margin-top: .3rem;

    &-item {
      display: flex;
      align-items: center;
      color: #333;
      font-size: .32rem;
      width: 1.6rem;
      margin-bottom: .2rem;

      &:last-child {
        width: initial;
      }

      .choose {
        width: .36rem;
        height: .36rem;
        border: 1px solid #ccc;
        border-radius: 1rem;
        margin-right: .18rem;

        &:checked {
          border: none;
          background: url("~@icon/community/checked-active.png") no-repeat center;
          background-size: contain;
        }
      }

      .post {
        color: #666;
        font-size: .32rem;
        width: 3.3rem;
        padding: .1rem .2rem;
        border: 1px solid #ccc;
        border-radius: .08rem;

        &::-webkit-input-placeholder {
          color: #ccc;
        }
      }
    }
  }
</style>
