import initData from "@/module/message-display/main-entrance/InitData";

export default function toolbarEventHandling(toolItemName: string) {
  // 获取传递的数据
  const data = initData();
  const emoticonShowStatus = data.emoticonShowStatus;
  if (emoticonShowStatus == null) {
    return;
  }
  switch (toolItemName) {
    // 表情框点击事件
    case "emoticon":
      if (emoticonShowStatus.value === "flex") {
        emoticonShowStatus.value = "none";
        break;
      }
      emoticonShowStatus.value = "flex";
      break;
    // 截屏点击事件
    case "screenCapture":
      // 显示截图组件
      data.screenshortStatus.value = true;
      emoticonShowStatus.value = "none";
      break;
    // 电话点击事件
    case "phone":
      console.log("电话点击");
      emoticonShowStatus.value = "none";
      break;
    // 消息记录点击事件
    case "history":
      emoticonShowStatus.value = "none";
      break;
    default:
      emoticonShowStatus.value = "none";
      break;
  }
}
