import initData from "@/module/message-display/main-entrance/InitData";

/**
 * 处理全局点击事件
 */
export default function globalClick(e?: Event) {
  const data = initData();
  const emoticonShowStatus = data.emoticonShowStatus;
  if (e == null || emoticonShowStatus == null) {
    return;
  }
  // 点击表情框以外的地方，隐藏当前表情框
  if (
    (e.target as Element).className !== "emoticon-panel" &&
    (e.target as Element).className !== "emoticon"
  ) {
    emoticonShowStatus.value = "none";
  }
}
