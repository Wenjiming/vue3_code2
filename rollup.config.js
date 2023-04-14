// 通过rollup打包

// 1）引入相关依赖

import ts from 'rollup-plugin-typescript2'
import json from '@rollup/plugin-json'
import resolvePlugin from '@rollup/plugin-node-resolve'
import path from 'path'

// 2)获取文件路径
let packagesDir = path.resolve(__dirname, 'packages')

// 2.1)获取需要打包的包
let packageDir = path.resolve(packagesDir, process.env.TARGET)

// 2.2)获取每个包的项目配置
const resolve = p => path.resolve(packageDir, p)
const pkg = require(resolve(`package.json`))
const packageOptions = pkg.buildOptions || {}
const name = packageOptions.filename || path.basename(packageDir)
console.log(packageOptions, 'packageOptions')

const outputConfigs = {
  'esm-bundler': {
    file: resolve(`dist/${name}.esm-bundler.js`),
    format: `es`
  },
  cjs: {
    file: resolve(`dist/${name}.cjs.js`),
    format: `cjs`
  },
  global: {
    file: resolve(`dist/${name}.global.js`),
    format: `iife`
  },
}
function createConfig(format, output, plugins = []) {
  output.name = packageOptions.name
  output.sourcemap = true // 方便查看源码
  return {
    input: resolve('src/index.ts'),
    output,
    plugins: [json(),ts({
      tsconfig: path.resolve(__dirname, 'tsconfig.json')
    }),
    resolvePlugin()
  ]
  }
}
export default packageOptions.formats.map(format => createConfig(format, outputConfigs[format]))