<template lang="pug">
  div(v-if="isLoad")
    component(
      :is="courseType"
      :data="mBean"
      @clickSetRemind="clickSetRemind"
      @followBtnClick="isCustomerServicePopup = true"
      @clickReward="rewardInfo.isShow = true"
      @collectBtnClick="isShowCollect = true"
      @shareBtnClick="isPostersSharePopup = true"
      @seeVideo="seeVideo"
      @clickChat="mBean.chatInfo.isShow = !mBean.chatInfo.isShow"
      @sendComment="sendComment"
      @loadMore="loadMore"
      @deleteMessage="deleteMessage"
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
    postRewardCourse,
    getCommentList
  } from '../../services/course'
  import {
    postShareStatistics
  } from '../../services'
  import { MessageBox } from 'mint-ui'

  let vm
  
  function pagehide () {
    if (vm.updateCountDownTimer) {
      clearInterval(vm.updateCountDownTimer)
      vm.updateCountDownTimer = null
    }
    if (vm.sendPingTimer) {
      clearInterval(vm.sendPingTimer)
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
          studyListInfo: {
            params: {
              key: '',
              first_id: 0,
              limit: 20,
              page: 1,
              type: 1
            },
            list: [],
            isShowTopView: false
          },
          commentListInfo: {
            list: [],
            params: {
              key: '',
              first_id: 0,
              limit: 20,
              page: 1,
              type: 1
            }
          },
          chatInfo: {
            isShow: false,
            list: [
              {
                id: 1,
                avatar: '',
                text: '回复问题',
                isAsk: true
              }
            ]
          },
          isFollow: false,
          key: '',
          webSocketUrl: '',
          isForbidComment: false,
          role: 0,
          totalComments: 0
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
        isShowVideo: false,
        studyDataLoad: null,
        webSocket: null,
        sendPingTimer: null
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
    watch: {
      courseKey (val) {
        if (val && this.studyDataLoad) {
          this.loadMore(this.studyDataLoad.type, this.studyDataLoad.res)
        }
      }
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
      },
      ShareScene () {
        return this.$store.state.sceneInfo.share_callback.live
      },
      courseKey () {
        return this.mBean.key
      },
      avatar () {
        return this.$store.state.personalInfo.avatar
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
              studyListInfo: {
                params: {
                  key: this.mBean.key,
                  first_id: 0,
                  limit: 20,
                  page: 1,
                  type: 1
                },
                list: [
                  {
                    time: Math.floor(new Date().getTime() / 1000), // 发送消息的时间戳
                    type: 1, // 类型 1: 普通评论 2提问的评论 3: 回复普通评论 4: 回复提问评论 5: 打赏信息 6: 视频资料 7: 图片资料 8分享记录
                    userInfo: {
                      avatar: this.avatar, // 头像
                      name: this.$store.state.personalInfo.nickname, // 用户昵称
                      uid: this.$store.state.personalInfo.uid // 发送内容的用户uid
                    },
                    label: 1, // 管理员标签
                    replyInfo: {
                      name: '', // 被回复的用户昵称
                      content: '' // 被回复的内容
                    },
                    content: '测试评论' // 普通的评论、回复的内容
                  }
                ],
                isShowTopView: false
              },
              commentListInfo: {
                list: [
                  {
                    time: Math.floor(new Date().getTime() / 1000), // 发送消息的时间戳
                    type: 1, // 类型 1: 普通评论 2提问的评论 3: 回复普通评论 4: 回复提问评论 5: 打赏信息 6: 视频资料 7: 图片资料 8分享记录
                    userInfo: {
                      avatar: this.avatar, // 头像
                      name: this.$store.state.personalInfo.nickname, // 用户昵称
                      uid: this.$store.state.personalInfo.uid // 发送内容的用户uid
                    },
                    label: 1, // 管理员标签
                    replyInfo: {
                      name: '', // 被回复的用户昵称
                      content: '' // 被回复的内容
                    },
                    content: '测试评论', // 普通的评论、回复的内容
                    id: 1
                  }
                ],
                params: {
                  key: '',
                  first_id: 0,
                  limit: 20,
                  page: 1,
                  type: 1
                }
              },
              chatInfo: {
                isShow: true,
                list: []
              },
              isFollow: data.user_focus_info.is_focus === 1,
              key: data.web_socket.key,
              webSocketUrl: data.web_socket.url,
              isForbidComment: data.is_comment === 2,
              role: data.role,
              totalComments: data.comment_number
            }
            this.connectWebSocket()
            if (!state) {
              // 未开播时更新距离开播倒计时
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
      getStudyDataList (type) {
        return getCommentList(this.mBean[type].params).then(res => {
          let list = []
          if (res.data.code === 1 && res.data.data && res.data.data.list) {
            list = res.data.data.list
            this.mBean[type].list = [ ...this.transformStudyList(list), ...this.mBean[type].list ]
          }
          this.$nextTick(() => {
            return list
          })
        })
      },
      async loadMore (type, res) {
        this.studyDataLoad = { type, res }
        if (!this.mBean.key) {
          return
        }
        const that = this
        let isLastPage = false
        await that.getStudyDataList(type).then(list => {
          isLastPage = that.$_.isLastPage(that.mBean[type].params.limit, list)
        })
        if (that.mBean[type].params.page === 1 && !this.webSocket) {
          that.connectWebSocket()
        }
        that.mBean[type].params.page++
        if (isLastPage) {
          if (type === 'studyListInfo') {
            that.mBean.studyListInfo.isShowTopView = true
          }
          res.complete()
        } else {
          res.loaded()
        }
      },
      /**
       * 分享回调
       */
      shareSuccess () {
        // 分享统计
        postShareStatistics({
          key: this.mBean.key,
          scene: this.ShareScene
        })
      },
      connectWebSocket () {
        this.webSocket = new WebSocket('ws://community-test-ws.xy22.cn/ws/?key=eyJncm91cF2cadZ99pZCI6IjFfMSIsInVpZCI6Miwicm9sZSI6IjEiLCJja190aW1lIjoxNTg4MjM4MjQ0fQ==')
        this.webSocket.onopen = () => {
          this.sendPingTimer = setInterval(() => {
            this.webSocket.send({
              'type_mark': 'ping'
            })
          }, 50000)
        }
        
        this.webSocket.onmessage = this.receiveMessage
      },
      /**
       * 接收WebSocket的消息
       */
      receiveMessage (res) {
        let data = res.data
        if (!data) return
        switch (data.type_mark) {
        case 1:
          // 文本
          let info = this.transformStudyList([data])
          this.addMessageItem(info[0])
          break
        case 2:
          // 图片
          break
        case 3:
          // 视频
          break
        case 'message':
          console.log(222)
          break
        default:
          break
        }
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
      /**
       * 发送的内容
       * @param info {Object} { text: 内容, isProblem: 是否提问 }
       */
      sendComment (info) {
        this.webSocket.send({
          'type_mark': 1,
          'content': info.text, // 文本内容
          'msg_tag': info.isProblem ? 1 : 0 // 消息标签 0无 1问 2赞
        })
        let data = {
          time: new Date().getTime(), // 发送消息的时间戳
          type: 1, // 类型 1: 普通评论 2提问的评论 3: 回复普通评论 4: 回复提问评论 5: 打赏信息 6: 视频资料 7: 图片资料 8分享记录
          userInfo: {
            avatar: this.avatar, // 头像
            name: this.$store.state.personalInfo.nickname, // 用户昵称
            uid: this.$store.state.personalInfo.uid // 发送内容的用户uid
          },
          label: this.mBean.role, // 管理员标签
          replyInfo: {
            name: '', // 被回复的用户昵称
            content: '' // 被回复的内容
          },
          content: info.text, // 普通的评论、回复的内容
          id: String(Math.random()).slice(-9)
        }
        this.addMessageItem(data)
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
            window.wx.chooseWXPay({
              ...res.data.data.js_sdk_config,
              success (res) {
                that.rewardInfo.isShow = false
                that.$_.Toast('打赏成功')
              }
            })
          }
        })
      },
      /**
       * 删除消息
       * @param info {Object} { id: 消息id, role: 直播间角色 }
       */
      deleteMessage (info) {
        this.webSocket.send({
          'type_mark': 6,
          'id': info.id
        })
        if (info.role) {
          this.mBean.studyListInfo.list = this.mBean.studyListInfo.list.filter(item => {
            return item.id !== info.id
          })
        } else {
          this.mBean.chatInfo.list = this.mBean.chatInfo.list.filter(item => {
            return item.id !== info.id
          })
        }
        this.mBean.commentListInfo.list = this.mBean.commentListInfo.list.filter(item => {
          return item.id !== info.id
        })
      },
      /**
       * 添加评论列表数据
       */
      addMessageItem (info) {
        if (this.mBean.commentListInfo.list.length) {
          this.mBean.commentListInfo.list.push(info)
        }
        if (info.role) {
          this.mBean.studyListInfo.list.push(info)
        } else {
          this.mBean.chatInfo.list.push({
            id: info.id,
            avatar: this.avatar,
            text: info.content,
            isAsk: info.type === 2
          })
        }
      },
      /**
       * 学习资料区列表数据转换
       * @param source {Object} 需要转换的数据源
       * @return {Object} 转换后可以直接使用的结构
       */
      transformStudyList (source) {
        let list = []
        source.forEach(item => {
          list.push({
            time: item.create_time, // 发送消息的时间戳
            type: 1, // 类型 1: 普通评论 2提问的评论 3: 回复普通评论 4: 回复提问评论 5: 打赏信息 6: 视频资料 7: 图片资料 8分享记录
            userInfo: {
              avatar: item.from_header_img, // 头像
              name: item.from_nick_name, // 用户昵称
              uid: item.from_uid // 发送内容的用户uid
            },
            label: '', // 管理员标签
            replyInfo: {
              name: item.passive_nick_name, // 被回复的用户昵称
              content: item.passive_content // 被回复的内容
            },
            content: item.content, // 普通的评论、回复的内容
            videoInfo: {
              cover: item.video_cover, // 视频资料封面
              src: item.video_url // 视频资料地址
            },
            image: item.img_url, // 图片
            amount: item.price, // 打赏的金额
            id: item.id
          })
        })
        return list
      }
    }
  }
</script>
