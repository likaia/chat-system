import { msgListType, responseDataType } from "@/type/ComponentDataType";
import messageListAPI from "@/api/messageListAPI";
import { Ref } from "vue";
// 解决层级过深使用useStore获取数据为undefined问题
import $store from "@/store";
import renderPage from "@/module/message-display/split-method/RenderPage";
import _ from "lodash";
import initData from "@/module/message-display/main-entrance/InitData";

export default function readSessionData(
  pageStart: Ref<number>,
  pageEnd: Ref<number>
) {
  // 获取data中的数据
  const data = initData();
  const listId = data.listId;
  const isLoading = data.isLoading;
  const messageStatus = data.messageStatus;
  const sessionMessageData = data.sessionMessageData;
  const pageNo = data.pageNo;
  const pageSize = data.pageSize;
  const isLastPage = data.isLastPage;
  if (sessionMessageData.length === 0) {
    // 第一次从本地存储中拿数据，将其放进sessionMessageData中
    const sessionData: Array<msgListType> = JSON.parse(
      sessionStorage.getItem("messageTextList") as string
    );
    for (let i = 0; i < sessionData.length; i++) {
      sessionMessageData.push(sessionData[i]);
    }
  }
  // session分页参数边界处理
  if (pageStart.value < 0) {
    pageStart.value = 0;
  }
  if (pageEnd.value < 0) {
    pageEnd.value = 0;
  }
  // 待渲染的聊天记录
  const finalMsgList: Array<msgListType> = [];
  // 从尾部读取数据
  for (let i = pageEnd.value; i > pageStart.value; i--) {
    finalMsgList.push(sessionMessageData[i]);
  }
  if (finalMsgList.length !== 0) {
    // 渲染消息列表，插入到数组头部
    renderPage(finalMsgList, {}, true);
    // 更新起始位置与结束位置
    if (pageStart.value < pageSize.value) {
      // 数量不足，取出0至起始位置的值
      pageStart.value = 0;
      pageEnd.value = pageStart.value;
    } else {
      // 更新结束位置：起始位置
      pageEnd.value = pageStart.value;
      // 更新起始位置：结束位置-数据大小
      pageStart.value = pageEnd.value - pageSize.value;
    }
  } else {
    // 所有redis数据加载完毕，开始分页加载数据库数据
    if (isLastPage.value) {
      // 停止加载数据
      isLoading.value = false;
      return;
    }
    // 分页加载聊天记录
    messageListAPI
      .getMessageTextList({
        msgId: listId.value,
        userId: $store.state.userID,
        pageNo: pageNo.value,
        messageStatus: messageStatus.value,
        pageSize: pageSize.value
      })
      .then((res: responseDataType) => {
        if (_.isEqual(res.code, 0)) {
          // 判断是否最后一页, 修改其状态
          if (res.data.isLastPage) {
            isLastPage.value = true;
          }
          // 渲染消息列表，插入到数组头部
          renderPage(res.data.messageTextList, {}, true);
          // 页码自增
          pageNo.value++;
        }
      });
  }
}
