import { createApp } from 'vue';
import Playground from './playground.vue'
import { store } from './store'
import './main.scss';

const app = createApp(Playground);

app.use(store);
app.mount('#app');
