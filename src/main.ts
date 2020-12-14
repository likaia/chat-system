import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import api from "./api/index";
import base from "./api/base";
import _ from "lodash";
import VueNativeSock from "vue-native-websocket-vue3";
const app = createApp(App);
// 挂载api
app.config.globalProperties.$api = api;
// 使用VueNativeSock插件，并进行相关配置
app
  .use(store)
  .use(router)
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
app.directive("rightClick", (el, binding) => {
  // 元素是否存在判断
  if (_.isEmpty(el)) {
    alert("右键指令错误：元素未绑定");
    return false;
  }
  el.oncontextmenu = function(e: MouseEvent) {
    const textArray = binding.value.text;
    const handlerObj = binding.value.handler;
    // 菜单选项与事件处理函数是否存在
    if (_.isEmpty(textArray) || _.isEmpty(handlerObj)) {
      alert("右键菜单内容与事件处理函数为必传项");
      return false;
    }
    // 事件处理数组
    const handlerArray = [];
    // 处理好的右键菜单
    const menuList = [];
    // 将事件处理函数放入数组中
    for (const key in handlerObj) {
      handlerArray.push(handlerObj[key]);
    }
    if (textArray.length !== handlerArray.length) {
      // 文本数量与事件处理不对等
      alert("右键菜单的每个选项，都必须有它的事件处理函数");
      return false;
    }
    // 追加右键菜单数据
    for (let i = 0; i < textArray.length; i++) {
      // 右键菜单对象, 添加名称
      const menuObj = {
        text: textArray[i],
        handler: handlerArray[i],
        id: i + 1
      };
      menuList.push(menuObj);
    }
    // 鼠标点的坐标
    const oX = e.clientX;
    const oY = e.clientY;
    // 右键菜单出现后的位置
    store.commit("updateRightMenuStatus", {
      status: "block",
      left: oX + "px",
      top: oY + "px",
      list: menuList
    });
    return false;
  };
});
export default app;
