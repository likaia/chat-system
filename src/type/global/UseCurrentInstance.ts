import { ComponentInternalInstance, getCurrentInstance } from "vue";
import initData from "@/module/message-display/main-entrance/InitData";

export default function useCurrentInstance() {
  let proxy: Record<string, any>;
  if (getCurrentInstance() == null) {
    proxy = initData().currentInstance?.proxy as Record<string, any>;
  } else {
    const { appContext } = getCurrentInstance() as ComponentInternalInstance;
    proxy = appContext.config.globalProperties;
  }
  return {
    proxy
  };
}
