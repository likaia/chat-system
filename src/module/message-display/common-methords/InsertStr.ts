/**
 * 将字符插入字符串的指定位置
 * @param source
 * @param start
 * @param newStr
 */
export default function insertStr(
  source: string,
  start: number,
  newStr: string
) {
  return source.slice(0, start) + newStr + source.slice(start);
}
