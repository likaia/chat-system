import InitData from "@/module/screen-short/main-entrance/InitData";

export default function mouseDownHandler(element: string, event?: MouseEvent) {
  const data = new InitData();
  // 获取拖动容器dom
  const frameSelectionController = data.getFrameSelectionController();
  if (frameSelectionController.value == null || event == null) {
    return;
  }

  switch (element) {
    case "frameSelectionArea":
      // 记录鼠标坐标
      data.setMouseX(event.clientX);
      data.setMouseY(event.clientY);
      // 记录拖动容器的左右偏移量
      data.setMouseL(frameSelectionController.value.offsetLeft);
      data.setMouseT(frameSelectionController.value.offsetTop);
      // 设置鼠标状态和样式为按下
      data.setMouseDownStatus(true);
      frameSelectionController.value.style.cursor = "move";
      break;
    case "screenShortArea":
      // 记录鼠标坐标
      data.setMouseX(event.clientX);
      data.setMouseY(event.clientY);
      // 设置鼠标状态为按下
      data.setMouseDownStatus(true);
      // 显示选框
      frameSelectionController.value.style.display = "block";
      break;
    default:
      break;
  }
}
