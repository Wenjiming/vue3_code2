import { isArray, isIntegerKey } from "@vue/shared";
import { TrackOpTypes, TriggerOpTypes } from './operations'

export function effect(fn, options: any = {}) {
  const effect = createReactEffect(fn, options)

  if (!options.lazy) {
    effect()
  }
  return effect
}
let uid = 0;
let activeEffect; // 保存当前的effect
let effectstack = []
function createReactEffect(fn, options) {
  const effect = function reactiveEffect() {
    if (!effectstack.includes(effect)) { // 重复修改相同属性，状态合并
      try {
        effectstack.push(effect)
        activeEffect = effect
        return fn() // computed需要
      } finally {
        effectstack.pop()
        activeEffect = effectstack[effectstack.length - 1]
      }
    }
  }
  effect.uid = uid++; // 区别不同effect
  effect._isEffect = true // 区别effect是不是响应式的effect
  effect.raw = fn; // 保存依赖回调
  effect.options = options; // 保存传入属性
  return effect
}

let targetMap = new WeakMap()
export function track(target, type, key) {
  // key activeEffect 一一对应
  /**
   * WeakMap(
   * {
   *    target: Map({
   *      key: Set({ effect1, effect2 })
   *    })
   * }
   * )
   */

  // { name : '' }
  // 1）定义未使用 2）非响应式数据(访问state.age)
  if (activeEffect === undefined) {
    return
  }
  let depMap = targetMap.get(target)
  if (!depMap) {
    targetMap.set(target, (depMap = new Map))
  }
  let dep = depMap.get(key)
  if (!dep) {
    depMap.set(key, (dep = new Set))
  }
  if (!dep.has(activeEffect)) {
    dep.add(activeEffect)
  }
  console.log(targetMap, 'targetMap')
}

/** effect可以树形结构，增加栈处理
 * 保存问题，activeEffect只保存了当前的
 * effect(()=>{ // effect1
  //收集的 effect1
    state .name
    effect(()=> { //effect2
      state.age//effect2
    }) 
    state.age // effect1
  })
 * 
 */

export function trigger(target,type,key, value?, oldValue?) {
  let depsMap = targetMap.get(target)
  if (!depsMap) return; // 根据target找到对应依赖，找不到不更新
  const effectSet = new Set()
  const add = (effectAdd) => {
    if (effectAdd) {
      effectAdd.forEach(effect => effectSet.add(effect))
    }
  }
  // 通过length属性，直接修改数组
  if (key === 'length' && isArray(target)) {
    const newLength = Number(value)
    depsMap.forEach((dep, effectPro) => {
      // state = { list: [1,2,3] }
      
      // 依赖使用①：state.list.length effectPro = 'length'
      // state.list.length = 1

      // 依赖使用②：state.list[2] effectPro = 2, 数组变短执行effect,获取到最新（undefined）
      // state.list.length = 1 dep: 不同effectPro的依赖Set({]})
      // 如果更改长度小于依赖收集索引，需要重新执行effect
      if (effectPro === 'length' || effectPro>=newLength) {
        add(dep)
      }
    })
  } else { // 对象
    if (key!=undefined) {
      add(depsMap.get(key))
    }
    switch(type) {
      case TriggerOpTypes.ADD: // 新增
        if(isIntegerKey(key) && isArray(target)) {
          add(depsMap.get('length'))
        }
        break;
        case TriggerOpTypes.DELETE:
          // if (!isArray(target)) {
          //   deps.push(depsMap.get(ITERATE_KEY))
          //   if (isMap(target)) {
          //     deps.push(depsMap.get(MAP_KEY_ITERATE_KEY))
          //   }
          // }
          break;
          // ADD DEL SET ??
    }
  }
  effectSet.forEach((effect:any) => {
    if (effect.options.sch) {
      effect.options.sch(effect) // _dirty = true, computed, 不会主动触发effect执行
    } else {
      effect()
    }
  })
}