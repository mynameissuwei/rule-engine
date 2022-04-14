import { createStore } from "vuex";
import getters from "./getters";
import user from "./modules/user";
import rule from "./modules/rule";
import persistedState from "vuex-persistedstate";

const store = createStore({
  modules: {
    user,
    rule,
  },
  getters,
  plugins: [
    persistedState({
      storage: window.sessionStorage,
      paths: ["rule"],
    }),
  ],
});

export default store;
