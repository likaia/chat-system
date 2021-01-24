import { onMounted, getCurrentInstance, onUnmounted, Ref, nextTick } from "vue";
import { SetupContext } from "@vue/runtime-core";
import {
  cutOutBoxBorder,
  movePositionType,
  cutBoxBorderType,
  zoomCutOutBoxReturnType,
  drawCutOutBoxReturnType
} from "@/module/screen-short/type/ComponentType.ts";
import { drawMasking } from "@/module/screen-short/split-methods/DrawMasking";
import {
  fixedData,
  nonNegativeData
} from "@/module/screen-short/common-methords/FixedData";
import { zoomCutOutBoxPosition } from "@/module/screen-short/common-methords/ZoomCutOutBoxPosition";
import { saveBorderArrInfo } from "@/module/screen-short/common-methords/SaveBorderArrInfo";
import { drawCutOutBox } from "@/module/screen-short/split-methods/DrawCutOutBox";
import InitData from "@/module/screen-short/main-entrance/InitData";
import { useStore } from "vuex";
import html2canvas from "html2canvas";
import { calculateToolLocation } from "@/module/screen-short/split-methods/CalculateToolLocation";

export default class EventMonitoring {
  // 当前实例的响应式data数据
  private readonly data: InitData;

  // 截图区域canvas容器
  private screenShortController: Ref<HTMLCanvasElement | null>;
  // 截图工具栏dom
  private toolController: Ref<HTMLDivElement | null>;
  // 截图图片存放容器
  private screenShortImageController: HTMLCanvasElement | undefined;
  // 截图区域画布
  private screenShortCanvas: CanvasRenderingContext2D | undefined;

  // 裁剪框位置参数
  private cutOutBoxPosition: cutBoxBorderType = {
    startX: 0,
    startY: 0,
    width: 0,
    height: 0
  };
  // 裁剪框临时位置参数
  private tempCutOutBoxPosition: cutBoxBorderType = {
    startX: 0,
    startY: 0,
    width: 0,
    height: 0
  };
  // 裁剪框边框节点坐标事件
  private cutOutBoxBorderArr: Array<cutOutBoxBorder> = [];
  // 裁剪框顶点边框直径大小
  private borderSize = 10;
  // 当前操作的边框节点
  private borderOption: number | null = null;

  // 点击裁剪框时的鼠标坐标
  private movePosition: movePositionType = {
    moveStartX: 0,
    moveStartY: 0
  };

  // 裁剪框修剪状态
  private draggingTrim = false;
  // 裁剪框拖拽状态
  private dragging = false;

  // 鼠标点击状态
  private clickFlag = false;

  constructor(props: Record<string, any>, context: SetupContext<any>) {
    // 实例化响应式data
    this.data = new InitData();
    // 获取截图区域canvas容器
    this.screenShortController = this.data.getScreenShortController();
    this.toolController = this.data.getToolController();
    // 设置实例与属性
    this.data.setPropsData(context.emit);
    this.data.setProperty(useStore(), getCurrentInstance());

    onMounted(() => {
      // 设置截图区域canvas宽高
      this.data.setScreenShortInfo(window.innerWidth, window.innerHeight);
      // 截取整个网页
      html2canvas(document.body, {
        allowTaint: true
      }).then(canvas => {
        // 装载截图的dom为null则退出
        if (this.screenShortController.value == null) return;

        // 存放html2canvas截取的内容
        this.screenShortImageController = canvas;
        // 获取截图区域画canvas容器画布
        const context = this.screenShortController.value?.getContext("2d");
        if (context == null) return;

        // 赋值截图区域canvas画布
        this.screenShortCanvas = context;
        // 绘制蒙层
        drawMasking(context);

        // 添加监听
        this.screenShortController.value?.addEventListener(
          "mousedown",
          this.mouseDownEvent
        );
        this.screenShortController.value?.addEventListener(
          "mousemove",
          this.mouseMoveEvent
        );
        this.screenShortController.value?.addEventListener(
          "mouseup",
          this.mouseUpEvent
        );
      });
    });

    onUnmounted(() => {
      // 初始化initData中的数据
      this.data.setInitStatus(true);
    });
  }

  // 鼠标按下事件
  private mouseDownEvent = (event: MouseEvent) => {
    this.dragging = true;
    this.clickFlag = true;
    // 隐藏截图工具栏
    this.data.setToolStatus(false);
    // 如果操作的是裁剪框
    if (this.borderOption) {
      this.draggingTrim = true;
      this.movePosition.moveStartX = nonNegativeData(event.offsetX);
      this.movePosition.moveStartY = nonNegativeData(event.offsetY);
    } else {
      // 记录当前鼠标开始坐标
      this.cutOutBoxPosition.startX = nonNegativeData(event.offsetX);
      this.cutOutBoxPosition.startY = nonNegativeData(event.offsetY);
    }
  };

  // 鼠标移动事件
  private mouseMoveEvent = (event: MouseEvent) => {
    if (this.screenShortCanvas == null) return;
    this.clickFlag = false;
    // 获取裁剪框位置信息
    const { startX, startY, width, height } = this.cutOutBoxPosition;
    // 获取当前鼠标坐标
    const currentX = nonNegativeData(event.offsetX);
    const currentY = nonNegativeData(event.offsetY);
    // 裁剪框临时宽高
    const tempWidth = currentX - startX;
    const tempHeight = currentY - startY;
    // 执行裁剪框操作函数
    this.operatingCutOutBox(
      currentX,
      currentY,
      startX,
      startY,
      width,
      height,
      this.screenShortCanvas
    );
    // 如果鼠标未点击或者当前操作的是裁剪框都return
    if (!this.dragging || this.draggingTrim) return;
    // 绘制裁剪框
    this.tempCutOutBoxPosition = drawCutOutBox(
      startX,
      startY,
      tempWidth,
      tempHeight,
      this.screenShortCanvas,
      this.borderSize,
      this.screenShortController.value as HTMLCanvasElement,
      this.screenShortImageController as HTMLCanvasElement
    ) as drawCutOutBoxReturnType;
  };

