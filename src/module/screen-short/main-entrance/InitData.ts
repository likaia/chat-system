import { ComponentInternalInstance, ref } from "vue";
import { Store } from "vuex";
import { positionInfoType } from "@/module/screen-short/type/ComponentType";

// 截图容器宽高
const screenShortWidth = ref<number>(0);
const screenShortHeight = ref<number>(0);

// 截图工具栏展示状态与位置
const toolStatus = ref<boolean>(false);
const toolLeft = ref<number>(0);
const toolTop = ref<number>(0);

// 截图工具栏点击状态
const toolClickStatus = ref<boolean>(false);
// 截图工具栏画笔选择显示状态
const optionStatus = ref<boolean>(false);
// 颜色面板展示状态
const colorPanelStatus = ref<boolean>(false);
// 当前选择的颜色
const selectedColor = ref<string>("#F53340");
// 当前点击的工具栏名称
const toolName = ref<string>("");
//  当前选择的画笔大小
const penSize = ref<number>(2);
// 文本输入工具栏点击状态
const textClickStatus = ref<boolean>(false);
// 撤销状态
const undoStatus = ref<boolean>(false);
// 裁剪框位置参数
let cutOutBoxPosition: positionInfoType = {
  startX: 0,
  startY: 0,
  width: 0,
  height: 0
};
// 截图工具栏画笔选择三角形角标位置
const optionIcoPosition = ref<number>(0);

// 获取截图容器dom
let screenShortController = ref<HTMLCanvasElement | null>(null);
// 获取截图工具栏容器dom
let toolController = ref<HTMLDivElement | null>(null);
// 获取文本输入区域dom
let textInputController = ref<HTMLDivElement | null>(null);
// 截图工具栏画笔选择dom
let optionIcoController = ref<HTMLDivElement | null>(null);
let optionController = ref<HTMLDivElement | null>(null);
// 事件处理
let emit: ((event: string, ...args: any[]) => void) | undefined;

// store与当前实例
let $store: Store<any> | undefined;
let currentInstance: ComponentInternalInstance | null | undefined;

// 数据初始化标识
let initStatus = false;

export default class InitData {
  constructor() {
    // 标识为true时则初始化数据
    if (initStatus) {
      // 初始化完成设置其值为false
      initStatus = false;
      screenShortWidth.value = 0;
      screenShortHeight.value = 0;
      screenShortController = ref(null);
      toolController = ref(null);
      textInputController = ref(null);
      optionController = ref(null);
      optionIcoController = ref(null);
      cutOutBoxPosition = {
        startX: 0,
        startY: 0,
        width: 0,
        height: 0
      };
      toolStatus.value = false;
      optionStatus.value = false;
      colorPanelStatus.value = false;
      emit = undefined;
      $store = undefined;
      currentInstance = undefined;
      toolClickStatus.value = false;
      optionIcoPosition.value = 0;
      selectedColor.value = "#F53340";
      toolName.value = "";
      penSize.value = 2;
    }
  }

  // 设置数据初始化标识
  public setInitStatus(status: boolean) {
    initStatus = status;
  }

  // 获取数据初始化标识
  public getInitStatus() {
    return initStatus;
  }

  // 获取截图容器宽高
  public getScreenShortWidth() {
    return screenShortWidth;
  }
  public getScreenShortHeight() {
    return screenShortHeight;
  }

  // 设置截图容器宽高
  public setScreenShortInfo(width: number, height: number) {
    screenShortWidth.value = width;
    screenShortHeight.value = height;
  }

  // 获取截图容器dom
  public getScreenShortController() {
    return screenShortController;
  }

  // 获取截图工具栏dom
  public getToolController() {
    return toolController;
  }

  // 获取文本输入区域dom
  public getTextInputController() {
    return textInputController;
  }

  // 获取截图工具栏展示状态
  public getToolStatus() {
    return toolStatus;
  }

  // 获取文本输入工具栏展示状态
  public getTextStatus() {
    return textClickStatus;
  }

  // 设置截图工具栏展示状态
  public setToolStatus(status: boolean) {
    toolStatus.value = status;
  }

  // 设置文本输入工具栏展示状态
  public setTextStatus(status: boolean) {
    textClickStatus.value = status;
  }

  // 获取截图工具位置信息
  public getToolLeft() {
    return toolLeft;
  }
  public getToolTop() {
    return toolTop;
  }

  // 设置截图工具位置信息
  public setToolInfo(left: number, top: number) {
    toolLeft.value = left;
    toolTop.value = top;
  }

  // 获取截图工具栏点击状态
  public getToolClickStatus() {
    return toolClickStatus;
  }

  // 设置截图工具栏点击状态
  public setToolClickStatus(status: boolean) {
    toolClickStatus.value = status;
  }

  // 获取裁剪框位置信息
  public getCutOutBoxPosition() {
    return cutOutBoxPosition;
  }

  // 设置裁剪框位置信息
  public setCutOutBoxPosition(
    mouseX: number,
    mouseY: number,
    width: number,
    height: number
  ) {
    cutOutBoxPosition.startX = mouseX;
    cutOutBoxPosition.startY = mouseY;
    cutOutBoxPosition.width = width;
    cutOutBoxPosition.height = height;
  }

  // 获取撤销状态
  public getUndoStatus() {
    return undoStatus;
  }
  // 设置撤销状态
  public setUndoStatus(status: boolean) {
    undoStatus.value = status;
  }

  // 获取/设置截图工具栏画笔选择工具展示状态
  public getOptionStatus() {
    return optionStatus;
  }
  public setOptionStatus(status: boolean) {
    optionStatus.value = status;
  }

  // 获取截图工具栏画笔选择工具dom
  public getOptionIcoController() {
    return optionIcoController;
  }
  public getOptionController() {
    return optionController;
  }

  // 获取/设置三角形角标位置
  public getOptionIcoPosition() {
    return optionIcoPosition;
  }
  public setOptionIcoPosition(position: number) {
    optionIcoPosition.value = position;
  }

  // 获取/设置颜色选择面板显示状态
  public getColorPanelStatus() {
    return colorPanelStatus;
  }
  public setColorPanelStatus(status: boolean) {
    colorPanelStatus.value = status;
  }

  // 获取/设置当前选择的颜色
  public getSelectedColor() {
    return selectedColor;
  }
  public setSelectedColor(color: string) {
    selectedColor.value = color;
  }

  // 获取/设置当前点击的工具栏条目名称
  public getToolName() {
    return toolName;
  }
  public setToolName(itemName: string) {
    toolName.value = itemName;
  }

  // 获取/设置当前画笔大小
  public getPenSize() {
    return penSize;
  }
  public setPenSize(size: number) {
    penSize.value = size;
  }

  /**
   * 设置父组件传递的数据
   * @param emitParam
   */
  public setPropsData(emitParam: (event: string, ...args: any[]) => void) {
    emit = emitParam;
  }

  /**
   * 设置实例属性
   * @param storeParam
   * @param instanceParam
   */
  public setProperty(
    storeParam: Store<any>,
    instanceParam: ComponentInternalInstance | null
  ) {
    $store = storeParam;
    currentInstance = instanceParam;
  }

  // 获取store
  public getStore() {
    return $store;
  }

  // 获取当前实例
  public getCurrentInstance() {
    return currentInstance;
  }

  // 获取当前emit
  public getEmit() {
    return emit;
  }
}
