<!-- <template>
  <div id="app">
    <loading ref="loading" />
    <transition name="page" mode="out-in">
      <component :is="layout" v-if="layout" />
    </transition>
  </div>
</template>

<script>
import Loading from './Loading.vue'

// Load layout components dynamically.
const requireContext = require.context('~/layouts', false, /.*\.vue$/)

const layouts = requireContext
  .keys()
  .map((file) => [file.replace(/(^.\/)|(\.vue$)/g, ''), requireContext(file)])
  .reduce((components, [name, component]) => {
    components[name] = component.default || component
    return components
  }, {})


export default {
  el: '#app',

  components: {
    Loading,
  },

  data: () => ({
    layout: null,
    defaultLayout: 'default',
  }),

  metaInfo() {
    const { appName } = window.config

    return {
      title: appName,
      titleTemplate: `%s · ${appName}`,
    }
  },

  mounted() {
    this.$loading = this.$refs.loading
    this.getSettings()
  },

  methods: {
    // get settings
    async getSettings() {
      await this.$store.dispatch('operations/fetchSettingData')
    },

    /**
     * Set the application layout.
     *
     * @param {String} layout
     */
    setLayout(layout) {
      if (!layout || !layouts[layout]) {
        layout = this.defaultLayout
      }

      this.layout = layouts[layout]
    },
  },
}
</script> -->
<template>
    <div id="app">
      <loading ref="loading" />
      <transition name="page" mode="out-in">
        <component :is="layout" v-if="layout" />
      </transition>
    </div>
  </template>

  <script>
  import { ref, onMounted } from 'vue';
  import Loading from './Loading.vue';
  import store from '../store'

  // Load layout components dynamically.
  const layoutFiles = import.meta.glob('./layouts/*.vue');
  const layouts = {};

  for (const file in layoutFiles) {
    layoutFiles[file]().then((module) => {
      const component = module.default || module;
      const name = file.replace(/^\.\//, '').replace(/\.vue$/, '');
      layouts[name] = component;
    });
  }

  export default {
    el: '#app',
    components: {
      Loading,
    },

    setup() {
      const loadingRef = ref(null);
      const layout = ref(null);
      const defaultLayout = 'default';

      const getSettings = async () => {
        console.log(store)
        await store.dispatch("operations/fetchSettingData");
      };

      const setLayout = (layout) => {
        if (!layout || !layouts[layout]) {
          layout = defaultLayout;
        }

        layout.value = layouts[layout];
      };

      onMounted(() => {
        loadingRef.value = true;
        getSettings();
      });

      return {
        loading: loadingRef,
        layout,
        setLayout,
      };
    },
  };
  </script>
