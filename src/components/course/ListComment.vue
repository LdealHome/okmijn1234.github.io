<template lang="pug">
  ul(@click="clickList")
    li.comment-list-item(
      v-for="(item, index) in list"
      :key="item.id"
      :class="{ 'own-comment': isOwnComment(index) }"
    )
      p.time(v-if="isShowTime(index)") {{item.time | formatTime}}
      div.comment-item(
        v-if="!isRecord(index)"
        @touchstart="showManageView($event ,index)"
        @touchend="touchend(index)"
      )
        div.user-info
          img.avatar(:src="item.userInfo.avatar")
          p.user-label(v-if="item.label") {{roleType[item.label]}}
          p.name {{item.userInfo.name}}
        p.comment-content(v-if="item.type === 1 || item.type === 2")
          span.withdraw-btn(v-show="isShowWithdraw(index)" @click.stop="clickItem({ ...item, type: 100 })") 撤回
          span.problem-comment(v-if="item.type === 2")
          span {{item.content}}
        div.reply-view(v-if="item.type === 3 || item.type === 4")
          p.reply-problem
            span.withdraw-btn(v-show="isShowWithdraw(index)" @click.stop="clickItem({ ...item, type: 100 })") 撤回
            span(v-if="item.replyInfo.delete") 该评论已被删除
            span(v-else :class="{ 'problem-reply-view': item.type === 4 }") {{item.replyInfo.name}}：{{item.replyInfo.content}}
          p.reply-content {{item.content}}
        div.media-view.video-back(v-if="item.type === 6" @click="clickItem(item)")
          img.media-img(:src="item.videoInfo.cover")
        div.media-view(v-if="item.type === 7")
          img.media-img.picture-item(v-lazy="item.image" @click="clickItem({ ...item, e: $event })")
      p.reward-item(v-if="item.type === 5" :class="recordTopSpacing(index)")
        span.reward-name {{item.userInfo.name}}
        span 赞赏了一个
        span.amount {{item.amount}}红包
        span.reward-btn(@click="clickItem(item)") 我也要赞赏
      p.share-item(v-if="item.type === 8" :class="recordTopSpacing(index)")
        span.share-name {{item.userInfo.name}}
        span 刚刚分享了课程
        span.share-btn(@click="clickItem(item)") 我也要分享
</template>

