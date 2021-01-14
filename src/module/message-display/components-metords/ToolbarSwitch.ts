import _ from "lodash";
import toolbarEventHandling from "@/module/message-display/split-method/ToolbarEventHandling";
import getEditableDivFocus from "@/module/message-display/components-metords/GetEditableDivFocus";
import initData from "@/module/message-display/main-entrance/InitData";

export default function toolbarSwitch(
  status: string,
  event: Event,
  path: string,
  hoverPath: string,
  downPath: string,
  toolItemName: string
) {
  const data = initData();
  // 获取dom
  const selectImg = data.selectImg;
  if (selectImg.value == null) {
    return;
  }
  // 根据状态切换对应的图标
  switch (status) {
    case "hover" || "up":
      // 选择图片单独处理
      if (_.isEqual(toolItemName, "selectImg")) {
        selectImg.value.src = require(`@/assets/img/${hoverPath}`);
        break;
      }
      (event.target as HTMLImageElement).src = require(`@/assets/img/${hoverPath}`);
      break;
    case "leave":
      // 选择图片单独处理
      if (_.isEqual(toolItemName, "selectImg")) {
        selectImg.value.src = require(`@/assets/img/${path}`);
        break;
      }
      (event.target as HTMLImageElement).src = require(`@/assets/img/${path}`);
      break;
    case "down":
      // 可编辑div获取焦点
      getEditableDivFocus();
      // 选择图片单独处理
      if (_.isEqual(toolItemName, "selectImg")) {
        selectImg.value.src = require(`@/assets/img/${downPath}`);
        break;
      }
      (event.target as HTMLImageElement).src = require(`@/assets/img/${downPath}`);
      // 根据点击项执行对应的事件处理
      toolbarEventHandling(toolItemName);
      break;
    default:
      break;
  }
}
