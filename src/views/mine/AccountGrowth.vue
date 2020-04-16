<template lang="pug">
  div.whole
    div.type-back
      div.type-item(:class="typeItemClass(1)" @click="switchType(1)") 已购课程
      div.type-item(:class="typeItemClass(2)" @click="switchType(2)") 免费课程
    component(:is="listType" :list="list")
    div(v-show="!list.length")
      div.empty-tips 你还没有获得任何课程
      div.obtain-btn(@click="obtainCourse") 去免费获取
    infinite-loading(@infinite="loadMore" :identifier="infinite")
      div(slot="spinner")
      div(slot="no-more")
      div(slot="no-results")
</template>

<script>
  import ListCourseGratis from '../../components/mine/ListCourseGratis'
  import ListCoursePurchase from '../../components/mine/ListCoursePurchase'
  import {
    getBuyCourse,
    getGratisCourse
  } from '../../services/mine'
  export default {
    name: 'AccountGrowth',
    components: {
      ListCourseGratis,
      ListCoursePurchase
    },
    data () {
      return {
        selectedType: 1,
        list: [],
        infinite: 0,
        params: {
          limit: 20,
          page: 1
        }
      }
    },
    computed: {
      typeItemClass (type) {
        return type => {
          return { 'type-active-item': this.selectedType === type }
        }
      },
      listType () {
        let list = ['ListCoursePurchase', 'ListCourseGratis']
        return list[this.selectedType - 1]
      }
    },
    methods: {
      obtainCourse () {
        this.$router.push({ name: 'home' })
      },
      /**
       * 切换课程类型
       * @param type {Number} 1:已购课程 2:免费课程
       */
      switchType (type) {
        this.selectedType = type
        this.list = []
        this.params.page = 1
        this.infinite++
      },
      async loadMore (res) {
        const that = this
        let isLastPage = false
        await that.getList().then(list => {
          isLastPage = that.$_.isLastPage(that.params.limit, list)
        })
        if (isLastPage) {
          res.complete()
        } else {
          res.loaded()
          that.params.page++
        }
      },
      getList () {
        if (this.selectedType === 1) {
          return getBuyCourse(this.params).then(res => {
            if (res.data.code === 1) {
              let list = res.data.data.list || []
              this.list.push(...this.transformBuyCourseList(list))
              return list
            }
          })
        } else {
          return getGratisCourse(this.params).then(res => {
            if (res.data.code === 1) {
              let list = res.data.data.list || []
              this.list.push(...this.transformGratisCourseList(list))
              return list
            }
          })
        }
      },
      /**
       * 购买的课程列表数据转换
       * @param source {Object} 需要转换的数据源
       * @return {Object} 转换后可以直接使用的结构
       */
      transformBuyCourseList (source) {
        let list = []
        source.forEach(item => {
          list.push({
            id: item.uid,
            title: item.title,
            time: item.pay_time,
            cover: item.poster,
            newest: item.newest_course
          })
        })
        return list
      },
      /**
       * 免费的课程列表数据转换
       * @param source {Object} 需要转换的数据源
       * @return {Object} 转换后可以直接使用的结构
       */
      transformGratisCourseList (source) {
        let list = []
        source.forEach(item => {
          list.push({
            id: item.id,
            title: item.title,
            time: item.free_time,
            cover: item.poster
          })
        })
        return list
      }
    }
  }
</script>

<style scoped lang="less">
  .whole {
    min-height: 100vh;
    overflow: hidden;
    background: #fff;
  }

  .type-back {
    display: flex;
    justify-content: space-around;
    height: .88rem;
    align-items: center;
    padding-bottom: .1rem;
    box-shadow: 1px 1px 1px 0 rgba(238, 238, 237, 0.68);
  }

  .type-item {
    font-size: .32rem;
    color: #5f5f5f;
  }

  .type-active-item {
    color: #1b1b1b;
    font-weight: bold;
    position: relative;

    &::after {
      width: .26rem;
      height: .06rem;
      border-radius: .03rem;
      background: #1b1b1b;
      left: 0;
      right: 0;
      bottom: -.06rem;
      margin: 0 auto;
      content: '';
      position: absolute;
    }
  }

  .empty-tips {
    font-size: .28rem;
    color: #999;
    text-align: center;
    background: url('~@images/mine/empty-tips.png') no-repeat top center;
    background-size: 2.54rem;
    margin-top: 3.9rem;
    padding-top: 1.7rem;
  }

  .obtain-btn {
    width: 5.8rem;
    height: .78rem;
    line-height: .78rem;
    text-align: center;
    font-size: .3rem;
    color: #313131;
    border-radius: .39rem;
    background: #f9d400;
    box-shadow: 0 0 .1rem 0 rgba(249, 212, 0, 1);
    position: fixed;
    bottom: .56rem;
    left: 0;
    right: 0;
    margin: 0 auto;
  }
</style>
