import { msgListType } from "@/type/ComponentDataType";
import messageParsing from "@/module/message-display/split-method/MessageParsing";
import initData from "@/module/message-display/main-entrance/InitData";

export default function renderPage(
  msgArray: Array<msgListType>,
  msgObj: msgListType,
  insertStart?: boolean
) {
  // 获取data中的数据
  const data = initData();
  // 待渲染消息总条数
  const msgTotals = data.msgTotals;
  if (msgArray.length > 0) {
    // 赋值待渲染消息总条数
    msgTotals.value = msgArray.length;
    // 页面更新，渲染消息内容列表数据
    for (let i = 0; i < msgArray.length; i++) {
      const thisSenderMessageObj: msgListType = {
        msgText: msgArray[i].msgText,
        avatarSrc: msgArray[i].avatarSrc,
        userId: msgArray[i].userId,
        userName: msgArray[i].userName,
        createTime: msgArray[i].createTime
      };
      // 解析并渲染
      messageParsing(thisSenderMessageObj, insertStart).then();
    }
  } else {
    // 接收到服务端推送的新消息，渲染单个消息对象
    const thisSenderMessageObj: msgListType = {
      msgText: msgObj.msgText,
      avatarSrc: msgObj.avatarSrc,
      userId: msgObj.userId,
      userName: msgObj.userName,
      createTime: msgObj?.createTime
    };
    // 解析并渲染
    messageParsing(thisSenderMessageObj, insertStart).then();
  }
}
