<template>
  <div>
    <page-header></page-header>
    <el-tabs v-model="message" @tab-click="handleTabClick">
      <el-tab-pane label="实体对象" name="entityObject">
        <entity-object></entity-object>
      </el-tab-pane>
      <!-- <el-tab-pane label="校验规则" name="first">
        <check-rule></check-rule>
      </el-tab-pane> -->
      <el-tab-pane label="脚本规则" name="scriptRule">
        <ScriptRule></ScriptRule>
      </el-tab-pane>
      <el-tab-pane label="自定义规则" name="customRule">
        <template v-if="message === 'customRule'">
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
import { onMounted, provide, ref } from "vue";
import PageHeader from "../../components/PageHeader.vue";
// import CheckRule from "views/checkrule/index.vue";
import CustomRule from "views/CustomRule/index.vue";
import RuleLayoutList from "views/RuleLayout/List/index.vue";
import { useRoute, useRouter } from "vue-router";
import ScriptRule from "views/ScriptRule/index.vue";
import EntityObject from "views/EntityObject/index.vue";

export default {
  name: "tabs",
  components: {
    RuleLayoutList,
    PageHeader,
    // CheckRule,
    CustomRule,
    ScriptRule,
    EntityObject
  },
  setup() {
    const message = ref("entityObject");
    const route = useRoute();
    const router = useRouter();

    onMounted(() => {
      let tabValue = route.query.tab;
      if (tabValue) message.value = tabValue;
    });

    const handleTabClick = (tab) => {
      router.push({
        query: {
          ...route.query,
          tab: tab.props.name
        },
      });
    };

    return {
      message,
      handleTabClick,
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
