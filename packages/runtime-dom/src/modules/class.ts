export const patchClass = (el, value) => {
  if(value === null) {
    return value = ''
  }
  el.className = value
}