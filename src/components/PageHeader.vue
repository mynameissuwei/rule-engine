<template>
  <div class="page-header">
    <div class="top-container">
      <div class="left">{{ name }}</div>
      <div class="right">
        <el-button
          type="primary"
          class="gray-button"
          plain
          size="small"
          @click="gotoUpdateRuleRepository"
          >修改
        </el-button>
      </div>
    </div>
    <div class="bottom-container">
      <div class="left">
        <span class="left-title"> 规则库描述： </span>
        <span class="right-title">
          {{ description }}
        </span>
      </div>
      <div class="right">
        <span class="left-title">规则库编码：</span>
        <span class="right-title"> {{ code }} </span>
      </div>
    </div>
  </div>
</template>

<script>
import { inject, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";

export default {
  name: "pageHeader",
  setup() {
    const store = useStore();
    const {
      id,
      ruleGroupCode: code,
      ruleGroupDesc: description,
      ruleGroupName: name,
    } = store.state.rule.ruleData;
    //provide、inject
    // const name = inject("ruleGroupName");
    // const code = inject("ruleGroupCode");
    // const description = inject("ruleGroupDesc");
    // const id = inject("id");

    const router = useRouter();
    //跳转到修改规则库页面
    const gotoUpdateRuleRepository = () => {
      router.push({
        path: "updateRuleRepository",
        query: {
          id,
          name,
          code,
          description,
        },
      });
    };
    return {
      name,
      code,
      description,
      gotoUpdateRuleRepository,
    };
  },
};
</script>

<style lang="scss" scoped>
.page-header {
  background: #fff;
  padding: 20px;

  .top-container {
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;

    .left {
      font-size: 18px;
      font-weight: 500;
      color: #323233;
    }
  }

  .bottom-container {
    display: flex;
    font-size: 14px;
    font-weight: 400;
    color: #333333;
    line-height: 22px;

    .left {
      flex: 0.7;
      margin-left: 25px;

      .left-title {
        font-weight: 400;
        color: #646566;
        line-height: 22px;
        font-size: 14px;
      }

      .right-title {
        margin-left: 18px;
      }
    }

    .right {
      flex: 0.3;
      text-align: left;
      .left-title {
        font-weight: 400;
        color: #646566;
        line-height: 22px;
        font-size: 14px;
      }
      .right-title {
        color: #333333;
        margin-left: 18px;
      }
    }
  }
}
</style>
