/**
 * 将base64转换为blob对象
 * @param base64 {String} base64编码字符串
 * @returns {Blob}
 */
export default function base64ToBlob (base64) {
  let splitString = base64.split(',')
  let mimeString = splitString[0].split(':')[1].split(';')[0]
  let byteString = atob(splitString[1])
  let length = byteString.length
  let buffer = new ArrayBuffer(length)
  let view = new Uint8Array(buffer)
  for (var i = 0; i < length; i++) {
    view[i] = byteString.charCodeAt(i)
  }
  return new Blob([buffer], { type: mimeString })
}
