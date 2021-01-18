import InitData from "@/module/screen-short/main-entrance/InitData";
import EventMonitoring from "@/module/screen-short/main-entrance/EventMonitoring";

export default function mouseUpHandler(element: string) {
  const data = new InitData();
  // 设置鼠标按下状态为false
  data.setMouseDownStatus(false);
  const frameSelectionController = data.getFrameSelectionController();
  const screenShortController = data.getScreenShortController();
  if (
    frameSelectionController.value == null ||
    screenShortController.value == null
  ) {
    return;
  }
  switch (element) {
    case "frameSelectionArea":
      // 设置拖动容器的鼠标样式为默认
      frameSelectionController.value.style.cursor = "default";
      break;
    case "screenShortArea":
      // 框选区域小于0，移除元素，添加监听
      if (
        data.getScreenshortSelectWidth().value <= 0 ||
        data.getScreenshortSelectHeight().value <= 0
      ) {
        data.setScreenshortSelectAreaInfo(0, 0);
        data.setMouseX(0);
        data.setMouseY(0);
        frameSelectionController.value.style.display = "none";
        // 监听截图区域按下
        screenShortController.value.addEventListener(
          "mousedown",
          EventMonitoring.screenShortMouseDown
        );
        screenShortController.value.addEventListener(
          "mousemove",
          EventMonitoring.screenShortMouseMove
        );
        screenShortController.value.addEventListener(
          "mouseup",
          EventMonitoring.screenShortMouseUp
        );
      } else {
        // 移除监听
        screenShortController.value.removeEventListener(
          "mousedown",
          EventMonitoring.screenShortMouseDown
        );
        screenShortController.value.removeEventListener(
          "mousemove",
          EventMonitoring.screenShortMouseMove
        );
        screenShortController.value.removeEventListener(
          "mouseup",
          EventMonitoring.screenShortMouseUp
        );
      }
      break;
    default:
      break;
  }
}
