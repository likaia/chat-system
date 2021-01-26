import { ComponentInternalInstance, ref } from "vue";
import { Store } from "vuex";

// 截图容器宽高
const screenShortWidth = ref<number>(0);
const screenShortHeight = ref<number>(0);

// 截图工具栏展示状态与位置
const toolStatus = ref<boolean>(false);
const toolLeft = ref<number>(0);
const toolTop = ref<number>(0);

// 截图工具栏点击状态
const toolClickStatus = ref<boolean>(false);

// 获取截图容器dom
let screenShortController = ref<HTMLCanvasElement | null>(null);
// 获取截图工具栏容器dom
let toolController = ref<HTMLDivElement | null>(null);
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
      toolStatus.value = false;
      emit = undefined;
      $store = undefined;
      currentInstance = undefined;
      toolClickStatus.value = false;
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

  // 获取截图工具栏展示状态
  public getToolStatus() {
    return toolStatus;
  }

  // 设置截图工具栏展示状态
  public setToolStatus(status: boolean) {
    toolStatus.value = status;
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
