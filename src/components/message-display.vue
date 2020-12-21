<!--公用组件：消息内容展示，实现群聊和单聊业务-->
<template>
  <div id="mainContent">
    <div class="top-panel" ref="topPanel">
      <div class="title-panel">
        <p v-if="messageStatus === 0">{{ buddyName }}</p>
        <p v-else>{{ buddyName }}({{ onlineUsers }})</p>
        <!--在线设备类型-->
        <!--<div class="equipmentType">
                    <img :src="this.resourceObj.phoneNormal" alt="">
                </div>-->
      </div>
      <div class="operate-panel">
        <div class="ico-panel">
          <div
            ref="createDisSrcPanel"
            class="item-panel"
            @mouseenter="createDisEventFun('hover')"
            @mouseleave="createDisEventFun('leave')"
            @click="createDisEventFun('click')"
          >
            <img :src="createDisSrc" alt="" />
          </div>
        </div>
      </div>
    </div>
    <!--消息显示-->
    <div class="messages-panel" ref="messagesContainer">
      <div class="row-panel" v-for="item in senderMessageList" :key="item.id">
        <!--消息发送时间-->
        <div class="snder-time-panel" v-if="item.createTime">
          <span>{{ item.createTime.substring(5, 16) }}</span>
        </div>
        <!--发送者消息样式-->
        <div
          class="sender-panel"
          v-if="item.userId === userID"
          :data-createTime="item.createTime"
        >
          <!--昵称展示-->
          <div class="user-name-panel sender">
            <p>{{ item.userName }}</p>
          </div>
          <!--消息-->
          <div class="msg-body">
            <!--消息尾巴-->
            <div class="tail-panel">
              <svg class="icon" aria-hidden="true">
                <use
                  xlink:href="#icon-zbds30duihuakuangyou"
                  color="#dce7dc"
                ></use>
              </svg>
            </div>
            <!--消息内容-->
            <p v-html="item.msgText" />
          </div>
          <!--头像-->
          <div class="avatar-panel">
            <img :src="item.avatarSrc" alt="" />
          </div>
        </div>
        <!--对方消息样式-->
        <div class="otherSide-panel" v-else :data-createTime="item.createTime">
          <!--头像-->
          <div class="avatar-panel">
            <img :src="item.avatarSrc" alt="" />
          </div>
          <!--昵称展示-->
          <div class="user-name-panel sender">
            <p>{{ item.userName }}</p>
          </div>
          <!--消息-->
          <div class="msg-body">
            <!--消息尾巴-->
            <div class="tail-panel">
              <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-zbds30duihuakuangzuo"></use>
              </svg>
            </div>
            <!--消息内容-->
            <p v-html="item.msgText" />
          </div>
        </div>
      </div>
    </div>
    <!--用户输入模块-->
    <div class="user-input-panel" @click="getEditableDivFocus()">
      <div class="toolbar-panel">
        <div class="item-panel" v-for="item in toolbarList" :key="item.info">
          <div v-if="item.name === 'selectImg'" class="file-panel">
            <img
              class="emoticon"
              ref="selectImg"
              :src="require(`../assets/img/${item.src}`)"
              :alt="item.info"
            />
            <input
              class="file"
              name="file"
              type="file"
              accept="image/png,image/gif,image/jpeg"
              @mouseenter="
                toolbarSwitch(
                  'hover',
                  $event,
                  item.src,
                  item.hover,
                  item.down,
                  item.name
                )
              "
              @mouseleave="
                toolbarSwitch(
                  'leave',
                  $event,
                  item.src,
                  item.hover,
                  item.down,
                  item.name
                )
              "
              @mousedown="
                toolbarSwitch(
                  'down',
                  $event,
                  item.src,
                  item.hover,
                  item.down,
                  item.name
                )
              "
              @mouseup="
                toolbarSwitch(
                  'up',
                  $event,
                  item.src,
                  item.hover,
                  item.down,
                  item.name
                )
              "
              @change="sendImage($event)"
            />
          </div>
          <img
            v-else
            class="emoticon"
            :src="require(`../assets/img/${item.src}`)"
            @mouseenter="
              toolbarSwitch(
                'hover',
                $event,
                item.src,
                item.hover,
                item.down,
                item.name
              )
            "
            @mouseleave="
              toolbarSwitch(
                'leave',
                $event,
                item.src,
                item.hover,
                item.down,
                item.name
              )
            "
            @mousedown="
              toolbarSwitch(
                'down',
                $event,
                item.src,
                item.hover,
                item.down,
                item.name
              )
            "
            @mouseup="
              toolbarSwitch(
                'up',
                $event,
                item.src,
                item.hover,
                item.down,
                item.name
              )
            "
            :alt="item.info"
          />
        </div>
      </div>
      <div
        id="msgInputContainer"
        class="input-panel"
        ref="msgInputContainer"
        @keypress.enter.exact="sendMessage($event)"
        contenteditable="true"
        spellcheck="false"
      ></div>
      <!--表情面板-->
      <div
        class="emoticon-panel"
        :style="{ display: emoticonShowStatus }"
        ref="emoticonPanel"
      >
        <div class="row-panel">
          <div
            class="item-panel"
            v-for="item in this.emojiList"
            :key="item.info"
          >
            <img
              :src="require(`../assets/img/emoji/${item.src}`)"
              :alt="item.info"
              @mouseover="
                emojiConversion($event, 'over', item.src, item.hover, item.info)
              "
              @mouseleave="
                emojiConversion(
                  $event,
                  'leave',
                  item.src,
                  item.hover,
                  item.info
                )
              "
              @click="
                emojiConversion(
                  $event,
                  'click',
                  item.src,
                  item.hover,
                  item.info
                )
              "
            />
          </div>
        </div>
        <div class="ico-panel"></div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import {
  messageDisplayDataType,
  msgListType,
  responseDataType
} from "@/type/ComponentDataType";
import base from "@/api/base";
import _ from "lodash";

