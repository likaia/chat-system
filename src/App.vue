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
        // 跳转登录页
        const userInfo = {
          "username":"李凯",
          "password":"likai0414"
        };
        // 调用登录api
        this.$api.websiteManageAPI.login(userInfo).then((res)=>{
          console.log(res);
          localStorage.setItem("token",res.token);
          // 更新vuex中的token
          this.$store.state.token = token;
          console.log("token设置成功");
        });
      }else{
        // 更新vuex中的token
        this.$store.state.token = token;
      }
    },
    methods:{
      // 获取当前屏幕高度
      getThisWindowHeight:()=>window.innerHeight
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
