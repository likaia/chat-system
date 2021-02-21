import { msgListType } from "@/type/ComponentDataType";
import base from "@/api/base";
import _ from "lodash";
import isImg from "@/module/message-display/common-methords/IsImg";
import getQueryVariable from "@/module/message-display/common-methords/GetQueryVariable";
import insertStr from "@/module/message-display/common-methords/InsertStr";
import getImageInfo from "@/module/message-display/common-methords/GetImageInfo";
import { nextTick, Ref } from "vue";
import initData from "@/module/message-display/main-entrance/InitData";
import { showImg } from "@/module/message-display/components-metords/ShowImg";

const bottomScrollBar = (
  scrollHeight: number,
  messagesContainer: Ref<HTMLDivElement>,
  isBottomOut: Ref<boolean>,
  msgListPanelHeight: Ref<number>,
  isFirstLoading: Ref<boolean>
) => {
  const data = initData();
  // 显示消息内容
  data.msgShowStatus.value = "";
  // 获取容器高度
  scrollHeight = messagesContainer.value.scrollHeight;
  // 当前滚动条在底部或者当前消息为发送端所发送的则修改滚动条位置
  if (isBottomOut.value || data.isSendMessages.value) {
    // 新消息渲染完成，修改滚动条位置
    messagesContainer.value.scrollTop = scrollHeight;
    // 更新消息记录容器高度
    msgListPanelHeight.value = scrollHeight;
    // 修改组件第一次加载状态为false
    isFirstLoading.value = false;
    // 修改消息发送端状态为false
    data.isSendMessages.value = false;
  }
};

