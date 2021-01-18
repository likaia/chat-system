import InitData from "@/module/screen-short/main-entrance/InitData";

export default function mouseMoveHandler(element: string, event?: MouseEvent) {
  const data = new InitData();
  if (!data.getMouseDownStatus().value || event == null) {
    return;
  }
  const frameSelectionController = data.getFrameSelectionController();
  const screenShortController = data.getScreenShortController();
  if (frameSelectionController.value == null || screenShortController == null) {
    return;
  }
  // 计算容器移动后的位置
  const leftPosition =
    event.clientX - (data.getMouseX().value - data.getMouseL().value);
  const topPosition =
    event.clientY - (data.getMouseY().value - data.getMouseT().value);
  switch (element) {
    case "frameSelectionArea":
      // 边界判断
      if (frameSelectionController.value.offsetLeft < 0) {
        data.setScreenshortPosition(0, topPosition);
        data.setMouseDownStatus(false);
        return;
      }
      if (frameSelectionController.value.offsetTop < 0) {
        data.setScreenshortPosition(leftPosition, 0);
        data.setMouseDownStatus(false);
        return;
      }
      // 更新容器位置
      data.setScreenshortPosition(leftPosition, topPosition);
      break;
    case "screenShortArea":
      // 更新选框位置
      data.setScreenshortPosition(
        data.getMouseX().value,
        data.getMouseY().value
      );
      // 更新截图框选区域宽高
      data.setScreenshortSelectAreaInfo(
        event.clientX - data.getMouseX().value,
        event.clientY - data.getMouseY().value
      );
      break;
    default:
      break;
  }
}
