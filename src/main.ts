import { createApp } from "vue";
import { createPinia } from "pinia";
import Antd from "ant-design-vue";
import App from "./App.vue";
import { router } from "@/router";

import "ant-design-vue/dist/antd.css";
import * as Icons from '@ant-design/icons-vue'

const app = createApp(App);

import 'echarts';
import VChart from 'vue-echarts';

app.component("VChart", VChart);

for (const i in Icons) {
    //@ts-ignore
    app.component(i, Icons[i])
}
app.config.globalProperties.$antIcons = Icons

app.use(createPinia());
app.use(router);
app.use(Antd);
app.mount("#app");
