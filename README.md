# chat-system
本项目是一个在线聊天系统，最大程度的还原了Mac客户端QQ。

线上地址：[chat-system](https://www.kaisir.cn/chat-system/index.html#/login)
## 前言
使用Vue3+TypeScript作为项目主体架构，有关项目的更多介绍以及重构过程请移步：[Vue模仿Mac版本QQ开源啦 | 掘金优秀开源推荐](https://juejin.im/post/6844904036177543176) & [使用Vue3重构vue2项目](https://juejin.im/post/6885376102596870158/)

## 项目技术栈
本项目使用到的技术栈如下：
* vue3及其周边
* scss
* TypeScript

## 注意事项
项目未开放注册通道，全面采用第三方平台登录机制。本地启动项目时，需要通过用户名和密码进行登录，因为第三方登录的授权回调地址是线上地址。

### 用户名和密码获取通道
[线上环境](https://www.kaisir.cn/chat-system/index.html#/)使用第三方平台登录后：
* 进入设置面板，如下图所示：
![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c15893bbe5c3429ca2a8d9908b8cf425~tplv-k3u1fbpfcp-watermark.image)
  
* 在打开的面板中（上图所示），用户名就是你登录所需的用户名
* 修改密码选项，需要自己设置密码（因为注册时系统会随机生成一个密码）

## 加入此项目
项目采用`Forking`工作流，如果想加入本项目的开发，需将项目fork到自己的仓库下，功能开发完成后，提PR即可。

在项目的根目录下有2个文件：
* ProjectDevelopmentPlan.md 为项目的开发计划，已完成的功能会打勾。
* designDiagram 文件夹为项目所要实现的效果图。

## 项目启动
* 终端或命令行执行下述命令，将项目下载到本地
```bash
git clone https://github.com/likaia/chat-system.git
```
* 分别执行下述命令，进入项目根目录，安装依赖
```bash
cd chat-system

yarn install
```
* 执行下述命令启动项目
```bash
yarn serve
```

## 项目开发
* 使用你喜欢的编辑器打开项目即可
* 在终端或命令行执行下述命令即可对项目进行打包
```bash
yarn build
```
## 写在最后
![](./JetBrains.png)

感谢 **[JetBrains](https://www.jetbrains.com/?from=chat-system)** 公司提供的的 **[软件开源许可证](https://www.jetbrains.com/shop/eform/opensource)** 。
* 项目遵守 [MIT](https://choosealicense.com/licenses/mit/) 开源协议
* 本项目仅用于学习使用，切勿用于商业用途，否则产生的法律后果与作者无关。
