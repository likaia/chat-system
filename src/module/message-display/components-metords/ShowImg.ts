import initData from "@/module/message-display/main-entrance/InitData";

export function showImg(src: string) {
  const data = initData();
  data.imgSrc.value = src;
  data.showImgStatus.value = true;
}
