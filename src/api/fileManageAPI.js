/*
* 文件管理接口
* */
import services from '../plugins/axios'
import base from './base'; // 导入接口域名列表

const fileManageAPI = {
    // base64图片上传
    baseFileUpload(file){
        return services._axios.post(`${base.lkBaseURL}/uploads/singleFileUpload`,file,{headers:{"Content-Type":"multipart/form-data"}});
    }
};

export default fileManageAPI;
