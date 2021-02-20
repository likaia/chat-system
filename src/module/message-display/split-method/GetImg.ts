/**
 * 获取裁剪后的图片
 */
import getEditableDivFocus from "@/module/message-display/components-metords/GetEditableDivFocus";

export default function getImg(base64: string) {
  // 可编辑div获取焦点
  getEditableDivFocus();
  const imgTag = `<img src="${base64}">`;
  // 将图片插入剪切板
  document.execCommand("insertHTML", false, imgTag);
}
