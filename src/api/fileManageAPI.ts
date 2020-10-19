/*
 * 文件管理接口
 * */
import services from "../config/axios";
import base from "./base"; // 导入接口域名列表

export default {
  // 文件上传接口
  upload(file: File | FormData) {
    return services.post(`${base.lkBaseURL}/uploads/singleFileUpload`, file, {
      headers: { "Content-Type": "multipart/form-data" }
    });
  }
};
