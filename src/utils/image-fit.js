/**
 * 获取图片切片位置
 * @param naturalWidth {Number} 原图的宽度
 * @param naturalHeight {Number} 原图的高度
 * @param destinationWidth {Number} 生成的图片高度
 * @param destinationHeight {Number} 生成的图片的宽度
 * @param mode {String} 图片缩放模式cover|contain
 * @returns {{x: number, y: number, w: number, h: number, dx: number, dy: number, dw: number, dh: number}}
 */
function imageFit (naturalWidth, naturalHeight, destinationWidth, destinationHeight, mode = 'cover') {
  let x, y, w, h, dx, dy, dw, dh
  if (mode !== 'cover' && naturalHeight > naturalWidth) { // 如果高度大于宽度, 只缩放不裁剪
    let aspectRatio = naturalWidth / naturalHeight
    x = 0
    y = 0
    w = naturalWidth
    h = naturalHeight
    dx = 0
    dy = 0
    dw = destinationWidth
    dh = destinationWidth / aspectRatio
  } else { // 裁剪图片cover
    let widthRatio = destinationWidth / naturalWidth
    let heightRatio = destinationHeight / naturalHeight
    // 获取缩放比例
    let ratio = Math.max(widthRatio, heightRatio)
    let newWidth = naturalWidth * ratio
    let newHeight = naturalHeight * ratio
    let absX = Math.abs(newWidth - destinationWidth)
    let absH = Math.abs(newHeight - destinationHeight)
    if (absX > 0) { // 保留高度
      x = (absX / 2) / ratio
      y = 0
      w = (newWidth - absX) / ratio
      h = naturalHeight
    } else { // 保留宽度
      x = 0
      y = (absH / 2) / ratio
      w = naturalWidth
      h = (newHeight - absH) / ratio
    }
    dx = 0
    dy = 0
    dw = destinationWidth
    dh = destinationHeight
  }
  return { x, y, w, h, dx, dy, dw, dh }
}
export default imageFit
