import { onMounted, getCurrentInstance, onUnmounted } from "vue";
import { SetupContext } from "@vue/runtime-core";
import InitData from "@/module/screen-short/main-entrance/InitData";
import { useStore } from "vuex";
import mouseMoveHandler from "../common-methords/MouseMoveHandler";
import mouseDownHandler from "@/module/screen-short/common-methords/MouseDownHandler";
import mouseUpHandler from "@/module/screen-short/common-methords/MouseUpHandler";

export default class EventMonitoring {
  constructor(props: Record<string, any>, context: SetupContext<any>) {
    const data = new InitData();
    const frameSelectionController = data.getFrameSelectionController();
    data.setPropsData(context.emit);
    data.setProperty(useStore(), getCurrentInstance());
    onMounted(() => {
      if (frameSelectionController.value == null) {
        return;
      }
      // 监听截图框选容器按下
      frameSelectionController.value.addEventListener(
        "mousedown",
        mouseDownHandler
      );
      frameSelectionController.value.addEventListener(
        "mousemove",
        mouseMoveHandler
      );
      frameSelectionController.value.addEventListener(
        "mouseup",
        mouseUpHandler
      );
    });

    onUnmounted(() => {
      // 移除监听
      document.body.removeEventListener("mousedown", mouseDownHandler);
      document.body.removeEventListener("mousemove", mouseMoveHandler);
      document.body.removeEventListener("mouseup", mouseUpHandler);
      // 设置initData数据状态为false
      data.setHasData(false);
    });
  }
}
