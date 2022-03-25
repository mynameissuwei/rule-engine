import { createRouter, createWebHashHistory } from "vue-router";

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: "/",
      name: "dashboard",
      component: () => import("views/dashboard/index.vue"),
    },
    {
      path: "/rule/create/:id?",
      name: "createRule",
      component: () => import("views/CheckRule/create.vue"),
    },
    {
      path: "/customRule/edit/:id?",
      name: "editCustomRule",
      component: () => import("views/CustomRule/edit.vue"),
    },
  ],
});

export default router;
