import {
  reactive,
  Ref,
  ref,
  getCurrentInstance,
  ComponentInternalInstance
} from "vue";
import {
  emojiObj,
  messageDisplayDataType,
  msgListType,
  toolbarObj
} from "@/type/ComponentDataType";
import { Store, useStore } from "vuex";

// DOM操作,必须return否则不会生效
let messagesContainer = ref<HTMLDivElement | null>(null);
let msgInputContainer = ref<HTMLDivElement | null>(null);
let selectImg = ref<HTMLImageElement | null>(null);

// 静态变量
const createDisSrc = ref<string>(
  require("@/assets/img/titlebar_function_createDis_normal@2x.png") as string
);
const emojiList = require("@/assets/json/emoji.json") as Array<emojiObj>;
const toolbarList = require("@/assets/json/toolbar.json") as Array<toolbarObj>;
const arrFrequency: number[] = [
  196.0,
  220.0,
  246.94,
  261.63,
  293.66,
  329.63,
  349.23,
  392.0,
  440.0,
  493.88,
  523.25,
  587.33,
  659.25,
  698.46,
  783.99,
  880.0,
  987.77,
  1046.5
];

// 响应式Data变量
let resourceObj = reactive<Record<string, string>>({
  createDisNormal: require("@/assets/img/titlebar_function_createDis_normal@2x.png"),
  createDisHover: require("@/assets/img/titlebar_function_createDis_hover@2x.png"),
  createDisClick: require("@/assets/img/titlebar_function_createDis_normal_p@2x.png"),
  phoneNormal: require("@/assets/img/phone_normal_ap@2x.png"),
  groupMsgImg: require("@/assets/img/group-msg-img.png"),
  avatarImg: require("@/assets/img/avatar.jpg"),
  msgImgTest: require("@/assets/img/msg-img-test.gif"),
  msgImgTestB: require("@/assets/img/msg-img-testB.gif")
});
let messageContent = ref<string>("");
let emoticonShowStatus = ref<string>("none");
let senderMessageList = reactive([]);
let isBottomOut = ref<boolean>(true);
let audioCtx = ref<number>(0);
let pageStart = ref<number>(0);
let pageEnd = ref<number>(0);
let pageNo = ref<number>(1);
let pageSize = ref<number>(20);
let sessionMessageData = reactive<Array<msgListType>>([]);
let msgListPanelHeight = ref<number>(0);
let isLoading = ref<boolean>(false);
let isLastPage = ref<boolean>(false);
let msgTotals = ref<number>(0);
let isFirstLoading = ref<boolean>(true);
let listId = ref<string>("");
let messageStatus = ref<number>(0);
let buddyId = ref<string>("");
let buddyName = ref<string>("");
let serverTime = ref<string>("");
let screenshortStatus = ref<boolean>(false);
let showImgStatus = ref<boolean>(false);
let imgSrc = ref<string>("");
let isSendMessages = ref<boolean>(false);
let msgShowStatus = ref<string>("");

// 事件处理
let emit: (event: string, ...args: any[]) => void = () => {
  return 0;
};
// store与当前实例
let $store = useStore();
let currentInstance = getCurrentInstance();

/**
 * 管理组件需要的响应式data数据
 */
export default function initData(): messageDisplayDataType {
  // 定义set方法，将props中的数据写入当前实例
  const setData = (
    listIdParam: Ref<string>,
    messageStatusParam: Ref<number>,
    buddyIdParam: Ref<string>,
    buddyNameParam: Ref<string>,
    serverTimeParam: Ref<string>,
    emitParam: (event: string, ...args: any[]) => void
  ) => {
    listId = listIdParam;
    messageStatus = messageStatusParam;
    buddyId = buddyIdParam;
    buddyName = buddyNameParam;
    serverTime = serverTimeParam;
    emit = emitParam;
  };

  // 设置属性
  const setProperty = (
    storeParam: Store<any>,
    instanceParam: ComponentInternalInstance | null
  ) => {
    $store = storeParam;
    currentInstance = instanceParam;
  };

  // 清空所有响应式数据，页面销毁时需要调用此方法来清空数据，否则数据会一直存在，重新加载页面就会出现问题
  const clearData = () => {
    // DOM元素
    messagesContainer = ref<HTMLDivElement | null>(null);
    msgInputContainer = ref<HTMLDivElement | null>(null);
    selectImg = ref<HTMLImageElement | null>(null);
    // 响应式Data变量
    resourceObj = reactive<Record<string, string>>({
      createDisNormal: require("@/assets/img/titlebar_function_createDis_normal@2x.png"),
      createDisHover: require("@/assets/img/titlebar_function_createDis_hover@2x.png"),
      createDisClick: require("@/assets/img/titlebar_function_createDis_normal_p@2x.png"),
      phoneNormal: require("@/assets/img/phone_normal_ap@2x.png"),
      groupMsgImg: require("@/assets/img/group-msg-img.png"),
      avatarImg: require("@/assets/img/avatar.jpg"),
      msgImgTest: require("@/assets/img/msg-img-test.gif"),
      msgImgTestB: require("@/assets/img/msg-img-testB.gif")
    });
    messageContent = ref<string>("");
    emoticonShowStatus = ref<string>("none");
    senderMessageList = reactive([]);
    isBottomOut = ref<boolean>(true);
    audioCtx = ref<number>(0);
    pageStart = ref<number>(0);
    pageEnd = ref<number>(0);
    pageNo = ref<number>(1);
    pageSize = ref<number>(20);
    sessionMessageData = reactive<Array<msgListType>>([]);
    msgListPanelHeight = ref<number>(0);
    isLoading = ref<boolean>(false);
    isLastPage = ref<boolean>(false);
    msgTotals = ref<number>(0);
    isFirstLoading = ref<boolean>(true);
    listId = ref<string>("");
    messageStatus = ref<number>(0);
    buddyId = ref<string>("");
    buddyName = ref<string>("");
    serverTime = ref<string>("");
    screenshortStatus = ref<boolean>(false);
    showImgStatus = ref<boolean>(false);
    imgSrc = ref<string>("");
    isSendMessages = ref<boolean>(false);
    msgShowStatus = ref<string>("");
  };

  // 返回组件需要的Data
  return {
    createDisSrc,
    resourceObj,
    messageContent,
    emoticonShowStatus,
    emojiList,
    toolbarList,
    senderMessageList,
    isBottomOut,
    audioCtx,
    arrFrequency,
    pageStart,
    pageEnd,
    pageNo,
    pageSize,
    sessionMessageData,
    msgListPanelHeight,
    isLoading,
    isLastPage,
    msgTotals,
    isFirstLoading,
    messagesContainer,
    msgInputContainer,
    selectImg,
    listId,
    messageStatus,
    buddyId,
    buddyName,
    serverTime,
    screenshortStatus,
    showImgStatus,
    imgSrc,
    isSendMessages,
    setData,
    emit,
    $store,
    currentInstance,
    setProperty,
    clearData,
    msgShowStatus
  };
}
