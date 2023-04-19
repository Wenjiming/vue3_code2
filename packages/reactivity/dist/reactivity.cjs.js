'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const isObject = (param) => typeof param === 'object' && param != 'null';
const isArray = Array.isArray;
const isFunction = (val) => typeof val === 'function';
const isString = (val) => typeof val === 'string';
const hasOwnProperty = Object.prototype.hasOwnProperty;
const hasOwn = (val, key) => hasOwnProperty.call(val, key);
const isIntegerKey = (key) => isString(key) &&
    key !== 'NaN' &&
    key[0] !== '-' &&
    '' + parseInt(key, 10) === key;
const hasChange = (val, oldVal) => {
    return val != oldVal;
};

function effect(fn, options = {}) {
    const effect = createReactEffect(fn, options);
    if (!options.lazy) {
        effect();
    }
    return effect;
}
let uid = 0;
let activeEffect; // 保存当前的effect
let effectstack = [];
function createReactEffect(fn, options) {
    const effect = function reactiveEffect() {
        if (!effectstack.includes(effect)) { // 重复修改相同属性，状态合并
            try {
                effectstack.push(effect);
                activeEffect = effect;
                return fn(); // computed需要
            }
            finally {
                effectstack.pop();
                activeEffect = effectstack[effectstack.length - 1];
            }
        }
    };
    effect.uid = uid++; // 区别不同effect
    effect._isEffect = true; // 区别effect是不是响应式的effect
    effect.raw = fn; // 保存依赖回调
    effect.options = options; // 保存传入属性
    return effect;
}
let targetMap = new WeakMap();
function track(target, type, key) {
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
        return;
    }
    let depMap = targetMap.get(target);
    if (!depMap) {
        targetMap.set(target, (depMap = new Map));
    }
    let dep = depMap.get(key);
    if (!dep) {
        depMap.set(key, (dep = new Set));
    }
    if (!dep.has(activeEffect)) {
        dep.add(activeEffect);
    }
    console.log(targetMap, 'targetMap');
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
function trigger(target, type, key, value, oldValue) {
    let depsMap = targetMap.get(target);
    if (!depsMap)
        return; // 根据target找到对应依赖，找不到不更新
    const effectSet = new Set();
    const add = (effectAdd) => {
        if (effectAdd) {
            effectAdd.forEach(effect => effectSet.add(effect));
        }
    };
    // 通过length属性，直接修改数组
    if (key === 'length' && isArray(target)) {
        const newLength = Number(value);
        depsMap.forEach((dep, effectPro) => {
            // state = { list: [1,2,3] }
            // 依赖使用①：state.list.length effectPro = 'length'
            // state.list.length = 1
            // 依赖使用②：state.list[2] effectPro = 2, 数组变短执行effect,获取到最新（undefined）
            // state.list.length = 1 dep: 不同effectPro的依赖Set({]})
            // 如果更改长度小于依赖收集索引，需要重新执行effect
            if (effectPro === 'length' || effectPro >= newLength) {
                add(dep);
            }
        });
    }
    else { // 对象
        if (key != undefined) {
            add(depsMap.get(key));
        }
        switch (type) {
            case "add" /* TriggerOpTypes.ADD */: // 新增
                if (isIntegerKey(key) && isArray(target)) {
                    add(depsMap.get('length'));
                }
                break;
            // ADD DEL SET ??
        }
    }
    effectSet.forEach((effect) => {
        if (effect.options.sch) {
            effect.options.sch(effect); // _dirty = true, computed, 不会主动触发effect执行
        }
        else {
            effect();
        }
    });
}

function createGetter(isReadOnly = false, shall = false) {
    return function get(target, key, receiver) {
        let res = Reflect.get(target, key, receiver);
        if (!isReadOnly) {
            // 收集依赖
            track(target, "get" /* TrackOpTypes.GET */, key);
        }
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
        const oldValue = target[key]; // 获取老值要在设置新值之前
        let res = Reflect.set(target, key, value, receiver);
        // 触发更新
        // 1)数组或对象 2）添加值还是修改值
        let hasKey = isArray(target) && isIntegerKey(key) ? Number(key) < target.length : hasOwn(target, key);
        if (!hasKey) { // 新增
            trigger(target, "add" /* TriggerOpTypes.ADD */, key, value);
        }
        else { // 修改
            if (hasChange(value, oldValue)) {
                trigger(target, "set" /* TriggerOpTypes.SET */, key, value);
            }
        }
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

function ref(target) {
    return createRef(target);
}
class RefImpl {
    rawValue;
    shallow;
    __v_isRef = true;
    _value;
    constructor(rawValue, shallow) {
        this.rawValue = rawValue;
        this.shallow = shallow;
        this._value = rawValue;
    }
    // 类的属性访问器
    get value() {
        track(this, "get" /* TrackOpTypes.GET */, 'value');
        return this._value;
    }
    set value(newValue) {
        if (hasChange(this._value, newValue)) {
            this._value;
            this._value = newValue;
            trigger(this, "set" /* TriggerOpTypes.SET */, 'value', newValue);
        }
    }
}
function createRef(rawValue, shallow = false) {
    return new RefImpl(rawValue, shallow);
}
class ObjectRefImpl {
    target;
    key;
    __v_isRef = true;
    constructor(target, key) {
        this.target = target;
        this.key = key;
    }
    get value() {
        return this.target[this.key];
    }
    set value(newVal) {
        this.target[this.key] = newVal;
    }
}
function toRef(target, key) {
    return new ObjectRefImpl(target, key);
}
function toRefs(target) {
    let res = isArray(target) ? new Array(target.length) : {};
    for (let key in target) {
        res[key] = toRef(target, key);
    }
    return res;
}

function computed(getterOrOptions) {
    // 1)getter函数 2）对象
    let getter, setter;
    if (isFunction(getterOrOptions)) {
        getter = getterOrOptions;
        setter = () => {
            console.warn(`computed value muse be readonly`);
        };
    }
    else {
        getter = getterOrOptions.get;
        setter = getterOrOptions.set;
    }
    return new ComputedRefImpl(getter, setter);
}
class ComputedRefImpl {
    setter;
    _dirty = true; // 默认获取值时候执行
    _value;
    effect; // effect 依赖
    constructor(getter, setter) {
        this.setter = setter;
        this.effect = effect(getter, {
            lazy: true,
            sch: () => {
                if (!this._dirty)
                    this._dirty = true;
                console.log(this._dirty);
            }
        }); // 默认不执行
    }
    get value() {
        console.log('get-value');
        if (this._dirty) {
            this._dirty = false; // 缓存机制
            return this.effect();
        }
    }
    set value(newVal) {
        this.setter(newVal);
    }
}

exports.computed = computed;
exports.effect = effect;
exports.reactive = reactive;
exports.readonly = readonly;
exports.ref = ref;
exports.shallowReactive = shallowReactive;
exports.shallowReadonly = shallowReadonly;
exports.toRef = toRef;
exports.toRefs = toRefs;
//# sourceMappingURL=reactivity.cjs.js.map
