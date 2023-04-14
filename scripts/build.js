// 打包 monorepo
const fs = require('fs')
const execa = require('execa')
// 获取需要打包文件夹
const dirs = fs.readdirSync('packages').filter(p => {
  return fs.statSync(`packages/${p}`).isDirectory()
})
async function build(target) {
  console.log(target);
  // execa 开启子进程  -c执行rollup环境配置，环境变量
  await execa('rollup',['-c','--environment', `TARGET:${target}`], { stdio: 'inherit' })
}
// 并行打包 Promise.all
async function runParaller(dirs,itemFn) {
  let res = []
  for (let item of dirs) {
    res.push(itemFn(item))
  }
  return Promise.all(res)
}
runParaller(dirs,build).then(() => {
  console.log('打包成功')
})
console.log(dirs)