<script>
  export default {
    name: 'ListComment',
    props: {
      type: { // 评论类型 comment类型时，如果是自己发送的内容，需要居右显示
        type: String,
        required: false,
        default: ''
      },
      list: {
        type: Array,
        required: true,
        default () {
          return [
            {
              time: '', // 发送消息的时间戳
              type: 1, // 类型 1: 普通评论 2提问的评论 3: 回复普通评论 4: 回复提问评论 5: 打赏信息 6: 视频资料 7: 图片资料 8分享记录
              userInfo: {
                avatar: '', // 头像
                name: '', // 用户昵称
                uid: 0 // 发送内容的用户uid
              },
              label: '', // 管理员标签
              replyInfo: {
                name: '', // 被回复的用户昵称
                content: '' // 被回复的内容
              },
              content: '', // 普通的评论、回复的内容
              videoInfo: {
                cover: '', // 视频资料封面
                src: '' // 视频资料地址
              },
              image: '', // 图片
              amount: 0 // 打赏的金额
            }
          ]
        }
      },
      role: {
        type: Number,
        required: false,
        default: 0
      },
      serverTime: {
        type: Number,
        required: false,
        default: 0
      }
    },
    data () {
      return {
        timer: null,
        isClickComment: false // 是否点击评论
      }
    },
    filters: {
      formatTime (val) {
        let date = new Date(val * 1000)
        let month = date.getMonth() + 1
        let day = date.getDate()
        let hour = date.getHours()
        var minute = date.getMinutes()
        if (month < 10) {
          month = '0' + month
        }
        if (day < 10) {
          day = '0' + day
        }
        if (hour < 10) {
          hour = '0' + hour
        }
        if (minute < 10) {
          minute = '0' + minute
        }
        return `${month}-${day} ${hour}:${minute}`
      }
    },
    computed: {
      roleType () {
        return this.$store.state.typeTable.liveRoleType || []
      },
      uid () {
        return this.$store.state.personalInfo.uid || 0
      },
      isOwnComment (index) {
        return index => {
          return this.list[index].userInfo.uid === this.uid && this.isComment && !this.list[index].isFictitious && !this.isRecord(index)
        }
      },
      isRecord (index) {
        return index => {
          let list = [5, 8]
          return list.includes(this.list[index].type)
        }
      },
      isShowTime (index) {
        return index => {
          return index === 0 ||
            (this.list[index].time - this.list[index - 1].time >= 300) ||
            (this.isOwnComment(index) && !this.isOwnComment(index - 1)) ||
            (!this.isOwnComment(index) && this.isOwnComment(index - 1))
        }
      },
      // 打赏记录、分享记录于时间文字的间距判断
      recordTopSpacing (index) {
        return index => {
          return { 'record-top': this.isShowTime(index) }
        }
      },
      isComment () {
        return this.type === 'comment'
      },
      isShowWithdraw () {
        return index => {
          return this.isOwnComment(index) && (this.serverTime - this.list[index].time) < 120
        }
      }
    },
    methods: {
      showManageView (e, index) {
        if (!this.role) {
          this.$emit('commentClick', index)
          return
        }
        let touches = e.touches[0]
        let { x, y } = { x: touches.pageX, y: touches.pageY }
        this.timer = setTimeout(() => {
          clearTimeout(this.timer)
          this.timer = null
          this.$emit('showManageView', {
            x,
            y,
            id: this.list[index].id,
            uid: this.list[index].userInfo.uid,
            role: this.list[index].label
          })
          // 长按事件
        }, 800)
      },
      touchend (index) {
        if (this.timer) {
          clearTimeout(this.timer)
          // 点击回复评论
          this.$emit('commentClick', index)
        } else {
          // 长按显示管理弹窗，手指离开屏幕后，才能操作删除和禁言功能
          // 解决ios长按后，手指离开同时触发了删除评论点击事件
          this.$emit('fingersAway')
        }
        if (!this.isOwnComment(index)) this.isClickComment = true
      },
      clickItem (item) {
        let info = {}
        switch (item.type) {
        case 6:
          // 视频
          info.videoInfo = {
            videoUrl: item.videoInfo.src,
            imgSrc: item.videoInfo.cover
          }
          break
        case 7:
          // 图片
          info.e = item.e
          break
        case 100:
          // 撤回
          info.id = item.id
          info.role = item.role
          break
        default:
          break
        }
        this.$emit('clickItem', {
          type: item.type,
          ...info
        })
      },
      clickList () {
        // 点击空白取消
        if (!this.isClickComment) {
          this.$emit('cancelReply')
        }
        this.isClickComment = false
      }
    }
  }
</script>

