/**
 * 判断是字符串数据是否为图片
 * @param str
 */
export default function isImg(str: string) {
  return (
    str.includes("jpeg") ||
    str.includes("png") ||
    str.includes("jpg") ||
    str.includes("gif")
  );
}
