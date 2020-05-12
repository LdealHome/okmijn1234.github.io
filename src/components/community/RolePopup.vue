<!--角色管理弹框-->
<template lang="pug">
  div.role__bounced
    div.mask(@click="$emit('cancel')")
    div.content
      p.title 切换当前列表学员期数：
        span.title-text (您的学习期数为{{realPeriodsName}})
      div.middle
        ul.list
          li.list-item(
            v-for="item in periodsList"
            :key="item.id"
            :class="{active: selectIndex === item.id}"
            @click="change(item)"
          ) {{item.title}}
      div.btns
        button.cancel(type="button" @click="$emit('cancel')") 取消
        button.determine(type="button" @click="$emit('determine', selectData)") 确认
</template>

<script>
  import {
    getPeriodsList
  } from '../../services/community'
  export default {
    name: 'RolePopup',
    data () {
      return {
        periodsList: [], // 列表
        selectData: {
          id: -1,
          name: ''
        },
        selectIndex: -1, // 是否选中
        realPeriodsId: -1, // 真实所说期数id
        realPeriodsName: '' // 真实所属期数名
      }
    },
    created () {
      this.mine()
    },
    methods: {
      mine () {
        let that = this
        getPeriodsList().then((res) => {
          if (res.data.code === 1) {
            let data = res.data.data
            let list = data.list
            that.periodsList.push(...list)
            that.selectIndex = data.select_id
            that.realPeriodsId = data.stage_id
            that.realPeriodsName = data.stage_name
          }
        })
      },
      /**
       * 选择期数
       * @param item {Object} 选择对应的数据
       */
      change (item) {
        this.selectIndex = item.id
        this.selectData = {
          id: item.id,
          title: item.title
        }
      }
    }
  }
</script>

<style scoped lang="less">
  .role__bounced {
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
      background-color: rgba(255, 255, 255, .02);
    }

    .content {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      width: 100%;
      height: calc(100vh - 5rem);
      display: flex;
      flex-direction: column;
      background-color: #fff;
      box-shadow: 0 -4px 10px 0 rgba(204, 204, 204, .4);
    }

    .title {
      color: #2a2b2d;
      font-size: .32rem;
      font-weight: bold;
      height: 1.15rem;
      line-height: 1.15rem;
      padding-left: .32rem;

      &-text {
        font-size: .28rem;
        font-weight: initial;
      }
    }

    .middle {
      flex: 1;
      padding: 0 .3rem;
      overflow: auto;
    }

    .list {
      display: flex;
      flex-wrap: wrap;

      &-item {
        color: #2a2b2d;
        font-size: .32rem;
        width: 1.14rem;
        height: 1.14rem;
        text-align: center;
        line-height: 1.14rem;
        margin-right: .3rem;
        margin-bottom: .34rem;
        border-radius: .08rem;
        background-color: #f5f7f9;

        &:nth-child(5n) {
          margin-right: 0;
        }

        &.active {
          background-color: #faedd9;
          color: #fba627;
        }
      }
    }

    .btns {
      display: flex;
      align-items: center;
      height: .88rem;
      box-shadow: 0 -2px 6px 0 rgba(217, 216, 216, .3);
    }

    .cancel,
    .determine {
      flex: 1;
      height: .88rem;
      background-color: transparent;

      &:active {
        background-color: darken(#fff, 5%);
      }
    }

    .cancel {
      color: #999;
      font-size: .32rem;
      border-right: 1px solid #ebeaea;
    }

    .determine {
      color: #fba628;
      font-size: .34rem;
    }
  }
</style>
