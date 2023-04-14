multirepo 指的是将模块分为多个仓库，monorepo 指的是将多个模块放在一个仓库中。

lerna 是一个管理工具，用于管理包含多个软件包（package）的 JavaScript 项目

lerna 可以帮我们解决如下几个痛点:
    多个仓库之间可以管理管理公共的依赖包，或者单独管理各自的依赖包
    方便模块之间的相互引用，模块之间的调试不必发版本，lerna内部会自动进行link
    lerna提供了两种模式，支持选择单独针对某个包发版本或者统一发版本
    多个仓库之间可以共享统一的代码规范，版本管理更加规范
https://www.iwhalecloud.com/news1/shownews.php?id=293

"private": true,
"workspaces": ["packages/*"],

设置为momorepo模式
yarn workspaces 是 yarn 提供的 monorepo 的依赖管理机制

yarn init
与 npm init 一样通过交互式会话创建一个 package.json

yarn init
跳过会话，直接通过默认值生成 package.json

yarn init --yes 简写 yarn init -y
初始化项目

公共模块安装到最外层package.json

 安装ts,执行npx tsc --init,生成tsconfig.ts
 tsc.cmd
 ts ^4.4.2
 yarn add rollup@2.56.3 rollup-plugin-typescript2@0.30.0
 @rollup/plugin-node-resolve@13.0.4 (处理第三方插件的)
 @rollup/plugin-json@4.1.0 execa@5.1.1 -D -W
 execa(node 多个子进程，打包时同时打包多个模块)

 打包：格式 
 "esm-bundler", es6打包成es5
 "cjs", commonjs(node)
 "global" window

 cls 清屏cmd,vscode

 weakMap: key必须是对象，自动垃圾回收
 函数柯里化：固定部分参数，返回一个接受剩余参数的函数
            根据不同的参数处理不同的逻辑，返回新的函数

effect
1)视图中获取数据 触发get 收集effect
2)修改数据 触发 set 执行 effect