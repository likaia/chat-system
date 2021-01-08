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
  loginStatusEnum: Record<string, any>; // 登录状态枚举
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
  count?: number; // 数据总条数
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
  senderMessageList: Array<msgListType>; // 已发送消息列表
  audioCtx: number; // 当前要播放的音频频率
  isBottomOut: boolean; // 滚动条是否触底
  arrFrequency: number[]; // 音频频率列表
  pageStart: number; // 分页起始位置
  pageEnd: number; // 分页结束位置
  pageNo: number; // 业码
  pageSize: number; // 数据量
  sessionMessageData: Array<msgListType>; // session中存储的聊天记录
  msgListPanelHeight: number; // 消息记录容器高度
  isLoading: boolean; // 是否正在加载消息
  isLastPage: boolean; // 是否最后一页
  msgTotals: number; // 待渲染消息总条数
  isFirstLoading: boolean; // 组件是否第一次加载
};

// 消息列表对象属性类型定义
export type msgListType = {
  msgText?: string;
  createTime?: string;
  userName?: string;
  userId?: string;
  buddyId?: string;
  messageStatus?: number;
  avatarSrc?: string;
  msgId?: number;
};

// 服务端推送消息类型
export type serverPushMessageType = {
  msg: string;
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
  remarks: string; // 备注
  rightMenuObj: {
    text: Array<string>; // 文本数组
    handler: Record<string, (...params: any) => void>; // 事件处理函数
  }; // 右键菜单
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
  childrenId?: number; // 分组id
  groupName: string; // 分组名称
  remarks: string; // 备注
};

// 待处理请求定义
export type pendingRequest = (...params: any[]) => void;

// 右键菜单DOM属性定义
export type rightMenuAttribute = {
  status: string; // 右键菜单显隐状态
  left: string; // 右键菜单显示位置: 左测距离
  top: string; // 右键菜单显示位置: 顶部距离
  list: []; // 右键菜单列表数据: 文本列表、事件处理函数
};

export type rightMenuListObj = {
  text?: Array<string>;
  handler?: Array<Record<string, (...params: any) => void>>;
  id?: number;
};

// 消息列表组件Data对象属性定义
export type msgListDataType = {
  msgSubscriptIco: string; // 置顶图标
  GroupBlocked: string; // 群消息免打扰图标
  lastMessageContent: string; // 最后一条消息内容
  currentIndex: number; // 当前点击项索引
  widgetIsNull: boolean; // 消息内容组件显示状态
  listId: string;
  messageType: number | null;
  buddyId: string;
  serverTime: string | null;
  buddyName: string;
  msgList: Array<totalMessage>;
};

// 右键菜单类型定义
export type rightMenuObjType = {
  this: any;
  text: Array<string | { status: boolean; content: string }>; // 文本数组
  handler: Record<string, (...params: any) => void>; // 事件处理函数
}; // 右键菜单

// 消息列表数据类型定义
export type totalMessage = {
  id?: number; // 消息id
  avatarSrc?: string; // 消息头像
  userName?: string; // 消息名称
  lastTime?: string; // 最后一条消息发送时间
  lastMsgTxt?: string; // 最后一条消息内容
  userId?: string; // 消息id
  type?: number; // 消息类型: 0: 单聊 1: 群聊
  buddyId?: string; // 好友id
  totalUnread?: number; // 未读消息条数
};

// 本地消息列表数据类型定义
export type localMsgObj = {
  id?: string; // 列表id
  lastMsgTxt?: string; // 最后一条消息内容
  lastTime?: string; // 最后一条消息发送时间
  totalUnread?: number; // 未读消息条数
};

export type LastMessageObj = {
  id: string; // 列表ID
  text: string; // 最后一条消息内容
  time: string; // 最后一条消息发送时间
  isPush?: boolean; // 是否为服务端推送的消息
};
