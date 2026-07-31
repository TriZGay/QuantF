//@ts-nocheck
import { createApp } from "vue";
import { createPinia } from "pinia";
import Antd from "ant-design-vue";
import App from "./App.vue";
import { router } from "@/router";
import "@/style/index.css";

import "ant-design-vue/dist/antd.dark.css";
// import "ant-design-vue/dist/antd.css";
import * as Icons from "@ant-design/icons-vue";

const app = createApp(App);

for (const i in Icons) {
  app.component(i, Icons[i]);
}
app.config.globalProperties.$antIcons = Icons;

app.use(createPinia());
app.use(router);
app.use(Antd);
app.mount("#app");
