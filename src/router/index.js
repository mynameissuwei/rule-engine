import { createRouter, createWebHashHistory } from "vue-router";

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
          path: "/",
          component: () => import("../views/ruleRepository/ruleRepository.vue"),
          name: "RuleRepository"
    },
    {
      path: "/home",
      name: "home",
      component: () => import("views/dashboard/index.vue"),
    },
    // {
    //   path: "/rule/create/:id?",
    //   name: "createRule",
    //   component: () => import("views/CheckRule/create.vue"),
    // },
    // {
    //   path: "/customRule/edit/:id?",
    //   name: "editCustomRule",
    //   component: () => import("views/CustomRule/edit.vue"),
    // },
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
    {
      path: "/newEntityObject",
      component: () => import("../views/EntityObject/NewEntityObject/index.vue"),
      name: "NewEntityObject",
      meta: {
        title: "新建实体对象"
      }
    },{
      path: "/newRuleRepository",
      component: () => import("../views/ruleRepository/newRuleRepository.vue"),
      name: "NewRuleRepository",
      meta: {
        title: "新建规则库"
      }
    },{
      path: "/inputScriptRule",
      component: () => import("../views/ScriptRule/InputScriptRule/index.vue"),
      name: "InputScriptRule",
      meta: {
        title: "新建脚本规则"
      }
    },
    {
      path: "/newEntityObject",
      component: () => import("../views/EntityObject/NewEntityObject/index.vue"),
      name: "NewEntityObject",
      hidden:true,
      meta: {
        title: "新建实体对象"
      }
    },{
      path: "/newRuleRepository",
      component: () => import("../views/ruleRepository/newRuleRepository.vue"),
      name: "NewRuleRepository",
      hidden:true,
      meta: {
        title: "新建规则库"
      }
    },{
      path: "/inputScriptRule",
      component: () => import("../views/ScriptRule/InputScriptRule/index.vue"),
      name: "InputScriptRule",
      hidden:true,
      meta: {
        title: "新建脚本规则"
      }
    },{
      path: "/updateRuleRepository",
      component: () => import("../views/ruleRepository/updateRuleRepository.vue"),
      name: "UpdateRuleRepository",
      hidden:true,
      meta: {
        title: "修改规则库信息"
      }
    },{
      path: "/scriptRuleDetail",
      component: () => import("../views/ScriptRule/ScriptRuleDetail/index.vue"),
      name: "ScriptRuleDetail",
      hidden:true,
      meta: {
        title: "脚本规则详情"
      }
    }

  ],
});

export default router;
