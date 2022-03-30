import { createApp } from 'vue'
import Layout from './Layout.vue'
import { router } from './router'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'


const app = createApp(Layout);
app.use(router);
app.use(ElementPlus);

app.mount('#app');
