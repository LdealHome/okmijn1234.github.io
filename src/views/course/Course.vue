<template lang="pug">
  div(v-if="isLoad")
    component(:is="courseType" :data="mBean")
</template>

<script>
  import CourseHorizontal from './CourseHorizontal'
  import { getCourseInfo } from '../../services/course'
  import weixinConfig from '../../mixin/weixinConfig'
  export default {
    name: 'Course',
    components: {
      CourseHorizontal
    },
    data () {
      return {
        type: 1,
        isLoad: true,
        mBean: {
          id: 0, // 课程id
          video: { // 视频信息
            src: '',
            poster: 'http://pics5.baidu.com/feed/1f178a82b9014a908d4af8fedd5fb314b31bee28.jpeg?token=50aab04d896c37c4f4511fbccb0f2c3a'
          },
          state: '', // 直播状态 0: 未开始 1:直播中 2:回放
          personTime: '', // 人次
          time: 0 // state对应不同时间 state：0距离直播开始时间 1直播播放的位置 
        }
      }
    },
    mixins: [weixinConfig],
    created () {
      getCourseInfo({ course_single_id: this.courseId }).then(res => {
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
            state: state, // 直播状态 0: 未开始 1:直播中 2:回放
            personTime: state > 0 ? data.watch_number : data.set_start_number, // 人次
            time: 60 // state对应不同时间 state：0距离直播开始时间 1直播播放的位置 
          }
          let shareInfo = {
            desc: data.share_info.content,
            img: data.share_info.img_url,
            title: data.share_info.title,
            link: data.share_info.link
          }
          this.getWeiXinConfig(shareInfo)
            .then(this.setWeiXinConfig)
          this.isLoad = true
        }
      })
    },
    computed: {
      courseType () {
        let list = ['CourseHorizontal', 'CourseHorizontal', 'CourseHorizontal']
        return list[this.type - 1]
      },
      courseId () {
        return this.$route.params.id
      }
    }
  }
</script>
