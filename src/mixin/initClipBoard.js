/**
 * 将文本复制到系统粘贴板
 * 点击复制按钮时，将该按钮对应的唯一类名标识码和复制内容传给initClipBoard
 */
import Clipboard from 'clipboard'
export default {
  methods: {
    /**
     * 初始化复制环境
     * @param className {String} 启动按钮，点击时执行复制
     * @param text {String} 复制到粘贴板的具体内容
     * @param callback {Function} 复制成功后的回调
     * @return {*}
     */
    initClipBoard (className, text, callback) {
      this.clipboard && this.clipboard.destroy()
      let clipboard = new Clipboard(className, {
        text () {
          return text
        }
      })
      this.clipboard = clipboard
      clipboard.on('success', function () {
        typeof callback === 'function' && callback.call()
        callback || $_.Toast('复制成功')
      })
      clipboard.on('error', function () {
        $_.Toast('复制失败，请手动复制')
      })
    }
  },
  beforeRouteLeave (to, from, next) {
    this.clipboard && this.clipboard.destroy()
    next()
  }
}
