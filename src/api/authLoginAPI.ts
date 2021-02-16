import services from "@/config/axios";
import base from "@/api/base";

// 定义参数类型
type paramsType = {
  code: string;
  platform: string;
  state: string;
};

/**
 * 第三方登录
 */
const authLoginAPI = {
  // 获取授权url地址
  getAuthorize(params: { platform: string }) {
    return services.get(`${base.lk}/user/getAuthorize`, {
      params: params
    });
  },
  // 授权登录
  authorizeLogin(params: paramsType) {
    return services.post(`${base.lk}/user/authorizeLogin`, params);
  }
};

export default authLoginAPI;