<style scoped lang="less">
  .comment-list-item {
    overflow: hidden;
    position: relative;
  }

  .time {
    font-size: .4rem;
    color: #999;
    transform: scale(.5);
    transform-origin: 0 100%;
    margin: 0 .99rem;
  }

  .reward-item,
  .share-item {
    height: .4rem;
    line-height: .4rem;
    padding: 0 .12rem 0 .44rem;
    font-size: .22rem;
    color: #bb864c;
    border-radius: .08rem;
    margin-left: .87rem;
    float: left;
    display: flex;
    align-items: center;
  }

  .reward-item {
    background: #fff5a7 url('~@icon/course/red-packet.png') no-repeat left .14rem center;
    background-size: .2rem;
  }

  .share-item {
    background: #fff5a7 url('~@icon/course/share-icon.png') no-repeat left .14rem center;
    background-size: .24rem;
  }

  .reward-name,
  .share-name {
    max-width: 2.4rem;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    word-wrap: normal;
    margin-right: .1rem;
  }

  .reward-name {
    max-width: .9rem;
  }

  .amount { color: #ff3d4c; }

  .reward-btn,
  .share-btn {
    height: .3rem;
    line-height: .3rem;
    border-radius: .15rem;
    font-size: .22rem;
    color: #fff;
    padding: 0 .1rem;
    margin-left: .18rem;
  }

  .reward-btn {
    background: #ff4c49;

    &:active {
      background: darken(#ff4c49, 5%);
    }
  }

  .share-btn {
    background: #00c6ff;

    &:active {
      background: darken(#00c6ff, 5%);
    }
  }
  
  .comment-item {
    max-width: 5.8rem;
    width: fit-content;
  }

  .user-info {
    display: flex;
    padding-left: .2rem;
    align-items: center;
  }

  .avatar {
    width: .6rem;
    height: .6rem;
    border-radius: 50%;
    margin-right: .2rem;
    border: 1px solid #fed20f;
  }

  .user-label {
    background: #c28ff2;
    height: .28rem;
    line-height: .28rem;
    border-radius: .04rem;
    font-size: .24rem;
    color: #fff;
    padding: 0 .1rem;
  }

  .name {
    font-size: .32rem;
    color: #2b2b2b;
    font-weight: bold;
    margin-left: .12rem;
    max-width: 3rem;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    word-wrap: normal;
  }

  .comment-content {
    font-size: .28rem;
    color: #333;
    line-height: .44rem;
    padding: .16rem .24rem .18rem .2rem;
    background: #fff;
    border-radius: .12rem;
    margin-left: .87rem;
    margin-top: .04rem;
    display: inline-block;
    text-align: left;
  }

  .comment-content,
  .reply-view {
    position: relative;

    &::after {
      width: .26rem;
      height: .26rem;
      content: '';
      position: absolute;
      background: #fff;
      transform: rotate(65deg);
      left: -.1rem;
      top: .02rem;
      border-radius: .1rem;
    }
  }

  .problem-comment {
    width: .42rem;
    height: .42rem;
    background: url('~@icon/course/ask-comment.png') no-repeat;
    background-size: 100%;
    display: inline-block;
    margin-right: .08rem;
    position: relative;
    top: .06rem;
  }

  .withdraw-btn {
    font-size: .24rem;
    color: #a3a3a3;
    background: #fff;
    border-radius: .04rem;
    height: .28rem;
    line-height: .28rem;
    padding: 0 .1rem;
    margin-right: .1rem;
    white-space: nowrap;

    &:active {
      opacity: .8;
    }
  }

  .media-view {
    width: 4.5rem;
    height: 2.3rem;
    border-radius: .12rem;
    overflow: hidden;
    margin-left: 1.07rem;
    margin-top: .24rem;
  }

  .video-back {
    position: relative;

    &::before {
      width: 100%;
      height: 100%;
      content: '';
      position: absolute;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      background: rgba(0, 0, 0, .5);
    }

    &::after {
      width: .58rem;
      height: .58rem;
      content: '';
      position: absolute;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      background: url('~@icon/course/play-btn.png') no-repeat;
      background-size: 100%;
      margin: auto;
      z-index: 2;
    }
  }

  .media-img {
    width: 100%;
    height: 100%;
  }

  .reply-view {
    font-size: .28rem;
    color: #333;
    line-height: .44rem;
    background: #fff;
    border-radius: .12rem;
    margin-left: .87rem;
    margin-top: .04rem;
    padding: .2rem 0 .36rem 0;
  }

  .problem-reply-view {
    padding-left: .5rem;
    position: relative;

    &::before {
      width: .42rem;
      height: .42rem;
      position: absolute;
      content: '';
      left: 0;
      top: -.04rem;
      background: url('~@icon/course/ask-comment.png') no-repeat;
      background-size: 100%;
    }
  }

  .reply-problem {
    padding: 0 .24rem .18rem .2rem;
    -webkit-user-select: none;
    user-select: none;
    -webkit-touch-callout: none;
  }

  .reply-content {
    padding: .24rem .24rem 0 .2rem;
    border-top: 1px dashed #ccc;
  }

  .own-comment {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    
    .time { transform-origin: 100% 100%; }

    .user-info {
      flex-direction: row-reverse;
      padding-right: .2rem;
      padding-left: 0;
    }

    .avatar { margin: 0 0 0 .2rem; }

    .user-label { margin: 0 0 0 .12rem; }

    .name {
      text-align: right;
      margin: 0;
    }

    .comment-item {
      text-align: right;
    }

    .comment-content {
      background: #f0f0f0;
      margin: .04rem .87rem .14rem 0;

      &::after {
        width: .2rem;
        height: .2rem;
        content: '';
        position: absolute;
        background: #f0f0f0;
        transform: rotate(-72deg);
        left: auto;
        right: -.06rem;
        top: .02rem;
        border-radius: .08rem;
      }
    }

    .media-view {
      margin-right: 1.07rem;
      margin-left: auto;
    }

    .reply-view {
      margin-right: .87rem;
      margin-left: auto;
      background: #f0f0f0;
      text-align: left;
      width: fit-content;
    }

    .comment-content,
    .reply-view {
      &::after {
        width: .2rem;
        height: .2rem;
        content: '';
        position: absolute;
        background: #f0f0f0;
        transform: rotate(-72deg);
        left: auto;
        right: -.06rem;
        top: .02rem;
        border-radius: .08rem;
      }
    }
  }

  .comment-content,
  .reward-item,
  .share-item,
  .media-view,
  .reply-view {
    margin-bottom: .14rem;
  }

  .record-top {
    margin-top: .22rem;
  }
</style>
