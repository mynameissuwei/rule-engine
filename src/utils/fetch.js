import axios from "axios";
import { ElMessage } from "@enn/element-plus";
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
    const res = response.data;

    if (!res.success) {
      ElMessage({
        message: res.message || "系统繁忙，请稍后再试",
        type: "error",
        duration: 5 * 1000,
      });
      console.log(res, "ressss");
      // return Promise.reject(new Error(res.message || "Error"));
      return res;
    } else {
      return res;
    }
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default service;
