import { msgListType, responseDataType } from "@/type/ComponentDataType";
import renderPage from "@/module/message-display/split-method/RenderPage";
import initData from "@/module/message-display/main-entrance/InitData";
import messageListAPI from "@/api/messageListAPI";

/**
 * 获取消息内容列表
 * @param msgId
 */
export default function getMessageTextList(msgId: string) {
  // 获取传递的参数
  const data = initData();
  // 获取传递的参数
  const messageStatus = data.messageStatus;
  const pageNo = data.pageNo;
  const pageSize = data.pageSize;
  const isLastPage = data.isLastPage;
  const pageStart = data.pageStart;
  const pageEnd = data.pageEnd;
  const $store = data.$store;
  messageListAPI
    .getMessageTextList({
      msgId: msgId,
      userId: $store.state.userID,
      messageStatus: messageStatus.value
    })
    .then((res: responseDataType) => {
      // 消息内容列表
      const messageTextList: Array<msgListType> = res.data.messageTextList;
      // 如果已经从数据库取了一次数据，分页参数自增
      if (res.data.isFirstDBLoad) {
        pageNo.value++;
      }
      // 赋值当前数据是否为最后一页数据
      isLastPage.value = res.data.isLastPage;
      if (res.code === 0) {
        if (messageTextList.length > 0) {
          // 将聊天记录放进sessionStorage中
          sessionStorage.setItem(
            "messageTextList",
            JSON.stringify(messageTextList)
          );
          // 截取特定条数消息
          const finalMsgList: Array<msgListType> = [];
          // 结束位置：数组长度
          pageEnd.value = messageTextList.length;
          // 起始位置：结束位置-数据大小
          pageStart.value = pageEnd.value - pageSize.value;
          if (pageStart.value < 0) {
            // 起始位置不能为负数
            pageStart.value = 0;
          }
          // 截取起始位置至结束位置的数据
          for (let i = pageStart.value; i < pageEnd.value; i++) {
            finalMsgList.push(messageTextList[i]);
          }
          // 更新结束位置：起始位置-1
          // 触顶加载数据为倒序读取, 此处为正序读取
          // i = pageStart.value, 最后一条数据已经渲染了
          // 触顶渲染时 i = pageEnd.value，最后一条数据就会重复渲染
          // 因此需要-1
          pageEnd.value = pageStart.value - 1;
          // 更新起始位置：结束位置-数据大小
          pageStart.value = pageEnd.value - pageSize.value;
          // 渲染消息列表
          renderPage(finalMsgList, {});
        }
      } else {
        alert(res.msg);
      }
    });
}
