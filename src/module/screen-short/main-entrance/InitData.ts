import { ComponentInternalInstance, ref } from "vue";
import { Store } from "vuex";

const screenshortLeftPosition = ref<number>(0); // 截图框选区域距离屏幕左侧的位置
const screenshortTopPosition = ref<number>(0); // 截图框选区域距离屏幕左侧的位置
const screenshortSelectAreaWidth = ref<number>(0); // 截图框选区域宽度
const screenshortSelectAreaHeight = ref<number>(0); // 截图框选区域高度
const mouseDownStatus = ref<boolean>(false); // 鼠标是否按下
const mouseX = ref<number>(0); // 鼠标的X轴位置
const mouseY = ref<number>(0); // 鼠标的Y轴位置
const mouseL = ref<number>(0); // 鼠标距离左边的偏移量
const mouseT = ref<number>(0); // 鼠标距离顶部的偏移量
// 获取截图选择框dom
const frameSelectionController = ref<HTMLDivElement | null>(null);
// 获取截图区域dom
const screenShortController = ref<HTMLDivElement | null>(null);
let emit: ((event: string, ...args: any[]) => void) | undefined; // 事件处理
// store与当前实例
let $store: Store<any> | undefined;
let currentInstance: ComponentInternalInstance | null | undefined;
// 数据是否存在
let hasData: boolean | undefined;

export default class InitData {
  constructor() {
    // 数据为空时则初始化数据
    if (!hasData) {
      // 初始化完成设置其值为true
      hasData = true;
      screenshortLeftPosition.value = 0;
      screenshortTopPosition.value = 0;
      mouseDownStatus.value = false;
      mouseX.value = 0;
      mouseY.value = 0;
      mouseL.value = 0;
      mouseT.value = 0;
    }
  }

  /**
   * 设置hasData属性
   * @param ststus
   */
  public setHasData(ststus: boolean) {
    hasData = ststus;
  }

  // 获取截图框选区域距离屏幕左侧的位置
  public getScreenshortLeftPosition() {
    return screenshortLeftPosition;
  }

  // 获取截图框选区域距离屏幕顶部的位置
  public getScreenshortTopPosition() {
    return screenshortTopPosition;
  }

  // 获取鼠标是否按下状态
  public getMouseDownStatus() {
    return mouseDownStatus;
  }

  // 获取鼠标位置
  public getMouseX() {
    return mouseX;
  }
  public getMouseY() {
    return mouseY;
  }
  public getMouseL() {
    return mouseL;
  }
  public getMouseT() {
    return mouseT;
  }

  // 设置鼠标位置
  public setMouseX(valueX: number) {
    mouseX.value = valueX;
  }
  public setMouseY(valueY: number) {
    mouseY.value = valueY;
  }
  public setMouseL(valueL: number) {
    mouseL.value = valueL;
  }
  public setMouseT(valueT: number) {
    mouseT.value = valueT;
  }

  /**
   * 设置截图框选区域宽高
   * @param width
   * @param height
   */
  public setScreenshortSelectAreaInfo(width: number, height: number) {
    screenshortSelectAreaWidth.value = width;
    screenshortSelectAreaHeight.value = height;
  }

  // 获取截图选框区域宽高
  public getScreenshortSelectWidth() {
    return screenshortSelectAreaWidth;
  }
  public getScreenshortSelectHeight() {
    return screenshortSelectAreaHeight;
  }

  // 获取截图框选区域dom
  public getFrameSelectionController() {
    return frameSelectionController;
  }

  // 获取截图区域dom
  public getScreenShortController() {
    return screenShortController;
  }

  // 设置鼠标是否按下状态
  public setMouseDownStatus(status: boolean) {
    mouseDownStatus.value = status;
  }

  /**
   * 设置截图框选区域位置
   * @param leftPosition
   * @param topPosition
   */
  public setScreenshortPosition(leftPosition: number, topPosition: number) {
    screenshortLeftPosition.value = leftPosition;
    screenshortTopPosition.value = topPosition;
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
