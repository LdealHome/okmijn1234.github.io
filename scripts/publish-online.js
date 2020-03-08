const shell = require('shelljs')
const args = require('minimist')(process.argv.slice(2))
const branch = args._[0]
let targetBranch = 'master'
// 确保要发布的分支存在
if (!branch) {
  shell.echo('请输入要发布的分支')
  shell.exit(1)
} else {
  let branchList = shell.exec('git branch', { silent: true }).stdout
  let reg = new RegExp(branch + '\n', 'g')
  if (!reg.test(branchList)) {
    shell.echo('该分支不存在')
    shell.exit(1)
  }
}
// 确保当前工作分支没有未推送的内容
shell.exec(`git push && git checkout ${targetBranch} && git checkout . && git pull && git merge ${branch}`)
// 重新生成新的提交内容
let log = shell.exec('git log --pretty=format:"%h - %an, %cd--%s" -1', { silent: true }).stdout
let date = new Date().toLocaleString()
let commit = 'build: ' + date
let operator = shell.exec('git config user.name', { silent: true }).stdout.replace(/\n/g, '')
shell.ShellString(`\n${operator} ${date}: ${branch} => ${log}`).toEnd('.build.log')
shell.exec('git add .')
shell.exec(`git commit -m "${commit}"`)
shell.exec('git push')
shell.exec(`git checkout ${branch}`)
shell.exec(`git merge ${targetBranch}`)
shell.exec('git push')
shell.echo('发布成功！')
