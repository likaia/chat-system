import { createStore } from "vuex";
import main from "../main";
import { rightMenuAttribute, userInfoType } from "@/type/ComponentDataType";
// antd的中文翻译库
import zhCN from "ant-design-vue/lib/locale/zh_CN";
export default createStore({
  state: {
    token: "",
    userID: "",
    antdLocale: zhCN,
    // 用户头像
    profilePicture: "",
    username: "",
    // 在线人数
    onlineUsers: 0,
    currentComponentName: null,
    socket: {
      // 连接状态
      isConnected: false,
      // 消息内容
      message: "",
      // 重新连接错误
      reconnectError: false,
      // 心跳消息发送时间
      heartBeatInterval: 50000,
      // 心跳定时器
      heartBeatTimer: 0
    },
    // 右键菜单
    rightMenu: {
      status: "none",
      top: "0px",
      left: "0px",
      list: []
    },
    // 关闭添加好友信息弹出框
    closeFriendAllAlert: false
  },
  mutations: {
    // 连接打开
    SOCKET_ONOPEN(state, event) {
      main.config.globalProperties.$socket = event.currentTarget;
      state.socket.isConnected = true;
      // 连接成功时启动定时发送心跳消息，避免被服务器断开连接
      state.socket.heartBeatTimer = setInterval(() => {
        const message = "心跳消息";
        state.socket.isConnected &&
          main.config.globalProperties.$socket.sendObj({
            code: 200,
            msg: message
          });
      }, state.socket.heartBeatInterval);
    },
    // 连接关闭
    SOCKET_ONCLOSE(state, event) {
      state.socket.isConnected = false;
      // 连接关闭时停掉心跳消息
      clearInterval(state.socket.heartBeatTimer);
      state.socket.heartBeatTimer = 0;
      console.log("连接已断开: " + new Date());
      console.log(event);
    },
    // 发生错误
    SOCKET_ONERROR(state, event) {
      console.error(state, event);
    },
    // 收到服务端发送的消息
    SOCKET_ONMESSAGE(state, message) {
      state.socket.message = message;
    },
    // 自动重连
    SOCKET_RECONNECT(state, count) {
      console.info("消息系统重连中...", state, count);
    },
    // 重连错误
    SOCKET_RECONNECT_ERROR(state) {
      state.socket.reconnectError = true;
    },
    // 更新用户信息
    updateUserInfo(state, userObj: userInfoType) {
      state.token = userObj.token;
      state.profilePicture = userObj.profilePicture;
      state.userID = userObj.userID;
      state.username = userObj.username;
    },
    // 更新组件名
    updateComponentName(state, route) {
      state.currentComponentName = route;
    },
    // 更新在线人数
    updateOnlineUsers(state, number) {
      state.onlineUsers = number;
    },
    // 更新token
    updateToken(state, token: string) {
      state.token = token;
      // 更新本地存储中的token
      localStorage.setItem("token", token);
    },
    // 更新右键菜单数据
    updateRightMenuStatus(state, menuObj: rightMenuAttribute) {
      state.rightMenu.status = menuObj.status;
      state.rightMenu.top = menuObj.top;
      state.rightMenu.left = menuObj.left;
      state.rightMenu.list = menuObj.list;
    },
    // 更新添加好友弹出框是否存在
    updateAddFriendStatus(state, value: boolean) {
      state.closeFriendAllAlert = value;
    }
  },
  modules: {}
});
