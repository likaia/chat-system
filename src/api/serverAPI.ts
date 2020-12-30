// 定义参数类型
import services from "@/config/axios";
import base from "@/api/base";

type paramsType<T = any> = {
  [key: string]: T;
};

const serverAPI = {
  // 获取服务器时间
  getServerTime() {
    return services.post(`${base.lk}/other/getServerTime`);
  }
};

export default serverAPI;
