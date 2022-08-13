/**
 * 显示动态表情
 * @param event
 * @param status
 * @param path
 * @param hoverPath
 * @param info
 */
import getImageUrl from "@/module/message-display/components-metords/GetImageUrl";

export default function emojiConversion(
  event: Event,
  status: string,
  path: string,
  hoverPath: string,
  info: string
) {
  if (status === "over") {
    (event.target as HTMLImageElement).src = getImageUrl(hoverPath, true);
  } else if (status === "click") {
    // 表情输入
    const imgSrc = getImageUrl(hoverPath, true);
    const imgTag = `<img src="${imgSrc}" width="28" height="28" alt="${info}">`;
    document.execCommand("insertHTML", false, imgTag);
  } else {
    (event.target as HTMLImageElement).src = getImageUrl(path, true);
  }
}
