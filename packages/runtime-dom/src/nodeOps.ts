// 操作节点 增删改查
export const nodeOps = {
  // vue会根据不同平台创建元素
  createElement: tagName => document.createElement(tagName),
  remove: child => {
    let parent = child.parentNode;
    if (parent) {
      parent.remove(child)
    }
  },
  insert(child,parent,ancher = null){
    parent.insertBefore(child,ancher) // ancher=null，appendChild
  },
  querySelector(selector) {
    return document.querySelector(selector)
  },
  setElementText: (el,text) => el.textContent = text,
  createText: text => document.createTextNode(text),
  setText: (node,text) => node.nodeValue = text,
}