export function createRenderer(renderOptionDom) {
  return {
    createApp(rootComp, rootProps) {
      let app = {
        mount(container) {
          console.log(rootComp, rootProps, container, renderOptionDom)
        }
      }
      return app
    }
  }
}