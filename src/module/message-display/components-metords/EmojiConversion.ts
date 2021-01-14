/**
 * 显示动态表情
 * @param event
 * @param status
 * @param path
 * @param hoverPath
 * @param info
 */
export default function emojiConversion(
  event: Event,
  status: string,
  path: string,
  hoverPath: string,
  info: string
) {
  if (status === "over") {
    (event.target as HTMLImageElement).src = require(`@/assets/img/emoji/${hoverPath}`);
  } else if (status === "click") {
    // 表情输入
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const imgSrc = require(`@/assets/img/emoji/${hoverPath}`);
    const imgTag = `<img src="${imgSrc}" width="28" height="28" alt="${info}">`;
    document.execCommand("insertHTML", false, imgTag);
  } else {
    (event.target as HTMLImageElement).src = require(`@/assets/img/emoji/${path}`);
  }
}
