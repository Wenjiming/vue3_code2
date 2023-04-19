import { TrackOpTypes, TriggerOpTypes } from './operations'
import { track, trigger } from './effect'
import { hasOwn, isArray, isIntegerKey, isObject, hasChange } from '@vue/shared'
export function ref(target) {
  return createRef(target)
}

export function shallowRef(target) { // 浅的
  return createRef(target, true)
}
class RefImpl {
  public __v_isRef = true;
  public _value
  constructor(public rawValue, public shallow) {
    this._value = rawValue
  }
  // 类的属性访问器
  get value() {
    track(this, TrackOpTypes.GET, 'value')
    return this._value
  }
  set value(newValue) {
    if (hasChange(this._value, newValue)) {
      let oldValue = this._value
      this._value = newValue
      trigger(this, TriggerOpTypes.SET,'value', newValue, oldValue)
    }
  }
  // 响应式：收集依赖触发更新
}

function createRef(rawValue, shallow = false) {
  return new RefImpl(rawValue, shallow)
}

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

export function toRef(target, key) {
  return new ObjectRefImpl(target, key)
}

export function toRefs(target) {
  let res = isArray(target) ? new Array(target.length) : {}
  for (let key in target) {
    res[key] = toRef(target, key)
  }
  return res
}