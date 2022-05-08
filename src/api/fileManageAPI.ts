/*
 * 文件管理接口
 * */
import services from "../config/axios";
import base from "./base"; // 导入接口域名列表

// 定义参数类型
type paramsType<T> = {
  [key: string]: T;
};

const fileManageAPI = {
  // 文件上传接口
  upload(file: File | FormData) {
    return services.post(
      `${base.lkBaseURL}/uploadFile/singleFileUpload`,
      file,
      {
        headers: { "Content-Type": "multipart/form-data" }
      }
    );
  },
  // 文件列表
  getUserFileList<T>(params: paramsType<T>) {
    return services.get(`${base.lk}/fileManagement/getUserFileList`, {
      params: params
    });
  },
  // 添加文件
  getAddFileInfo<T>(params: paramsType<T>) {
    return services.post(`${base.lk}/fileManagement/addFileInfo`, params);
  }
};

export default fileManageAPI;
