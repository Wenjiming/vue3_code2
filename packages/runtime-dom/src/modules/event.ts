
// 事件 @click="fn" @click="fn1"
// 一个元素的绑定事件 addEventListener ,不能直接覆盖
// 缓存（click:fn)
export const patchEvent = (el,key,value) => {
  // 1.对函数缓存
  const invokers = el._vei || (el._vei = {})
  const exists = invokers[key]
  if (exists && value) {
    exists.value = value; // 指向最新的事件
  } else {
    // 获取事件名称 1）新的有 2）新的没有
    const eventName = key.slice(2).toLowerCase()
    if (value) {
      let invoker = invokers[eventName] = createInvoker(value)
      el.addEventListener(eventName, invoker)
    } else {// 没有 删除
      el.removeEventListener(eventName, exists)
      invokers[eventName] = undefined;
    }
  }
}
function createInvoker(value) {
  const fn = (e) => {
    fn.value(e)
  }
  fn.value = value;
  return fn;
}