import { defineComponent } from "vue";

// 声明vue文件的导出类型
declare module "*.vue" {
  const component: ReturnType<typeof defineComponent>;
  export default component;
}

// 声明全局属性类型
declare module "@vue/runtime-core" {
  interface ComponentCustomProperties<T> {
    $api: T;
  }
}
