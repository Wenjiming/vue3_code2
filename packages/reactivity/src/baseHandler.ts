

import { hasOwn, isArray, isIntegerKey, isObject, hasChange } from '@vue/shared'
import {
  reactive,
  shallowReactive,
  shallowReadonly,
  readonly
} from './reactive'
import { TrackOpTypes, TriggerOpTypes } from './operations'
import { track, trigger } from './effect'

function createGetter (isReadOnly = false, shall = false) {
  return function get(target, key, receiver) {
    let res = Reflect.get(target, key, receiver)
    if (!isReadOnly) {
      // 收集依赖
      track(target, TrackOpTypes.GET, key)
    }
    if (shall) { // 浅
      return res
    }
    if (isObject(res)) { // 懒代理 { list: { name: 'wenji' }} 懒代理.list对象，
      // 不使用数据，不取到.list,.list就不会生成proxy对象，懒代理
      return isReadOnly ? readonly(res): reactive(res)
    }
    return res
  }
}
function createSetter(shall = false) {
  return function set(target, key, value, receiver) {
    const oldValue = target[key] // 获取老值要在设置新值之前
    let res = Reflect.set(target, key, value, receiver)
    // 触发更新
    // 1)数组或对象 2）添加值还是修改值
    let hasKey = isArray(target) && isIntegerKey(key) ? Number(key) < target.length : hasOwn(target, key)
    if (!hasKey) { // 新增
      trigger(target, TriggerOpTypes.ADD,key, value)
    } else { // 修改
      if (hasChange(value, oldValue)) {
        trigger(target, TriggerOpTypes.SET,key, value, oldValue)
      }
    }
    return res
  }
}
const get = createGetter()
const shallowReactiveGet = createGetter(false, true)
const shallowReadonlyGet = createGetter(true, true)
const readonlyGet = createGetter(true, false)

const set = createSetter()
const shallowSet = createSetter(true)
const reactiveHandlers = {
  get,
  set
}
const shallowReactiveHandlers = {
  get: shallowReactiveGet,
  set: shallowSet
}
const shallowReadonlyHandlers = {
  get: shallowReadonlyGet,
  set: (target, key, value) => {
    console.log(`set key on fail:${key}`)
  }
}
const readonlyHandlers = {
  get: readonlyGet,
  set: (target, key, value) => {
    console.log(`set key on fail:${key}`)
  }
}

export { reactiveHandlers, shallowReactiveHandlers, shallowReadonlyHandlers, readonlyHandlers }