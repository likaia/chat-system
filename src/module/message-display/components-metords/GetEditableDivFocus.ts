import initData from "@/module/message-display/main-entrance/InitData";

/**
 * 可编辑div获取焦点
 */
export default function getEditableDivFocus() {
  const data = initData();
  const msgInputContainer = data.msgInputContainer;
  if (msgInputContainer.value == null) {
    return;
  }
  msgInputContainer.value.focus();
}
