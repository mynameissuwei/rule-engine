<template>
  <div>
    <rule-header
      :leftText="id ? '编辑校验规则' : '新建校验规则'"
      :showButton="id ? true : false"
    />
    <div class="container">
      <div class="form-box">
        <el-form ref="formRef" :rules="rules" :model="form" label-width="120px">
          <el-form-item label="规则名称:" prop="name">
            <el-input
              v-model="form.ruleName"
              placeholder="可使用中英文、数字组合"
            ></el-input>
            <el-tooltip
              class="item"
              content="支持中英文、数字组合"
              effect="light"
              placement="top"
            >
              <el-icon><question-filled /></el-icon>
            </el-tooltip>
          </el-form-item>
          <el-form-item label="使用场景描述:" prop="region">
            <el-input
              v-model="form.scenarioName"
              placeholder="请输入"
            ></el-input>
          </el-form-item>
          <el-form-item label="规则编辑" prop="region">
            <div>
              <div
                type="primary"
                size="small"
                @click="handleCreate"
                class="gray-button"
              >
                + 添加规则
              </div>
              <div v-for="item in form.conditions"></div>
            </div>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <el-footer class="footerContainer">
      <el-button-group>
        <el-button type="primary" size="small" @click="onSubmit"
          >完成</el-button
        >
        <el-button
          class="center"
          size="small"
          style="margin: 0px 20px"
          @click="onCancel"
          >取消</el-button
        >
        <el-button size="small">测试</el-button>
      </el-button-group>
    </el-footer>
    <rule-modal :visible="visible"></rule-modal>
  </div>
</template>

<script>
import { reactive, ref, toRefs, nextTick, onBeforeMount } from "vue";
import PageHeader from "comps/PageHeader.vue";
import RuleHeader from "./RuleHeader.vue";
import { QuestionFilled } from "@element-plus/icons-vue";
// import { defaultArticleModel } from "apis/checkRule";
import { cloneDeep } from "lodash";
import { useRouter } from "vue-router";
// import { fetchDetail } from "api/customrule.js";
import RuleModal from "./RuleModal.vue";

export default {
  components: { PageHeader, QuestionFilled, RuleHeader, RuleModal },
  setup() {
    console.log(123);
    const router = useRouter();
    const rules = {
      name: [{ required: true, message: "请输入规则名称", trigger: "blur" }],
      region: [{ required: true, message: "请输入规则名称", trigger: "blur" }],
    };
    const formFieldRef = ref(null);
    const dataMap = reactive({
      form: {
        ruleName: "",
        scenarioName: "",
      },
      id: router.currentRoute.value.params.id,
      visible: false,
      fieldStatus: "",
      resetForm() {
        dataMap.form = cloneDeep([]);
      },
      handleCreate() {
        dataMap.resetForm();
        dataMap.fieldStatus = "create";
        dataMap.visible = true;
        nextTick(() => {
          formFieldRef.value.clearValidate();
        });
      },
      onSubmitRule() {},
      onCancel() {
        router.push({
          name: "dashboard",
          params: { id: undefined },
        });
      },
    });
    onBeforeMount(async () => {
      const data = {
        id: "1",
        ruleCode: "RL0001",
        ruleName: "测试一条规则",
        scenarioName: "测试使用",
        comment: "规则配置",
        releaseStatus: "1",
        status: 1,
        ruleGroup: {
          id: "1",
          ruleGroupCode: "D001",
          ruleGroupName: "规则一",
        },
        conditions: [
          {
            sortNo: 1,
            nextRelation: "AND",
            ruleName: "123",
            ruleObjectList: [
              {
                id: "2",
                objectName: "对象二",
                ruleObjectFieldList: [
                  {
                    sortNo: 1,
                    comment: "测试一下规则field",
                    fieldName: "name",
                    fieldType: "String",
                    dataType: "java.lang.String",
                    fieldPath: "$.name",
                    fieldComment: "字符串错误信息",
                    ruleType: "STRING_NOT_EMPTY",
                    nextRelation: "AND",
                    message: "这是返回消息",
                  },
                  {
                    sortNo: 2,
                    comment: "测试一下规则field",
                    fieldName: "nickName",
                    fieldType: "String",
                    dataType: "java.lang.String",
                    fieldPath: "$.nickName",
                    fieldComment: "字符串长度不能超过指定范围",
                    ruleType: "STRING_LENGTH",
                    maxValue: "",
                    minValue: "",
                    maxLength: 4,
                    minLength: 2,
                    rangeType: "GT_LT",
                    nextRelation: "AND",
                    message: "这是返回消息",
                  },
                  {
                    sortNo: 2,
                    comment: "3-field",
                    fieldName: "company",
                    fieldType: "String",
                    dataType: "java.lang.String",
                    fieldPath: "$.company",
                    fieldComment: "第3个测试字符串",
                    ruleType: "STRING_LENGTH",
                    targetLength: 222222,
                    targetValue: "11111",
                    maxValue: "",
                    minValue: "",
                    maxLength: 10,
                    minLength: 2,
                    rangeType: "GTE_LTE",
                    nextRelation: "AND",
                    message: "message-3",
                  },
                ],
              },
            ],
          },
        ],
      };

      if (dataMap.id) {
        // const res = await fetchDetail(dataMap.id)
        dataMap.form = data;
      } else {
      }
    });

    return {
      ...toRefs(dataMap),
      formFieldRef,
    };
  },
};
</script>

<style lang="scss" scoped>
.container {
  display: flex;
  .el-input {
    width: 320px;
    margin-right: 10px;
  }
}
</style>
