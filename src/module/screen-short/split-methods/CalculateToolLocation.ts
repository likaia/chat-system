import { cutBoxBorderType } from "@/module/screen-short/type/ComponentType";

/**
 * 计算截图工具栏位置
 * @param position 裁剪框位置信息
 * @param toolWidth 截图工具栏宽度
 */
export function calculateToolLocation(
  position: cutBoxBorderType,
  toolWidth: number
) {
  // 工具栏X轴坐标 = (裁剪框的宽度 - 工具栏的宽度) / 2 + 裁剪框距离左侧的距离
  const mouseX = (position.width - toolWidth) / 2 + position.startX;
  // 工具栏Y轴坐标
  const mouseY = position.startY + position.height + 10;
  return {
    mouseX,
    mouseY
  };
}
