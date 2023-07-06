// /**
//  * First we will load all of this project's JavaScript dependencies which
//  * includes Vue and other libraries. It is a great starting point when
//  * building robust, powerful web applications using Vue and Laravel.
//  */

// import './bootstrap';
// import { createApp } from 'vue';

// /**
//  * Next, we will create a fresh Vue application instance. You may then begin
//  * registering components with the application instance so they are ready
//  * to use in your application's views. An example is included for you.
//  */

// const app = createApp({});

// import ExampleComponent from './components/ExampleComponent.vue';
// app.component('example-component', ExampleComponent);

// /**
//  * The following block of code may be used to automatically register your
//  * Vue components. It will recursively scan this directory for the Vue
//  * components and automatically register them with their "basename".
//  *
//  * Eg. ./components/ExampleComponent.vue -> <example-component></example-component>
//  */

// // Object.entries(import.meta.glob('./**/*.vue', { eager: true })).forEach(([path, definition]) => {
// //     app.component(path.split('/').pop().replace(/\.\w+$/, ''), definition.default);
// // });

// /**
//  * Finally, we will attach the application instance to a HTML element with
//  * an "id" attribute of "app". This element is included with the "auth"
//  * scaffolding. Otherwise, you will need to add an element yourself.
//  */

// app.mount('#app');

import { createApp } from 'vue'
import { createI18n } from 'vue-i18n'
import store from './store'
import router from './router'
import { createWebHistory } from 'vue-router'
import  can  from './helpers/can'
import App from './components/App.vue'
// import 'vue2-daterange-picker/dist/vue2-daterange-picker.css'
import VuePageTransition from 'vue-page-transition'
import Clipboard from 'v-clipboard'
import VueMasonry from 'vue-masonry-css'
import VueHtmlToPaper from 'vue-html-to-paper'
// import DateRangePicker from 'vue-mj-daterangepicker'
import vSelect from 'vue-select'
import moment from 'moment'
import VTooltip from 'v-tooltip'

const i18n = createI18n({
  locale: 'en', // Specify your default locale here
})

const app = createApp(App)
// app.provide('store', store);
app.use(i18n)
app.use(store)
app.use(router)
app.use(VuePageTransition)
app.use(Clipboard)
app.use(VueMasonry)
app.use(VueHtmlToPaper, {
  name: '_blank',
  styles: [
    'https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&display=swap',
    window.location.origin + '/css/app.css'
  ],
  timeout: 1000
})
// app.use(DateRangePicker)
app.component('VSelect', vSelect)
app.use(moment)

app.use(VTooltip)
VTooltip.options.defaultTemplate = '<div class="tooltip-vue" role="tooltip"><div class="tooltip-vue-arrow"></div><div class="tooltip-vue-inner"></div></div>'
VTooltip.options.defaultArrowSelector = '.tooltip-vue-arrow, .tooltip-vue__arrow'
VTooltip.options.defaultInnerSelector = '.tooltip-vue-inner, .tooltip-vue__inner'

app.config.productionTip = false
app.config.globalProperties.$can = can

app.mount('#app')
