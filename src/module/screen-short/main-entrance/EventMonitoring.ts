import { onMounted, getCurrentInstance, onUnmounted, Ref } from "vue";
import { SetupContext } from "@vue/runtime-core";
import InitData from "@/module/screen-short/main-entrance/InitData";
import { useStore } from "vuex";
import mouseMoveHandler from "../common-methords/MouseMoveHandler";
import mouseDownHandler from "@/module/screen-short/common-methords/MouseDownHandler";
import mouseUpHandler from "@/module/screen-short/common-methords/MouseUpHandler";

export default class EventMonitoring {
  private timer = 0; // 截图框选区域容器宽高定时器
  private data: InitData; // 当前实例的响应式data数据
  private frameSelectionController: Ref<HTMLDivElement | null>; // 截图选择区域dom
  private screenShortController: Ref<HTMLDivElement | null>; // 截图区域doms
  constructor(props: Record<string, any>, context: SetupContext<any>) {
    this.data = new InitData();
    this.frameSelectionController = this.data.getFrameSelectionController();
    this.screenShortController = this.data.getScreenShortController();
    this.data.setPropsData(context.emit);
    this.data.setProperty(useStore(), getCurrentInstance());

    onMounted(() => {
      if (
        this.frameSelectionController.value == null ||
        this.screenShortController.value == null
      ) {
        return;
      }
      // 监听截图框选容器按下
      this.frameSelectionController.value.addEventListener(
        "mousedown",
        EventMonitoring.frameSelectionMouseDown
      );
      this.frameSelectionController.value.addEventListener(
        "mousemove",
        EventMonitoring.frameSelectionMouseMove
      );
      this.frameSelectionController.value.addEventListener(
        "mouseup",
        EventMonitoring.frameSelectionMouseUp
      );
      // 监听截图区域按下
      this.screenShortController.value.addEventListener(
        "mousedown",
        EventMonitoring.screenShortMouseDown
      );
      this.screenShortController.value.addEventListener(
        "mousemove",
        EventMonitoring.screenShortMouseMove
      );
      this.screenShortController.value.addEventListener(
        "mouseup",
        EventMonitoring.screenShortMouseUp
      );
      // 监听截图框选区域容器宽高改变
      // this.monitorFrameSelection();
    });

    onUnmounted(() => {
      if (
        this.frameSelectionController.value == null ||
        this.screenShortController.value == null
      ) {
        return;
      }
      // 移除监听
      this.frameSelectionController.value.removeEventListener(
        "mousedown",
        EventMonitoring.frameSelectionMouseDown
      );
      this.frameSelectionController.value.removeEventListener(
        "mousemove",
        EventMonitoring.frameSelectionMouseMove
      );
      this.frameSelectionController.value.removeEventListener(
        "mouseup",
        EventMonitoring.frameSelectionMouseUp
      );
      this.screenShortController.value.removeEventListener(
        "mousedown",
        EventMonitoring.screenShortMouseDown
      );
      this.screenShortController.value.removeEventListener(
        "mousemove",
        EventMonitoring.screenShortMouseMove
      );
      this.screenShortController.value.removeEventListener(
        "mouseup",
        EventMonitoring.screenShortMouseUp
      );
      // 设置initData数据状态为false
      this.data.setHasData(false);
    });
  }

  // 截图框选容器鼠标事件中继处理函数
  private static frameSelectionMouseDown(event: MouseEvent) {
    mouseDownHandler("frameSelectionArea", event);
  }
  private static frameSelectionMouseMove(event: MouseEvent) {
    mouseMoveHandler("frameSelectionArea", event);
  }
  private static frameSelectionMouseUp() {
    mouseUpHandler("frameSelectionArea");
  }

  // 截图区域鼠标事件中继处理函数
  public static screenShortMouseDown(event: MouseEvent) {
    // 监听截图框选区域容器宽高改变
    mouseDownHandler("screenShortArea", event);
  }
  public static screenShortMouseMove(event: MouseEvent) {
    mouseMoveHandler("screenShortArea", event);
  }
  public static screenShortMouseUp() {
    mouseUpHandler("screenShortArea");
  }

  // 监听截图框选区域容器宽高
  private monitorFrameSelection() {
    // 宽高不为0时清理截图区域的鼠标事件监听
    this.timer = setInterval(() => {
      if (
        this.frameSelectionController.value == null ||
        this.screenShortController.value == null
      ) {
        return;
      }
      if (
        this.data.getScreenshortSelectWidth().value > 0 &&
        this.data.getScreenshortSelectHeight().value > 0
      ) {
        console.log("清理定时器");
        this.screenShortController.value.removeEventListener(
          "mousedown",
          EventMonitoring.screenShortMouseDown
        );
        this.screenShortController.value.removeEventListener(
          "mousemove",
          EventMonitoring.screenShortMouseMove
        );
        this.screenShortController.value.removeEventListener(
          "mouseup",
          EventMonitoring.screenShortMouseUp
        );
        clearInterval(this.timer);
      }
    }, 0);
  }
}
