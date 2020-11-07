// 登录组件Data对象属性定义
export type loginDataType<T> = {
  loginUndo: T; // 禁止登录时的图标
  loginBtnIcon: T; // 登录时的按钮图标
  loginBtnHover: T; // 鼠标悬浮时的登录图标
  loginBtnDown: T; // 鼠标按下时的登录图标
  userName: string; // 用户名
  password: string; // 密码
  confirmPassword: string; // 注册时的确认登录密码
  isLoginStatus: number; // 登录状态：0.未登录 1.登录中 2.注册
  loginStatusEnum: Object; // 登录状态枚举
  isDefaultAvatar: boolean; // 头像是否为默认头像
  avatarSrc: T; // 头像地址
  loadText: string; // 加载层的文字
};

// 接口返回值类型
export type responseDataType<T = any> = {
  msg?: string;
  code?: number;
  data: T;
  fileName?: string;
};

// 用户个人信息类型
export type userInfoType = {
  token: string;
  userID: string;
  profilePicture: string;
  username: string;
};

// 主面板组件Data对象属性定义
export type mainContentDateType<T> = {
  searchImg: string; // 搜索图标展示状态
  searchContent: string; // 搜索框内容
  addBackground: string; // 添加联系人图标背景颜色
  leftIco: string; // 左上角图标显示状态
  messageIco: T; // 消息面板图标
  messageIcoActive: T; // 消息面板选中时的图标
  contactIco: T; // 联系人面板图标
  contactIcoActive: T; // 联系人面板选中时的图标
  moreIco: T; // 更多面板图标
  moreIcoActive: T; // 更多面板选中时的图标
};

// 消息展示组件Data对象属性定义
export type messageDisplayDataType<T> = {
  images: string[]; // 聊天图片展示
  createDisSrc: T; // 创建群聊图标
  resourceObj: {
    [key: string]: T;
  }; // 图标资源对象
  messageContent: string; // 消息内容
  emoticonShowStatus: string; // 表情面板显隐状态
  emojiList: {}; // 表情列表，从json文件中获取
  toolbarList: {}; // 工具栏列表，从json文件中获取
  senderMessageList: T[]; // 已发送消息列表
  audioCtx: number; // 当前要播放的音频频率
  arrFrequency: number[]; // 音频频率列表
};

// 消息列表对象属性类型定义
export type msgListType = {
  username?: string;
  userID?: string;
  avatarSrc?: string;
  msg?: string;
};

// 发送者消息对象类型定义
export type senderMessageType = {
  msgText: string;
  msgId: number;
  avatarSrc: string;
  userID: string;
  username: string;
};

// 联系人面板Data属性定义
export type contactListDataType<V> = {
  friendsList: Array<V>; // 好友列表
  groupArrow: Element[]; // 分组箭头dom
  groupList: Element[]; // 分组列表dom
  paramsID: string; // 好友列表的用户id
  widgetIsNull: boolean; // 组件是否为空
  groupName: string; // 分组名称
};

// 联系人列表类型定义
export type friendsListType<V> = {
  groupName: string; // 分组名称
  totalPeople: number; // 总人数
  onlineUsers: number; // 在线人数
  friendsData: Array<V>; // 好友列表
};

// 联系人类型定义
export type friendsDataType = {
  userName?: string; // 昵称
  avatarSrc?: string; // 头像地址
  signature?: string; // 个性签名
  onlineStatus?: boolean; // 在线状态
  userId?: string; // 用户id
  groupId?: number;//分组id
  groupName: string; // 分组名称
};
