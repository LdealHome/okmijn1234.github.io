<template lang="pug">
  div
    mt-popup.popup-content(
      v-model="isShow"
    )
      img.close(src="@icon/close/close-reward.png" @click="isShow = false")
      p.top-text 喜欢讲师
      img.avatar(:src="rewardInfo.avatar")
      p.name {{rewardInfo.name}}
      div.reward-list(v-if="isFixed")
        div.reward-item(
          v-for="(amountItem, index) in rewardInfo.amountList"
          :key="index"
          :style="{'margin-right': (index+1)%3 === 0 ? 0 : '2%'}"
          @click="$emit('rewardClick', amountItem.price)"
        )
          span.symbol ￥
            span.sum {{amountItem.price}}
        button.other-amount(@click="isFixed = false") 其他金额
      div(v-else)
        div.reward-sum
          input.edit-sum(type="number" @input="handleInput2" pattern="\d*" placeholder="0.00" v-model.trim="editSum" v-ios-focus)
        button.fixed-sum(@click="isFixed = true") 固定金额
        div.confirm(@click="confirmSumClick") 确定
    // 输入的打赏金额错误消息框
    div.msg-back(v-if="isShowMessageBox")
      div.message-box
        p.tips-text 单笔金额不可低于0.3元
        button.msg-confirm(@click="isShowMessageBox = false") 确定
</template>

<script>
  export default {
    name: 'RewardPopup',
    props: {
      rewardInfo: {
        type: Object,
        required: false,
        default () {
          return {
            isShow: true,
            avatar: '',
            name: '',
            amountList: []
          }
        }
      }
    },
    data () {
      return {
        isShow: true,
        isFixed: true, // 是否选择打赏固定金额
        isShowMessageBox: false, // 是否显示消息框
        editSum: '', // 输入的打赏金额
        beforeChange: '' // 打赏金额输入前的值
      }
    },
    created () {
      this.isShow = this.isShowPopup
    },
    watch: {
      isShow (val) {
        this.$root.$emit('toggleModal', Boolean(val))
        if (!val) {
          this.$emit('close')
        }
      },
      isShowPopup (val) {
        this.isShow = val
      }
    },
    computed: {
      isShowPopup () {
        return this.rewardInfo.isShow
      }
    },
    methods: {
      /**
       * 确认输入的打赏金额
       */
      confirmSumClick () {
        const that = this
        if (!(that.editSum >= 0.3)) {
          that.isShowMessageBox = true
          return
        }
        that.$emit('rewardClick', that.editSum)
      },
      handleInput2 (event) {
        let str = event.target.value
        if (event.data === '.') {
          if (this.beforeChange.length <= 0) {
            this.editSum = '0'
            return
          }
        }
        if (str.indexOf('.') >= 0 && str.length - 3 > str.indexOf('.')) {
          this.editSum = str.substring(0, str.indexOf('.') + 3)
        }
        this.beforeChange = this.editSum
      }
    }
  }
</script>

<style scoped lang="less">
  .popup-content {
    width: 6.38rem;
    border-radius: .16rem;
    padding: .4rem .3rem 0;
    overflow: hidden;
    text-align: center;
  }

  .top-text {
    font-size: .36rem;
    color: #333;
  }

  .avatar {
    width: .9rem;
    height: .9rem;
    margin-top: .2rem;
    margin-bottom: .16rem;
  }

  .name {
    font-size: .32rem;
    color: #666;
  }

  .close {
    width: .27rem;
    height: .27rem;
    position: absolute;
    right: .2rem;
    top: .3rem;
    padding: .1rem;
    box-sizing: content-box;
  }

  .reward-list {
    margin-top: .44rem;
  }

  .reward-item {
    width: 32%;
    height: 1rem;
    text-align: center;
    border-radius: .08rem;
    border: .02rem solid #ff4a4a;
    box-sizing: border-box;
    color: #ff4a4a;
    float: left;
    font-weight: bold;
    margin-bottom: .2rem;

    .symbol {
      font-size: .28rem;
      line-height: .78rem;
      vertical-align: top;
    }
  }

  .sum {
    font-size: .6rem;
    line-height: .96rem;
  }

  .right-end {
    margin-right: 0;
  }

  .other-amount {
    margin: 0 auto;
    background: none;
    font-size: .24rem;
    color: #333;
    padding: .1rem;
    margin-top: .22rem;
    margin-bottom: .3rem;
  }

  .reward-sum {
    margin-top: .4rem;
    font-weight: bold;
    color: #333;
  }

  .edit-sum {
    width: 100%;
    font-size: .6rem;
    outline: 0;
    text-align: center;
    color: #333;

    &::placeholder {
      color: #ccc;
    }
  }

  .fixed-sum {
    font-size: .24rem;
    color: #0072ff;
    margin-top: .68rem;
    margin-bottom: .78rem;
    background: none;
  }

  .confirm {
    font-size: .36rem;
    color: #ff4a4a;
    padding: .3rem 0 .32rem;
    border-top: 1px solid #f5f5f5;
  }

  .msg-back {
    width: 100%;
    height: 100%;
    top: 0;
    position: fixed;
    z-index: 2010;
    background: rgba(0, 0, 0, .6);
  }

  .message-box {
    width: 5.8rem;
    height: 2.58rem;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    margin: auto;
    position: absolute;
    border-radius: .16rem;
    background-color: #fff;
    text-align: center;
  }

  .tips-text {
    font-size: .36rem;
    color: #333;
    line-height: 1.6rem;
  }

  .msg-confirm {
    width: 100%;
    line-height: .98rem;
    font-size: .36rem;
    color: #0072ff;
    border-top: 1px solid #f5f5f5;
    background: none;
  }
</style>
