export default function getDeviceSystem () {
  let ua = navigator.userAgent
  let isWindowsPhone = ua.indexOf('Windows Phone') >= 0
  let isAndroid = ua.indexOf('Android') > 0 && !isWindowsPhone
  let isIOS = /iP(ad|hone|od)/.test(ua) && !isWindowsPhone
  if (isWindowsPhone) {
    return 'windows'
  }
  if (isAndroid) {
    return 'android'
  }
  if (isIOS) {
    return 'ios'
  }
}
