import { isFunction } from "@vue/shared";
import  { effect } from './effect'
export function computed(getterOrOptions) {
  // 1)getter函数 2）对象
  let getter,setter;
  if (isFunction(getterOrOptions)) {
    getter = getterOrOptions;
    setter = () => {
      console.warn(`computed value muse be readonly`)
    }
  } else {
    getter = getterOrOptions.get
    setter = getterOrOptions.set
  }
  return new ComputedRefImpl(getter,setter)
}
class ComputedRefImpl {
  public _dirty = true; // 默认获取值时候执行
  public _value;
  public effect; // effect 依赖
  constructor(getter,public setter) {
    this.effect = effect(getter, { 
      lazy: true,
      sch: () => { // 修改数据执行
        if (!this._dirty) this._dirty = true;
        console.log(this._dirty) 
      }
    }) // 默认不执行
  }
  get value() {
    console.log('get-value')
    if (this._dirty) {
      this._dirty = false // 缓存机制
      return this.effect()
    }
  }
  set value(newVal) {
    this.setter(newVal)
  }
}