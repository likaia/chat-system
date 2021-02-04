import { SetupContext } from "@vue/runtime-core";
import { onMounted, toRefs } from "vue";
import { imgPropsType } from "@/module/show-img/type/ShowImgDataType";
import InitData from "@/module/show-img/main-entrance/InitData";
import getQueryVariable from "@/module/message-display/common-methords/GetQueryVariable";

export default class EventMonitoring {
  private readonly data: InitData;
  constructor(props: imgPropsType, context: SetupContext<any>) {
    this.data = new InitData();
    // 将props改为响应式
    const prop = toRefs(props);
    this.data.setEmit(context.emit);
    this.data.setImgSrc(prop.src.value);
    onMounted(() => {
      // 获取图片宽高
      const imgWidth = getQueryVariable(this.data.getImgsrc().value, "width");
      const imgHeight = getQueryVariable(this.data.getImgsrc().value, "height");
      this.data.setPhotoControllerInfo(imgWidth, imgHeight + 55);
    });
  }
}
