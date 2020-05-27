<template lang="pug">
  div
    component(
      :is="courseType"
      :data="mBean"
      @clickSetRemind="clickSetRemind"
      @followBtnClick="isAddWeChatPopup = true"
      @clickReward="rewardInfo.isShow = true"
      @collectBtnClick="isShowCollect = true"
      @shareBtnClick="isPostersSharePopup = true"
      @seeVideo="seeVideo"
      @sendComment="sendComment"
      @loadMore="loadMore"
      @changeMessage="changeMessage"
      @changeRollState="changeRollState"
      @switchTab="switchTab"
    )
    CustomerServicePopup(
      v-if="isCustomerServicePopup"
      :customer="customerServiceData"
      @close="isCustomerServicePopup = false"
    )
    AddWeChatPopup(
      v-if="isAddWeChatPopup"
      :addWeChatSrc="addWeChatSrc"
      @close="isAddWeChatPopup = false"
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
  import AddWeChatPopup from '../../components/course/AddWeChatPopup'
  import RewardPopup from '../../components/course/RewardPopup'
  import GuideCollection from '../../components/course/GuideCollection'
  import PostersSharePopup from '../../components/community/PostersSharePopup'
  import VideoPopup from '../../components/VideoPopup'
  import weixinConfig from '../../mixin/weixinConfig'
  import {
    getCourseInfo,
    postChangeRemindState,
    postRewardCourse,
    getCommentList
  } from '../../services/course'
  import {
    getVideoInfo
  } from '../../services'
  import { MessageBox } from 'mint-ui'

  let vm
  
  function pagehide () {
    if (vm.webSocket) {
      vm.webSocket.close()
      vm.webSocket = null
    }
    if (vm.updateCountDownTimer) clearInterval(vm.updateCountDownTimer) 
    if (vm.sendPingTimer) clearInterval(vm.sendPingTimer) 
    if (vm.updateTimer) clearInterval(vm.updateTimer) 
    if (vm.reconnectTimer) clearTimeout(vm.reconnectTimer)
    let videoPlayTime = sessionStorage.getItem('videoPlayTime')
    if (videoPlayTime && vm.mBean.isStatistics) {
      sessionStorage.removeItem('videoPlayTime')
      let data = JSON.parse(localStorage.getItem('studyStatistics') || '{}')
      let time = new Date()
      // 最后一次的播放时长(暂停后单独算一次)
      let watchTime = Math.floor((time - videoPlayTime) / 1000)
      localStorage.setItem('studyStatistics', JSON.stringify({
        course_single_id: vm.courseId,
        study_close_time: Math.floor(time.getTime() / 1000),
        study_duration: watchTime + (data.study_duration || 0),
        play_length: (data.play_length || 0) + watchTime,
        play_over: 2,
        key: vm.courseKey
      }))
    }
    window.removeEventListener('pagehide', pagehide, false)
  }

  export default {
    name: 'Course',
    components: {
      CourseHorizontal,
      CustomerServicePopup,
      AddWeChatPopup,
      RewardPopup,
      GuideCollection,
      PostersSharePopup,
      VideoPopup
    },
    data () {
      return {
        type: 1,
        mBean: {
          id: 0, // 课程id
          video: { // 视频信息
            src: '',
            poster: ''
          },
          isShowFollow: false, // 是否显示关注按钮
          followBtnAvatar: '', // 关注按钮头像
          state: -1, // 直播状态 0: 未开始 1:直播中 2:回放
          personTime: 0, // 人次
          time: 0, // state对应不同时间 state：0距离直播开始时间 1直播播放的位置
          isSetReminders: true, // 是否设置开播提醒
          countDownList: [],
          studyListInfo: {
            params: {
              key: '',
              mark_id: 0,
              limit: 20,
              page: 1,
              type: 1,
              direction: 1
            },
            list: [],
            isShowTopView: false,
            direction: 'bottom',
            isRollBottom: false
          },
          commentListInfo: {
            list: [],
            params: {
              key: '',
              mark_id: 0,
              limit: 20,
              page: 1,
              type: 2,
              direction: 1
            },
            rollBottom: 0,
            forbiddenWordsList: [],
            isRollBottom: false,
            isShowTopView: false
          },
          isFollow: false,
          key: '',
          webSocketUrl: '',
          isForbidComment: false,
          isAllProhibited: false, // 是否是全员禁言
          isSuperAdmin: false, // 是否是超级管理员，超级管理员在全员禁言时，可以评论
          role: 0,
          totalComments: 0,
          isStatistics: false,
          navBarCurrent: 1,
          isFullScreen: false,
          peopleOnlineNumber: 0
        },
        rewardInfo: {
          isShow: false,
          avatar: '',
          name: '',
          amountList: []
        },
        replyInfo: {
          content: '',
          isReply: false,
          id: 0
        },
        updateCountDownTimer: null, // 更新倒计时的定时器
        isShowCollect: false, // 是否显示收藏引导弹窗
        isPostersSharePopup: false,
        isCustomerServicePopup: false,
        isAddWeChatPopup: false,
        addWeChatSrc: '',
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
        sendPingTimer: null,
        updateTimer: null,
        reconnectTimer: null
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
      courseKey () {
        return this.mBean.key
      },
      // 访客
      isGuest () {
        return this.$store.state.guest
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
            document.title = data.title
            this.mBean = {
              id: data.id, // 课程id
              video: { // 视频信息
                src: data.video_src,
                poster: data.video_cover
              },
              isShowFollow: data.live_focus_qr_code,
              followBtnAvatar: data.user_focus_info.focus_anchor_img,
              state: state, // 直播状态 0: 未开始 1:直播中 2:回放
              personTime: state > 0 ? data.watch_number : data.set_start_number, // 人次
              visitPersonTime: data.watch_number, // 累计访问人次
              time: state > 0 ? (state === 1 ? data.current_live_time : data.user_play_length) : data.differ_time, // state对应不同时间 state：0距离直播开始时间 1直播播放的位置 2上一次回放的位置
              isSetReminders: data.is_set_remind === 1, // 是否设置开播提醒
              countDownList: [],
              studyListInfo: {
                params: {
                  key: data.web_socket.key,
                  mark_id: 0,
                  limit: 20,
                  page: 1,
                  type: 1,
                  lay_out: this.type,
                  direction: state !== 1 ? 2 : 1 // 分页查询的方向 1:上拉获取历史数据 2:下拉获取最新数据
                },
                list: [],
                rollBottom: 0,
                isShowTopView: state !== 1,
                direction: state !== 1 ? 'bottom' : 'top',
                isLastPage: false,
                isRollBottom: false
              },
              commentListInfo: {
                list: [],
                params: {
                  key: data.web_socket.key,
                  mark_id: 0,
                  limit: 20,
                  page: 1,
                  type: 2,
                  lay_out: this.type,
                  direction: 1
                },
                rollBottom: 0,
                forbiddenWordsList: [], // 显示的列表中，被禁言的用户uid列表
                isLastPage: false,
                isRollBottom: true,
                isShowTopView: false
              },
              isFollow: data.user_focus_info.is_focus === 1,
              key: data.web_socket.key,
              webSocketUrl: data.web_socket.url,
              isForbidComment: data.is_comment === 2,
              isAllProhibited: data.is_comment_all === 2 && data.is_super !== 1, // 是否是全员禁言(只改变非超级管理员的禁言状态)
              isSuperAdmin: data.is_super === 1, // 是否是超级管理员，超级管理员在全员禁言时，可以评论
              role: data.role,
              totalComments: data.comment_number,
              serverTime: res.data.timestamp,
              isStatistics: data.is_statistics,
              videoLength: data.video_length,
              navBarCurrent: 1,
              isFullScreen: data.is_full_screen,
              peopleOnlineNumber: 0 // 在线人数
            }
            if (!state) {
              // 未开播时更新距离开播倒计时
              this.updateCountDownList()
            } else {
              this.updateServerTime()
            }

            let shareInfo = {
              desc: data.share_info.content,
              img: data.share_info.img_url,
              title: data.share_info.title,
              link: data.share_info.link
            }
            this.updateWXConfig()
            this.getWeiXinConfig(shareInfo)
              .then(res => {
                this.setWeiXinConfig(res, this.shareSuccess)
              })

            let rewardInfo = data.anchor_info
            this.rewardInfo = {
              isShow: false,
              avatar: rewardInfo.anchor_img,
              name: rewardInfo.nick_name,
              amountList: data.reward_info
            }
            this.customerServiceData.codeSrc = data.user_focus_info.focus_code
            this.addWeChatSrc = data.live_focus_qr_code
          }
        })
      },
      getStudyDataList (type) {
        return new Promise((resolve, reject) => {
          let originalList = this.mBean[type].list
          if (originalList.length) {
            this.mBean[type].params.mark_id = originalList[this.mBean[type].params.direction === 1 ? 0 : (originalList.length - 1)].id
          }
          getCommentList(this.mBean[type].params).then(res => {
            let list = []
            if (res.data.code === 1 && res.data.data && res.data.data.list) {
              list = res.data.data.list
              if (this.mBean[type].params.direction === 1) {
                this.mBean[type].list = [ ...this.transformStudyList(list), ...this.mBean[type].list ]
              } else {
                this.mBean[type].list.push(...this.transformStudyList(list))
              }
            }
            // 学习资料区滚动到最后一页时，显示顶部的集福中心样式
            if (list.length < this.mBean[type].params.limit) {
              this.$set(this.mBean[type], 'isShowTopView', true)
            }
            this.$nextTick(() => {
              // 直播中进入页面学习资料区滚动到底部
              if (type === 'studyListInfo' &&
                this.mBean[type].params.page === 1 &&
                this.mBean[type].params.direction === 1
              ) {
                this.mBean.studyListInfo.rollBottom++
                this.mBean.studyListInfo.isRollBottom = true
              }
              resolve(list)
            })
          })
        })
      },
      async loadMore (type, res) {
        this.studyDataLoad = { type, res }
        if (!this.courseKey) {
          return
        }
        const that = this
        let isLastPage = false
        await that.getStudyDataList(type).then(list => {
          isLastPage = that.$_.isLastPage(that.mBean[type].params.limit, list)
        })
        if (type === 'commentListInfo' && this.mBean[type].params.page === 1) {
          this.mBean.commentListInfo.rollBottom++
        }
        // 连接websocket
        if (!this.webSocket) {
          that.connectWebSocket()
        }
        this.mBean[type].params.page++
        if (isLastPage) {
          this.mBean[type].isLastPage = true
          res.complete()
        } else {
          res.loaded()
        }
      },
      /**
       * 切换资料区、互动区
       */
      switchTab (index) {
        // 切换到资料区时，先将是否滚动到底部状态设置为false
        // 解决切换到资料区，收到新消息会自动滚动新消息位置问题
        if (index === 0) {
          this.mBean.studyListInfo.isRollBottom = false
        }
        this.mBean.navBarCurrent = index
      },
      /**
       * 分享回调
       */
      shareSuccess () {
        this.sendMessage({ 'type_mark': 5 })
      },
      connectWebSocket () {
        if (!this.mBean.webSocketUrl) return
        this.webSocket = new WebSocket(this.mBean.webSocketUrl)
        this.webSocket.onopen = () => {
          if (this.reconnectTimer) {
            clearTimeout(this.reconnectTimer)
            this.reconnectTimer = null
          }
          if (this.sendPingTimer) clearInterval(this.sendPingTimer)
          this.sendMessage({ 'type_mark': 'ping' })
          this.sendPingTimer = setInterval(() => {
            this.sendMessage({ 'type_mark': 'ping' })
          }, 50000)
        }
        
        this.webSocket.onmessage = this.receiveMessage

        // 断开重连
        this.webSocket.onclose = () => {
          this.reconnectWebSocket()
        }
        this.webSocket.onerror = () => {
          this.reconnectWebSocket()
        }
      },
      /**
       * 重新连接WebSocked
       */
      reconnectWebSocket () {
        if (this.reconnectTimer || !this.webSocket) return
        // 设置延时重连，没连接上会一直重连
        this.reconnectTimer = setTimeout(() => {
          this.connectWebSocket()
          this.reconnectTimer = null
        }, 2000)
      },
      /**
       * 更新本地的服务器时间，用于判断显示自己评论的撤回按钮
       */
      updateServerTime () {
        this.updateTimer = setInterval(() => {
          this.mBean.serverTime++
        }, 1000)
      },
      /**
       * 接收WebSocket的消息
       */
      receiveMessage (res) {
        let data = JSON.parse(res.data)
        if (!data) return
        switch (data.type_mark) {
        case 1:
        case 2:
        case 3:
        case 4:
        case 5:
          // 1文本 2图片 3视频 4红包 5分享记录
          let info = this.transformStudyList([data])
          this.addMessageItem(info[0])
          this.mBean.totalComments++
          break
        case 6:
        case 9:
          // 删除评论
          // 撤回评论
          this.mBean.studyListInfo.list = this.mBean.studyListInfo.list.filter(item => {
            return item.id !== data.id
          })
       
          this.mBean.commentListInfo.list = this.mBean.commentListInfo.list.filter(item => {
            return item.id !== data.id
          })
          this.mBean.totalComments--
          break
        case 7:
          // 禁言
          this.mBean.isForbidComment = true
          break
        case 8:
          // 禁言
          this.mBean.isForbidComment = false
          break
        case 10:
          // 全员禁言, 只改变不是超级管理员的禁言状态
          this.mBean.isAllProhibited = !this.mBean.isSuperAdmin
          break
        case 11:
          // 全员解除禁言
          this.mBean.isAllProhibited = false
          break
        case 'message':
          this.$_.Toast(data.message)
          break
        case 'join':
          this.mBean.personTime++
          break
        case 'people':
          this.mBean.peopleOnlineNumber = data.number
          break
        default:
          break
        }
      },
      /**
       * 设置/取消开播提醒
       */
      clickSetRemind () {
        if (this.isGuest) {
          this.$router.push({ name: 'particulars', params: { from: this.fromUid } })
          return
        }
        if (!this.mBean.isFollow) {
          this.isCustomerServicePopup = true
          return 
        }
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
            // 修改访问人次，未开播和开播后访问的人次是不同的两个值
            this.mBean.personTime = this.mBean.visitPersonTime
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
      /**
       * 查看视频
       * @param info {Object} { type: 类型(1根据场景值获取视频，2直接显示视频信息), scene: 场景值信息, videoInfo: 视频信息 }
       */
      seeVideo (info) {
        if (info.type === 1) {
          getVideoInfo({ scene: info.scene }).then(res => {
            if (res.data.code === 1) {
              let data = res.data.data
              this.videoInfo = {
                videoUrl: data.path,
                imgSrc: data.poster
              }
              this.isShowVideo = true
            }
          })
        } else {
          this.videoInfo = info.videoInfo
          this.isShowVideo = true
        }
      },
      /**
       * 发送的内容
       * @param info {Object} { text: 内容, isProblem: 是否提问, replyInfo: 回复的信息 }
       */
      sendComment (info) {
        this.sendMessage({
          'type_mark': 1,
          'content': info.text, // 文本内容
          'msg_tag': info.isProblem && !info.replyInfo.id ? 1 : 0, // 消息标签 0无 1问 2赞
          'pid': info.replyInfo.id, // 回复时才有
          'passive_uid': info.replyInfo.uid, // 回复时才有
          'passive_content': info.replyInfo.content, // 被回复的内容
          'passive_nick_name': info.replyInfo.name, // 被回复人昵称
          'passive_msg_tag': info.replyInfo.id && info.replyInfo.isAsk ? 1 : 0
        })
        // 学员(普通用户)在选中资料区时评论，自动切换到互动区
        if (this.mBean.navBarCurrent === 0 && !this.mBean.isSuperAdmin) {
          this.mBean.navBarCurrent = 1
        }
        // 自己发送评论或回复评论时，需滚动到评论列表底部
        this.mBean.commentListInfo.isRollBottom = true
        if (this.mBean.state === 1 || this.mBean.studyListInfo.isLastPage) {
          this.mBean.studyListInfo.isRollBottom = true
        }
      },
      /**
       * 打赏-唤醒支付
       * @param amount {Number}
       */
      rewardClick (amount) {
        const that = this
        postRewardCourse({
          amount,
          key: this.courseKey
        }).then(res => {
          if (res.data.code === 1) {
            window.wx.chooseWXPay({
              ...res.data.data.js_sdk_config,
              success (res) {
                that.rewardInfo.isShow = false
                that.$_.Toast('打赏完毕，谢主隆恩')
              }
            })
          }
        })
      },
      /**
       * 更改消息
       * @param info {Object} { type: 类型 (100撤回、101删除评论、102禁言、解除禁言) id: 消息id }
       */
      changeMessage (info) {
        if (info.type === 102) {
          let list = this.mBean.commentListInfo.forbiddenWordsList
          let type = list.includes(info.uid) ? 8 : 7
          if (type === 7) {
            // 禁言
            this.$_.Toast('该用户已被禁言')
            list.push(info.uid)
          } else {
            // 解除禁言
            this.$_.Toast('已解除该用户禁言')
            this.mBean.commentListInfo.forbiddenWordsList = list.filter(item => { return item !== info.uid })
          }
          this.sendMessage({
            'type_mark': type,
            'passive_uid': info.uid
          })
        } else {
          if (info.type === 101) {
            this.$_.Toast('该用户评论已删除')
          }
          this.sendMessage({
            'type_mark': info.type === 100 ? 9 : 6,
            'id': info.id
          })
        }
      },
      sendMessage (data) {
        this.webSocket.send(JSON.stringify(data))
      },
      /**
       * 添加评论列表数据
       */
      addMessageItem (info) {
        if (this.mBean.commentListInfo.list.length || this.mBean.commentListInfo.isLastPage) {
          this.mBean.commentListInfo.list.push(info)
          if (this.mBean.commentListInfo.isRollBottom) {
            this.$nextTick(() => {
              // 评论区滚动到底部时，接受到新消息，要滚动到新消息位置
              this.mBean.commentListInfo.rollBottom++
            })
          }
        }
        // 超级管理员发送的内容、打赏记录添加到学习资料区
        if (
          (info.isSuperAdmin || info.type === 5) &&
          (this.mBean.state === 1 || this.mBean.studyListInfo.isLastPage) &&
          info.type !== 8
        ) {
          this.mBean.studyListInfo.list.push(info)
          if (this.mBean.studyListInfo.isRollBottom) {
            this.$nextTick(() => {
              // 学习资料区滚动到底部时，接受到新消息，要滚动到新消息位置
              this.mBean.studyListInfo.rollBottom++
            })
          }
        }
      },
      /**
       * 改变学习资料区、评论区是否滚动到底部状态
       * @param info {Object} 改变相关数据 { type: 资料区、评论区对应属性名, state: 状态 }
       */
      changeRollState (info) {
        this.mBean[info.type].isRollBottom = info.state
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
       * 学习资料区列表数据转换
       * @param source {Object} 需要转换的数据源
       * @return {Object} 转换后可以直接使用的结构
       */
      transformStudyList (source) {
        let list = []
        source.forEach(item => {
          // 禁言用户列表
          if (!this.mBean.commentListInfo.forbiddenWordsList.includes(+item.from_uid) && item.from_user_is_say === 2) {
            this.mBean.commentListInfo.forbiddenWordsList.push(+item.from_uid)
          }
          // 消息类型
          let type = 0
          switch (item.type_mark) {
          case 1:
            // 文本
            if (item.msg_tag === 1 || item.passive_msg_tag === 1) {
              // 提问类型并且判断是否是回复
              type = item.pid ? 4 : 2
            } else {
              type = item.pid ? 3 : 1
            }
            break
          case 2:
            // 图片
            type = 7
            break
          case 3:
            // 视频
            type = 6
            break
          case 4:
            // 打赏记录
            type = 5
            break
          case 5:
            // 分享记录
            type = 8
            break
          default:
            break
          }
          list.push({
            time: item.create_time, // 发送消息的时间戳
            type: type, // 类型 1: 普通评论 2提问的评论 3: 回复普通评论 4: 回复提问评论 5: 打赏信息 6: 视频资料 7: 图片资料 8分享记录
            userInfo: {
              avatar: item.from_header_img, // 头像
              name: item.from_nick_name, // 用户昵称
              uid: +item.from_uid // 发送内容的用户uid
            },
            label: +item.from_user_title, // 管理员标签
            replyInfo: {
              delete: item.passive_is_del === 2,
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
            id: item.id,
            isFictitious: item.is_virtual_user === 1, // 是否是虚拟用户
            isSuperAdmin: +item.is_super === 1 // 是否是超级管理员发的信息
          })
        })
        return list
      }
    }
  }
</script>
