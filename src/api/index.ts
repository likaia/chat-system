/**
 * api统一出口
 *  将api接口根据功能划分为多个模块，利于多人开发，一个人负责一个模块的开发，方便每个模块中接口的命名
 * */

// 网站管理接口
import websiteManageAPI from "@/api/websiteManageAPI";
// 文件管理接口
import fileManageAPI from "@/api/fileManageAPI";
// 消息列表接口
import messageListAPI from "@/api/messageListAPI";
// 服务器信息接口
import serverAPI from "@/api/serverAPI";
// 第三方登录接口
import authLoginAPI from "@/api/authLoginAPI";
// 指纹登录接口
import touchIdLogingAPI from "@/api/touchIdLogingAPI";
// 导出接口
export default {
  websiteManageAPI,
  fileManageAPI,
  messageListAPI,
  serverAPI,
  authLoginAPI,
  touchIdLogingAPI
};
