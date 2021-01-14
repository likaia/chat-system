import { Ref } from "vue";
import isImg from "@/module/message-display/common-methords/IsImg";
import compressPic from "@/module/message-display/common-methords/CompressPic";
import _ from "lodash";
import { readPasteType } from "@/type/ComponentDataType";
import initData from "@/module/message-display/main-entrance/InitData";

/**
 * 读取剪切板数据
 */
export default function readPasteData(
  clipboardEvent?: ClipboardEvent
): readPasteType | void {
  if (clipboardEvent == null) {
    return;
  }
  const data = initData();
  // 获取输入框DOM, 使用V3的响应式API来替代this.$refs
  const msgInputContainer: Ref<HTMLDivElement | null> = data.msgInputContainer;
  // 处理文本数据，移除样式
  clipboardEvent.preventDefault();
  const text =
    clipboardEvent.clipboardData &&
    clipboardEvent.clipboardData.getData("text/plain");
  if (text?.includes("gif")) {
    alert("无法上传gif，请使用工具栏中的选择图片");
    return;
  }
  // text存在且不是img则将其插入可编辑div中
  if (!_.isEmpty(text) && !_.isNull(text) && !isImg(text)) {
    document.execCommand("insertText", false, text);
  }
  // 读取图片
  const items =
    clipboardEvent.clipboardData && clipboardEvent.clipboardData.items;
  let file: Blob | null = null;
  if (items && items.length) {
    // 检索剪切板items
    for (const item of Array.from(items)) {
      if (item.type.indexOf("image") !== -1) {
        file = item.getAsFile();
        break;
      }
    }
  }
  // 预览图片
  const reader = new FileReader();
  reader.onload = event => {
    // 图片内容
    const imgContent = event.target?.result;
    // 创建img标签
    const img = document.createElement("img");
    // 获取当前base64图片信息，计算当前图片宽高以及压缩比例
    const imgObj = new Image();
    let imgWidth: number;
    let imgHeight: number;
    let scale = 1;
    imgObj.src = imgContent as string;
    imgObj.onload = () => {
      // 计算img宽高
      if (imgObj.width < 400) {
        imgWidth = imgObj.width;
        imgHeight = imgObj.height;
      } else {
        // 输入框图片显示缩小10倍
        imgWidth = imgObj.width / 10;
        imgHeight = imgObj.height / 10;
        // 图片宽度大于1920，图片压缩1.5倍
        if (imgObj.width > 1920) {
          // 真实比例缩小1.5倍
          scale = 1.5;
        }
      }
      // 设置可编辑div中图片宽高
      img.width = imgWidth;
      img.height = imgHeight;
      // 压缩图片，渲染页面
      compressPic(
        imgContent as string,
        scale,
        (newBlob: Blob, newBase: string) => {
          img.src = newBase; // 设置链接
          // 图片渲染
          if (msgInputContainer.value != null) {
            // V3改动需要在原方法上加.value去访问其他方法
            msgInputContainer.value.append(img);
          }
        }
      );
    };
  };
  if (file) {
    // 文件不为空时渲染
    reader.readAsDataURL(file);
  }
}
