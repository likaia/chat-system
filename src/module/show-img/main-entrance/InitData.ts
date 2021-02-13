import { ref } from "vue";

let photoContainer = ref<HTMLDivElement | null>(null);
const topContainer = ref<HTMLDivElement | null>(null);
const photoContainerWidth = ref<number>(0);
const photoContainerHeight = ref<number>(0);
const photoContainerTop = ref<number>(0);
const photoContainerLeft = ref<number>(0);
const imgSrc = ref<string>("");
const leftIco = ref<boolean>(false);
// 事件处理
let emit: ((event: string, ...args: any[]) => void) | undefined;

// 数据初始化标识
let initStatus = false;

export default class InitData {
  constructor() {
    // 标识为true时则初始化数据
    if (initStatus) {
      photoContainer = ref<HTMLDivElement | null>(null);
      emit = undefined;
      photoContainerWidth.value = 0;
      photoContainerHeight.value = 0;
      photoContainerTop.value = 0;
      photoContainerLeft.value = 0;
      imgSrc.value = "";
      leftIco.value = false;
      // 初始化成功后将标示设为false
      initStatus = false;
    }
  }

  // 获取图片容器
  public getPhotoContainer() {
    return photoContainer;
  }
  // 获取顶部拖拽区域容器
  public getTopContainer() {
    return topContainer;
  }

  // 设置图片容器宽高
  public setPhotoControllerInfo(width: number, height: number) {
    photoContainerWidth.value = width;
    photoContainerHeight.value = height;
  }

  // 获取图片容器宽高
  public getPhotoControllerWidth() {
    return photoContainerWidth;
  }
  public getPhotoControllerHeight() {
    return photoContainerHeight;
  }

  // 获取图片容器位置
  public getPhotoContainerTop() {
    return photoContainerTop;
  }
  public getPhotoContainerLeft() {
    return photoContainerLeft;
  }
  // 设置图片容器位置
  public setPhotoContainerPosition(left: number, top: number) {
    photoContainerTop.value = top;
    photoContainerLeft.value = left;
  }

  // 获取/设置图片地址
  public getImgsrc() {
    return imgSrc;
  }
  public setImgSrc(src: string) {
    imgSrc.value = src;
  }

  // 获取/设置左侧图标展示状态
  public getLeftIcoStatus() {
    return leftIco;
  }
  public setLeftIcoStatus(status: boolean) {
    leftIco.value = status;
  }

  // 设置/获取emit
  public setEmit(emitParam: (event: string, ...args: any[]) => void) {
    emit = emitParam;
  }
  public getEmit() {
    return emit;
  }

  // 销毁组件
  public destroyComponent() {
    if (emit == null) return;
    // 数据初始化标示设为true
    initStatus = true;
    emit("destroy-component", false);
  }
}
