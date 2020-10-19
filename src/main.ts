import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import api from "./api/index";
const app = createApp(App);
// 挂载api
app.config.globalProperties.$api = api;
// 使用VueNativeSock插件，并进行相关配置
app
  .use(store)
  .use(router)
  .mount("#app");
export default app;
