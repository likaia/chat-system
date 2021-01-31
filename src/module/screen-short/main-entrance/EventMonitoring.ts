import { onMounted, getCurrentInstance, onUnmounted, Ref, nextTick } from "vue";
import { SetupContext } from "@vue/runtime-core";
import {
  cutOutBoxBorder,
  movePositionType,
  zoomCutOutBoxReturnType,
  drawCutOutBoxReturnType,
  positionInfoType
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
import { drawRectangle } from "@/module/screen-short/split-methods/DrawRectangle";
import { drawCircle } from "@/module/screen-short/split-methods/DrawCircle";
import { drawLineArrow } from "@/module/screen-short/split-methods/DrawLineArrow";
import {
  drawPencli,
  initPencli
} from "@/module/screen-short/split-methods/DrawPencil";
import { drawText } from "@/module/screen-short/split-methods/DrawText";
import { saveCanvasToImage } from "@/module/screen-short/common-methords/SaveCanvasToImage";
import { saveCanvasToBase64 } from "@/module/screen-short/common-methords/SaveCanvasToBase64";
import { drawMosaic } from "@/module/screen-short/split-methods/DrawMosaic";
import { calculateOptionIcoPosition } from "@/module/screen-short/split-methods/CalculateOptionIcoPosition";
import { setSelectedClassName } from "@/module/screen-short/common-methords/SetSelectedClassName";

export default class EventMonitoring {
  // 当前实例的响应式data数据
  private readonly data: InitData;
  private emit: ((event: string, ...args: any[]) => void) | undefined;

  // 截图区域canvas容器
  private screenShortController: Ref<HTMLCanvasElement | null>;
  // 截图工具栏dom
  private toolController: Ref<HTMLDivElement | null>;
  // 截图图片存放容器
  private screenShortImageController: HTMLCanvasElement | undefined;
  // 截图区域画布
  private screenShortCanvas: CanvasRenderingContext2D | undefined;
  // 文本区域dom
  private textInputController: Ref<HTMLDivElement | null> | undefined;
  //  截图工具栏画笔选项dom
  private optionController: Ref<HTMLDivElement | null> | undefined;
  private optionIcoController: Ref<HTMLDivElement | null> | undefined;
  // 图形位置参数
  private drawGraphPosition: positionInfoType = {
    startX: 0,
    startY: 0,
    width: 0,
    height: 0
  };
  // 临时图形位置参数
  private tempGraphPosition: positionInfoType = {
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
  // 当前点击的工具栏条目
  private toolName = "";
  private fontSize = 17;
  // 撤销点击次数
  private undoClickNum = 0;
  // 最大可撤销次数
  private maxUndoNum = 15;
  // 马赛克涂抹区域大小
  private degreeOfBlur = 5;
  private history: Array<Record<string, any>> = [];
  // 文本输入框位置
  private textInputPosition: { mouseX: number; mouseY: number } = {
    mouseX: 0,
    mouseY: 0
  };

  constructor(props: Record<string, any>, context: SetupContext<any>) {
    // 实例化响应式data
    this.data = new InitData();
    // 获取截图区域canvas容器
    this.screenShortController = this.data.getScreenShortController();
    this.toolController = this.data.getToolController();
    this.textInputController = this.data.getTextInputController();
    this.optionController = this.data.getOptionController();
    this.optionIcoController = this.data.getOptionIcoController();
    // 设置实例与属性
    this.data.setPropsData(context.emit);
    this.data.setProperty(useStore(), getCurrentInstance());
    // 设置画笔颜色与大小

    onMounted(() => {
      this.emit = this.data.getEmit();
      // 设置截图区域canvas宽高
      this.data.setScreenShortInfo(window.innerWidth, window.innerHeight);
      // 截取整个网页，allowTaint: true可解决截图后跨域导致的图片不显示问题，但是会影响截图的主体功能
      html2canvas(document.body, {}).then(canvas => {
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
    // 当前操作的是撤销
    if (this.toolName == "undo") return;
    this.dragging = true;
    this.clickFlag = true;
    const mouseX = nonNegativeData(event.offsetX);
    const mouseY = nonNegativeData(event.offsetY);

    // 如果当前操作的是截图工具栏
    if (this.data.getToolClickStatus().value) {
      // 记录当前鼠标开始坐标
      this.drawGraphPosition.startX = mouseX;
      this.drawGraphPosition.startY = mouseY;
    } else {
      // 隐藏截图工具栏
      this.data.setToolStatus(false);
    }
    if (this.toolName == "brush" && this.screenShortCanvas) {
      // 当前操作的是画笔
      initPencli(this.screenShortCanvas, mouseX, mouseY);
    }
    // 当前操作的文本
    if (
      this.toolName == "text" &&
      this.textInputController?.value &&
      this.screenShortController?.value &&
      this.screenShortCanvas
    ) {
      // 修改鼠标样式
      this.screenShortController.value.style.cursor = "text";
      // 显示文本输入区域
      this.data.setTextStatus(true);
      // 判断输入框位置是否变化
      if (
        this.textInputPosition.mouseX != 0 &&
        this.textInputPosition.mouseY != 0 &&
        this.textInputPosition.mouseX != mouseX &&
        this.textInputPosition.mouseY != mouseY
      ) {
        drawText(
          this.textInputController.value?.innerText,
          this.textInputPosition.mouseX,
          this.textInputPosition.mouseY,
          this.data.getSelectedColor().value,
          this.fontSize,
          this.screenShortCanvas
        );
        // 清空文本输入区域的内容
        this.textInputController.value.innerHTML = "";
        // 保存绘制记录
        this.addHistoy();
      }
      // 计算文本框显示位置
      const textMouseX = mouseX - 15;
      const textMouseY = mouseY - 15;
      // 修改文本区域位置
      this.textInputController.value.style.left = textMouseX + "px";
      this.textInputController.value.style.top = textMouseY + "px";
      setTimeout(() => {
        // 获取焦点
        if (this.textInputController?.value) {
          this.textInputController.value.focus();
          // 记录当前输入框位置
          this.textInputPosition = { mouseX: mouseX, mouseY: mouseY };
        }
      });
    }

    // 如果操作的是裁剪框
    if (this.borderOption) {
      this.draggingTrim = true;
      this.movePosition.moveStartX = mouseX;
      this.movePosition.moveStartY = mouseY;
    } else {
      // 记录当前鼠标开始坐标
      this.drawGraphPosition.startX = mouseX;
      this.drawGraphPosition.startY = mouseY;
    }
  };

  // 鼠标移动事件
  private mouseMoveEvent = (event: MouseEvent) => {
    if (
      this.screenShortCanvas == null ||
      this.screenShortController.value == null ||
      this.toolName == "undo"
    )
      return;
    this.clickFlag = false;
    // 获取裁剪框位置信息
    const { startX, startY, width, height } = this.drawGraphPosition;
    // 获取当前鼠标坐标
    const currentX = nonNegativeData(event.offsetX);
    const currentY = nonNegativeData(event.offsetY);
    // 裁剪框临时宽高
    const tempWidth = currentX - startX;
    const tempHeight = currentY - startY;
    // 工具栏绘制
    if (this.data.getToolClickStatus().value && this.dragging) {
      // 当前操作的不是马赛克则显示最后一次画布绘制时的状态
      if (this.toolName != "mosaicPen") {
        this.showLastHistory();
      }
      switch (this.toolName) {
        case "square":
          drawRectangle(
            startX,
            startY,
            tempWidth,
            tempHeight,
            this.data.getSelectedColor().value,
            this.data.getPenSize().value,
            this.screenShortCanvas,
            this.screenShortController.value as HTMLCanvasElement,
            this.screenShortImageController as HTMLCanvasElement
          );
          break;
        case "round":
          drawCircle(
            this.screenShortCanvas,
            currentX,
            currentY,
            startX,
            startY,
            this.data.getPenSize().value,
            this.data.getSelectedColor().value
          );
          break;
        case "right-top":
          drawLineArrow(
            this.screenShortCanvas,
            startX,
            startY,
            currentX,
            currentY,
            30,
            10,
            this.data.getPenSize().value,
            this.data.getSelectedColor().value
          );
          break;
        case "brush":
          // 画笔绘制
          drawPencli(
            this.screenShortCanvas,
            currentX,
            currentY,
            this.data.getPenSize().value,
            this.data.getSelectedColor().value
          );
          break;
        case "mosaicPen":
          // 绘制马赛克，为了确保鼠标位置在绘制区域中间，所以对x、y坐标进行-10处理
          drawMosaic(
            currentX - 10,
            currentY - 10,
            this.data.getPenSize().value,
            this.degreeOfBlur,
            this.screenShortCanvas
          );
          break;
        default:
          break;
      }
      return;
    }
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
    this.tempGraphPosition = drawCutOutBox(
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
    // 当前操作的是撤销
    if (this.toolName == "undo") return;
    // 绘制结束
    this.dragging = false;
    this.draggingTrim = false;
    if (
      this.screenShortController.value == null ||
      this.screenShortCanvas == null
    ) {
      return;
    }
    if (this.data.getToolClickStatus().value) {
      // 保存绘制记录
      this.addHistoy();
      return;
    }
    // 保存绘制后的图形位置信息
    this.drawGraphPosition = this.tempGraphPosition;
    // 如果工具栏未点击则保存裁剪框位置
    if (!this.data.getToolClickStatus().value) {
      const { startX, startY, width, height } = this.drawGraphPosition;
      this.data.setCutOutBoxPosition(startX, startY, width, height);
    }
    // 保存边框节点信息
    this.cutOutBoxBorderArr = saveBorderArrInfo(
      this.borderSize,
      this.drawGraphPosition
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
            this.drawGraphPosition,
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
              if (this.data.getToolClickStatus().value) {
                this.screenShortController.value.style.cursor = "crosshair";
              } else {
                this.screenShortController.value.style.cursor = "move";
              }
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
        this.tempGraphPosition = drawCutOutBox(
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
        this.tempGraphPosition = drawCutOutBox(
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

  /**
   * 裁剪框工具栏点击事件
   * @param toolName
   * @param index
   * @param mouseEvent
   */
  public toolClickEvent = (
    toolName: string,
    index: number,
    mouseEvent: MouseEvent
  ) => {
    // 更新当前点击的工具栏条目
    this.toolName = toolName;
    this.data.setToolName(toolName);
    // 为当前点击项添加选中时的class名
    setSelectedClassName(mouseEvent, index, false);
    if (toolName != "text") {
      // 显示画笔选择工具栏
      this.data.setOptionStatus(true);
      // 设置画笔选择工具栏三角形角标位置
      this.data.setOptionIcoPosition(calculateOptionIcoPosition(index));
    } else {
      // 隐藏画笔工具栏
      this.data.setOptionStatus(false);
    }
    // 清空文本输入区域的内容并隐藏文本输入框
    if (this.textInputController?.value != null && this.data.getTextStatus()) {
      this.textInputController.value.innerHTML = "";
      this.data.setTextStatus(false);
    }
    // 初始化点击状态
    this.dragging = false;
    this.draggingTrim = false;

    // 保存图片
    if (toolName == "save") {
      this.getCanvasImgData(true);
    }
    // 销毁组件
    if (toolName == "close") {
      this.resetComponent();
    }
    // 确认截图
    if (toolName == "confirm" && this.screenShortCanvas && this.emit) {
      const base64 = this.getCanvasImgData(false);
      this.emit("get-image-data", base64);
    }
    // 撤销
    if (toolName == "undo") {
      // 隐藏画笔选项工具栏
      this.data.setOptionStatus(false);
      this.takeOutHistory();
    }

    // 设置裁剪框工具栏为点击状态
    this.data.setToolClickStatus(true);
  };

  /**
   * 保存当前画布状态
   * @private
   */
  private addHistoy() {
    if (
      this.screenShortCanvas != null &&
      this.screenShortController.value != null
    ) {
      // 获取canvas画布与容器
      const context = this.screenShortCanvas;
      const controller = this.screenShortController.value;
      if (this.history.length > this.maxUndoNum) {
        // 删除最早的一条画布记录
        this.history.unshift();
      }
      // 保存当前画布状态
      this.history.push({
        data: context.getImageData(0, 0, controller.width, controller.height)
      });
      // 启用撤销按钮
      this.data.setUndoStatus(true);
    }
  }

  /**
   * 显示最新的画布状态
   * @private
   */
  private showLastHistory() {
    if (this.screenShortCanvas != null) {
      const context = this.screenShortCanvas;
      if (this.history.length <= 0) {
        this.addHistoy();
      }
      context.putImageData(this.history[this.history.length - 1]["data"], 0, 0);
    }
  }

  /**
   * 取出一条历史记录
   */
  private takeOutHistory() {
    const lastImageData = this.history.pop();
    if (this.screenShortCanvas != null && lastImageData) {
      const context = this.screenShortCanvas;
      if (this.undoClickNum == 0 && this.history.length > 0) {
        // 首次取出需要取两条历史记录
        const firstPopImageData = this.history.pop() as Record<string, any>;
        context.putImageData(firstPopImageData["data"], 0, 0);
      } else {
        context.putImageData(lastImageData["data"], 0, 0);
      }
    }

    this.undoClickNum++;
    // 历史记录已取完，禁用撤回按钮点击
    if (this.history.length <= 0) {
      this.undoClickNum = 0;
      this.data.setUndoStatus(false);
    }
  }

  /**
   * 重置组件
   */
  private resetComponent = () => {
    if (this.emit) {
      // 隐藏截图工具栏
      this.data.setToolStatus(false);
      // 初始化响应式变量
      this.data.setInitStatus(true);
      // 销毁组件
      this.emit("destroy-component", false);
      return;
    }
    throw "组件重置失败";
  };

  /**
   * 将指定区域的canvas转为图片
   * @private
   */
  private getCanvasImgData = (isSave: boolean) => {
    // 获取裁剪区域位置信息
    const { startX, startY, width, height } = this.data.getCutOutBoxPosition();
    let base64 = "";
    // 保存图片,需要减去八个点的大小
    if (this.screenShortCanvas) {
      if (isSave) {
        // 将canvas转为图片
        saveCanvasToImage(
          this.screenShortCanvas,
          startX + this.borderSize / 1.5,
          startY + this.borderSize / 1.5,
          width - this.borderSize * 1.5,
          height - this.borderSize * 1.5
        );
      } else {
        // 将canvas转为base64
        base64 = saveCanvasToBase64(
          this.screenShortCanvas,
          startX + this.borderSize / 1.5,
          startY + this.borderSize / 1.5,
          width - this.borderSize * 1.5,
          height - this.borderSize * 1.5
        );
      }
    }
    // 重置组件
    this.resetComponent();
    return base64;
  };
}
