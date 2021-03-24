import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import api from "./api/index";
import base from "./api/base";
import VueNativeSock from "vue-native-websocket-vue3";
import vueRightMenu from "vue-right-click-menu-next";
import screenShot from "vue-web-screen-shot";

const app = createApp(App);
// 挂载api
app.config.globalProperties.$api = api;

// 使用VueNativeSock插件，并进行相关配置
app
  .use(store)
  .use(router)
  .use(vueRightMenu)
  .use(screenShot, { enableWebRtc: true })
  .mount("#app");
// 使用VueNativeSock插件，并进行相关配置
app.use(
  VueNativeSock,
  `${base.lkWebSocket}/${localStorage.getItem("userID")}`,
  {
    // 启用Vuex集成
    store: store,
    // 数据发送/接收使用使用json
    format: "json",
    // 开启手动调用 connect() 连接服务器
    connectManually: true,
    // 开启自动重连
    reconnection: true,
    // 尝试重连的次数
    reconnectionAttempts: 5,
    // 重连间隔时间
    reconnectionDelay: 3000
  }
);
export default app;
