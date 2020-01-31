<template>
    <div id="login-panel" ref="loginPanel">
        <div class="top-panel">
            <div class="qrCode-panel">
                <img src="../assets/img/login/code_normal@2x.png"/>
            </div>
        </div>
        <!--头像区域-->
        <div class="headPortrait-panel">
            <!--加载层-->
            <div class="load-panel loadWhirl" v-if="isLoginStatus==='loggingIn'">
                <!--头像显示层:登录中-->
                <div class="headPortrait-img-panel avatarRotation">
                    <img :src="avatarSrc"/>
                </div>
            </div>
            <!--头像显示层:注册-->
            <div class="headPortrait-img-panel" v-else-if="isLoginStatus===false">
                <!--灰色蒙层:默认头像-->
                <div class="cover-panel" v-if="isDefaultAvatar===true">
                    <p>上传头像</p>
                    <input class="file" name="file" type="file" accept="image/png,image/gif,image/jpeg" @change="uploadAvatar($event)"/>
                </div>
                <!--头像已上传：取消灰色蒙层-->
                <div class="cover-panel" v-else style="background: rgba(0,0,0,.0);">
                    <input class="file" name="file" type="file" accept="image/png,image/gif,image/jpeg" @change="uploadAvatar($event)"/>
                </div>
                <img :src="avatarSrc"/>
            </div>
            <!--头像显示层:登录-->
            <div class="headPortrait-img-panel" v-else>
                <img :src="avatarSrc"/>
            </div>
        </div>
        <!--输入区域:登录-->
        <div class="inputArea-panel" v-if="isLoginStatus===true">
            <div class="item-panel">
                <input type="text" @blur="getUserAvatar()" v-model="userName" placeholder="输入用户名" onfocus="this.placeholder=''" onblur="this.placeholder='输入用户名'">
            </div>
            <div class="item-panel">
                <input type="password" v-model="password" placeholder="输入密码" onfocus="this.placeholder=''" onblur="this.placeholder='输入密码'" @keydown.enter.exact="login('click')">
                <div class="login-btn-panel" @click="login('click')" @mouseenter="login('hover')" @mouseleave="login('leave')">
                    <img :src="loginBtnNormal"/>
                </div>
            </div>
        </div>
        <!--输入区域:登录中-->
        <div class="inputArea-panel" v-else-if="isLoginStatus==='loggingIn'">
            <div class="username-view-panel">
                <p>
                    {{userName}}
                </p>
            </div>
            <div class="cancel-btn-panel" @click="cancelLogin()" ref="cancelBtn">
                <p>取消</p>
            </div>
        </div>
        <!--输入区域:注册-->
        <div class="inputArea-panel" v-else>
            <div class="item-panel">
                <input type="text" v-model="userName" placeholder="输入用户名" onfocus="this.placeholder=''" onblur="this.placeholder='输入用户名'">
            </div>
            <div class="item-panel">
                <input type="password" v-model="password" placeholder="输入密码" onfocus="this.placeholder=''" onblur="this.placeholder='输入密码'">
            </div>
            <div class="item-panel">
                <input type="password" v-model="confirmPassword" placeholder="确认密码" onfocus="this.placeholder=''" onblur="this.placeholder='确认密码'" @keydown.enter.exact="login('clickRegistered')">
                <div class="login-btn-panel" @click="login('clickRegistered')" @mouseenter="login('hover')" @mouseleave="login('leave')">
                    <img :src="loginBtnNormal"/>
                </div>
            </div>
        </div>
        <!--注册区域-->
        <div class="registration-area-panel" v-if="isLoginStatus!=='loggingIn'">
            <p v-if="isLoginStatus===true" @click="registered(true)">立即注册</p>
            <p v-else @click="registered(false)">返回登录</p>
        </div>
    </div>
</template>

