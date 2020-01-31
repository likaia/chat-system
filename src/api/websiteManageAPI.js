/*
* 网站管理接口
* */
import services from '../plugins/axios'
import base from './base'; // 导入接口域名列表

const websiteManageAPI = {
    // 登录
    login(params){
        return services._axios.post(`${base.lk}/user/login`,params);
    },
    // 注册接口
    registered(params){
        return services._axios.post(`${base.lk}/user/registered`,params)
    },
    // 获取用户头像
    getUserAvatar(params){
        return services._axios.post(`${base.lk}/user/getUserAvatarSrc`,params)
    }
};

export default websiteManageAPI;