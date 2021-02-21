import readSessionData from "@/module/message-display/split-method/ReadSessionData";

import initData from "@/module/message-display/main-entrance/InitData";

// 消息容器滚动监听
export default function containerScroll() {
  // 获取data中的数据
  const data = initData();
  const messagesContainer = data.messagesContainer;
  if (messagesContainer.value == null) {
    return;
  }
  const isLoading = data.isLoading;
  const isFirstLoading = data.isFirstLoading;
  const pageStart = data.pageStart;
  const pageEnd = data.pageEnd;
  // 加载消息定时器
  let loadingtime = 0;
  // 滚动时显示滚动条，不滚动时隐藏滚动条
  let scrollTimer = 0;
  // 横向滚动条起始位置
  let levelPosition = messagesContainer.value.scrollLeft;
  // 监听messagesContainer容器滚动
  messagesContainer.value.onscroll = () => {
    if (messagesContainer.value == null) {
      return;
    }
    // 显示滚动条
    messagesContainer.value.classList.remove("transparent-scroll-bar");
    clearTimeout(scrollTimer);
    scrollTimer = setTimeout(() => {
      if (messagesContainer.value == null) {
        return;
      }
      // 隐藏滚动条
      messagesContainer.value.classList.add("transparent-scroll-bar");
    }, 500);
    // 触顶加载数据且不是页面第一次加载
    if (messagesContainer.value.scrollTop === 0 && !isFirstLoading.value) {
      // 横向滚动不加载数据
      if (messagesContainer.value.scrollLeft !== levelPosition) {
        // 更新滚动条位置
        levelPosition = messagesContainer.value.scrollLeft;
        return;
      }
      // 清理上次的消息定时器
      clearTimeout(loadingtime);
      // 显示加载动画
      isLoading.value = true;
      loadingtime = setTimeout(() => {
        // 加载数据
        readSessionData(pageStart, pageEnd);
      }, 500);
    }
  };
}
