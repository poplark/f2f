import { createApp } from 'vue'
import Layout from './Layout.vue'
import { router } from './router'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import Header from './components/Header/index.vue';
import DateTime from './components/DateTime.vue';
import { store } from './store';


const app = createApp(Layout);
app.use(router);
app.use(ElementPlus);
app.use(store);

app.component('my-header', Header);
app.component('date-time', DateTime);

app.mount('#app');
