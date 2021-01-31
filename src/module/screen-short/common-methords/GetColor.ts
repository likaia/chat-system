import InitData from "@/module/screen-short/main-entrance/InitData";

export function getColor(index: number) {
  const data = new InitData();
  let currenColor = "#F53440";
  switch (index) {
    case 1:
      currenColor = "#F53440";
      break;
    case 2:
      currenColor = "#F65E95";
      break;
    case 3:
      currenColor = "#D254CF";
      break;
    case 4:
      currenColor = "#12A9D7";
      break;
    case 5:
      currenColor = "#30A345";
      break;
    case 6:
      currenColor = "#FACF50";
      break;
    case 7:
      currenColor = "#F66632";
      break;
    case 8:
      currenColor = "#989998";
      break;
    case 9:
      currenColor = "#000000";
      break;
    case 10:
      currenColor = "#FEFFFF";
      break;
  }
  data.setSelectedColor(currenColor);
  // 隐藏颜色选择面板
  data.setColorPanelStatus(false);
  return currenColor;
}