export default defineComponent({
  name: "message-display",
  props: {
    listId: String, // 消息id
    messageStatus: Number, // 消息类型
    buddyId: String, // 好友id
    buddyName: String // 好友昵称
  },
  data<T>(): messageDisplayDataType<T> {
    return {
      images: [],
      createDisSrc: require("@/assets/img/titlebar_function_createDis_normal@2x.png"),
      resourceObj: {
        createDisNormal: require("@/assets/img/titlebar_function_createDis_normal@2x.png"),
        createDisHover: require("@/assets/img/titlebar_function_createDis_hover@2x.png"),
        createDisClick: require("@/assets/img/titlebar_function_createDis_normal_p@2x.png"),
        phoneNormal: require("@/assets/img/phone_normal_ap@2x.png"),
        groupMsgImg: require("@/assets/img/group-msg-img.png"),
        avatarImg: require("@/assets/img/avatar.jpg"),
        msgImgTest: require("@/assets/img/msg-img-test.gif"),
        msgImgTestB: require("@/assets/img/msg-img-testB.gif")
      },
      messageContent: "",
      emoticonShowStatus: "none",
      emojiList: require("@/assets/json/emoji.json"),
      toolbarList: require("@/assets/json/toolbar.json"),
      senderMessageList: [],
      audioCtx: 0,
      // 声音频率
      arrFrequency: [
        196.0,
        220.0,
        246.94,
        261.63,
        293.66,
        329.63,
        349.23,
        392.0,
        440.0,
        493.88,
        523.25,
        587.33,
        659.25,
        698.46,
        783.99,
        880.0,
        987.77,
        1046.5
      ]
    };
  },
  mounted() {
    // 设置列容器高度
    this.$refs.messagesContainer.style.height =
      this.getThisWindowHeight() - 450 + "px";
    // 获取消息内容
    this.getMessageTextList(this.listId);
    // 执行剪切板监听与全局点击事件监听
    this.pasteHandle();
    this.globalClick();
    // 监听消息接收
    this.$options.sockets.onmessage = (res: { data: string }) => {
      const data = JSON.parse(res.data);
      if (data.code === 200) {
        // 更新在线人数
        this.$store.commit("updateOnlineUsers", data.onlineUsers);
      } else {
        // 更新在线人数
        this.$store.commit("updateOnlineUsers", data.onlineUsers);
        // 获取服务端推送的消息
        const msgObj: msgListType = {
          msgText: data.msg,
          avatarSrc: data.avatarSrc,
          createTime: data.createTime,
          userId: data.userID,
          buddyId: data.buddyId,
          messageStatus: data.messageStatus,
          userName: data.username
        };
        // 播放消息提示音:判断当前消息是否为对方发送
        if (msgObj.userId !== this.userID) {
          this.audioCtx = new AudioContext();
          // 非当前用户发送的消息
          // 当前频率: 随机产生
          const frequency = this.arrFrequency[
            Math.floor(Math.random() * this.arrFrequency.length)
          ];
          // 创建音调控制对象
          const oscillator = this.audioCtx.createOscillator();
          // 创建音量控制对象
          const gainNode = this.audioCtx.createGain();
          // 音调音量关联
          oscillator.connect(gainNode);
          // 音量和设备关联
          gainNode.connect(this.audioCtx.destination);
          // 音调类型指定为正弦波
          oscillator.type = "sine";
          // 设置音调频率: 最终播放的声音
          oscillator.frequency.value = frequency;
          // 先把当前音量设为0
          gainNode.gain.setValueAtTime(0, this.audioCtx.currentTime);
          // 0.01秒时间内音量从刚刚的0变成1，线性变化
          gainNode.gain.linearRampToValueAtTime(
            1,
            this.audioCtx.currentTime + 0.01
          );
          // 声音走起
          oscillator.start(this.audioCtx.currentTime);
          // 2秒时间内音量从刚刚的1变成0.001，指数变化
          gainNode.gain.exponentialRampToValueAtTime(
            0.001,
            this.audioCtx.currentTime + 2
          );
          // 2秒后停止声音
          oscillator.stop(this.audioCtx.currentTime + 2);
        }
        // 接收方消息：列表id == 消息推送方id，且消息状态为单聊
        if (
          _.isEqual(this.listId, msgObj.userId) &&
          msgObj.messageStatus === 0
        ) {
          // 渲染页面
          this.renderPage([], msgObj);
        }
        // 发送方消息：当前登录用户id == 消息发送方id，且消息状态为单聊
        if (
          _.isEqual(this.userID, msgObj.userId) &&
          msgObj.messageStatus === 0
        ) {
          // 渲染页面
          this.renderPage([], msgObj);
        }
        // 群聊消息：消息状态为1，列表id == 消息接收方id
        if (
          msgObj.messageStatus === 1 &&
          _.isEqual(this.listId, msgObj.buddyId)
        ) {
          // 渲染页面
          this.renderPage([], msgObj);
        }
      }
    };
  },
  methods: {
    // 处理剪切板粘贴
    pasteHandle: function() {
      document.body.addEventListener("paste", event => {
        // 获取当前输入框内的文字
        const oldText = this.$refs.msgInputContainer?.textContent;
        // 读取图片
        const items = event.clipboardData && event.clipboardData.items;
        let file: Blob | null = null;
        if (items && items.length) {
          // 检索剪切板items
          for (const item of Array.from(items)) {
            if (item.type.indexOf("image") !== -1) {
              file = item.getAsFile();
              break;
            }
          }
        }
        // 预览图片
        const reader = new FileReader();
        reader.onload = event => {
          // 图片内容
          const imgContent = event.target?.result;
          // 创建img标签
          const img = document.createElement("img");
          // 获取当前base64图片信息，计算当前图片宽高以及压缩比例
          const imgObj = new Image();
          let imgWidth: number;
          let imgHeight: number;
          let scale = 1;
          imgObj.src = imgContent as string;
          imgObj.onload = () => {
            // 计算img宽高
            if (imgObj.width < 400) {
              imgWidth = imgObj.width;
              imgHeight = imgObj.height;
            } else {
              // 输入框图片显示缩小10倍
              imgWidth = imgObj.width / 10;
              imgHeight = imgObj.height / 10;
              // 图片宽度大于1920，图片压缩5倍
              if (imgObj.width > 1920) {
                // 真实比例缩小5倍
                scale = 5;
              }
            }
            // 设置可编辑div中图片宽高
            img.width = imgWidth;
            img.height = imgHeight;
            // 压缩图片，渲染页面
            this.compressPic(
              imgContent as string,
              scale,
              (newBlob: Blob, newBase: string) => {
                // 删除可编辑div中的图片名称
                this.$refs.msgInputContainer.textContent = oldText;
                img.src = newBase; // 设置链接
                // 图片渲染
                this.$refs.msgInputContainer.append(img);
              }
            );
          };
        };
        reader.readAsDataURL(file as Blob);
      });
    },
    // base图片压缩
    compressPic: function(base64: string, scale: number, callback: Function) {
      const _img = new Image();
      _img.src = base64;
      _img.onload = () => {
        const _canvas = document.createElement("canvas");
        const w = _img.width / scale;
        const h = _img.height / scale;
        _canvas.setAttribute("width", w + "");
        _canvas.setAttribute("height", h + "");
        _canvas.getContext("2d")?.drawImage(_img, 0, 0, w, h);
        const base64 = _canvas.toDataURL("image/jpeg");
        // 当canvas对象的原型中没有toBlob方法的时候，手动添加该方法
        if (!HTMLCanvasElement.prototype.toBlob) {
          Object.defineProperty(HTMLCanvasElement.prototype, "toBlob", {
            value: function<T>(callback: Function, type: string, quality: T) {
              const binStr = atob(this.toDataURL(type, quality).split(",")[1]),
                len = binStr.length,
                arr = new Uint8Array(len);
              for (let i = 0; i < len; i++) {
                arr[i] = binStr.charCodeAt(i);
              }
              callback(new Blob([arr], { type: type || "image/png" }));
            }
          });
        } else {
          _canvas.toBlob((blob: Blob | null) => {
            if (blob && blob.size > 1024 * 1024) {
              this.compressPic(base64, scale, callback);
            } else {
              callback(blob, base64);
            }
          }, "image/jpeg");
        }
      };
    },
    // 处理全局点击事件
    globalClick: function() {
      document.addEventListener("click", e => {
        // 点击表情框以外的地方，隐藏当前表情框
        if (
          (e.target as Element).className !== "emoticon-panel" &&
          (e.target as Element).className !== "emoticon"
        ) {
          this.emoticonShowStatus = "none";
        }
      });
    },
    // 创建群聊
    createDisEventFun: function(status: string) {
      if (status === "hover") {
        this.createDisSrc = this.resourceObj.createDisHover;
      } else if (status === "leave") {
        this.createDisSrc = this.resourceObj.createDisNormal;
      } else {
        this.createDisSrc = this.resourceObj.createDisClick;
      }
    },
    getThisWindowHeight: () => window.innerHeight,
    getThisWindowWidth: () => window.innerWidth,
    // 消息发送
    sendMessage: function(event: KeyboardEvent) {
      // 阻止编辑框默认生成div事件
      event.preventDefault();
      let msgText = "";
      // 获取输入框下的所有子元素
      const allNodes = (event.target as Node).childNodes;
      for (const item of allNodes) {
        // 判断当前元素是否为img元素
        if (item.nodeName === "IMG") {
          if ((item as HTMLImageElement).alt === "") {
            // 是图片
            let base64Img = (item as HTMLImageElement).src;
            // 删除base64图片的前缀
            base64Img = base64Img.replace(/^data:image\/\w+;base64,/, "");
            // 随机文件名
            const fileName = new Date().getTime() + "chatImg" + ".jpeg";
            // 将base64转换成file
            const imgFile = this.convertBase64UrlToImgFile(
              base64Img,
              fileName,
              "image/jpeg"
            );
            const formData = new FormData();
            // 此处的file与后台取值时的属性一样,append时需要添加文件名，否则一直是blob
            formData.append("file", imgFile, fileName);
            // 将图片上传至服务器
            this.$api.fileManageAPI
              .upload(formData)
              .then((res: responseDataType) => {
                let msgImgName = "";
                const imgSrc = `${base.lkBaseURL}/uploads/chatImg/${res.fileName}`;
                // 获取图片大小
                const img = new Image();
                let imgWidth = 0;
                let imgHeight = 0;
                // 判断参数是否为url
                img.src = imgSrc;
                // 判断图片是否有缓存
                if (img.complete) {
                  imgWidth = img.width;
                  imgHeight = img.height;
                  msgImgName = `/${res.fileName}?width:${imgWidth}&height:${imgHeight}/`;
                  // 消息发送: 发送图片
                  this.$socket.sendObj({
                    msg: msgImgName,
                    buddyId: this.buddyId,
                    messageStatus: this.messageStatus,
                    code: 0,
                    username: this.$store.state.username,
                    avatarSrc: this.$store.state.profilePicture,
                    userID: this.$store.state.userID,
                    msgId: this.listId
                  });
                } else {
                  img.onload = () => {
                    imgWidth = img.width;
                    imgHeight = img.height;
                    msgImgName = `/${res.fileName}?width=${imgWidth}&height=${imgHeight}/`;
                    // 消息发送: 发送图片
                    this.$socket.sendObj({
                      msg: msgImgName,
                      buddyId: this.buddyId,
                      messageStatus: this.messageStatus,
                      code: 0,
                      username: this.$store.state.username,
                      avatarSrc: this.$store.state.profilePicture,
                      userID: this.$store.state.userID,
                      msgId: this.listId
                    });
                  };
                }
                // 清空输入框中的内容
                (event.target as Element).innerHTML = "";
              });
          } else {
            msgText += `/${(item as HTMLImageElement).alt}/`;
          }
        } else {
          // 获取text节点的值
          if (item.nodeValue !== null) {
            msgText += item.nodeValue;
          }
        }
      }
      // 消息发送: 发送文字，为空则不发送
      if (msgText.trim().length > 0) {
        this.$socket.sendObj({
          msg: msgText,
          buddyId: this.buddyId,
          messageStatus: this.messageStatus,
          code: 0,
          username: this.$store.state.username,
          avatarSrc: this.$store.state.profilePicture,
          userID: this.$store.state.userID,
          msgId: this.listId
        });
        // 清空输入框中的内容
        (event.target as Element).innerHTML = "";
      }
    },
    //  渲染页面
    renderPage: function(msgArray: Array<msgListType>, msgObj: msgListType) {
      if (msgArray.length > 0) {
        // 页面更新，渲染消息内容列表数据
        for (let i = 0; i < msgArray.length; i++) {
          const thisSenderMessageObj: msgListType = {
            msgText: msgArray[i].msgText,
            avatarSrc: msgArray[i].avatarSrc,
            userId: msgArray[i].userId,
            userName: msgArray[i].userName,
            createTime: msgArray[i].createTime
          };
          // 解析并渲染
          this.messageParsing(thisSenderMessageObj);
        }
      } else {
        // 接收到服务端推送的新消息，渲染单个消息对象
        const thisSenderMessageObj: msgListType = {
          msgText: msgObj.msgText,
          avatarSrc: msgObj.avatarSrc,
          userId: msgObj.userId,
          userName: msgObj.userName,
          createTime: msgObj?.createTime
        };
        // 找到消息记录列表中与新消息的同一分钟的消息，移除新消息的createTime对象
        for (let i = 0; i < this.senderMessageList.length; i++) {
          const messageObj: msgListType = this.senderMessageList[i];
          // 截取当前消息与新消息发送时间的 年-月-日 时:分,判断其是否相等
          if (
            _.isEqual(
              messageObj.createTime?.substring(0, 16),
              thisSenderMessageObj.createTime?.substring(0, 16)
            )
          ) {
            // 移除新消息的createTime属性
            _.unset(thisSenderMessageObj, "createTime");
          }
        }
        // 解析并渲染
        this.messageParsing(thisSenderMessageObj);
      }
    },
    // 消息解析
    messageParsing: function(msgObj: msgListType) {
      // 消息内容为空不渲染
      if (msgObj.msgText == null) {
        return false;
      }
      // 解析接口返回的数据进行渲染
      const separateReg = /(\/[^/]+\/)/g;
      let msgText = msgObj.msgText as string;
      let finalMsgText: string;
      // 将符合条件的字符串放到数组里
      const resultArray = msgText.match(separateReg);
      if (resultArray !== null) {
        for (let item of resultArray) {
          // 删除字符串中的/符号
          item = item.replace(/\//g, "");
          // 判断是否为图片
          if (this.isImg(item)) {
            const imgSrc = `${base.lkBaseURL}/uploads/chatImg/${item}`;
            // 找到item中?位置，在?之前添加\\进行转义，解决正则无法匹配特殊字符问题
            const charIndex = item.indexOf("?");
            // 生成正则表达式条件，添加\\用于对？的转义
            const regularItem = this.insertStr(item, charIndex, "\\");
            // 解析为img标签
            const imgTag = `<img width="100%" height="100%" src="${imgSrc}" alt="聊天图片">`;
            // 替换匹配的字符串为img标签:全局替换
            msgText = msgText.replace(
              new RegExp(`/${regularItem}/`, "g"),
              imgTag
            );
          }
          // 判断是否为gif
          if (item.indexOf("gif") !== -1) {
            const imgSrc = `${base.lkBaseURL}/uploads/chatImg/${item}`;
            // 解析为img标签
            const imgTag = `<img width="100%" height="100%" src="${imgSrc}" alt="聊天图片">`;
            // 替换匹配的字符串为img标签:全局替换
            msgText = msgText.replace(new RegExp(`/${item}/`, "g"), imgTag);
          }
          // 表情渲染: 遍历表情配置文件
          for (const emojiItem of this.emojiList) {
            // 判断捕获到的字符串与配置文件中的字符串是否相同
            if (emojiItem.info === item) {
              // eslint-disable-next-line @typescript-eslint/no-var-requires
              const imgSrc = require(`../assets/img/emoji/${emojiItem.hover}`);
              const imgTag = `<img src="${imgSrc}" width="28" height="28" alt="${item}">`;
              // 替换匹配的字符串为img标签:全局替换
              msgText = msgText.replace(new RegExp(`/${item}/`, "g"), imgTag);
            }
          }
        }
        finalMsgText = msgText;
      } else {
        finalMsgText = msgText;
      }
      msgObj.msgText = finalMsgText;
      // 渲染页面
      this.senderMessageList.push(msgObj);
      // 修改滚动条位置
      this.$nextTick(() => {
        if (this.$refs.messagesContainer?.scrollHeight) {
          this.$refs.messagesContainer.scrollTop = this.$refs.messagesContainer.scrollHeight;
        }
      });
    },
    // 获取url参数
    getQueryVariable: function(url: string, variable: string) {
      // 对url进行截取
      url = url.substring(url.indexOf("?"), url.length);
      const query = url.substring(1);
      const vars = query.split("&");
      for (let i = 0; i < vars.length; i++) {
        const pair = vars[i].split("=");
        if (pair[0] == variable) {
          return pair[1];
        }
      }
      return false;
    },
    // 工具栏切换
    toolbarSwitch: function(
      status: string,
      event: Event,
      path: string,
      hoverPath: string,
      downPath: string,
      toolItemName: string
    ) {
      if (status === "hover" || status === "up") {
        // 选择图片
        if (_.isEqual(toolItemName, "selectImg")) {
          this.$refs.selectImg.src = require(`@/assets/img/${hoverPath}`);
        } else {
          (event.target as HTMLImageElement).src = require(`@/assets/img/${hoverPath}`);
        }
      } else if (status === "leave") {
        // 选择图片
        if (_.isEqual(toolItemName, "selectImg")) {
          this.$refs.selectImg.src = require(`@/assets/img/${path}`);
        } else {
          (event.target as HTMLImageElement).src = require(`@/assets/img/${path}`);
        }
      } else {
        // 可编辑div获取焦点
        this.getEditableDivFocus();
        // 选择图片
        if (_.isEqual(toolItemName, "selectImg")) {
          this.$refs.selectImg.src = require(`@/assets/img/${downPath}`);
        } else {
          (event.target as HTMLImageElement).src = require(`@/assets/img/${downPath}`);
          // 表情框显示条件
          if (toolItemName === "emoticon") {
            if (this.emoticonShowStatus === "flex") {
              this.emoticonShowStatus = "none";
            } else {
              this.emoticonShowStatus = "flex";
            }
          } else {
            this.emoticonShowStatus = "none";
          }
        }
      }
    },
    // 发送图片
    sendImage: function(e: { target: { files: FileList } }) {
      // 图片上传
      const file = e.target.files[0];
      // 构造form对象
      const formData = new FormData();
      // 后台取值字段 | blob文件数据 | 文件名称
      formData.append("file", file, "chatImg" + file.name);
      // 调用上传api
      this.$api.fileManageAPI.upload(formData).then((res: responseDataType) => {
        const fileName = `/${res.fileName}/`;
        // 消息发送: 发送图片
        this.$socket.sendObj({
          msg: fileName,
          buddyId: this.buddyId,
          messageStatus: this.messageStatus,
          code: 0,
          username: this.$store.state.username,
          avatarSrc: this.$store.state.profilePicture,
          userID: this.$store.state.userID,
          msgId: this.listId
        });
      });
    },
    // 表情框鼠标悬浮显示动态表情
    emojiConversion: function(
      event: Event,
      status: string,
      path: string,
      hoverPath: string,
      info: string
    ) {
      if (status === "over") {
        (event.target as HTMLImageElement).src = require(`@/assets/img/emoji/${hoverPath}`);
      } else if (status === "click") {
        // 表情输入
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const imgSrc = require(`@/assets/img/emoji/${hoverPath}`);
        const imgTag = `<img src="${imgSrc}" width="28" height="28" alt="${info}">`;
        document.execCommand("insertHTML", false, imgTag);
      } else {
        (event.target as HTMLImageElement).src = require(`@/assets/img/emoji/${path}`);
      }
    },
    // base64转file
    convertBase64UrlToImgFile: function(
      urlData: string,
      fileName: string,
      fileType: string
    ) {
      // 转换为byte
      const bytes = window.atob(urlData);
      // 处理异常,将ascii码小于0的转换为大于0
      const ab = new ArrayBuffer(bytes.length);
      const ia = new Int8Array(ab);
      for (let i = 0; i < bytes.length; i++) {
        ia[i] = bytes.charCodeAt(i);
      }
      // 转换成文件，添加文件的type，name，lastModifiedDate属性
      const blob: any = new Blob([ab], { type: fileType });
      blob.lastModifiedDate = new Date();
      blob.name = fileName;
      return blob;
    },
    // 判断是否为图片
    isImg: function(str: string) {
      return str.indexOf(".jpeg") !== -1 || str.indexOf(".png") !== -1;
    },
    // 字符串指定位置添加字符
    insertStr: function(source: string, start: number, newStr: string) {
      return source.slice(0, start) + newStr + source.slice(start);
    },
    // 可编辑div获取焦点
    getEditableDivFocus: function() {
      // 开头获取焦点
      this.$refs.msgInputContainer.focus();
    },
    // 获取消息内容
    getMessageTextList: function(msgId: string) {
      this.$api.messageListAPI
        .getMessageTextList({ msgId: msgId, userId: this.userID })
        .then((res: responseDataType) => {
          if (res.code === 0) {
            // 消息内容列表
            const messageTextList: Array<msgListType> =
              res.data.messageTextList;
            // 处理好的消息内容数组
            const finalTextList: Array<msgListType> = [];
            // 时间存放对象
            const timeObj: { [key: string]: boolean } = {};
            // 处理消息内容列表，同一分钟的数据只保留一个创建时间
            for (let i = 0; i < messageTextList.length; i++) {
              // 消息对象
              const messageObj = messageTextList[i];
              // 获取时间的 年-月-日 时:分
              const time = (messageObj.createTime as string).substring(0, 16);
              // timeObj中已经存在time，则移除当前消息对象的createTime
              if (_.has(timeObj, time)) {
                // 移除createTime属性
                _.unset(messageObj, "createTime");
                // 将移除createTime属性的消息对象放进处理好的消息数组中
                finalTextList.push(messageObj);
              } else {
                // 将time作为key放进timeObj中
                timeObj[time] = true;
                // 原封不动的将消息对象放进处理好的消息数组中
                finalTextList.push(messageObj);
              }
            }
            // 渲染消息列表
            this.renderPage(finalTextList, {});
          } else {
            alert(res.msg);
          }
        });
    }
  },
  emits: {
    // vue3中建议对所有emit事件进行验证
    "update-last-message": (val: string) => {
      return !_.isEmpty(val);
    }
  },
  computed: {
    userID(): string {
      return this.$store.state.userID;
    },
    onlineUsers(): number {
      return this.$store.state.onlineUsers;
    }
  },
  watch: {
    listId: function(newMsgId: string) {
      // 消息id发生改变,晴空消息列表数据
      this.senderMessageList = [];
      // 重新获取消息内容
      this.getMessageTextList(newMsgId);
      if (_.isEqual(this.messageStatus, 1)) {
        this.$socket.sendObj({
          code: 200,
          userID: this.$store.state.userID,
          msg: this.userID + "加入群聊"
        });
      }
    }
  }
});
</script>

<style lang="scss" src="../assets/scss/message-display.scss" scoped></style>
