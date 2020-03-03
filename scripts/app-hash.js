const shell = require('shelljs')
const path = require('path')

function resolve (dir) {
  return path.join(process.cwd(), dir)
}

// 将入口文件中对app的引用路径修改（app.hash.(js|css) => app.(js|css)?hash）
shell.sed('-i', /(app\.)([a-z0-9]{8})\.(js|css)/g, '$1$3?$2', resolve('dist/index.html'))

// 获取需要修改名字的文件（name.hash.(js|css)）
let hashFiles = shell.find(resolve('dist/assets')).filter(function (file) {
  return file.match(/\.[a-z0-9]{8}\.(js|css)$/)
})

// 将资源文件重命名（app.hash.(js|css) => app.(js|css)）
hashFiles.forEach(function (item) {
  let match = item.match(/(.*\.)[a-z0-9]{8}\.(js|css)$/)
  shell.mv(item, match[1] + match[2])
})
