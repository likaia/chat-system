import InitData from "@/module/screen-short/main-entrance/InitData";

export default function mouseUpHandler() {
  const data = new InitData();
  // 设置鼠标按下状态为false
  data.setMouseDownStatus(false);
  const frameSelectionController = data.getFrameSelectionController();
  if (frameSelectionController.value == null) {
    return;
  }
  // 设置拖动容器的鼠标样式为默认
  frameSelectionController.value.style.cursor = "default";
}
