import initData from "@/module/message-display/main-entrance/InitData";
import getImageUrl from "@/module/message-display/components-metords/GetImageUrl";

/**
 *  创建群聊
 * @param status
 */
export default function createDisEvent(status: string) {
  // 创建群聊各状态图标路径
  const resourceObj: Record<string, string> = {
    createDisNormal: getImageUrl("titlebar_function_createDis_normal@2x.png"),
    createDisHover: getImageUrl("titlebar_function_createDis_hover@2x.png"),
    createDisClick: getImageUrl("titlebar_function_createDis_normal_p@2x.png")
  };
  const data = initData();
  const createDisSrc = data.createDisSrc;
  // 根据状态执行对应的事件
  switch (status) {
    case "hover":
      createDisSrc.value = resourceObj.createDisHover;
      break;
    case "leave":
      createDisSrc.value = resourceObj.createDisNormal;
      break;
    default:
      createDisSrc.value = resourceObj.createDisClick;
      break;
  }
}
