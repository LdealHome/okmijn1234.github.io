const D2UConverter = require('@dpwolfe/dos2unix').dos2unix
const args = require('minimist')(process.argv.slice(2), {
  string: ['dir']
})

function dos2unix (dir) {
  new D2UConverter({ glob: { cwd: process.cwd() } })
    .on('error', function (err) {
      console.error(err)
    })
    .on('end', function (stats) {
      console.log(stats)
    })
    .process([dir || '*'])
}

dos2unix(args.dir)
