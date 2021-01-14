/**
 * 获取url参数
 * @param url
 * @param variable
 */
export default function getQueryVariable(
  url: string,
  variable: string
): number {
  // 对url进行截取
  url = url.substring(url.indexOf("?"), url.length);
  const query = url.substring(1);
  const vars = query.split("&");
  for (let i = 0; i < vars.length; i++) {
    const pair = vars[i].split("=");
    if (pair[0] == variable) {
      return Number(pair[1]);
    }
  }
  return -1;
}
