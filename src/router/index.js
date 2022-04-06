import { createRouter, createWebHashHistory } from "vue-router";

export const constantRoutes = [
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
  {
    path: "/customRule/test",
    name: "testCustomRule",
    component: () => import("views/CustomRule/test.vue"),
  },
  {
    path: "/rule-graph",
    name: "ruleGraph",
    component: () => import("@/views/RuleGraph/index.vue"),
  },
  {
    path: "/rule-layout/detail",
    name: "ruleLayout",
    component: () => import("@/views/RuleLayout/Detail/index.vue"),
  },
  {
    path: "/rule-layout/add",
    name: "ruleLayoutADD",
    component: () => import("@/views/RuleLayout/Add/index.vue"),
  },
  {
    path: "/rule-layout/list",
    name: "ruleLayoutList",
    component: () => import("@/views/RuleLayout/List/index.vue"),
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes: constantRoutes,
});

export default router;
