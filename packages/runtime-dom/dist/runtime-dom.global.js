var VueRuntimeDom = (function (exports) {
  'use strict';

  const extend = Object.assign;

  // 操作节点 增删改查
  const nodeOps = {
      // vue会根据不同平台创建元素
      createElement: tagName => document.createElement(tagName),
      remove: child => {
          let parent = child.parentNode;
          if (parent) {
              parent.remove(child);
          }
      },
      insert(child, parent, ancher = null) {
          parent.insertBefore(child, ancher); // ancher=null，appendChild
      },
      querySelector(selector) {
          return document.querySelector(selector);
      },
      setElementText: (el, text) => el.textContent = text,
      createText: text => document.createTextNode(text),
      setText: (node, text) => node.nodeValue = text,
  };

  const patchClass = (el, value) => {
      if (value === null) {
          return value = '';
      }
      el.className = value;
  };

  const patchStyle = (el, prev, next) => {
      const style = el.style;
      if (next === null) {
          el.removeAttribute('style');
      }
      else {
          // 老的有， 新的没有
          if (prev) {
              for (let key in prev) {
                  if (next[key] === null) {
                      style[key] = '';
                  }
              }
          }
          // 新的有，老的没有 => 把新的赋值给老的
          for (let key in next) {
              style[key] = next[key];
          }
      }
  };

  // 自定义属性
  const patchAttr = (el, key, value) => {
      if (value === null) {
          el.removeAttribute(key);
      }
      else {
          el.setAttribute(key, value);
      }
  };

  // 事件 @click="fn" @click="fn1"
  // 一个元素的绑定事件 addEventListener ,不能直接覆盖
  // 缓存（click:fn)
  const patchEvent = (el, key, value) => {
      // 1.对函数缓存
      const invokers = el._vei || (el._vei = {});
      const exists = invokers[key];
      if (exists && value) {
          exists.value = value; // 指向最新的事件
      }
      else {
          // 获取事件名称 1）新的有 2）新的没有
          const eventName = key.slice(2).toLowerCase();
          if (value) {
              let invoker = invokers[eventName] = createInvoker(value);
              el.addEventListener(eventName, invoker);
          }
          else { // 没有 删除
              el.removeEventListener(eventName, exists);
              invokers[eventName] = undefined;
          }
      }
  };
  function createInvoker(value) {
      const fn = (e) => {
          fn.value(e);
      };
      fn.value = value;
      return fn;
  }

  // 策略模式 div class style a=1 onClick { style: { color: 'red' }} { style: { background: 'red' }}
  const patchProps = (el, key, prevValue, nextValue) => {
      switch (key) {
          case 'class':
              patchClass(el, nextValue);
              break;
          case 'style':
              patchStyle(el, prevValue, nextValue);
              break;
          default: // 方法
              if (/^on[^a-z]/.test(key)) { // 是不是事件 @onclick
                  patchEvent(el, key, nextValue);
              }
              else {
                  patchAttr(el, key, nextValue);
              }
              break;
      }
  };

  // 操作dom 1)节点 2）属性
  function createRenderer(renderOptionDom) {
      return {
          createApp(rootComp, rootProps) {
              let app = {
                  mount(container) {
                  }
              };
              return app;
          }
      };
  }
  extend({ patchProps }, nodeOps);
  const createApp = (rootComp, rootProps) => {
      // 不同平台操作dom不同
      let app = createRenderer().createApp(rootComp, rootProps);
      let { mount } = app;
      app.mount = (container) => {
          container = nodeOps.querySelector(container);
          container.innerHTML = '';
          // dom元素挂载
          mount(container);
      };
      return app;
  };
  // export {
  //   renderOptionDom
  // }

  exports.createApp = createApp;

  Object.defineProperty(exports, '__esModule', { value: true });

  return exports;

}({}));
//# sourceMappingURL=runtime-dom.global.js.map
