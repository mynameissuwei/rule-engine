<template>
  <div>
    <rule-header
      :leftText="
        id ? (isDetail ? '校验规则详情' : '编辑校验规则') : '新建校验规则'
      "
      :showButton="id ? (isDetail ? true : false) : false"
    />
    <div class="container" v-loading="spinLoadingRef">
      <div class="form-box">
        <el-form ref="formRef" :rules="rules" :model="form" label-width="120px">
          <el-form-item label="规则名称:" prop="name">
            <el-input
              v-model="form.ruleName"
              placeholder="可使用中英文、数字组合"
              :disabled="isDetail"
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
              :disabled="isDetail"
            ></el-input>
          </el-form-item>
          <el-form-item label="规则编辑" prop="region">
            <div>
              <el-button
                size="small"
                @click="handleCreate"
                class="gray-button"
                :disabled="isDetail"
              >
                + 添加规则
              </el-button>
              <div class="rule-container" v-for="(item, index) in ruleSet">
                <div class="rule-top">
                  <span class="rule-left">
                    <el-icon
                      @click="item.edit = true"
                      style="cursor: pointer"
                      v-if="!item.edit"
                      ><arrow-down-bold
                    /></el-icon>

                    <el-icon
                      @click="item.edit = false"
                      style="cursor: pointer"
                      v-if="item.edit"
                      ><arrow-up-bold
                    /></el-icon>

                    <span> 规则集{{ index + 1 }} </span>
                  </span>

                  <span class="rule-right" v-if="!isDetail">
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
                <div v-if="!item.edit">
                  <el-form
                    v-for="(every, index) in item.ruleObjectList"
                    ref="form"
                    label-width="auto"
                    label-position="top"
                    size="default"
                  >
                    <el-form-item
                      :label="item.fieldName"
                      v-for="(item, index) in every.ruleObjectFieldList"
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
            </div>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <el-footer class="footerContainer">
      <el-button-group>
        <el-button
          type="primary"
          size="small"
          @click="onSubmit"
          :loading="buttonLoadingRef"
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
import { useRouter, useRoute } from "vue-router";
import {
  createRuleObject,
  fetchDetail,
  updateRuleObject,
} from "api/customrule.js";
import RuleModal from "./RuleModal.vue";
import { useStore } from "vuex";
import { ElMessage } from "@enn/element-plus";

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
    const route = useRoute();
    const store = useStore();

    const rules = {
      name: [{ required: true, message: "请输入规则名称", trigger: "blur" }],
      region: [{ required: true, message: "请输入规则名称", trigger: "blur" }],
    };
    const formFieldRef = ref(null);
    const buttonLoadingRef = ref(false);
    const spinLoadingRef = ref(false);

    const ruleSet = ref([]);
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
      isDetail: route.query.status == "detail" ? true : false,
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
      //关于字段赋值的逻辑
      // calibratorType => ruleType
      // fieldType => dataType
      // fieldPath => objectCode fieldCode
      // 根据不同的 calibratorType 来进行不同的 字段赋值
      changeCondition(data) {
        let result = data.map((item) => {
          return {
            ...item,
            ruleObjectList: item.ruleObjectList.map((every, idx) => {
              return {
                ...every,
                ruleObjectFieldList: every.ruleObjectFieldList.map((l, idx) => {
                  let result = {
                    ruleType: l.calibratorType,
                    dataType: l.fieldType,
                    // id: l.id,
                    sortNo: idx + 1,
                    fieldName: l.fieldName,
                    fieldPath: `$.${every.objectCode}.${l.fieldCode}`,
                  };
                  result[dataMap.mapObject[l.calibratorType]] = l.fieldValue;
                  return result;
                }),
              };
            }),
          };
        });
        return result;
      },
      revertCondition(value) {
        let result = value.map((item) => {
          return {
            ...item,
            ruleObjectList: item.ruleObjectList.map((l) => {
              return {
                ...l,
                objectCode: l.ruleObjectFieldList[0].fieldPath.split(".")[1],
                ruleObjectFieldList: l.ruleObjectFieldList.map((every) => {
                  let result = {
                    calibratorType: every.ruleType,
                    fieldType: every.dataType,
                    fieldName: every.fieldName,
                    fieldCode: every.fieldPath.split(".")[2],
                  };
                  result["fieldValue"] =
                    every[dataMap.mapObject[every.ruleType]];
                  return result;
                }),
              };
            }),
          };
        });

        return result;
      },
      async onSubmit() {
        buttonLoadingRef.value = true;
        let result = {
          ...dataMap.form,
          conditions: dataMap.changeCondition(ruleSet.value),
          tenantId: store.state.user.tenantId,
          userId: store.state.user.userId,
          userName: store.state.user.username,
        };

        const {
          data: { success, message },
        } = dataMap.id
          ? await updateRuleObject({
              id: Number(dataMap.id),
              ...result,
            })
          : await createRuleObject(result);
        if (success) {
          ElMessage.success(message);
          router.push({
            name: "dashboard",
          });
        } else {
          ElMessage.error(message);
        }
        buttonLoadingRef.value = false;
      },
      // 添加多个currentRow  ruleObjectList:[{ruleObjectFieldList:{}},{ruleObjectFieldList:{}}]
      pushRule(ruleObjectList) {
        let ruleSetObject = {
          ruleObjectList,
        };
        let array = [...ruleSet.value, ruleSetObject];
        let result = array.map((item, idx) => {
          return {
            conditionName: `规则集${idx + 1}`,
            sortNo: idx + 1,
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
      initForm(data) {
        const { ruleName, scenarioName, conditions } = data;
        dataMap.form = {
          ruleName,
          scenarioName,
        };
        ruleSet.value = dataMap.revertCondition(conditions);
      },
    });

    onBeforeMount(async () => {
      if (dataMap.id) {
        spinLoadingRef.value = true;
        const res = await fetchDetail(dataMap.id);
        if (res.data.success) {
          dataMap.initForm(res.data.data);
        } else {
          ElMessage.error(res.data.message);
        }
        spinLoadingRef.value = false;
      }
    });

    return {
      ...toRefs(dataMap),
      formFieldRef,
      ruleSet,
      buttonLoadingRef,
      spinLoadingRef,
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
