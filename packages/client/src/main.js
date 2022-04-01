import { createApp } from 'vue'
import Layout from './Layout.vue'
import { router } from './router'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import Header from './components/Header.vue';


const app = createApp(Layout);
app.use(router);
app.use(ElementPlus);

app.component('my-header', Header);

app.mount('#app');
