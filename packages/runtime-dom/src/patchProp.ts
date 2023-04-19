// 策略模式 div class style a=1 onClick { style: { color: 'red' }} { style: { background: 'red' }}
import{ patchClass } from './modules/class'
import{ patchStyle } from './modules/style'
import{ patchAttr } from './modules/attr'
import { patchEvent } from './modules/event'

export const patchProps = (el,key,prevValue, nextValue) => {
  switch(key) {
    case 'class':
      patchClass(el, nextValue)
      break;
    case 'style':
      patchStyle(el,prevValue, nextValue)
      break;
      default: // 方法
        if (/^on[^a-z]/.test(key)) { // 是不是事件 @onclick
          patchEvent(el, key, nextValue)
        } else {
          patchAttr(el, key, nextValue)
        }
        break;
  }
}