<script>
    import base from '../api/base'
    import lodash from 'lodash'

    export default {
        name: "login",
        data(){
            return {
                loginUndo: require("../assets/img/login/icon-enter-undo@2x.png"),
                loginBtnNormal: require("../assets/img/login/icon-enter-undo@2x.png"),
                loginBtnHover: require("../assets/img/login/icon-enter-hover@2x.png"),
                loginBtnDown: require("../assets/img/login/icon-enter-down@2x.png"),
                userName: "",
                password: "",
                confirmPassword:"",
                isLoginStatus: true,
                isDefaultAvatar: true,
                avatarSrc:require("../assets/img/login/LoginWindow_BigDefaultHeadImage@2x.png"),
                // 加载层文字
                loadText:"上传中"
            }
        },
        methods: {
            login: function (status) {
                let loginBtnTime;
                if(status==="hover"){
                    if(this.password===""){
                        this.loginBtnNormal = this.loginUndo;
                    }else{
                        this.loginBtnNormal = this.loginBtnHover
                    }
                }else if(status==="click"){
                    // 登录事件
                    if(this.password===""){
                        this.loginBtnNormal = this.loginUndo;
                    }else{
                        this.loginBtnNormal = this.loginBtnDown;
                        clearTimeout(loginBtnTime);
                        loginBtnTime = setTimeout(()=>{
                            if(lodash.isEmpty(this.userName)){
                                alert("用户名不能为空");
                                return;
                            }
                            if(lodash.isEmpty(this.password)){
                                alert("密码不能为空");
                                return;
                            }
                            // 显示登录ui
                            this.isLoginStatus = "loggingIn";
                            this.loginBtnNormal = require("../assets/img/login/icon-enter-normal@2x.png");
                            // 调用登录接口
                            const userObj = {
                                "userName":this.userName,
                                "password":this.password
                            };
                            this.$api.websiteManageAPI.login(userObj).then((res)=>{
                                if(res.code===0){
                                    res.data = JSON.parse(res.data);
                                    // 存储当前用户信息
                                    localStorage.setItem("token",res.data.token);
                                    localStorage.setItem("profilePicture",res.data.avatarSrc);
                                    localStorage.setItem("userID",res.data.userID);
                                    localStorage.setItem("username",res.data.username);
                                    // 跳转主界面路由
                                    this.$router.push({name:"contents",params:{thisStatus:"message"}})
                                }else{
                                    // 返回登录界面
                                    this.isLoginStatus = true;
                                    this.password = "";
                                    setTimeout(()=>{
                                        alert(res.msg);
                                    },300);
                                }
                            });
                        },150);
                    }
                }else if(status==="clickRegistered"){
                    // 注册事件
                    if(this.password===""){
                        this.loginBtnNormal = this.loginUndo;
                    }else{
                        this.loginBtnNormal = this.loginBtnDown;
                        clearTimeout(loginBtnTime);
                        loginBtnTime = setTimeout(()=>{
                            this.loginBtnNormal = require("../assets/img/login/icon-enter-normal@2x.png");
                            // 判断确认密码是否输入
                            if(lodash.isEmpty(this.confirmPassword)){
                                alert("确认密码不能为空");
                                return;
                            }
                            // 头像必传
                            if(this.isDefaultAvatar){
                                alert("头像为必传项");
                                return;
                            }
                            // 用户名长度不能小于4
                            this.userName = lodash.trim(this.userName);
                            if(this.userName.length<4){
                                alert("用户名长度不能小于4");
                                return;
                            }
                            // 密码长度不能小于6位
                            if(this.password.length<6){
                                alert("密码长度不能小于6位");
                                return;
                            }
                            // 判断密码与确认密码是否相等
                            if(lodash.isEqual(this.password,this.confirmPassword)){
                                this.$fullScreenLoading.show("注册中");
                                const userObj = {
                                  "userName":this.userName,
                                  "password":this.password,
                                  "avatarSrc":this.avatarSrc
                                };
                                // 调用注册api
                                this.$api.websiteManageAPI.registered(userObj).then((res)=>{
                                    if(res.code===0){
                                        this.$fullScreenLoading.show("注册成功,请牢记密码");
                                        setTimeout(()=>{
                                            // 切回登录界面
                                            this.isLoginStatus = true;
                                            this.$fullScreenLoading.hide();
                                        },1000);
                                    }
                                })
                            }else{
                                alert("两次输入的密码不匹配");
                            }
                        },150);
                    }
                } else{
                    if(this.password===""){
                        this.loginBtnNormal = this.loginUndo;
                    }else{
                        this.loginBtnNormal = require("../assets/img/login/icon-enter-normal@2x.png")
                    }

                }
            },
            registered: function (status) {
                // 登录与注册之间的切换
                let degreeOfRotation = 0;
                const timer = setInterval(()=>{
                    degreeOfRotation+=30;
                    if(degreeOfRotation>=360){
                        // 显示登录或注册
                        this.isLoginStatus = status !== true;
                        clearInterval(timer);
                    }
                    this.$refs.loginPanel.style.transform = `rotateY(${degreeOfRotation}deg)`
                },40);

            },
            getUserAvatar:function(){
                // 获取用户头像
                const userObj = {
                    "userName":this.userName
                };
                // 调用接口
                if(!lodash.isEmpty(this.userName)){
                    this.$api.websiteManageAPI.getUserAvatar(userObj).then((res)=>{
                        if(res.code===0){
                            // 替换头像
                            this.avatarSrc = res.data;
                        }else{
                            this.avatarSrc = require("../assets/img/login/LoginWindow_BigDefaultHeadImage@2x.png")
                        }
                    })
                }
            },
            cancelLogin:function () {
                // 取消登录
                this.$refs.cancelBtn.style.background = "#f3f3f3";
                // 清空密码显示登录
                this.password = "";
                this.isLoginStatus = true;
                this.$refs.cancelBtn.style.background = "";
            },
            uploadAvatar:function (e) {
                // 头像上传
                this.$fullScreenLoading.show("上传中");
                let file = e.target.files[0];
                // 构造form对象
                let formData = new FormData();
                // 后台取值字段 | blob文件数据 | 文件名称
                formData.append("file",file,file.name);
                // 调用上传api
                this.$api.fileManageAPI.baseFileUpload(formData).then((res)=>{
                    const fileName = `${base.lkBaseURL}/uploads/${res.fileName}`;
                    // 更改默认头像状态
                    this.isDefaultAvatar = false;
                    // 头像赋值
                    this.avatarSrc = fileName;
                    // 隐藏全局加载层
                    this.$fullScreenLoading.hide();
                });
            }
        },
        watch: {
            // 监听确认密码状态
            'password':function (thisVal) {
                if(thisVal===""){
                    this.loginBtnNormal = this.loginUndo;
                }else{
                    this.loginBtnNormal = require("../assets/img/login/icon-enter-normal@2x.png")
                }
            }
        }
    }
</script>

<style scoped lang="scss" src="../assets/scss/login.scss"/>