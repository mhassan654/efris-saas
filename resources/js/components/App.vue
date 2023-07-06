<template>
    <div id="app">
      <loading ref="loading" />
<!--      <transition name="page" mode="out-in">-->
        <component :is="layout" v-if="layout" />
<!--      </transition>-->
    </div>
  </template>

  <script>
  import { ref, onMounted,inject } from 'vue';
  import Loading from './Loading.vue';
  // import store from '../store'

  // Load layout components dynamically.
  const layoutFiles =  import.meta.glob('../layouts/*.vue');

  const layouts = {};

  for (const file in layoutFiles) {
    layoutFiles[file]().then((module) => {
      const component = module.default || module;
      const name = file.replace(/^\.\//, '').replace(/\.vue$/, '');
      // console.log(name)
      layouts[name] = component;
      // console.log( layouts[name])
    });
  }

  export default {
    el: '#app',
    components: {
      Loading,
    },

    setup() {
        // Inject the store property
        // const store = inject('store');
      const loadingRef = ref(null);
      const layout = ref(null);
      const defaultLayout = 'default';

      // const getSettings = async () => {
      //   console.log(store)
      //   await store.dispatch("fetchSettingData");
      // };

      const setLayout = (layout) => {
        if (!layout || !layouts[layout]) {
          layout = defaultLayout;
        }

        layout.value = layouts[layout];
      };

      onMounted(() => {
        loadingRef.value = true;
        // getSettings();
      });

      return {
        loading: loadingRef,
        layout,
        setLayout,
      };
    },
  };
  </script>
