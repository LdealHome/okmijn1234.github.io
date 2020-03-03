/**
 * 修改ios设备输入框失去焦点后页面不能回滚到正确的位置
 */
import getDeviceSystem from '../utils/get-device-system'
export default {
  bind (el) {
    if (getDeviceSystem() === 'ios') {
      el.addEventListener('focus', function () {
        $_.scrollY = window.scrollY
        if ($_.scrollTimer) {
          clearTimeout($_.scrollTimer)
        }
      })
      el.addEventListener('blur', function () {
        $_.scrollTimer = setTimeout(function () {
          window.scrollTo(0, $_.scrollY)
        }, 200)
      })
    }
  }
}
