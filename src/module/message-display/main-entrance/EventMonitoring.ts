import {
  computed,
  ComputedRef,
  onMounted,
  onUnmounted,
  watch,
  getCurrentInstance,
  toRefs,
  ComponentInternalInstance
} from "vue";
import { useStore } from "vuex";
import getMessageTextList from "@/module/message-display/split-method/GetMessageTextList";
import readPasteData from "@/module/message-display/split-method/ReadPasteData";
import globalClick from "@/module/message-display/split-method/GlobalClick";
import initData from "@/module/message-display/main-entrance/InitData";
import containerScroll from "@/module/message-display/split-method/ContainerScroll";
import { messageDisplayPropsType, msgListType } from "@/type/ComponentDataType";
import { SetupContext } from "@vue/runtime-core";
import _ from "lodash";
import playSound from "@/module/message-display/split-method/PlaySound";
import renderPage from "@/module/message-display/split-method/RenderPage";

export default function eventMonitoring(
  props: messageDisplayPropsType,
  context: SetupContext<any>
): {
  userID: ComputedRef<string>;
  onlineUsers: ComputedRef<number>;
} | void {
  const $store = useStore();
  const currentInstance = getCurrentInstance();
  // 获取传递的参数
  const data = initData();
  // 将props改为响应式
  const prop = toRefs(props);
  // 将prop中的数据设置到data中
  data.setData(
    prop.listId,
    prop.messageStatus,
    prop.buddyId,
    prop.buddyName,
    prop.serverTime,
    context.emit
  );
  // 设置data中的实例属性
  data.setProperty($store, currentInstance);

  onMounted(() => {
    const { proxy } = getCurrentInstance() as ComponentInternalInstance;
    proxy.$socket.sendObj({
      code: 200,
      token: $store.state.token,
      userID: $store.state.userID,
      msg: $store.state.userID + "上线"
    });
    // 获取消息内容
    getMessageTextList(prop.listId.value);
    // 监听消息容器滚动
    containerScroll();

    if (data.messagesContainer.value == null) {
      return;
    }
    // 设置列容器高度
    data.messagesContainer.value.style.height = window.innerHeight - 450 + "px";

    // 执行剪切板监听与全局点击事件监听
    document.body.addEventListener("paste", readPasteData);
    document.body.addEventListener("click", globalClick);
    // 监听消息推送
    (currentInstance?.appContext.config.globalProperties.sockets).onmessage = (res: {
      data: string;
    }) => {
      const ResponseData = JSON.parse(res.data);
      if (ResponseData.code !== 200 && ResponseData.code !== -1) {
        // 获取服务端推送的消息
        const msgObj: msgListType = {
          msgText: ResponseData.msg,
          avatarSrc: ResponseData.avatarSrc,
          createTime: ResponseData.createTime,
          userId: ResponseData.userID,
          buddyId: ResponseData.buddyId,
          messageStatus: ResponseData.messageStatus,
          userName: ResponseData.username
        };
        if (data.messagesContainer.value == null) {
          return;
        }
        // 判断当前滚动条位置是否在底部
        data.isBottomOut.value =
          data.messagesContainer.value.scrollTop +
            data.messagesContainer.value.clientHeight ==
          data.messagesContainer.value.scrollHeight;
        // 播放消息提示音:当前消息为对方发送
        if (!_.isEqual(msgObj.userId, $store.state.userID)) {
          playSound();
        }
        // 接收方消息：列表id == 消息推送方id，且消息状态为单聊
        if (
          _.isEqual(prop.listId.value, msgObj.userId) &&
          msgObj.messageStatus === 0
        ) {
          // 渲染页面
          renderPage([], msgObj);
        }
        // 发送方消息：当前登录用户id == 消息发送方id，且消息状态为单聊
        if (
          _.isEqual($store.state.userID, msgObj.userId) &&
          msgObj.messageStatus === 0
        ) {
          // 渲染页面
          renderPage([], msgObj);
        }
        // 群聊消息：消息状态为1，列表id == 消息接收方id
        if (
          msgObj.messageStatus === 1 &&
          _.isEqual(prop.listId.value, msgObj.buddyId)
        ) {
          // 渲染页面
          renderPage([], msgObj);
        }
      }
    };
  });

  onUnmounted(() => {
    // 销毁时移除监听
    document.body.removeEventListener("paste", readPasteData);
    document.body.removeEventListener("click", globalClick);
    // 清空initData中的数据
    data.clearData();
  });

  // 监听listID改变
  watch(prop.listId, (newMsgId: string) => {
    // 清空消息列表数据
    data.senderMessageList.length = 0;
    // 初始化分页数据
    data.sessionMessageData.length = 0;
    data.pageStart.value = 0;
    data.pageEnd.value = 0;
    data.pageNo.value = 1;
    data.isLastPage.value = false;
    data.msgTotals.value = 0;
    data.msgListPanelHeight.value = 0;
    data.isLoading.value = false;
    data.isFirstLoading.value = true;
    data.listId.value = prop.listId.value;
    data.messageStatus.value = prop.messageStatus.value;
    data.buddyId.value = prop.buddyId.value;
    data.buddyName.value = prop.buddyName.value;
    data.serverTime.value = prop.serverTime.value;
    // 移除本地存储中的消息列表
    sessionStorage.removeItem("messageTextList");
    // 重新获取消息内容
    getMessageTextList(newMsgId);
    if (_.isEqual(data.messageStatus.value, 1)) {
      currentInstance?.appContext.config.globalProperties.$socket.sendObj({
        code: 200,
        token: $store.state.token,
        userID: $store.state.userID,
        msg: $store.state.userID + "进入群聊"
      });
    }
  });

  // 获取当前登录用户ID
  const userID = computed((): string => {
    return $store.state.userID;
  });
  // 获取在线人数
  const onlineUsers = computed((): number => {
    return $store.state.onlineUsers;
  });

  return {
    userID,
    onlineUsers
  };
}
