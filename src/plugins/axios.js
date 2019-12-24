"use strict";

import Vue from 'vue';
import axios from "axios";
import store from '../store/index';
let config = {
  baseURL: process.env.NODE_ENV === 'development' ? '/user' : '/api',
  // 请求超时时间
  timeout: 60 * 1000,
  // 跨域请求时是否需要凭证
  // withCredentials: true, // Check cross-site Access-Control
  heards:{
    get:{
      'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
      // 将普适性的请求头作为基础配置。当需要特殊请求头时，将特殊请求头作为参数传入，覆盖基础配置
    },
    post:{
      'Content-Type': 'application/json;charset=utf-8'
      // 将普适性的请求头作为基础配置。当需要特殊请求头时，将特殊请求头作为参数传入，覆盖基础配置
    }
  },
  // 在向服务器发送请求前，对数据进行处理，axios默认会序列化数据
  // transformRequest:[function(data){
  //
  // }],
  // 在传递给 then/catch 前，修改响应数据
  // transformResponse:[function(data){
  //
  // }]
};

// 创建实例
const _axios = axios.create(config);
// 请求拦截器
_axios.interceptors.request.use(
  function(config) {
    // 从vuex里获取token
    const token = store.state.token;
    // 如果token存在就在请求头里添加
    token && (config.headers.Authorization = token);
    return config;
  },
  function(error) {
    // Do something with request error
    error.data = {};
    error.data.msg = "服务器异常";
    return Promise.reject(error);
  }
);

// 响应拦截器
_axios.interceptors.response.use(
  function(response) {
    // 只返回response中的data数据
    return response.data;
  },
  function(error) {
    // Do something with response error
    error.data = {};
    error.data.msg = "请求超时或服务器异常";
    return Promise.reject(error);
  }
);

// eslint-disable-next-line no-unused-vars
Plugin.install = function(Vue, options) {
  Vue.axios = _axios;
  window.axios = _axios;
  Object.defineProperties(Vue.prototype, {
    axios: {
      get() {
        return _axios;
      }
    },
    $axios: {
      get() {
        return _axios;
      }
    },
  });
};

Vue.use(Plugin);

export default Plugin;
