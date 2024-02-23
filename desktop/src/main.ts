import { createApp } from 'vue';

import ArcoVue from '@arco-design/web-vue';
import ArcoVueIcon from '@arco-design/web-vue/es/icon';
import '@arco-design/web-vue/dist/arco.css';
import 'reset.css'

import router from '@/router';
import App from './App.vue';

main();

function main() {
  const app = createApp(App);
  app.use(router);
  app.use(ArcoVue);
  app.use(ArcoVueIcon);

  app.mount('#app');
}
