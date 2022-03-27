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
      component: () => import("views/checkrule/create.vue"),
    },
    {
      path: "/customRule/edit/:id?",
      name: "editCustomRule",
      component: () => import("views/customrule/edit.vue"),
    },
  ],
});

export default router;
