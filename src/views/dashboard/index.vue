<template>
  <page-header></page-header>
  <el-tabs v-model="message">
    <el-tab-pane label="校验规则" name="first">
      <check-rule></check-rule>
    </el-tab-pane>
    <el-tab-pane label="脚本规则" name="second"> 这是脚本规则 </el-tab-pane>
    <el-tab-pane label="自定义规则" name="third">
      <custom-rule></custom-rule>
    </el-tab-pane>
  </el-tabs>
</template>

<script>
import { ref } from "vue";
import PageHeader from "comps/PageHeader.vue";
import CheckRule from "views/checkrule/index.vue";
import CustomRule from "views/customrule/index.vue";

export default {
  name: "tabs",
  components: {
    PageHeader,
    CheckRule,
    CustomRule,
  },
  setup() {
    const message = ref("third");
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