  // 鼠标抬起事件
  private mouseUpEvent = () => {
    // 绘制结束
    this.dragging = false;
    this.draggingTrim = false;
    // 保存裁剪框位置信息
    this.cutOutBoxPosition = this.tempCutOutBoxPosition;
    // 保存边框节点信息
    this.cutOutBoxBorderArr = saveBorderArrInfo(
      this.borderSize,
      this.cutOutBoxPosition
    );
    if (this.screenShortController.value != null) {
      // 修改鼠标状态为拖动
      this.screenShortController.value.style.cursor = "move";
      // 显示截图工具栏
      this.data.setToolStatus(true);
      nextTick().then(() => {
        if (this.toolController.value != null) {
          // 计算截图工具栏位置
          const toolLocation = calculateToolLocation(
            this.cutOutBoxPosition,
            this.toolController.value?.offsetWidth
          );
          // 设置截图工具栏位置
          this.data.setToolInfo(toolLocation.mouseX, toolLocation.mouseY);
        }
      });
    }
  };

  /**
   * 操作裁剪框
   * @param currentX 裁剪框当前x轴坐标
   * @param currentY 裁剪框当前y轴坐标
   * @param startX 鼠标x轴坐标
   * @param startY 鼠标y轴坐标
   * @param width 裁剪框宽度
   * @param height 裁剪框高度
   * @param context 需要进行绘制的canvas画布
   * @private
   */
  private operatingCutOutBox(
    currentX: number,
    currentY: number,
    startX: number,
    startY: number,
    width: number,
    height: number,
    context: CanvasRenderingContext2D
  ) {
    // canvas元素不存在
    if (this.screenShortController.value == null) {
      return;
    }
    // 获取鼠标按下时的坐标
    const { moveStartX, moveStartY } = this.movePosition;

    // 裁剪框边框节点事件存在且裁剪框未进行操作，则对鼠标样式进行修改
    if (this.cutOutBoxBorderArr.length > 0 && !this.draggingTrim) {
      // 标识鼠标是否在裁剪框内
      let flag = false;
      // 判断鼠标位置
      context.beginPath();
      for (let i = 0; i < this.cutOutBoxBorderArr.length; i++) {
        context.rect(
          this.cutOutBoxBorderArr[i].x,
          this.cutOutBoxBorderArr[i].y,
          this.cutOutBoxBorderArr[i].width,
          this.cutOutBoxBorderArr[i].height
        );
        if (context.isPointInPath(currentX, currentY)) {
          switch (this.cutOutBoxBorderArr[i].index) {
            case 1:
              this.screenShortController.value.style.cursor = "move";
              break;
            case 2:
              this.screenShortController.value.style.cursor = "ns-resize";
              break;
            case 3:
              this.screenShortController.value.style.cursor = "ew-resize";
              break;
            case 4:
              this.screenShortController.value.style.cursor = "nwse-resize";
              break;
            case 5:
              this.screenShortController.value.style.cursor = "nesw-resize";
              break;
            default:
              break;
          }
          this.borderOption = this.cutOutBoxBorderArr[i].option;
          flag = true;
          break;
        }
      }
      context.closePath();
      if (!flag) {
        // 鼠标移出裁剪框重置鼠标样式
        this.screenShortController.value.style.cursor = "default";
        // 重置当前操作的边框节点为null
        this.borderOption = null;
      }
    }

    // 裁剪框正在被操作
    if (this.draggingTrim) {
      // 当前操作节点为1时则为移动裁剪框
      if (this.borderOption === 1) {
        // 计算要移动的x轴坐标
        const x = fixedData(
          currentX - (moveStartX - startX),
          width,
          this.screenShortController.value.width
        );
        // 计算要移动的y轴坐标
        const y = fixedData(
          currentY - (moveStartY - startY),
          height,
          this.screenShortController.value.height
        );
        // 重新绘制裁剪框
        this.tempCutOutBoxPosition = drawCutOutBox(
          x,
          y,
          width,
          height,
          context,
          this.borderSize,
          this.screenShortController.value as HTMLCanvasElement,
          this.screenShortImageController as HTMLCanvasElement
        ) as drawCutOutBoxReturnType;
      } else {
        // 裁剪框其他8个点的拖拽事件
        const {
          tempStartX,
          tempStartY,
          tempWidth,
          tempHeight
        } = zoomCutOutBoxPosition(
          currentX,
          currentY,
          startX,
          startY,
          width,
          height,
          this.borderOption as number
        ) as zoomCutOutBoxReturnType;
        // 绘制裁剪框
        this.tempCutOutBoxPosition = drawCutOutBox(
          tempStartX,
          tempStartY,
          tempWidth,
          tempHeight,
          context,
          this.borderSize,
          this.screenShortController.value as HTMLCanvasElement,
          this.screenShortImageController as HTMLCanvasElement
        ) as drawCutOutBoxReturnType;
      }
    }
  }
}
