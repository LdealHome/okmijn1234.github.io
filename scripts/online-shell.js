const shell = require('shelljs')
const fs = require('fs-extra')

const entry = `/www/wwwroot/community-pro/communityWeb/index.html`

let status = shell.exec('git checkout . && git checkout master && git pull')
if (status.code !== 0) {
  shell.echo('更新代码失败，请排查')
  shell.exit(1)
}
// 如果package.json发生变化就重新安装依赖包
if (status.grep('package.json').stdout !== '\n') {
  shell.echo('开始安装依赖包...')
  shell.exec('npm install')
  shell.echo('依赖包更新完成')
}
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
fs.copy('/www/wwwroot/lm_build/shequn/dist/index.html', entry)
  .then(() => {
    console.log('build success!')
    console.log('entry path:' + entry)
  })
