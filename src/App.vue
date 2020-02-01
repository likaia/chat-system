<template>
  <div id="app" :style="appStyleObj">
    <main-content/>
  </div>
</template>
<script>
  import mainContent from '@/components/main-content.vue';
  import lodash from 'lodash';

  export default {
    // 当前组件名
    name:'app',
    components:{
      // 需要在页面所引入的组件进行声明
      mainContent
    },
    data(){
      // 当前页面需要用到的数据
      return{
        appStyleObj: {
          height: window.innerHeight+"px",
          background: "#0C9A9A",
          currentComponentName: null
        }
      }
    },
    created: function(){
      // 页面创建完成后，从localstorage中获取token更新vuex
      const token = localStorage.getItem("token");
      const username = localStorage.getItem("username");
      if(this.isMobile()){
        window.location.href = "https://www.kaisir.cn/chat-system/index.html#/contents/message/message/messageDisplay/5309190090";
      }
      if(lodash.isEmpty(token) || lodash.isEmpty(username)){
        // 判断当前路由参数是否为登录页面
        if(this.currentComponentName!=="login"){
          // 跳转登录路由
          localStorage.removeItem("msgArray");
          this.$router.push({name:"login"})
        }
      }else{
        // 更新vuex中的token
        this.$store.state.token = token;
        this.$store.state.profilePicture = localStorage.getItem("profilePicture");
        this.$store.state.userID = localStorage.getItem("userID");
        this.$store.state.username = localStorage.getItem("username");
      }
    },
    methods:{
      // 获取当前屏幕高度
      getThisWindowHeight:()=>window.innerHeight,
      // 居中打开一个新窗口
      openWin:(url,name,iWidth,iHeight)=>{
        //获得窗口的垂直位置
        const iTop = (window.screen.availHeight - 30 - iHeight) / 2;
        // //获得窗口的水平位置
        const iLeft = (window.screen.availWidth - 10 - iWidth) / 2;
        return window.open(url, name, `width=${iWidth},height=${iHeight},top=${iTop},left=${iLeft},toolbar:0`);
      },
      isMobile:()=>{
        return !!(navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i));
      }
    },
    beforeDestroy() {
      // 页面销毁时,断开连接
      console.log("页面销毁，断开websocket连接");
      this.$disconnect();
    },
    watch: {
      $route:{
        handler: function (route) {
          this.currentComponentName=route.name;
        },
        immediate: true
      }
    },
  }
</script>
<style lang="scss">
  *{
    margin: 0;
    padding: 0;
  }
  body{
    box-sizing: border-box;
  }
  #app{
    width: 100%;
    height: 100%;
  }
  .icon {
    width: 1em;
    height: 1em;
    vertical-align: -0.15em;
    fill: currentColor;
    overflow: hidden;
  }
</style>
