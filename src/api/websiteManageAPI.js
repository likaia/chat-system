/*
* 网站管理接口
* */
import services from '../plugins/axios'
import base from './base'; // 导入接口域名列表
const websiteManageAPI = {
    // 登录
    login(params){
        return services._axios.post(`${base.lk}/login`,params);
    },
    // 测试post接口
    postJSON(params){
        return services._axios.post(`${base.lk}/getter/postJSON`,params);
    },
    // 测试get接口
    getJSON(pageNo,pageSize){
        return services._axios.get(`${base.lk}/getter/getJSON`,{params:{pageNo:pageNo,pageSize:pageSize}});
    }
};

export default websiteManageAPI;