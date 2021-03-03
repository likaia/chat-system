import services from "@/config/axios";
import base from "@/api/base";

const touchIdLogingAPI = {
  // 获取touchId
  getTouchID(params: { userId: string }) {
    return services.post(`${base.lk}/user/getTouchID`, params);
  },

  // 注册touchid
  registeredTouchID(params: { touchId: string; clientDataJson: string }) {
    return services.post(`${base.lk}/user/registeredTouchID`, params);
  },

  // 指纹登录
  touchIdLogin(params: { touchId: string; certificate: string }) {
    return services.post(`${base.lk}/user/touchIdLogin`, params);
  }
};

export default touchIdLogingAPI;
