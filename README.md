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

高阶函数（函数柯里化实现）

 weakMap: key必须是对象，自动垃圾回收
 函数柯里化：固定部分参数，返回一个接受剩余参数的函数
            根据不同的参数处理不同的逻辑，返回新的函数

effect
1)视图中获取数据 触发get 收集effect
2)修改数据 触发 set 执行 effect

reactive
proxy 懒代理，嵌套多层，使用到的再设置代理
 
effect: 依赖

流程：
1）数据第一层定义proxy,懒代理（嵌套多层，使用到的再设置代理）
2）访问数据，触发get, 设置代理，收集依赖(effect) track函数收集依赖
3）修改数据 触发set 执行effect trigger触发执行依赖

state = reactive({ list: [1,2,3] })
// {{ state.list }} // 页面依赖 targetMap(weakMap) = { { list: [1,2,3] } : Map({ list: Set({}) })} ,target: state.list
// state.list[3] = 2 超出索引设置值，不会触发更新
state.list[3] = 2设置完值后，target = [1,2,3,2],不存在对应依赖不会更新

结论：通过数组索引更改数组值，target不一致，state.list的target为state
      通过索引更改数组，target为最新数组
      使用target作为key,获取不到对应Map
      .push,.pop,.shift,.unshift方法同上

state.list.length
实际为两个依赖，state.list state.list.length 

.slice不会改变原数组，不会触发依赖更新

ref: 原理 Object.defineProperty proxy必须是对象
返回是一个对象

constructor(public target, public shall) {
       // 等价于 this.target = target this.shall = shall
  }

toRef: 将目标对象属性值变成ref对象
toRef(target, key)

普通对象，然后toRef,不是响应式
reactive定义对象，然后toRef，是响应式
原因：1）const state = reactive({ age: 10 }) state = proxy对象
      2) const stateRef = toRef(proxy对象, key),得到ObjectRefImpl实例
      3)通过stateRef.value 触发get,访问proxy对象[key],从而触发proxy的get方法，收集依赖，stateRef.value值改变的时候更新依赖

      class ObjectRefImpl {
        public __v_isRef = true;
        constructor(public target, public key) {
        }
        get value() {
            return this.target[this.key]
        }
        set value(newVal) {
            this.target[this.key] = newVal
        }
      }
computed特性
1）懒执行，computed定义了不使用，不会执行， 
2）缓存机制（_dirty属性实现）

let age = ref(10)
let myAge = computed(() => age.value + 10)
console.log(myAge.value) // 使用了执行computed

setTimeout(() => {
    age.value = 20 // 未使用不会执行
    // console.log(myAge.value) // 使用了执行computed
}, 1000)

vue3兼容vue2写法

const App = {
    data() {
        return {
            a: 1
        }
    },
    render(a,this) {
        // a === this true
        // a => Proxy(组件中定义的属性合并) this => Proxy
        return h('div',{style: { color: 'red' }}, 'hello')
    }
    // setup中可以直接返回函数包裹h函数
    setup() {
        const state = { age: 10 }
        const fn = state.age++
        return () => {
            return h('div',{style: { color: 'red' }, onClick: fn }, `hello${state.age}`)
    }
        }
}
runtime-dom: 操作dom相关（挂载，h函数等）
createRenderer的作用是： 实现vue3的runtime-core的核心，不只是仅仅的渲染到dom上，还可以渲染到canvas,webview等指定的平台