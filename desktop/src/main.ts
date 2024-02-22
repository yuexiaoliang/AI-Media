import { createApp } from 'vue';
import App from './App.vue';
import router from '@/router';

main();

function main() {
  const app = createApp(App);
  app.use(router);

  app.mount('#app')
}
