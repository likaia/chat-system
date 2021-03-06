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
    return services.post(`${base.lk}/user/login`, params);
  },
  // 注册
  registered<T>(params: paramsType<T>) {
    return services.post(`${base.lk}/user/registered`, params);
  },
  // 修改密码
  modifyPassword(params: { password: string }) {
    return services.post(`${base.lk}/user/modifyPassword`, params);
  },
  // 修改密码
  // 获取用户头像
  getUserAvatar<T>(params: paramsType<T>) {
    return services.post(`${base.lk}/user/getUserAvatarSrc`, params);
  },
  // 根据用户id获取用户信息
  getUserDataByUid<T>(params: paramsType<T>) {
    return services.post(`${base.lk}/user/getUserDataByUid`, params);
  },
  // 根据用户id获取好友列表
  getFriendsList<T>(params: paramsType<T>) {
    return services.post(`${base.lk}/user/getFriendsList`, params);
  },
  // token续期
  tokenRenew<T>(params: paramsType<T>) {
    return services.post(`${base.lk}/user/tokenRenew`, params);
  },
  // 搜索好友
  getSearchUserInfoList<T>(params: paramsType<T>) {
    return services.post(`${base.lk}/user/searchUserInfo`, params);
  },
  // 添加好友
  addFriend<T>(params: paramsType<T>) {
    return services.post(`${base.lk}/user/addFriend`, params);
  },
  // 更新在线状态
  updateOnlineStatus<T>(params: paramsType<T>) {
    return services.post(`${base.lk}/user/updateOnlineStatus`, params);
  },
  // 更新用户信息
  updateUserInfo<T>(params: paramsType<T>) {
    return services.post(`${base.lk}/user/updateUserInfo`, params);
  },
  // 更新好友验证消息
  getToBeVerifiedList<T>(params: paramsType<T>) {
    return services.get(`${base.lk}/user/getToBeVerifiedList`, {
      params: params
    });
  },
  // 更新好友信息
  updateFriend<T>(params: paramsType<T>) {
    return services.post(`${base.lk}/user/updateFriend`, params);
  },
  // 添加分组
  getAddGroup<T>(params: paramsType<T>) {
    return services.post(`${base.lk}/user/addGroup`, params);
  },
  // 分组重命名
  updateRenameGroupName<T>(params: paramsType<T>) {
    return services.post(`${base.lk}/user/renameGroupName`, params);
  },
  // 删除分组
  updateDeleteGroup<T>(params: paramsType<T>) {
    return services.post(`${base.lk}/user/deleteGroup`, params);
  },
  // 删除好友
  updateDeleteFriend<T>(params: paramsType<T>) {
    return services.post(`${base.lk}/user/deleteFriend`, params);
  }
};

export default websiteManageAPI;
