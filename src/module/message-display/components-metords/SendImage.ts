import { responseDataType } from "@/type/ComponentDataType";
import _ from "lodash";
import initData from "@/module/message-display/main-entrance/InitData";

/**
 * 发送图片函数
 * @param e
 */
export default function sendImage(e: { target: { files: FileList } }) {
  // 获取传递的参数
  const data = initData();
  const listId = data.listId;
  const messageStatus = data.messageStatus;
  const buddyId = data.buddyId;
  // 获取当前实例，替代this
  const internalInstance = data.currentInstance;
  const $store = data.$store;
  // 获取File对象
  const file = e.target.files[0];
  // 创建文件读取流
  const fileReader = new FileReader();
  // 读取File对象
  fileReader.readAsDataURL(file);
  // 在异步函数中获取图片信息
  fileReader.onload = event => {
    const base64 = event.target?.result;
    const img = new Image();
    img.src = base64 as string;
    // 加载图片
    img.onload = () => {
      // 获取图片宽高
      const imgWidth = img.naturalWidth;
      const imgHeight = img.naturalHeight;
      // 构造form对象
      const formData = new FormData();
      // 后台取值字段 | blob文件数据 | 文件名称
      formData.append("file", file, "chatImg" + file.name);
      // 调用上传api
      internalInstance?.proxy.$api.fileManageAPI
        .upload(formData)
        .then((res: responseDataType) => {
          // 文件上传失败
          if (!_.isEqual(res.code, 0)) {
            alert(res.msg);
            return false;
          }
          const fileName = `/${res.fileName}?width=${imgWidth}&height=${imgHeight}/`;
          // 消息发送: 发送图片
          internalInstance?.proxy.$socket.sendObj({
            msg: fileName,
            buddyId: buddyId.value,
            messageStatus: messageStatus.value,
            code: 0,
            avatarSrc: $store.state.profilePicture,
            token: $store.state.refreshToken,
            msgId: listId.value
          });
        });
    };
  };
}
