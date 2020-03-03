function error (e) {
  $_.Toast('播放音乐遇到错误')
  this.pause()
  if (typeof this.config.onError === 'function') {
    this.config.onError.call(this, e)
  }
}
function loadedmetadata () {
  if (typeof this.config.onLoadedmetadata === 'function') {
    this.config.onLoadedmetadata.call(this, {
      duration: AudioContext.formatTime(this.audio.duration)
    })
  }
}
function play () {
  if (typeof this.config.onPlay === 'function') {
    this.config.onPlay.call(this, null)
  }
}
function progress () {
  if (typeof this.config.onProgress === 'function') {
    let buffered = this.audio.buffered
    if (buffered.length) {
      let percent = buffered.end(0) / this.audio.duration
      this.config.onProgress.call(this, 100 * percent.toFixed(2))
    }
  }
}
function playing () {
  if (typeof this.config.onPlaying === 'function') {
    this.config.onPlaying.call(this, null)
  }
}
function pause () {
  if (typeof this.config.onPause === 'function') {
    this.config.onPause.call(this, null)
  }
}
function ended () {
  if (typeof this.config.onEnded === 'function') {
    this.config.onEnded.call(this, null)
  }
}
function timeupdate () {
  if (typeof this.config.onTimeupdate === 'function') {
    this.config.onTimeupdate.call(this, {
      percent: +(this.audio.currentTime / this.audio.duration * 100).toFixed(2),
      current: AudioContext.formatTime(this.audio.currentTime)
    })
  }
}

let eventBuffer = {}

export default class AudioContext {
  /**
   * 初始化配置
   * @param config {Object} 获取实例传递的方法
   * @param config.src {String} 音频地址
   * @param config.isFirst {Boolean} 是否为页面加载首次播放
   * @param config.onPlay {Function} 播放回调
   * @param config.onPlaying {Function} 开始播放回调
   * @param config.onPause {Function} 暂停播放回调
   * @param config.onEnded {Function} 播放完成回调
   * @param config.onError {Function} 播放错误回调
   * @param config.onTimeupdate {Function} 播放进度回调
   * @param config.onProgress {Function} 缓冲进度回调
   */
  constructor (config) {
    if (!window.__audio) {
      window.__audio = new Audio()
    }
    this.audio = window.__audio
    this.config = config
    // 不是第一次播放就移除已有监听函数
    if (!config.isFirst) {
      this.audio.removeEventListener('error', eventBuffer.error)
      this.audio.removeEventListener('loadedmetadata', eventBuffer.loadedmetadata)
      this.audio.removeEventListener('play', eventBuffer.play)
      this.audio.removeEventListener('progress', eventBuffer.progress)
      this.audio.removeEventListener('playing', eventBuffer.playing)
      this.audio.removeEventListener('pause', eventBuffer.pause)
      this.audio.removeEventListener('ended', eventBuffer.ended)
      this.audio.removeEventListener('timeupdate', eventBuffer.timeupdate)
    }
    this.attachEvent()
    this.config.src && this.play(this.config.src)
  }
  
  attachEvent () {
    // 记录事件处理函数的引用
    eventBuffer = {
      error: error.bind(this),
      loadedmetadata: loadedmetadata.bind(this),
      play: play.bind(this),
      progress: progress.bind(this),
      playing: playing.bind(this),
      pause: pause.bind(this),
      ended: ended.bind(this),
      timeupdate: timeupdate.bind(this)
    }
    this.audio.addEventListener('error', eventBuffer.error, false)
    this.audio.addEventListener('loadedmetadata', eventBuffer.loadedmetadata, false)
    this.audio.addEventListener('play', eventBuffer.play, false)
    this.audio.addEventListener('progress', eventBuffer.progress, false)
    this.audio.addEventListener('playing', eventBuffer.playing, false)
    this.audio.addEventListener('pause', eventBuffer.pause, false)
    this.audio.addEventListener('ended', eventBuffer.ended, false)
    this.audio.addEventListener('timeupdate', eventBuffer.timeupdate, false)
  }
  play (src) {
    src && (this.audio.src = src)
    if (!this.audio.src) {
      $_.Toast('音乐地址不合法')
      return
    }
    this.audio.play()
  }
  pause () {
    this.audio.pause()
  }
  
  /**
   * 时间格式化 mm:ss
   * @param duration { Number } 时间总数（单位S）
   * @returns {string}
   */
  static formatTime (duration) {
    let s = +duration
    // let hour = Math.floor(s / 3600)
    let minute = Math.floor(s % 3600 / 60)
    let second = Math.floor(s % 3600 % 60)
    if (minute < 10) {
      minute = '0' + minute
    }
    if (second < 10) {
      second = '0' + second
    }
    return minute + ':' + second
  }
}
