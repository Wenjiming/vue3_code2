var VueRuntimeCore = (function (exports) {
  'use strict';

  function createRenderer(renderOptionDom) {
      return {
          createApp(rootComp, rootProps) {
              let app = {
                  mount(container) {
                      console.log(rootComp, rootProps, container, renderOptionDom);
                  }
              };
              return app;
          }
      };
  }

  exports.createRenderer = createRenderer;

  Object.defineProperty(exports, '__esModule', { value: true });

  return exports;

}({}));
//# sourceMappingURL=runtime-core.global.js.map
