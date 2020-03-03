const shell = require('shelljs')
const path = require('path')
const SSH = require('node-ssh')

const ssh = new SSH()

function resolve (dir) {
  return path.join(process.cwd(), dir)
}

// todo 信息无误后在上传
shell.exit(1)
const dir = 'hkstest.smsqmx.com'

// 构建测试包代码
if (shell.exec('vue-cli-service build --mode qa').code !== 0) {
  shell.echo('build error!!!')
  shell.exit(1)
}

// app hash 替换
if (shell.exec('node scripts/app-hash.js').code !== 0) {
  shell.echo('handle hash fail')
  shell.exit(1)
}

// 上传模块对应的代码
async function uploadFile () {
  // 上传html
  await ssh.putFile(resolve('dist/index.html'), `/www/wwwroot/${dir}/index.html`)
  console.log('upload html success.')
  // 上传资源文件
  await ssh.putDirectory(resolve('dist/assets'), `/www/wwwroot/${dir}/assets`, {
    recursive: true,
    concurrency: 10,
    validate: function (itemPath) {
      return true
    }
  })
  console.log('upload assets success.')
  return 0
}

ssh.connect({
  host: '49.4.93.42',
  username: 'root',
  passphrase: 'liubo1011',
  privateKey: resolve('ssh/id_rsa_2048_liubo')
})
  .then(() => {
    return uploadFile()
  })
  .then(res => {
    console.log('file upload completed!')
    process.exit(res)
  })
  .catch(err => {
    console.log(err)
    process.exit(1)
  })
