import initData from "@/module/message-display/main-entrance/InitData";

/**
 * 组件销毁函数
 * @param status
 */
export default function destroyComponent(status: boolean) {
  const data = initData();
  data.screenshortStatus.value = status;
}
