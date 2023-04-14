import { isObject } from '@vue/shared'
import { reactiveHandlers, shallowReactiveHandlers, shallowReadonlyHandlers, readonlyHandlers } from './baseHandler'

const reactiveMap = new WeakMap()
const readonlyMap = new WeakMap()

function createReactiveObj(target,isReadOnly,baseHandlers) {
  if (!isObject(target)) {
    return target
  }
  const map = isReadOnly ? readonlyMap : reactiveMap
  let targetProxy = map.get(target)
  if (targetProxy) { // 优化， 避免重复访问属性，reactive调用，重复proxy
    console.log(targetProxy, '触发了')
    return targetProxy
  }
  const proxy = new Proxy(target, baseHandlers)
  map.set(target, proxy)
  return proxy
}
function reactive(target){
  return createReactiveObj(target,false, reactiveHandlers)
}
function shallowReactive(target){
  return createReactiveObj(target,false, shallowReactiveHandlers)
}
function shallowReadonly(target){
  return createReactiveObj(target,false, shallowReadonlyHandlers)
}
function readonly(target){
  return createReactiveObj(target,true, readonlyHandlers)
}

export {
  reactive,
  shallowReactive,
  shallowReadonly,
  readonly
}






