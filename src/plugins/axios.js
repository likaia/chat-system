"use strict";

import Vue from 'vue';
import axios from "axios";
// 设置baseURL
axios.defaults.baseURL = process.env.baseURL || process.env.apiUrl || 'https://www.kaisir.cn';
// 请求头添加token
axios.defaults.headers.common['Authorization'] = "";
// 设置get请求头
axios.defaults.headers.get['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';
// 设置post请求头
axios.defaults.headers.post['Content-Type'] = 'application/json;charset=utf-8';

let config = {
  baseURL: "localhost/user",
  // 请求超时时间
  timeout: 60 * 1000,
  // 跨域请求时是否需要凭证
  // withCredentials: true, // Check cross-site Access-Control
};

// 根据环境当前变量更改baseURL
switch (process.env.NODE_ENV) {
  case 'development':
    // 开发环境
    config.baseURL = "https://www.kaisir.cn/user";
    break;
  case 'production':
    // 生产环境
    config.baseURL = "https://www.kaisir.cn/api";
}

const _axios = axios.create(config);
// 请求拦截器
_axios.interceptors.request.use(
  function(config) {
    // Do something before request is sent
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
    // Do something with response data
    return response;
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
