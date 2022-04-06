import router, { constantRoutes } from "@/router";
import store from "./store";
import { useStore } from "vuex";

const hasTenant = store.getters.tenantId;

router.beforeEach(async (to, from, next) => {
  if (!hasTenant) {
    await store.dispatch("user/getInfo");
  }

  next();
});
