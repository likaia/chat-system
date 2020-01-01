/**
 * api统一出口
 *  将api接口根据功能划分为多个模块，利于多人开发，一个人负责一个模块的开发，方便每个模块中接口的命名
 * */
// 网站管理接口
import websiteManageAPI from './websiteManageAPI';
// 其他模块接口

// 导出接口
export default {
    websiteManageAPI,
    // ...
}
