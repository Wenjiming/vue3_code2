// 操作dom 1)节点 2）属性
import { extend } from "@vue/shared"
import { nodeOps } from './nodeOps'
import { patchProps } from './patchProp'

function createRenderer() {

}
const renderOptionDom = extend({patchProps}, nodeOps)
export const createApp = (rootComp, rootProps) => {
  // 不同平台操作dom不同
  let app: any = createRenderer(renderOptionDom).createApp(rootComp, rootProps)
  let { mount } = app;
  app.mount = (container) => {
    container = nodeOps.querySelector(container)
    container.innerHTML = ''
    // dom元素挂载
    mount(container)
  }
return app
}
// export {
//   renderOptionDom
// }