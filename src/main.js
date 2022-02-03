import {createApp} from 'vue'
import {createPinia} from "pinia"
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import App from './App.vue'
import {router} from "./routes";

const app = createApp(App);

app.use(router).use(ElementPlus, {
    locale: zhCn
}).use(createPinia()).mount('#app');
