// import Vue from 'vue'
// import Vuex from 'vuex'

// Vue.use(Vuex)

// // Load store modules dynamically.
// const requireContext = require.context('./modules', false, /.*\.js$/)

// const modules = requireContext.keys()
//   .map(file =>
//     [file.replace(/(^.\/)|(\.js$)/g, ''), requireContext(file)]
//   )
//   .reduce((modules, [name, module]) => {
//     if (module.namespaced === undefined) {
//       module.namespaced = true
//     }

//     return { ...modules, [name]: module }
//   }, {})

// export default new Vuex.Store({
//   modules
// })

import { createApp } from 'vue'
import { createStore } from 'vuex'
import * as store from './modules'

// Load store modules dynamically.
// const requireContext = require.context('./modules', false, /.*\.js$/)

// const modules = requireContext.keys()
//   .map(file =>
//     [file.replace(/(^.\/)|(\.js$)/g, ''), requireContext(file)]
//   )
//   .reduce((modules, [name, module]) => {
//     if (module.namespaced === undefined) {
//       module.namespaced = true
//     }

//     return { ...modules, [name]: module.default }
//   }, {})

// const store = createStore({
//   modules
// })

// const app = createApp({})
// app.use(store)

// app.mount('#app')
export default store