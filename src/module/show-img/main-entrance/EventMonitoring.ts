import { SetupContext } from "@vue/runtime-core";
import { onMounted, Ref, toRefs } from "vue";
import { imgPropsType } from "@/module/show-img/type/ShowImgDataType";
import InitData from "@/module/show-img/main-entrance/InitData";
import getQueryVariable from "@/module/message-display/common-methords/GetQueryVariable";
import {
  fixedData,
  nonNegativeData
} from "@/module/message-display/common-methords/FixedData";

export default class EventMonitoring {
  private readonly data: InitData;
  private photoContainer: Ref<HTMLDivElement | null>;
  private topContainer: Ref<HTMLDivElement | null>;
  private mouseStartX = 0;
  private mouseStartY = 0;
  private dragging = false;
  constructor(props: imgPropsType, context: SetupContext<any>) {
    this.data = new InitData();
    // 将props改为响应式
    const prop = toRefs(props);
    this.data.setEmit(context.emit);
    this.data.setImgSrc(prop.src.value);
    this.photoContainer = this.data.getPhotoContainer();
    this.topContainer = this.data.getTopContainer();
    onMounted(() => {
      // 获取图片宽高
      const imgWidth = getQueryVariable(this.data.getImgsrc().value, "width");
      const imgHeight = getQueryVariable(this.data.getImgsrc().value, "height");
      this.data.setPhotoControllerInfo(imgWidth, imgHeight + 55);
      // 添加监听
      this.topContainer.value?.addEventListener(
        "mousedown",
        this.mouseDownEvent
      );
      this.topContainer.value?.addEventListener(
        "mousemove",
        this.mouseMoveEvnet
      );
      this.topContainer.value?.addEventListener("mouseup", this.mouseUpEvent);
      document.body.addEventListener("keydown", event => {
        if (event.key == "Escape") {
          // 销毁组件
          this.data.destroyComponent();
        }
      });
    });
  }

  private mouseDownEvent = (event: MouseEvent) => {
    if (this.photoContainer.value == null) return;
    // 禁止页面选中
    document.onselectstart = () => false;
    // 获取图片预览容器相对于视窗的位置集合
    const movePosition = this.photoContainer.value.getBoundingClientRect();
    // 获取当前鼠标x、y轴坐标
    const mouseX = nonNegativeData(event.clientX);
    const mouseY = nonNegativeData(event.clientY);
    // 鼠标起始点坐标 = 当前坐标 - 元素距离视窗的距离
    this.mouseStartX = mouseX - movePosition.left;
    this.mouseStartY = mouseY - movePosition.top;
    this.dragging = true;
  };

  private mouseMoveEvnet = (event: MouseEvent) => {
    // 不处于拖拽状态或者照片预览容器为null则return
    if (!this.dragging || this.photoContainer.value == null) return;
    // 移除初始化时的居中属性
    this.photoContainer.value?.classList.remove("center");
    // 获取当前鼠标坐标
    const currentX = nonNegativeData(event.clientX);
    const currentY = nonNegativeData(event.clientY);
    // 修改鼠标状态为拖动
    this.photoContainer.value.style.cursor = "move";
    // 计算图片预览容器位置
    const left = fixedData(
      currentX - this.mouseStartX,
      this.data.getPhotoControllerWidth().value,
      window.innerWidth
    );
    const top = fixedData(
      currentY - this.mouseStartY,
      this.data.getPhotoControllerHeight().value,
      window.innerHeight
    );
    // 修改照片预览容器位置
    this.data.setPhotoContainerPosition(left, top);
  };

  private mouseUpEvent = () => {
    if (this.photoContainer.value == null) return;
    // 修改鼠标状态为正常
    this.photoContainer.value.style.cursor = "default";
    // 恢复页面选中
    document.onselectstart = () => true;
    this.dragging = false;
  };
}
