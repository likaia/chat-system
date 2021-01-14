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
const messagesContainer = ref<HTMLDivElement | null>(null);
const msgInputContainer = ref<HTMLDivElement | null>(null);
const selectImg = ref<HTMLImageElement | null>(null);
// 响应式Data变量
const createDisSrc = ref<string>(
  require("@/assets/img/titlebar_function_createDis_normal@2x.png") as string
);
const resourceObj = reactive<Record<string, string>>({
  createDisNormal: require("@/assets/img/titlebar_function_createDis_normal@2x.png"),
  createDisHover: require("@/assets/img/titlebar_function_createDis_hover@2x.png"),
  createDisClick: require("@/assets/img/titlebar_function_createDis_normal_p@2x.png"),
  phoneNormal: require("@/assets/img/phone_normal_ap@2x.png"),
  groupMsgImg: require("@/assets/img/group-msg-img.png"),
  avatarImg: require("@/assets/img/avatar.jpg"),
  msgImgTest: require("@/assets/img/msg-img-test.gif"),
  msgImgTestB: require("@/assets/img/msg-img-testB.gif")
});
const messageContent = ref<string>("");
const emoticonShowStatus = ref<string>("none");
const emojiList = require("@/assets/json/emoji.json") as Array<emojiObj>;
const toolbarList = require("@/assets/json/toolbar.json") as Array<toolbarObj>;
const senderMessageList = reactive([]);
const isBottomOut = ref<boolean>(true);
const audioCtx = ref<number>(0);
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
const pageStart = ref<number>(0);
const pageEnd = ref<number>(0);
const pageNo = ref<number>(1);
const pageSize = ref<number>(20);
const sessionMessageData = reactive<Array<msgListType>>([]);
const msgListPanelHeight = ref<number>(0);
const isLoading = ref<boolean>(false);
const isLastPage = ref<boolean>(false);
const msgTotals = ref<number>(0);
const isFirstLoading = ref<boolean>(true);
let listId = ref<string>("");
let messageStatus = ref<number>(0);
let buddyId = ref<string>("");
let buddyName = ref<string>("");
let serverTime = ref<string>("");
let emit: (event: string, ...args: any[]) => void = () => {
  return 0;
};
// store与当前实例
let $store = useStore();
let currentInstance = getCurrentInstance();
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
  const setProperty = (
    storeParam: Store<any>,
    instanceParam: ComponentInternalInstance | null
  ) => {
    $store = storeParam;
    currentInstance = instanceParam;
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
    setData,
    emit,
    $store,
    currentInstance,
    setProperty
  };
}
