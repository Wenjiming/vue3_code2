function proxy(target) {
  return new Proxy(target,{
    get(target,key){
      return target[key]
    },
    set(target,key, value) {
      target[key] = value
    }
  })
}

function deepProxy(obj) {
  let pro = proxy(obj)
  console.log(pro, 'pro')
  for (let key in pro) {
    let data = Reflect.get(pro, key)
    let isObj = typeof data === 'object' && data!=null
    if (isObj) Reflect.set(pro, key, deepProxy(data))
  }
  return pro
}
let a = deepProxy({name: 'wenji',list:[1,2]})
console.log(a);
// 递归 proxy
