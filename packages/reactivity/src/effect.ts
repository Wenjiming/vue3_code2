export function effect(fn, options: any = {}) {
  const effect = createReactEffect(fn, options)

  if (!options.lazy) {
    effect()
  }
  return effect
}
let uid = 0;
function createReactEffect(fn, options) {
  const effect = function reactiveEffect() {
    fn()
  }
  effect.uid = uid++; // 区别不同effect
  effect._isEffect = true // 区别effect是不是响应式的effect
  effect.raw = fn; // 保存依赖回调
  effect.options = options; // 保存传入属性
  return effect
}