export default async function messageParsing(
  msgObj: msgListType,
  insertStart?: boolean
) {
  // 消息内容为空不渲染
  if (msgObj.msgText == null) {
    return;
  }
  // 获取data中的数据
  const data = initData();
  const messagesContainer = data.messagesContainer;
  const emit = data.emit;
  const msgListPanelHeight = data.msgListPanelHeight;
  const msgTotals = data.msgTotals;
  const listId = data.listId;
  const messageStatus = data.messageStatus;
  const isLoading = data.isLoading;
  const isFirstLoading = data.isFirstLoading;
  const isBottomOut = data.isBottomOut;
  const senderMessageList = data.senderMessageList;
  const emojiList = data.emojiList;
  const $store = data.$store;
  // 解析接口返回的数据进行渲染
  const separateReg = /(\/[^/]+\/)/g;
  let msgText = msgObj.msgText as string;
  let finalMsgText: string;
  // 将符合条件的字符串放到数组里
  const resultArray = msgText.match(separateReg);
  if (resultArray !== null) {
    for (let item of resultArray) {
      // 删除字符串中的/符号
      item = item.replace(/\//g, "");
      // 图片渲染
      if (isImg(item)) {
        const imgSrc = `${base.lkBaseURL}/uploads/chatImg/${item}`;
        let thisImgWidth = 0;
        let thisImgHeight = 0;
        // 判断图片中是否包含宽高信息
        if (imgSrc.includes("width")) {
          // 从url中获取
          thisImgWidth = getQueryVariable(imgSrc, "width");
          thisImgHeight = getQueryVariable(imgSrc, "height");
        } else {
          // 读取图片获取信息
          const imgInfo: {
            imgWidth: number;
            imgHeight: number;
          } = await getImageInfo(imgSrc);
          thisImgWidth = imgInfo.imgWidth;
          thisImgHeight = imgInfo.imgHeight;
        }
        // 图片宽度大于400px缩放4倍
        if (thisImgWidth > 400) {
          // 缩放四倍
          thisImgWidth = thisImgWidth / 4;
          thisImgHeight = thisImgHeight / 4;
        }
        // 缩放后的图片高度大于400再次缩放3倍
        if (thisImgHeight > 400) {
          // 缩放3倍
          thisImgWidth = thisImgWidth / 3;
          thisImgHeight = thisImgHeight / 3;
        }
        // 找到item中?位置，在?之前添加\\进行转义，解决正则无法匹配特殊字符问题
        const charIndex = item.indexOf("?");
        // 生成正则表达式条件，添加\\用于对？的转义
        const regularItem = insertStr(item, charIndex, "\\");
        // 解析为img标签
        const imgTag = `<img class="previewable" style="display: block; cursor: pointer; max-height: 300px; object-fit: contain" width="${thisImgWidth}px" draggable="false" height="${thisImgHeight}px" src="${imgSrc}" alt="聊天图片">`;
        // 替换匹配的字符串为img标签:全局替换
        msgText = msgText.replace(new RegExp(`/${regularItem}/`, "g"), imgTag);
      }
      // 表情渲染: 遍历表情配置文件
      for (const emojiItem of emojiList) {
        // 判断捕获到的字符串与配置文件中的字符串是否相同
        if (emojiItem.info === item) {
          const imgSrc = require(`@/assets/img/emoji/${emojiItem.hover}`) as string;
          const imgTag = `<img src="${imgSrc}" width="28" height="28" alt="${item}">`;
          // 替换匹配的字符串为img标签:全局替换
          msgText = msgText.replace(new RegExp(`/${item}/`, "g"), imgTag);
        }
      }
    }
    finalMsgText = msgText;
  } else {
    finalMsgText = msgText;
  }
  // 消息内容包含链接时，则用a标签拼接
  if (finalMsgText.includes("http") && !finalMsgText.includes("img")) {
    finalMsgText = `<a href="${finalMsgText}" target="_blank">${finalMsgText}</a>`;
  }
  msgObj.msgText = finalMsgText;
  // 渲染页面
  if (insertStart) {
    let scrollHeight = 0;
    let loadingTime = 150;
    // 向数组头部添加消息对象
    senderMessageList.unshift(msgObj);

    nextTick().then(() => {
      // 隐藏消息内容
      data.msgShowStatus.value = "hidden";
      const previewablePanel = document.getElementsByClassName("previewable");
      for (let i = 0; i < previewablePanel.length; i++) {
        const item = previewablePanel.item(i) as HTMLImageElement;
        if (!item.getAttribute("hasClickEvent")) {
          // 为可预览图片添加点击事件监听
          item.addEventListener("click", () => {
            showImg(item.src);
          });
          // 添加标识
          item.setAttribute("hasClickEvent", "true");
        }
      }

      if (data.pageNo.value > 20) {
        // 数据加载超过20条，加载时间改为400ms
        loadingTime = 400;
      }

      setTimeout(() => {
        if (messagesContainer.value == null) return;
        scrollHeight = messagesContainer.value.scrollHeight;
        // 加载历史消息，修改滚动条位置：当前消息记录容器高度 - 消息记录容器高度
        messagesContainer.value.scrollTop =
          scrollHeight - msgListPanelHeight.value;
        // 一条消息渲染完成，待渲染消息总条数自减
        msgTotals.value--;
        // 判断消息是否渲染完成
        if (msgTotals.value === 0) {
          // 显示消息内容
          data.msgShowStatus.value = "";
          // 关闭加载动画
          isLoading.value = false;
          // 加载历史消息完成，更新消息记录容器高度
          msgListPanelHeight.value = scrollHeight;
        }
      }, loadingTime);
    });
  } else {
    let senderName = "";
    // 消息类型为群聊消息且发送者不为自己则添加发送者昵称
    if (
      messageStatus.value == 1 &&
      !_.isEqual(msgObj.userId, $store.state.userID)
    ) {
      senderName = (msgObj.userName as string) + ":";
    }
    // 更新最后发送时间与消息内容
    if (msgObj.msgText.includes("img")) {
      emit("update-last-message", {
        text: senderName + "[图片消息]",
        id: listId.value,
        time: msgObj.createTime
      });
    } else {
      emit("update-last-message", {
        text: senderName + msgObj.msgText,
        id: listId.value,
        time: msgObj.createTime
      });
    }
    // 向数组尾部添加消息对象
    senderMessageList.push(msgObj);
    // 修改滚动条位置
    nextTick().then(() => {
      // 隐藏消息内容
      data.msgShowStatus.value = "hidden";
      const scrollHeight = 0;
      const previewablePanel = document.getElementsByClassName("previewable");
      if (messagesContainer.value == null) return;
      for (let i = 0; i < previewablePanel.length; i++) {
        const item = previewablePanel.item(i) as HTMLImageElement;

        if (!item.getAttribute("hasClickEvent")) {
          item.onload = () => {
            if (messagesContainer.value == null) return;
            // 置底滚动条
            bottomScrollBar(
              scrollHeight,
              messagesContainer as Ref<HTMLDivElement>,
              isBottomOut,
              msgListPanelHeight,
              isFirstLoading
            );
          };

          // 为可预览图片添加点击事件监听
          item.addEventListener("click", () => {
            showImg(item.src);
          });
          // 添加标识
          item.setAttribute("hasClickEvent", "true");
        }
      }

      // 置底滚动条
      bottomScrollBar(
        scrollHeight,
        messagesContainer as Ref<HTMLDivElement>,
        isBottomOut,
        msgListPanelHeight,
        isFirstLoading
      );
    });
  }
}
