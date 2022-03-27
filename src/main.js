import { createApp } from "vue";
import App from "./App.vue";
import router from "@/router";
import store from "@/store";
import "styles/index.scss";
import { Base64 } from "js-base64";
import EnnAuthSdk from "@enncloud/enn-auth-sdk/src/index";
import element from "plugins/element";

(async function () {
  try {
    let authSdk = await EnnAuthSdk({
      appid: import.meta.env.VITE_APP_APP_ID, // 项目APPID
      baseUrl: import.meta.env.VITE_APP_LOGIN_API, // 该前端对应的后端接口服务的地址(需保证该后端服务也集成了后端的鉴权sdk)
      env: import.meta.env.VITE_APP_ENV, // 当前运行环境 NEW_DEV（新智测试环境）NEW_PRO(新智生产环境多租户版本) NEW_PRO_ONLINE(新智生产环境多租户版本对外域名)
      accessKey: import.meta.env.VITE_APP_ACCESS_KEY, // 网关key
      warningCb: (message) => {
        console.log(message, "message");
      }, // 错误提示回调函数
      whiteList: [/(.*)\.baidu\.com/i, "https://xxx.com"], // 第三方js白名单
    });
    initVite(authSdk);
  } catch (e) {
    // 不要在catch里实例化vue
  }
})();

const initVite = (authSdk) => {
  const app = createApp(App);
  app.config.globalProperties.$ennAuth = authSdk;
  app.use(router);
  app.use(store);
  app.use(Base64);
  app.use(element);
  app.mount("#app");
};
