import { createApp } from "vue";
import { createPinia } from "pinia";
import Antd from "ant-design-vue";
import App from "./App.vue";
import { router } from "@/router";

import "ant-design-vue/dist/antd.css";
import * as Icons from '@ant-design/icons-vue'

import * as buffer from 'buffer';

//解决浏览器没有node环境的Buffer包
if (typeof (window as any).global === 'undefined') {
    (window as any).global = window;
}
if (typeof (window as any).Buffer === 'undefined') {
    (window as any).Buffer = buffer.Buffer
}

const app = createApp(App);

for (const i in Icons) {
    //@ts-ignore
    app.component(i, Icons[i])
}
app.config.globalProperties.$antIcons = Icons

app.use(createPinia());
app.use(router);
app.use(Antd);
app.mount("#app");
