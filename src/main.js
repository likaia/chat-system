import Vue from 'vue'
import './plugins/axios'
import App from './App.vue'
import router from './router'
import store from './store'
import api from './api/index';
import VueNativeSock from 'vue-native-websocket'
import base from "./api/base";

Vue.config.productionTip = false;
// 使用VueNativeSock插件，并进行相关配置
Vue.use(VueNativeSock,base.lkWebSocket,{
  // 启用Vuex集成
  store: store,
  // 数据发送/接收使用使用json
  format: "json",
  // 开启自动重连
  reconnection: true,
  // 尝试重连的次数
  reconnectionAttempts: 5,
  // 重连间隔时间
  reconnectionDelay: 3000,
  // 将数据进行序列化
  passToStoreHandler: function (eventName, event) {
    if (!eventName.startsWith('SOCKET_')) { return }
    let method = 'commit';
    let target = eventName.toUpperCase();
    let msg = event;
    if (this.format === 'json' && event.data) {
      msg = JSON.parse(event.data);
      if (msg.mutation) {
        target = [msg.namespace || '', msg.mutation].filter((e) => !!e).join('/');
      } else if (msg.action) {
        method = 'dispatch';
        target = [msg.namespace || '', msg.action].filter((e) => !!e).join('/');
      }
    }
    this.store[method](target, msg);
    this.store.state.socket.message = msg;
  }
});
// 挂载到原型
Vue.prototype.$api = api;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
