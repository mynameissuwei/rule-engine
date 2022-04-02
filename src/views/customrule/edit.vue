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
              <div class="rule-container" v-for="(item, index) in ruleSet">
                <div class="rule-top">
                  <span class="rule-left">
                    <el-icon
                      @click="item.edit = false"
                      style="cursor: pointer"
                      v-if="item.edit"
                      ><arrow-down-bold
                    /></el-icon>

                    <el-icon
                      @click="item.edit = true"
                      style="cursor: pointer"
                      v-if="!item.edit"
                      ><arrow-up-bold
                    /></el-icon>

                    <span> 规则集{{ index + 1 }} </span>
                  </span>
                  <span class="rule-right">
                    <el-icon style="cursor: pointer" @click="handleEdit"
                      ><edit-pen
                    /></el-icon>
                    <span class="space"></span>
                    <el-icon
                      style="cursor: pointer"
                      @click="handleDelete(index)"
                    >
                      <delete
                    /></el-icon>
                  </span>
                </div>
                <el-form
                  v-if="item.edit"
                  ref="form"
                  label-width="auto"
                  label-position="top"
                  size="default"
                >
                  <el-form-item
                    :label="item.fieldName"
                    v-for="(item, index) in item.ruleObjectList
                      .ruleObjectFieldList"
                  >
                    <el-input
                      v-if="item.calibratorType == 'STRING_EQUALS'"
                      v-model="item.fieldValue"
                      :disabled="formDisabled"
                    />
                    <el-select
                      v-if="item.calibratorType == 'VALUE_CONTAIN'"
                      v-model="item.fieldValue"
                      :disabled="formDisabled"
                    >
                    </el-select>
                  </el-form-item>
                </el-form>
              </div>
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
    <rule-modal
      :visible="visible"
      :handleCancel="handleCancel"
      v-if="visible"
      @pushRule="pushRule"
    ></rule-modal>
  </div>
</template>

<script>
import { reactive, ref, toRefs, nextTick, onBeforeMount } from "vue";
import PageHeader from "comps/PageHeader.vue";
import RuleHeader from "./RuleHeader.vue";
import {
  QuestionFilled,
  ArrowDownBold,
  ArrowUpBold,
  EditPen,
  Delete,
} from "@element-plus/icons-vue";
import { cloneDeep } from "lodash";
import { useRouter } from "vue-router";
import { fetchRuleObjectDetail, createRuleObject } from "api/customrule.js";
import RuleModal from "./RuleModal.vue";

export default {
  components: {
    PageHeader,
    QuestionFilled,
    ArrowDownBold,
    ArrowUpBold,
    EditPen,
    Delete,
    RuleHeader,
    RuleModal,
  },
  setup() {
    const router = useRouter();
    const rules = {
      name: [{ required: true, message: "请输入规则名称", trigger: "blur" }],
      region: [{ required: true, message: "请输入规则名称", trigger: "blur" }],
    };
    const formFieldRef = ref(null);
    const ruleSet = ref([
      {
        conditionName: "fake_data",
        sortNo: 1,
        nextRelation: "AND",
        ruleObjectList: {
          id: "12",
          objectName: "客户",
          objectCode: "customer",
          status: 0,
          useStatus: 0,
          updatedByName: "苏伟",
          updatedDate: "2022-03-31 10:35:46",
          ruleObjectFieldList: [
            {
              id: "26",
              fieldName: "客户类型",
              fieldCode: "customer_type",
              fieldType: "java.lang.String",
              fieldEnum: "小客户;中客户;大客户",
              calibratorType: "STRING_EQUALS",
              fieldValue: "123",
            },
            {
              id: "27",
              fieldName: "客户名称",
              fieldCode: "customer_name",
              fieldType: "java.lang.String",
              fieldEnum: "",
              calibratorType: "STRING_EQUALS",
              fieldValue: "kkkk",
            },
          ],
        },
      },
    ]);
    const dataMap = reactive({
      form: {
        ruleName: "",
        scenarioName: "",
      },
      mapObject: {
        VALUE_CONTAIN: "targetContains",
        STRING_EQUALS: "targetValue",
        INTEGER_RANGE: "rangeType",
      },
      formDisabled: true,
      id: router.currentRoute.value.params.id,
      visible: false,
      fieldStatus: "",
      handleCreate() {
        dataMap.fieldStatus = "create";
        dataMap.visible = true;
      },
      handleEdit() {
        dataMap.fieldStatus = "edit";
        dataMap.visible = true;
      },
      handleCancel() {
        dataMap.visible = false;
      },
      handleDelete(index) {
        ruleSet.value.splice(index, 1);
      },
      changeCondition(value) {
        let result = value.map((item) => {
          return {
            ...item,
            ruleObjectList: item.ruleObjectList.ruleObjectFieldList.map((l) => {
              let result = {
                ruleType: l.calibratorType,
                dataType: l.fieldType,
                id: l.id,
                fieldName: l.fieldName,
                fieldCode: `$.${item.ruleObjectList.objectCode}.${l.fieldCode}`,
              };
              result[dataMap.mapObject[l.calibratorType]] = l.fieldValue;
              return result;
            }),
          };
        });
        return result;
      },
      async onSubmit() {
        let result = {
          ...dataMap.form,
          conditions: dataMap.changeCondition(ruleSet.value),
        };
        const res = await createRuleObject(result);
      },
      pushRule(ruleObjectList) {
        let ruleSetObject = {
          conditionName: "fake_data",
          sortNo: 1,
          nextRelation: "AND",
          ruleObjectList,
        };
        let array = [...ruleSet.value, ruleSetObject];
        let result = array.map((item, idx) => {
          return {
            conditionName: `规则集${idx + 1}`,
            sortNo: idx,
            nextRelation: "OR",
            ...item,
          };
        });
        ruleSet.value = result;
      },
      onCancel() {
        router.push({
          name: "dashboard",
          params: { id: undefined },
        });
      },
    });
    onBeforeMount(async () => {
      if (dataMap.id) {
        let object = {
          id: dataMap.id,
        };
        const res = await fetchRuleObjectDetail(object);
      } else {
      }
    });

    return {
      ...toRefs(dataMap),
      formFieldRef,
      ruleSet,
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
.rule-container {
  margin-top: 10px;
  .el-form {
    margin-left: 22px;
    margin-top: 7px;
    .el-form-item {
      margin-top: 9px;
    }
  }
  .rule-top {
    width: 800px;
    height: 37px;
    line-height: 37px;
    background: #f6f7fb;
    border-radius: 2px;
    display: flex;
    justify-content: space-between;
    .rule-left {
      margin-left: 8px;
    }
    .rule-right {
      margin-right: 8px;
      .space {
        margin-right: 8px;
      }
    }
  }
}
</style>
