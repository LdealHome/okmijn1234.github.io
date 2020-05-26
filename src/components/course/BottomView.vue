<template lang="pug">
  div.bottom-back
    div(v-if="!isGuest")
      div.default-view(:class="{ 'not-broadcast': isNotStarted }")
        div.comment-view(@click="commentClick")
          p.comment-edit {{editTips}}
          div.problem-btn(v-show="isShowProblemBtn" :class="{ 'problem-active': data.isProblem }" @click.stop="problemClick") 提问
        span.reward-btn(@click="$emit('clickItem', 3)")
        img.more-btn(src="@icon/course/more.png" @click="$emit('clickItem', 4)")
    div.unregistered(v-else)
      div.enroll-btn(@click="enrollClick") 点击了解：19元学习365天
</template>

<script>
  export default {
    name: 'BottomView',
    props: {
      data: {
        type: Object,
        required: true,
        default () {
          return {
            isProblem: false
          }
        }
      },
      liveInfo: {
        type: Object,
        required: true,
        default () {
          return {
            state: 0, // 直播状态 0: 未开始 1:直播中 2:回放
            isForbidComment: false, // 是否禁止评论
            isAllProhibited: false, // 是否开启全员禁言
            role: 0, // 直播间角色
            chatInfo: {
              isShow: true
            }
          }
        }
      }
    },
    data () {
      return {
        editContent: '',
        changeInfo: {
          emptyNumber: 0,
          focusNumber: 0
        }
      }
    },
    computed: {
      isShowProblemBtn () {
        return !this.liveInfo.role && !this.isEstoppel
      },
      isNotStarted () {
        return this.state <= 0
      },
      editTips () {
        return this.isAllProhibited ? '全员禁言，只允许管理员发言' : (this.isForbidComment ? '已被管理员禁言' : '说点什么吧~')
      },
      state () {
        return this.liveInfo.state
      },
      isForbidComment () {
        return this.liveInfo.isForbidComment
      },
      isAllProhibited () {
        return this.liveInfo.isAllProhibited
      },
      isEstoppel () {
        return this.isForbidComment || this.isAllProhibited
      },
      isShowChat () {
        return this.liveInfo.chatInfo.isShow
      },
      // 访客
      isGuest () {
        return this.$store.state.guest
      },
      from () {
        return this.$route.params.from
      }
    },
    methods: {
      problemClick () {
        if (this.isNotStarted || this.isEstoppel) return
        this.$emit('clickItem', 5)
      },
      commentClick () {
        if (this.isNotStarted || this.isEstoppel) return
        this.$emit('clickItem', 6)
      },
      enrollClick () {
        this.$router.push({ name: 'particulars', params: { from: this.from } })
      }
    }
  }
</script>

<style scoped lang="less">
  .bottom-back {
    background: #fff;
    z-index: 10;
  }

  .default-view {
    height: .98rem;
    display: flex;
    align-items: center;
    padding: 0 .22rem 0 .42rem;
    box-shadow: 0 0 .03rem 0 rgba(206, 202, 202, 1);
  }

  .comment-view {
    flex: 1;
    margin-right: .16rem;
    height: .72rem;
    display: flex;
    border-radius: 36rem;
    align-items: center;
    background: #f8f8f8;
    padding-left: .2rem;
  }

  .comment-edit {
    flex: 1;
    font-size: .28rem;
    color: #a3a3a3;
  }

  .forbid-words {
    font-size: .28rem;
    color: #a3a3a3;
    height: .6rem;
    line-height: .6rem;
  }

  .problem-btn {
    font-size: .24rem;
    color: #9c9b9b;
    padding: 0 .2rem 0 .34rem;
    margin-left: .1rem;
    background: url('~@icon/course/default-state.png') no-repeat left center;
    background-size: .24rem;
  }

  .problem-active {
    background: url('~@icon/course/selected-state.png') no-repeat left center;
    background-size: .24rem;
  }

  .reward-btn {
    width: .54rem;
    height: .54rem;
    padding: .1rem;
    box-sizing: content-box;
    background: url('~@icon/course/reward.png') no-repeat center center;
    background-size: .54rem;
  }

  .more-btn {
    width: .56rem;
    height: .56rem;
    padding: .09rem;
    box-sizing: content-box;
  }

  .unregistered {
    height: .98rem;
    display: flex;
    align-items: center;
    padding: 0 .3rem 0 .3rem;
    background: #fff;
  }

  .enroll-btn {
    flex: 1;
    height: .7rem;
    line-height: .7rem;
    background: #f9d400;
    font-size: .34rem;
    color: #f3000c;
    text-align: center;
    border-radius: .35rem;
    margin-right: .1rem;

    &:active {
      background: darken(#f9d400, 5%);
    }
  }

  .not-broadcast {
    .comment-view {
      border: 1px solid #ccc;
      background: #f8f8f8;
      color: #ccc;
    }

    .problem-btn {
      color: #ccc;
    }

    .reward-btn {
      width: .54rem;
      height: .54rem;
      padding: .1rem;
      box-sizing: content-box;
      background: url('~@icon/course/reward-grey.png') no-repeat center center;
      background-size: .54rem;
    }
  }
</style>
