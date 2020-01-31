// 引入对应的组件
import loading from "./lib/FullScreenLoading";

// 定义对象:开发插件对象
const LoadPlugin = {
    // 插件包含install方法
    install(Vue,options){
        // 使用Vue.extend构造器，创建一个子类,参数为引入的FullScreenLoading组件
        const loadingSubclass = Vue.extend(loading);
        // 实例化loadingSubclass，挂载到HTMLElement实例上
        const Profile = new loadingSubclass({
            el: document.createElement('div')
        });
        // 插入到body中，FullScreenLoading.vue中的template模板内容将会替换挂载的元素，Profile.el中到内容最终为模版到内容
        document.body.appendChild(Profile.$el);
        // 判断是否有传参数：替换组件内的默认显示数据
        if(options){
            if(options.tips){
                Profile.tips = options.tips;
            }
        }
        // 添加实例方法，挂载至Vue原型
        Vue.prototype.$fullScreenLoading = {
            // 定义显示隐藏的方法
            show(tips) {
                Profile.show = true;
                if (tips) {
                    // 替换组件的默认数据
                    Profile.tips = tips;
                }
            },
            hide() {
                Profile.show = false;
            }
        };
    }
};

// 导出对象
export default LoadPlugin;