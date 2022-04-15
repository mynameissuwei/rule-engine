import router from "@/router";
import store from "./store";

router.beforeEach(async (to, from, next) => {
  const hasTenant = store.getters.tenantId;
  if (!hasTenant) {
    await store.dispatch("user/getInfo");
  }

  next();
});
