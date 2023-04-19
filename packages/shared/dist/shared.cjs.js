'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const isObject = (param) => typeof param === 'object' && param != 'null';
const extend = Object.assign;
const isArray = Array.isArray;
const isFunction = (val) => typeof val === 'function';
const isString = (val) => typeof val === 'string';
const isNumber = (val) => typeof val === 'number';
const hasOwnProperty = Object.prototype.hasOwnProperty;
const hasOwn = (val, key) => hasOwnProperty.call(val, key);
const isIntegerKey = (key) => isString(key) &&
    key !== 'NaN' &&
    key[0] !== '-' &&
    '' + parseInt(key, 10) === key;
const hasChange = (val, oldVal) => {
    return val != oldVal;
};

exports.extend = extend;
exports.hasChange = hasChange;
exports.hasOwn = hasOwn;
exports.isArray = isArray;
exports.isFunction = isFunction;
exports.isIntegerKey = isIntegerKey;
exports.isNumber = isNumber;
exports.isObject = isObject;
exports.isString = isString;
//# sourceMappingURL=shared.cjs.js.map
