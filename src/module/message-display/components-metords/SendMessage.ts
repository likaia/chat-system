import _ from "lodash";
import uploadImage from "@/module/message-display/split-method/UploadImage";
import convertBase64UrlToImgFile from "@/module/message-display/common-methords/ConvertBase64UrlToImgFile";
import initData from "@/module/message-display/main-entrance/InitData";

export default async function sendMessage(event?: KeyboardEvent) {
  if (event == null) {
    return;
  }
  // 获取传递的参数
  const data = initData();
  const listId = data.listId;
  const messageStatus = data.messageStatus;
  const buddyId = data.buddyId;
  const $store = data.$store;
  // 获取当前实例，替代this
  const internalInstance = data.currentInstance;
  // 阻止编辑框默认生成div事件
  event.preventDefault();
  // 获取输入框的内容
  let msgText = "";
  // 获取输入框下的所有子元素
  const allNodes = (event.target as Node).childNodes;
  for (const item of allNodes) {
    // 判断当前类型，获取元素内的内容
    switch (item.nodeName) {
      case "IMG":
        // 获取图片消息并拼接
        if (_.isEmpty((item as HTMLImageElement).alt)) {
          // 是图片
          let base64Img = (item as HTMLImageElement).src;
          // 删除base64图片的前缀
          base64Img = base64Img.replace(/^data:image\/\w+;base64,/, "");
          // 随机文件名
          const fileName = new Date().getTime() + "chatImg" + ".jpeg";
          // 将base64转换成file
          const imgFile = convertBase64UrlToImgFile(
            base64Img,
            fileName,
            "image/jpeg"
          );
          const formData = new FormData();
          // 此处的file与后台取值时的属性一样,append时需要添加文件名，否则一直是blob
          formData.append("file", imgFile, fileName);
          // 上传图片获取图片地址
          const res: { code: number; msg: string } = await uploadImage(
            formData
          );
          // 将图片地址拼接至待发送消息中
          msgText += res.msg;
        } else {
          // 是表情，向msgText追加内容
          msgText += `/${(item as HTMLImageElement).alt}/`;
        }
        break;
      case "DIV":
        // 获取div元素节点的值
        msgText += (item as HTMLDivElement)?.innerText;
        break;
      case "#text":
        // 获取文本消息并拼接
        msgText += item.nodeValue;
        break;
      default:
        throw "不支持的元素类型" + item;
    }
  }
  // 消息发送: 发送文字，为空则不发送
  if (msgText.trim().length > 0) {
    // 标识当前消息为发送端
    data.isSendMessages.value = true;
    // 获取$socket
    internalInstance?.proxy.$socket.sendObj({
      msg: msgText,
      buddyId: buddyId.value,
      messageStatus: messageStatus.value,
      code: 0,
      avatarSrc: $store.state.profilePicture,
      token: $store.state.refreshToken,
      msgId: listId.value
    });
    // 清空输入框中的内容
    (event.target as Element).innerHTML = "";
  }
}
