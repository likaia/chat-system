// 切换三个小圆点的展示状态
import InitData from "@/module/show-img/main-entrance/InitData";

export function showLeftIco(status: boolean) {
  const data = new InitData();
  data.setLeftIcoStatus(status);
}
