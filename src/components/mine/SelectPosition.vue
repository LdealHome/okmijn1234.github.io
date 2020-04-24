<template lang="pug">
  div
    mt-popup.popup-back(
      v-model="isShow"
    )
      img.close-btn(src="~@icon/close/close-position.png" @click="isShow = false")
      p.popup-title 请选择您的职位
      ul.position-list
        li.position-item(v-for="item in list" :key="item.key")
          input.radio-item(
            type="radio"
            name="position"
            :id="item.key"
            :value="item.key"
            v-model="selectedType"
          )
          label(:for="item.key") {{item.name}}
          input.other-input(
            placeholder="请输入您的职位" 
            :readonly="otherPositionReadonly"
            v-model="otherPosition"
            v-if="item.key === -1"
            v-ios-focus
          )
      div.confirm-btn(@click="confrimClick") 确认
</template>

<script>
  export default {
    name: 'SelectPosition',
    props: {
      data: {
        type: Object,
        required: true,
        default () {
          return {
            isShow: false,
            selectedType: 0, // 选中的职位类型
            positionName: '' // 职位名称
          }
        }
      }
    },
    data () {
      return {
        isShow: false,
        selectedType: -2,
        otherPosition: ''
      }
    },
    created () {
      this.isShow = this.isShowPopup
    },
    watch: {
      isShow (val) {
        this.$root.$emit('toggleModal', Boolean(val))
        if (val) {
          if (this.data.selectedType >= -1) {
            this.selectedType = this.data.selectedType
            this.otherPosition = this.data.selectedType === -1 ? this.data.positionName : ''
          }
        } else {
          if (val !== this.isShowPopup) this.$emit('close')
          this.selectedType = -2
          this.otherPosition = ''
        }
      },
      isShowPopup (val) { if (val) this.isShow = true },
      selectedType (val) {
        if (val > -1) {
          this.otherPosition = ''
        }
      }
    },
    computed: {
      isShowPopup () {
        return this.data.isShow
      },
      list () {
        return this.$store.state.typeTable.positionType || []
      },
      otherPositionReadonly () {
        return this.selectedType !== -1
      }
    },
    methods: {
      confrimClick () {
        if (this.selectedType <= -2) {
          this.$_.Toast('请选择职位！')
          return
        }
        this.isShow = false
        this.$emit('confrim', {
          type: this.selectedType,
          name: this.otherPosition
        })
      }
    }
  }
</script>

<style scoped lang="less">
  .popup-back {
    width: 5.66rem;
    background: #fff;
    border-radius: .08rem;
    padding: 0 .5rem;
  }

  .close-btn {
    width: .5rem;
    height: .5rem;
    position: absolute;
    right: 0;
    top: -.92rem;

    &:active {
      transform: scale(1.1);
    }
  }

  .popup-title {
    padding: .28rem 0;
    text-align: center;
    font-size: .32rem;
    color: #333;
  }

  .position-list {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
  }

  .position-item {
    display: flex;
    align-items: center;
    margin-bottom: .46rem;
  }

  .other-position {
    float: left;
  }

  .other-input {
    width: 2.48rem;
    height: .5rem;
    line-height: .5rem;
    border-radius: .08rem;
    border: 1px solid #e9e7e7;
    font-size: .24rem;
    color: #666;
    margin-left: .12rem;
    padding-left: .3rem;
    padding-right: .1rem;
  }

  .radio-item {
    width: .34rem;
    height: .34rem;
    border: 1px solid #ccc;
    border-radius: 50%;
    margin-right: .18rem;

    &:checked {
      border: none;
      background: url("~@icon/mine/selection-icon.png") no-repeat center;
      background-size: contain;
    }
  }

  .confirm-btn {
    width: 3.3rem;
    height: .68rem;
    line-height: .68rem;
    background: #f9d400;
    border-radius: .34rem;
    font-size: .24rem;
    color: #333;
    text-align: center;
    margin: .04rem auto .14rem;
  }
</style>
