import initData from "@/module/message-display/main-entrance/InitData";

export function destroyShowImg(status: boolean) {
  const data = initData();
  data.showImgStatus.value = status;
}
