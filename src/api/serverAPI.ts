// 定义参数类型
import services from "@/config/axios";
import base from "@/api/base";

const serverAPI = {
  // 获取服务器时间
  getServerTime() {
    return services.get(`${base.lkBaseURL}/other/getServerTime`);
  }
};

export default serverAPI;
