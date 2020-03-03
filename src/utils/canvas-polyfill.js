/**
 * fix某些手机不支持canvas.toBlob
 */
export function canvasToBlob () {
  if (!HTMLCanvasElement.prototype.toBlob) {
    Object.defineProperty(HTMLCanvasElement.prototype, 'toBlob', {
      value: function (callback, type, quality) {
        let canvas = this
        setTimeout(function () {
          let binStr = atob(canvas.toDataURL(type, quality).split(',')[1])
            
          let len = binStr.length
            
          let arr = new Uint8Array(len)
          for (let i = 0; i < len; i++) {
            arr[i] = binStr.charCodeAt(i)
          }
          callback(new Blob([arr], { type: type || 'image/png' }))
        })
      }
    })
  }
}

export function canvasWrapText () {
  /**
   * canvas文字换行
   * @param text {String} 需要绘制的文字
   * @param x {Number} 文字开始绘制的起始位置X
   * @param y {Number} 文字开始绘制的起始位置Y
   * @param maxWidth {Number} 文字绘制的最大宽度
   * @param lineHeight {Number} 文字的行高
   * @param limitLine {Number} 最多绘制几行文字，超过会自动截断
   */
  CanvasRenderingContext2D.prototype.wrapText = function (text, x, y, maxWidth, lineHeight, limitLine) {
    let startY = y
    if (typeof text !== 'string' || typeof x !== 'number' || typeof y !== 'number') {
      return
    }
    let context = this
    let canvas = context.canvas

    if (typeof maxWidth === 'undefined') {
      maxWidth = (canvas && canvas.width) || 300
    }
    if (typeof lineHeight === 'undefined') {
      lineHeight = (canvas && parseInt(window.getComputedStyle(canvas).lineHeight)) || parseInt(window.getComputedStyle(document.body).lineHeight)
    }

    // 字符分隔为数组
    let arrText = text.split('')
    let line = ''

    for (let n = 0; n < arrText.length; n++) {
      let testLine = line + arrText[n]
      let metrics = context.measureText(testLine)
      let testWidth = metrics.width
      if (testWidth > maxWidth && n > 0) {
        // 限制文字的最大行
        if (limitLine && (y - startY) >= ((limitLine - 1) * lineHeight)) {
          line = line.slice(0, -1) + '...'
          context.fillText(line, x, y)
          return
        }
        context.fillText(line, x, y)
        line = arrText[n]
        y += lineHeight
      } else {
        line = testLine
      }
    }
    context.fillText(line, x, y)
  }
}

export function canvasRoundedRect () {
  /**
   * 绘制圆角矩形
   * @param x {Number} 矩形的横轴起点
   * @param y {Number} 矩形的纵轴起点
   * @param width {Number} 矩形的宽度
   * @param height {Number} 矩形的高度
   * @param radius {Number} 圆角半径
   */
  CanvasRenderingContext2D.prototype.roundedRect = function (x, y, width, height, radius) {
    this.beginPath()
    this.moveTo(x, y + radius)
    this.lineTo(x, y + height - radius)
    this.quadraticCurveTo(x, y + height, x + radius, y + height)
    this.lineTo(x + width - radius, y + height)
    this.quadraticCurveTo(x + width, y + height, x + width, y + height - radius)
    this.lineTo(x + width, y + radius)
    this.quadraticCurveTo(x + width, y, x + width - radius, y)
    this.lineTo(x + radius, y)
    this.quadraticCurveTo(x, y, x, y + radius)
    this.closePath()
  }
}
