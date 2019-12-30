<template>
  <div id="app" :style="appStyleObj">
    <main-content/>
  </div>
</template>
<script>
  import mainContent from '@/components/main-content.vue';
  import lodash from 'lodash'
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
          background: "#0C9A9A"
        }
      }
    },
    created: function(){
      // 页面创建完成后，从localstorage中获取token更新vuex
      const token = localStorage.getItem("token");
      if(lodash.isEmpty(token)){
     /*   const userInfo = {
          "username":"李凯",
          "password":"likai0414"
        };
        // 调用登录api
        this.$api.websiteManageAPI.login(userInfo).then((res)=>{
          localStorage.setItem("token",res.token);
          localStorage.setItem("profilePicture",res.avatarSrc);
          localStorage.setItem("userID",res.userID);
          // 更新vuex中的token
          this.$store.state.token = res.token;
          this.$store.state.profilePicture = res.avatarSrc;
          this.$store.state.userID = res.userID;
        });*/

        // 跳转登录页
        let windowOBJ = this.openWin("https://www.kaisir.cn/login","loginWindow",800,675);
        // 使用定时器判断当前窗口是否关闭
        let loop = setInterval(()=>{
          if(windowOBJ.closed){
            clearInterval(loop);
            // 刷新当前页
            parent.location.reload();
          }
        },1);

      }else{
        // 更新vuex中的token
        this.$store.state.token = token;
        this.$store.state.profilePicture = localStorage.getItem("profilePicture");
        this.$store.state.userID = localStorage.getItem("userID");
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
      }
    }
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
    background: #0C9A9A;
  }
  .icon {
    width: 1em;
    height: 1em;
    vertical-align: -0.15em;
    fill: currentColor;
    overflow: hidden;
  }
</style>
