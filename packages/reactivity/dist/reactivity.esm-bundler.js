const isObject = (param) => typeof param === 'object' && param != 'null';

function createGetter(isReadOnly = false, shall = false) {
    return function get(target, key, receiver) {
        let res = Reflect.get(target, key, receiver);
        if (shall) { // 浅
            return res;
        }
        if (isObject(res)) { // 懒代理 { list: { name: 'wenji' }} 懒代理.list对象，
            // 不使用数据，不取到.list,.list就不会生成proxy对象，懒代理
            return isReadOnly ? readonly(res) : reactive(res);
        }
        return res;
    };
}
function createSetter(shall = false) {
    return function set(target, key, value, receiver) {
        let res = Reflect.set(target, key, value, receiver);
        // 触发更新
        return res;
    };
}
const get = createGetter();
const shallowReactiveGet = createGetter(false, true);
const shallowReadonlyGet = createGetter(true, true);
const readonlyGet = createGetter(true, false);
const set = createSetter();
const shallowSet = createSetter(true);
const reactiveHandlers = {
    get,
    set
};
const shallowReactiveHandlers = {
    get: shallowReactiveGet,
    set: shallowSet
};
const shallowReadonlyHandlers = {
    get: shallowReadonlyGet,
    set: (target, key, value) => {
        console.log(`set key on fail:${key}`);
    }
};
const readonlyHandlers = {
    get: readonlyGet,
    set: (target, key, value) => {
        console.log(`set key on fail:${key}`);
    }
};

const reactiveMap = new WeakMap();
const readonlyMap = new WeakMap();
function createReactiveObj(target, isReadOnly, baseHandlers) {
    if (!isObject(target)) {
        return target;
    }
    const map = isReadOnly ? readonlyMap : reactiveMap;
    let targetProxy = map.get(target);
    if (targetProxy) { // 优化， 避免重复访问属性，reactive调用，重复proxy
        console.log(targetProxy, '触发了');
        return targetProxy;
    }
    const proxy = new Proxy(target, baseHandlers);
    map.set(target, proxy);
    return proxy;
}
function reactive(target) {
    return createReactiveObj(target, false, reactiveHandlers);
}
function shallowReactive(target) {
    return createReactiveObj(target, false, shallowReactiveHandlers);
}
function shallowReadonly(target) {
    return createReactiveObj(target, false, shallowReadonlyHandlers);
}
function readonly(target) {
    return createReactiveObj(target, true, readonlyHandlers);
}

export { reactive, readonly, shallowReactive, shallowReadonly };
//# sourceMappingURL=reactivity.esm-bundler.js.map
