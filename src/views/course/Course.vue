<template lang="pug">
  div(v-if="isLoad")
    component(
      :is="courseType" :data="mBean"
      @clickSetRemind="clickSetRemind"
      @followBtnClick="isCustomerServicePopup = true"
      @clickReward="rewardInfo.isShow = true"
      @collectBtnClick="isShowCollect = true"
      @shareBtnClick="isPostersSharePopup = true"
      @seeVideo="seeVideo"
      @clickChat="mBean.chatInfo.isShow = !mBean.chatInfo.isShow"
      @sendComment="sendComment"
    )
    CustomerServicePopup(
      v-if="isCustomerServicePopup"
      :customer="customerServiceData"
      @close="isCustomerServicePopup = false"
    )
    RewardPopup(
      :rewardInfo="rewardInfo"
      @close="rewardInfo.isShow = false"
      @rewardClick="rewardClick"
    )
    PostersSharePopup(
      v-if="isPostersSharePopup"
      :fromUid="fromUid"
      @close="isPostersSharePopup = false"
    )
    GuideCollection(:isShow="isShowCollect" @close="isShowCollect = false")
    VideoPopup(:video="videoInfo" :isShow="isShowVideo" @videoClose="isShowVideo = false")
</template>

<script>
  import CourseHorizontal from './CourseHorizontal'
  import CustomerServicePopup from '../../components/community/CustomerServicePopup'
  import RewardPopup from '../../components/course/RewardPopup'
  import GuideCollection from '../../components/course/GuideCollection'
  import PostersSharePopup from '../../components/community/PostersSharePopup'
  import VideoPopup from '../../components/VideoPopup'
  import weixinConfig from '../../mixin/weixinConfig'
  import {
    getCourseInfo,
    postChangeRemindState,
    postAddVisits,
    postRewardCourse
  } from '../../services/course'
  import { MessageBox } from 'mint-ui'

  let vm
  
  function pagehide () {
    if (vm.updateCountDownTimer) {
      clearInterval(vm.updateCountDownTimer)
      vm.updateCountDownTimer = null
    }
    let videoPlayTime = sessionStorage.getItem('videoPlayTime')
    if (videoPlayTime) {
      let playTime = JSON.parse(localStorage.getItem('studyStatistics') || '{}').play_length || 0
      localStorage.setItem('studyStatistics', JSON.stringify({
        course_single_id: vm.courseId,
        play_length: Math.floor((new Date() - videoPlayTime) / 1000) + playTime,
        play_over: 2
      }))
    }
    window.removeEventListener('pagehide', pagehide, false)
  }

  export default {
    name: 'Course',
    components: {
      CourseHorizontal,
      CustomerServicePopup,
      RewardPopup,
      GuideCollection,
      PostersSharePopup,
      VideoPopup
    },
    data () {
      return {
        type: 1,
        isLoad: true,
        mBean: {
          id: 0, // 课程id
          video: { // 视频信息
            src: '',
            poster: ''
          },
          followBtnAvatar: '', // 关注按钮头像
          state: 0, // 直播状态 0: 未开始 1:直播中 2:回放
          personTime: 0, // 人次
          time: 70000, // state对应不同时间 state：0距离直播开始时间 1直播播放的位置
          isSetReminders: true, // 是否设置开播提醒
          countDownList: [],
          studyList: [
            {
              time: 1587545821, // 发送消息的时间戳
              type: 4, // 类型 1: 普通评论 2提问的评论 3: 回复普通评论 4: 回复提问评论 5: 打赏信息 6: 视频资料 7: 图片资料 8分享记录
              userInfo: {
                avatar: '', // 头像
                name: '测试', // 用户昵称
                uid: 14 // 发送内容的用户uid
              },
              label: '班主任', // 管理员标签
              replyInfo: {
                name: '作者', // 被回复的用户昵称
                content: '请问什么时候开课' // 被回复的内容
              },
              content: '每天哦', // 普通的评论、回复的内容
              videoInfo: {
                cover: 'https://dss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=1922786828,481523169&fm=26&gp=0.jpg', // 视频资料封面
                src: '' // 视频资料地址
              },
              image: '', // 图片
              amount: 0 // 打赏的金额
            },
            {
              time: 1587545921, // 发送消息的时间戳
              type: 1, // 类型 1: 普通评论 2提问的评论 3: 回复普通评论 4: 回复提问评论 5: 打赏信息 6: 视频资料 7: 图片资料 8分享记录
              userInfo: {
                avatar: '', // 头像
                name: '链脉名片', // 用户昵称
                uid: 6 // 发送内容的用户uid
              },
              label: '班长', // 管理员标签
              replyInfo: {
                name: '', // 被回复的用户昵称
                content: '' // 被回复的内容
              },
              content: '评论的 内容哦' // 普通的评论、回复的内容
            },
            {
              time: 1587546921, // 发送消息的时间戳
              type: 5, // 类型 1: 普通评论 2提问的评论 3: 回复普通评论 4: 回复提问评论 5: 打赏信息 6: 视频资料 7: 图片资料 8分享记录
              userInfo: {
                avatar: '', // 头像
                name: '打赏你昵称', // 用户名
                uid: 1
              },
              amount: '6.66' // 打赏的金额
            },
            {
              time: 1515132, // 发送消息的时间戳
              type: 8, // 类型 1: 普通评论 2提问的评论 3: 回复普通评论 4: 回复提问评论 5: 打赏信息 6: 视频资料 7: 图片资料 8分享记录
              userInfo: {
                avatar: '', // 头像
                name: '哈哈', // 用户名
                uid: 1
              }
            },
            {
              time: 1515131, // 发送消息的时间戳
              type: 7, // 类型 1: 普通评论 2提问的评论 3: 回复普通评论 4: 回复提问评论 5: 打赏信息 6: 视频资料 7: 图片资料 8分享记录
              userInfo: {
                avatar: '', // 头像
                name: '哈哈', // 用户名
                uid: 1
              },
              image: 'https://dss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=1922786828,481523169&fm=26&gp=0.jpg' // 图片
            }
          ],
          commentList: [
            {
              time: 1587545821, // 发送消息的时间戳
              type: 4, // 类型 1: 普通评论 2提问的评论 3: 回复普通评论 4: 回复提问评论 5: 打赏信息 6: 视频资料 7: 图片资料 8分享记录
              userInfo: {
                avatar: '', // 头像
                name: '测试', // 用户昵称
                uid: 6 // 发送内容的用户uid
              },
              label: '班主任', // 管理员标签
              replyInfo: {
                name: '作者', // 被回复的用户昵称
                content: '请问什么时候开课' // 被回复的内容
              },
              content: '每天哦每天哦每天哦每天哦每天哦每天哦每天哦' // 普通的评论、回复的内容
            }
          ],
          chatInfo: {
            isShow: false,
            list: [
              {
                id: 1,
                avatar: '',
                text: '回复问题',
                isAsk: true
              },
              {
                id: 0,
                avatar: '',
                text: '回复问题',
                isAsk: false
              }
            ]
          },
          isFollow: false
        },
        rewardInfo: {
          isShow: false,
          avatar: '',
          name: ''
        },
        updateCountDownTimer: null, // 更新倒计时的定时器
        isShowCollect: false, // 是否显示收藏引导弹窗
        isPostersSharePopup: false,
        isCustomerServicePopup: false,
        customerServiceData: { // 关注公众号
          differentiate: 2,
          content: '',
          codeSrc: ''
        },
        videoInfo: {
          videoUrl: '',
          imgSrc: ''
        },
        isShowVideo: false
      }
    },
    mixins: [weixinConfig],
    created () {
      vm = this
      this.main()
      window.addEventListener('pagehide', pagehide, false)
    },
    beforeRouteLeave (to, from, next) {
      pagehide()
      next()
    },
    computed: {
      courseType () {
        let list = ['CourseHorizontal', 'CourseHorizontal', 'CourseHorizontal']
        return list[this.type - 1]
      },
      courseId () {
        return this.$route.params.id
      },
      fromUid () {
        return this.$route.params.from
      }
    },
    methods: {
      main () {
        getCourseInfo({ course_single_id: this.courseId, uid: this.fromUid }).then(res => {
          if (res.data.code === 1) {
            let data = res.data.data
            let state = data.is_start === 1 ? (data.is_live === 1 ? 1 : 2) : 0

            this.type = data.lay_out // 1横屏、2竖屏全屏、3竖屏小屏
            this.mBean = {
              id: data.id, // 课程id
              video: { // 视频信息
                src: data.video_src,
                poster: data.video_cover
              },
              followBtnAvatar: data.user_focus_info.focus_anchor_img,
              state: state, // 直播状态 0: 未开始 1:直播中 2:回放
              personTime: state > 0 ? data.watch_number : data.set_start_number, // 人次
              time: state > 0 ? data.current_live_time : data.differ_time, // state对应不同时间 state：0距离直播开始时间 1直播播放的位置
              isSetReminders: data.is_set_remind === 1, // 是否设置开播提醒
              countDownList: [],
              studyList: [
                // {
                //   time: 1587546921, // 发送消息的时间戳
                //   type: 5, // 类型 1: 普通评论 2提问的评论 3: 回复普通评论 4: 回复提问评论 5: 打赏信息 6: 视频资料 7: 图片资料 8分享记录
                //   userInfo: {
                //     avatar: '', // 头像
                //     name: '打赏你昵称', // 用户名
                //     uid: 1
                //   },
                //   amount: '6.66' // 打赏的金额
                // },
                // {
                //   time: 1587546901, // 发送消息的时间戳
                //   type: 7, // 类型 1: 普通评论 2提问的评论 3: 回复普通评论 4: 回复提问评论 5: 打赏信息 6: 视频资料 7: 图片资料 8分享记录
                //   userInfo: {
                //     avatar: '', // 头像
                //     name: '打赏你昵称', // 用户名
                //     uid: 1
                //   },
                //   image: 'http://hskimgtest.smsqmx.com/upload/single/img/2020/04/27/202004275ea64ebd48d431587957436000.png'
                // },
                // {
                //   time: 1515132, // 发送消息的时间戳
                //   type: 8, // 类型 1: 普通评论 2提问的评论 3: 回复普通评论 4: 回复提问评论 5: 打赏信息 6: 视频资料 7: 图片资料 8分享记录
                //   userInfo: {
                //     avatar: '', // 头像
                //     name: '哈哈', // 用户名
                //     uid: 1
                //   }
                // },
                // {
                //   time: 1515131, // 发送消息的时间戳
                //   type: 7, // 类型 1: 普通评论 2提问的评论 3: 回复普通评论 4: 回复提问评论 5: 打赏信息 6: 视频资料 7: 图片资料 8分享记录
                //   userInfo: {
                //     avatar: '', // 头像
                //     name: '哈哈', // 用户名
                //     uid: 1
                //   },
                //   image: 'https://dss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=1922786828,481523169&fm=26&gp=0.jpg' // 图片
                // },
                // {
                //   time: 1587545921, // 发送消息的时间戳
                //   type: 6, // 类型 1: 普通评论 2提问的评论 3: 回复普通评论 4: 回复提问评论 5: 打赏信息 6: 视频资料 7: 图片资料 8分享记录
                //   userInfo: {
                //     avatar: '', // 头像
                //     name: '链脉名片', // 用户昵称
                //     uid: 6 // 发送内容的用户uid
                //   },
                //   label: '班长', // 管理员标签
                //   videoInfo: {
                //     cover: 'https://dss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=1922786828,481523169&fm=26&gp=0.jpg', // 视频资料封面
                //     src: 'http://hskimgtest.smsqmx.com/upload/single/video/2020/04/24/202004245ea2a012696071587716113000.mp4?sign=ed9b7e64300d5afc8b9d43e0ca9afe98&t=5ea95ace' // 视频资料地址
                //   }
                // }
              ],
              commentList: [],
              chatInfo: {
                isShow: true,
                list: []
              },
              isFollow: data.user_focus_info.is_focus === 1
            }
            if (!state) {
              this.updateCountDownList()
            } else {
              // 新增课程浏览量
              postAddVisits({ course_single_id: this.courseId })
            }

            let shareInfo = {
              desc: data.share_info.content,
              img: data.share_info.img_url,
              title: data.share_info.title,
              link: data.share_info.link
            }
            this.getWeiXinConfig(shareInfo)
              .then(res => {
                this.setWeiXinConfig(res, this.shareSuccess)
              })

            this.isLoad = true

            let rewardInfo = data.anchor_info
            this.rewardInfo = {
              isShow: false,
              avatar: rewardInfo.anchor_img,
              name: rewardInfo.nick_name
            }
            this.customerServiceData.codeSrc = data.user_focus_info.focus_code
          }
        })
      },
      /**
       * 分享回调
       */
      shareSuccess () {
        // 分享统计
      },
      /**
       * 设置/取消开播提醒
       */
      clickSetRemind () {
        if (this.mBean.isSetReminders) {
          const that = this
          MessageBox({
            message: '确认取消开播提醒吗？你有可能会错过课程开播哦~',
            showCancelButton: true
          }).then(function (code) {
            if (code === 'confirm') {
              that.changeRemindState(2)
            }
          })
        } else {
          this.changeRemindState(1)
        }
      },
      /**
       * 修改开播提醒状态
       * @param type {Number} 修改后的状态 1开启 2取消
       */
      changeRemindState (type) {
        postChangeRemindState({ remind: type }).then(res => {
          if (res.data.code === 1) {
            if (type === 1) {
              this.$_.Toast('已设置开播提醒')
            }
            this.mBean.isSetReminders = type === 1
          }
        })
      },
      /**
       * 更新开播倒计时数组值
       */
      updateCountDownList () {
        this.mBean.countDownList = this.transformCountDownList()
        this.updateCountDownTimer = setInterval(() => {
          this.mBean.time--
          if (this.mBean.time < 1) {
            // 到开播时间修改课程状态，关闭计算倒计时定时器
            this.clearCountDownTimer()
            this.mBean.state = 1
          } else {
            this.mBean.countDownList = this.transformCountDownList()
          }
        }, 1000)
      },
      clearCountDownTimer () {
        if (this.updateCountDownTimer) {
          clearInterval(this.updateCountDownTimer)
          this.updateCountDownTimer = null
        }
      },
      transformCountDownList () {
        let s = +this.mBean.time
        let day = Math.floor(s / 86400)
        let hour = Math.floor(s % 86400 / 3600)
        let minute = Math.floor(s % 3600 / 60)
        let second = Math.floor(s % 3600 % 60)
        if (day < 10) {
          day = '0' + day
        }
        if (hour < 10) {
          hour = '0' + hour
        }
        if (minute < 10) {
          minute = '0' + minute
        }
        if (second < 10) {
          second = '0' + second
        }
        return [day, hour, minute, second]
      },
      /**
       * 查看视频
       * @param info {Object} { type: 类型(1根据场景值获取视频，2直接显示视频信息), scene: 场景值信息, videoInfo: 视频信息 }
       */
      seeVideo (info) {
        if (info.type === 1) {
        } else {
          this.videoInfo = info.videoInfo
        }
        this.isShowVideo = true
      },
      sendComment (text) {
        this.mBean.chatInfo.list.push({
          id: String(Math.random()).slice(-9),
          avatar: '',
          text,
          isAsk: false
        })
      },
      /**
       * 打赏-唤醒支付
       * @param amount {Number}
       */
      rewardClick (amount) {
        const that = this
        postRewardCourse({
          amount,
          course_single_id: this.courseId
        }).then(res => {
          if (res.data.code === 1) {
            that.rewardInfo.isShow = false
            that.$_.Toast('打赏成功')
            window.wx.chooseWXPay({
              ...res.data.data.js_sdk_config,
              success (res) {
                that.rewardInfo.isShow = false
                that.$_.Toast('打赏成功')
              }
            })
          }
        })
      }
    }
  }
</script>
