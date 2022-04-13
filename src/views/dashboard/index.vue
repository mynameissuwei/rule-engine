<template>
  <div>
    <page-header></page-header>
    <el-tabs v-model="message">
      <el-tab-pane label="实体对象" name="entityObject">
        <entity-object></entity-object>
      </el-tab-pane>
      <!-- <el-tab-pane label="校验规则" name="first">
        <check-rule></check-rule>
      </el-tab-pane> -->
      <el-tab-pane label="脚本规则" name="ScriptRule">
        <ScriptRule></ScriptRule>
      </el-tab-pane>
      <el-tab-pane label="自定义规则" name="third">
        <template v-if="message === 'third'">
          <custom-rule></custom-rule>
        </template>
      </el-tab-pane>
      <el-tab-pane label="脚本规则编排" name="four">
        <template v-if="message === 'four'">
          <RuleLayoutList></RuleLayoutList>
        </template>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { provide, ref } from "vue";
import PageHeader from "../../components/PageHeader.vue";
// import CheckRule from "views/CheckRule/index.vue";
import CustomRule from "views/CustomRule/index.vue";
import RuleLayoutList from "views/RuleLayout/List/index.vue";
import { useRoute } from "vue-router";
import ScriptRule from "views/ScriptRule/index.vue";
import entityObject from "views/EntityObject/index.vue";

export default {
  name: "tabs",
  components: {
    RuleLayoutList,
    PageHeader,
    // CheckRule,
    CustomRule,
    ScriptRule,
    entityObject,
  },
  setup() {
    const message = ref("third");
    const router = useRoute();
    const id = ref(router.query.id);
    const name = ref(router.query.ruleGroupName);
    const ruleGroupCode = ref(router.query.ruleGroupCode);
    const description = ref(router.query.ruleGroupDesc);
    provide("id", id);
    provide("ruleGroupName", name);
    provide("ruleGroupCode", ruleGroupCode);
    provide("ruleGroupDesc", description);
    return {
      message,
    };
  },
};
</script>

<style lang="scss" scoped>
::v-deep {
  .el-tabs__header {
    padding-left: 49px;
  }
}
</style>
