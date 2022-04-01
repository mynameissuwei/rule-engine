import axios from "axios";

// 创建axios实例
const service = axios.create({
  baseURL: import.meta.env.VITE_BASE_API,
  timeout: 5000,
  headers: {
    "x-gw-accessKey": import.meta.env.VITE_APP_ACCESS_KEY,
  },
});

// 请求拦截
service.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
service.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default service;
