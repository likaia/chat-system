// 消息列表接口
import services from "../config/axios";
import base from "./base";
import { addTotalMessageType } from "@/type/ComponentDataType"; // 导入接口域名列表

// 定义参数类型
type paramsType<T = any> = {
  [key: string]: T;
};

const messageListAPI = {
  // 获取消息列表接口
  getMessageList(params: paramsType) {
    return services.get(`${base.lk}/MessageManagement/getMessageList`, {
      params: params
    });
  },
  // 获取消息内容列表接口
  getMessageTextList(params: paramsType) {
    return services.get(`${base.lk}/MessageManagement/getMessageTextList`, {
      params: params
    });
  },
  // 添加消息
  addMessage(params: addTotalMessageType) {
    return services.post(`${base.lk}/MessageManagement/addMessageInfo`, params);
  },
  // 添加消息内容
  addMessageText(params: paramsType) {
    return services.post(
      `${base.lk}/MessageManagement/addMessageTextInfo`,
      params
    );
  },
  // 更新消息
  updateMessage(params: paramsType) {
    return services.post(
      `${base.lk}/MessageManagement/updateMessageInfo`,
      params
    );
  },
  // 删除消息
  deleteMessage(params: paramsType) {
    return services.post(
      `${base.lk}/MessageManagement/deleteMessageInfo`,
      params
    );
  },
  // 删除消息内容
  deleteMessageText(params: paramsType) {
    return services.post(
      `${base.lk}/MessageManagement/deleteMessageTextInfo`,
      params
    );
  }
};

export default messageListAPI;
