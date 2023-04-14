
const execa = require('execa')

async function build(target) {
  console.log(target);
  // execa 开启子进程  -c执行rollup环境配置，环境变量
  await execa('rollup',['-cw','--environment', `TARGET:${target}`], { stdio: 'inherit' })
}
build('reactivity')