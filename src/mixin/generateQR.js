import QRCode from 'qrcode'
export default {
  methods: {
    /**
     * 根据内容生成二维码图片
     */
    async generateQR (text) {
      try {
        return await QRCode.toDataURL(text, {
          margin: 1
        })
      } catch (e) {
        console.log(e)
      }
    }
  }
}
