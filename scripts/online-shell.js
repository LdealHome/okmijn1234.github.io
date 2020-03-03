const shell = require('shelljs')
const fs = require('fs-extra')

const entry = `/www/wwwroot/hksnew.smsqmx.com/index.html`

shell.exec('git checkout . && git checkout new_hks_online && git pull')
// 构建代码
if (shell.exec('vue-cli-service build --mode production').code !== 0) {
  shell.echo('build error!!!')
  shell.exit(1)
}

// app hash 替换
if (shell.exec('node scripts/app-hash.js').code !== 0) {
  shell.echo('handle hash fail')
  shell.exit(1)
}

// 生成入口文件
fs.copy('/www/wwwroot/lm_build/hks/dist/index.html', entry)
  .then(() => {
    console.log('build success!')
    console.log('entry path:' + entry)
  })
