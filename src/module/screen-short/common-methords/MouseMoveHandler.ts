import InitData from "@/module/screen-short/main-entrance/InitData";

export default function mouseMoveHandler(event: MouseEvent) {
  const data = new InitData();
  if (!data.getMouseDownStatus().value) {
    return;
  }
  // 计算容器移动后的位置
  const leftPosition =
    event.clientX - (data.getMouseX().value - data.getMouseL().value);
  const topPosition =
    event.clientY - (data.getMouseY().value - data.getMouseT().value);
  // 更新容器位置
  data.setScreenshortPosition(leftPosition, topPosition);
}
