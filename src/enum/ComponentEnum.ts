// 组件内枚举定义

// 登录状态
export enum loginStatusEnum {
  NOT_LOGGED_IN = 0, // 未登录
  LOGGING_IN = 1, // 登录中
  REGISTERED = 2 // 注册
}

// 消息面板状态
export enum messageStatusEnum {
  singleChat = 0, // 单聊
  groupChat = 1 // 群聊
}
