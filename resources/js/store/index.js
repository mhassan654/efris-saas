import { createStore } from 'vuex'

const store = createStore({});

const moduleFiles = import.meta.glob('./modules/*.js');
Object.entries(moduleFiles).forEach(([path, module]) => {
  const moduleName = path.replace(/^\.\/(.*)\.\w+$/, '$1');
  module().then((moduleConfig) => {
    store.registerModule(moduleName, moduleConfig.default || moduleConfig);
  });
});

export default store
