import { createApp } from "vue";
import App from "./App.vue";
import router from "@/router";
import store from "@/store";
import "styles/index.scss";
import { Base64 } from "js-base64";
import EnnAuthSdk from "@enncloud/enn-auth-sdk/src/index";
import element from "plugins/element";

EnnAuthSdk({
  baseUrl: import.meta.env.VITE_APP_LOGIN_API, //项目后端接口地址
  appid: import.meta.env.VITE_APP_APP_ID, // 项目APPID
  accessKey: import.meta.env.VITE_APP_ACCESS_KEY, // 网关key
  authUrl: import.meta.env.VITE_APP_AUTH_API,
  env: import.meta.env.VITE_APP_ENV, // 当前运行环境 develop or production
  warningCb: (message) => {
    console.log(message, "error");
  },
}).then((ennAuth) => {
  console.log(ennAuth, "ennAuth");
  const app = createApp(App);
  // ennAuth.logout();
  app.config.globalProperties.$ennAuth = ennAuth; // 将实例挂载至vue原型链中，以便其它组件调用 登出功能 （this.authSdk.logout()） 切换租户功能(this.authSdk.selectTenant())
  app.use(router);
  app.use(store);
  app.use(Base64);
  app.use(element);
  app.mount("#app");
});
