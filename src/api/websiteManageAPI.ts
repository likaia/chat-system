/*
 * 网站管理接口
 * */
import services from "../config/axios";
import base from "./base"; // 导入接口域名列表

// 定义参数类型
type paramsType<T> = {
  [key: string]: T;
};

const websiteManageAPI = {
  // 登录
  login<T>(params: paramsType<T>) {
    return services.post(`${base.develop}/user/login`, params);
  },
  // 注册
  registered<T>(params: paramsType<T>) {
    return services.post(`${base.develop}/user/registered`, params);
  },
  // 修改密码
  modifyPassword(params: { password: string }) {
    return services.post(`${base.develop}/user/modifyPassword`, params);
  },
  // 修改密码
  // 获取用户头像
  getUserAvatar<T>(params: paramsType<T>) {
    return services.post(`${base.develop}/user/getUserAvatarSrc`, params);
  },
  // 根据用户id获取用户信息
  getUserDataByUid<T>(params: paramsType<T>) {
    return services.post(`${base.develop}/user/getUserDataByUid`, params);
  },
  // 根据用户id获取好友列表
  getFriendsList<T>(params: paramsType<T>) {
    return services.post(`${base.develop}/user/getFriendsList`, params);
  },
  // token续期
  tokenRenew<T>(params: paramsType<T>) {
    return services.post(`${base.develop}/user/tokenRenew`, params);
  },
  // 搜索好友
  getSearchUserInfoList<T>(params: paramsType<T>) {
    return services.post(`${base.develop}/user/searchUserInfo`, params);
  },
  // 添加好友
  addFriend<T>(params: paramsType<T>) {
    return services.post(`${base.develop}/user/addFriend`, params);
  },
  // 更新在线状态
  updateOnlineStatus<T>(params: paramsType<T>) {
    return services.post(`${base.develop}/user/updateOnlineStatus`, params);
  },
  // 更新用户信息
  updateUserInfo<T>(params: paramsType<T>) {
    return services.post(`${base.develop}/user/updateUserInfo`, params);
  },
  // 更新好友验证消息
  getToBeVerifiedList<T>(params: paramsType<T>) {
    return services.get(`${base.develop}/user/getToBeVerifiedList`, {
      params: params
    });
  },
  // 更新好友信息
  updateFriend<T>(params: paramsType<T>) {
    return services.post(`${base.develop}/user/updateFriend`, params);
  },
  // 添加分组
  getAddGroup<T>(params: paramsType<T>) {
    return services.post(`${base.develop}/user/addGroup`, params);
  },
  // 分组重命名
  updateRenameGroupName<T>(params: paramsType<T>) {
    return services.post(`${base.develop}/user/renameGroupName`, params);
  },
  // 删除分组
  updateDeleteGroup<T>(params: paramsType<T>) {
    return services.post(`${base.develop}/user/deleteGroup`, params);
  },
  // 删除好友
  updateDeleteFriend<T>(params: paramsType<T>) {
    return services.post(`${base.develop}/user/deleteFriend`, params);
  }
};

export default websiteManageAPI;
