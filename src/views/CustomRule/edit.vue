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
          <el-form-item label="规则名称:" prop="ruleName">
            <el-input
              v-model="form.ruleName"
              placeholder="可使用中英文、数字组合"
              :disabled="isDetail"
              style="width: 340px; margin-right: 10px"
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
          <el-form-item label="使用场景描述:" prop="scenarioName">
            <el-input
              v-model="form.scenarioName"
              placeholder="请输入"
              :disabled="isDetail"
              style="width: 340px"
            ></el-input>
          </el-form-item>
          <el-form-item label="规则编辑">
            <div>
              <el-button
                size="small"
                @click="handleCreate"
                class="gray-button"
                color="#F2F3F5"
                :disabled="isDetail"
              >
                + 添加规则
              </el-button>
              <el-scrollbar
                height="570px"
                style="padding-right: 20px"
                :always="true"
              >
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
                      <el-icon
                        style="cursor: pointer"
                        @click="handleEdit(item.ruleObjectList, item.id)"
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
                      label-width="auto"
                      label-position="top"
                      size="default"
                    >
                      <el-form-item
                        :label="item.fieldName"
                        v-for="(item, index) in every.ruleObjectFieldList"
                      >
                        <el-input
                          v-if="
                            item.calibratorType == 'STRING_EQUALS' ||
                            item.calibratorType == 'UN_KNOWN'
                          "
                          v-model="item.fieldValue"
                          :disabled="formDisabled"
                          style="width: 340px"
                        />
                        <el-select
                          v-if="item.calibratorType == 'VALUE_CONTAIN'"
                          v-model="item.fieldValue"
                          multiple
                          :disabled="formDisabled"
                          style="width: 340px"
                        >
                          <el-option
                            v-for="l in item.fieldEnum
                              ? item.fieldEnum.split(';')
                              : []"
                            :key="l"
                            :label="l"
                            :value="l"
                          />
                        </el-select>
                        <el-date-picker
                          v-model="item.fieldValue"
                          v-if="item.calibratorType === 'DATE_RANGE'"
                          type="datetimerange"
                          range-separator="To"
                          start-placeholder="开始时间"
                          end-placeholder="结束时间"
                          format="YYYY-MM-DD"
                          value-format="YYYY-MM-DD"
                          style="width: 340px"
                          :disabled="formDisabled"
                        />
                        <el-row
                          style="width: 340px"
                          v-if="
                            item.calibratorType === 'NUMBER_RANGE' ||
                            item.calibratorType === 'DOUBLE_RANGE' ||
                            item.calibratorType === 'INTEGER_RANGE'
                          "
                        >
                          <el-col :span="11">
                            <el-input
                              v-model="item.fieldValue"
                              :disabled="formDisabled"
                            />
                          </el-col>
                          <el-col :span="2" class="text-center">
                            <span class="text-gray-500">-</span>
                          </el-col>
                          <el-col :span="11">
                            <el-input
                              v-model="item['fieldValueSecond']"
                              :disabled="formDisabled"
                            />
                          </el-col>
                        </el-row>
                      </el-form-item>
                    </el-form>
                  </div>
                </div>
              </el-scrollbar>
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
          @click="onSubmit(formRef)"
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
      </el-button-group>
    </el-footer>
    <rule-modal
      :visible="visible"
      :fieldStatus="fieldStatus"
      :handleCancel="handleCancel"
      :editData="editDataRef"
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

    const formFieldRef = ref(null);
    const buttonLoadingRef = ref(false);
    const spinLoadingRef = ref(false);
    const ruleSet = ref([]);
    const editDataRef = ref(null);

    const dataMap = reactive({
      formRef: null,
      form: {
        ruleName: "",
        scenarioName: "",
      },
      rules: {
        ruleName: [
          { required: true, message: "请输入规则名称", trigger: "blur" },
          {
            min: 1,
            max: 10,
            message: "长度在 1 到 50 个字符",
            trigger: "blur",
          },
          {
            pattern: /^[a-zA-Z0-9\u4e00-\u9fa5]+$/,
            message: "只能输入中文、数字、英文",
            trigger: "blur",
          },
        ],
        scenarioName: [
          {
            min: 0,
            max: 100,
            message: "最大长度100字符",
            trigger: "blur",
          },
        ],
      },
      editId: null,
      formDisabled: true,
      id: router.currentRoute.value.params.id,
      isDetail: route.query.status == "detail" ? true : false,
      visible: false,
      fieldStatus: "",
      handleCreate() {
        dataMap.fieldStatus = "create";
        dataMap.visible = true;
      },
      handleEdit(editData, id) {
        dataMap.fieldStatus = "edit";
        dataMap.editId = id;
        dataMap.visible = true;
        editDataRef.value = editData;
      },
      handleCancel() {
        dataMap.visible = false;
      },
      handleDelete(index) {
        ruleSet.value.splice(index, 1);
      },
      initID() {
        return Math.random().toString();
      },
      revertObject(obj) {
        let result = {
          id: obj.id,
          calibratorType: obj.ruleType,
          fieldType: obj.dataType,
          fieldName: obj.fieldName,
          fieldCode: obj.fieldPath.split(".")[2],
        };

        if (obj.ruleType === "STRING_EQUALS") {
          result.fieldValue = obj.targetValue;
        }
        if (obj.ruleType === "VALUE_CONTAIN") {
          result.fieldValue = obj.targetContains.split("|");
        }
        if (
          obj.ruleType === "INTEGER_RANGE" ||
          obj.ruleType === "DOUBLE_RANGE" ||
          obj.ruleType === "NUMBER_RANGE"
        ) {
          result.fieldValue = obj.minValue;
          result.fieldValueSecond = obj.maxValue;
        }
        if (obj.ruleType === "DATE_RANGE") {
          result.fieldValue = [obj.minValue, obj.maxValue];
        }
        return result;
      },
      modifyObject(parentObj, obj, idx) {
        let result = {
          id: obj.id,
          ruleType: obj.calibratorType,
          dataType: obj.fieldType,
          sortNo: idx + 1,
          fieldName: obj.fieldName,
          fieldPath: `$.${parentObj.objectCode}.${obj.fieldCode}`,
        };
        if (obj.calibratorType === "STRING_EQUALS") {
          result.targetValue = obj.fieldValue;
        }
        if (obj.calibratorType === "VALUE_CONTAIN") {
          result.targetContains = obj.fieldValue.join("|");
        }
        if (
          obj.calibratorType === "INTEGER_RANGE" ||
          obj.calibratorType === "DOUBLE_RANGE" ||
          obj.calibratorType === "NUMBER_RANGE"
        ) {
          result.rangeType = "GTE_LTE";
          result.minValue = obj.fieldValue;
          result.maxValue = obj.fieldValueSecond;
        }
        if (obj.calibratorType === "DATE_RANGE") {
          result.minValue = obj.fieldValue[0];
          result.maxValue = obj.fieldValue[1];
        }
        return result;
      },
      //关于字段赋值的逻辑
      // calibratorType => ruleType
      // fieldType => dataType
      // fieldPath => objectCode fieldCode
      // 根据不同的 calibratorType 来进行不同的 字段赋值
      changeCondition(data) {
        let frontCheckList = {};
        let conditions = data.map((item) => {
          return {
            ...item,
            ruleObjectList: item.ruleObjectList.map((every, idx) => {
              frontCheckList[every.id] = {
                checkList: every.checkList,
                formData: every.formData,
              };
              return {
                ...every,
                checkList: JSON.stringify(every.checkList),
                formData: JSON.stringify(every.formData),
                ruleObjectFieldList: every.ruleObjectFieldList.map((l, idx) => {
                  let result = dataMap.modifyObject(every, l, idx);
                  return result;
                }),
              };
            }),
          };
        });
        return {
          conditions,
          frontCheckList,
        };
      },
      revertCondition(value, frontCheckList) {
        let frontCheckListObj = JSON.parse(frontCheckList);
        let result = value.map((item) => {
          return {
            ...item,
            id: dataMap.initID(),
            ruleObjectList: item.ruleObjectList.map((l) => {
              let frontObj = frontCheckListObj[l.id];
              return {
                ...l,
                ...frontObj,
                objectCode: l.ruleObjectFieldList[0].fieldPath.split(".")[1],
                ruleObjectFieldList: l.ruleObjectFieldList.map((every) => {
                  let data = dataMap.revertObject(every);
                  return data;
                }),
              };
            }),
          };
        });

        return result;
      },
      async onSubmit(formEl) {
        if (!formEl) return;
        await formEl.validate(async (valid, fields) => {
          if (valid) {
            buttonLoadingRef.value = true;
            const { conditions, frontCheckList } = dataMap.changeCondition(
              ruleSet.value
            );
            console.log(frontCheckList, "RevertfrontCheckList");
            let result = {
              ...dataMap.form,
              frontCheckList: JSON.stringify(frontCheckList),
              conditions,
              tenantId: store.state.user.tenantId,
              userId: store.state.user.userId,
              userName: store.state.user.username,
            };

            const { success, message } = dataMap.id
              ? await updateRuleObject({
                  id: Number(dataMap.id),
                  ...result,
                })
              : await createRuleObject(result);

            if (success) {
              ElMessage.success(message);
              router.push({
                name: "home",
              });
            }
            buttonLoadingRef.value = false;
          }
        });
      },
      // 添加多个currentRow  ruleObjectList:[{ruleObjectFieldList:{}},{ruleObjectFieldList:{}}]
      pushRule(ruleObjectList) {
        let result;
        if (dataMap.fieldStatus == "edit") {
          //
          result = ruleSet.value.map((item) => {
            if (item.id == dataMap.editId) {
              return {
                ...item,
                ruleObjectList,
              };
            }
            return item;
          });
        } else {
          let array = [...ruleSet.value, { ruleObjectList }];
          result = array.map((item, idx) => ({
            conditionName: `规则集${idx + 1}`,
            sortNo: idx + 1,
            nextRelation: "OR",
            id: dataMap.initID(),
            ...item,
          }));
        }

        ruleSet.value = result;
      },
      onCancel() {
        router.push({
          name: "home",
          params: { id: undefined },
        });
      },
      initForm(data) {
        const { ruleName, scenarioName, conditions, frontCheckList } = data;
        dataMap.form = {
          ruleName,
          scenarioName,
        };
        console.log(JSON.parse(frontCheckList, "RevertfrontCheckList"));
        ruleSet.value = dataMap.revertCondition(conditions, frontCheckList);
      },
    });
    onBeforeMount(async () => {
      if (dataMap.id) {
        spinLoadingRef.value = true;
        const { success, data } = await fetchDetail(dataMap.id);
        if (success) {
          dataMap.initForm(data);
        }
        spinLoadingRef.value = false;
      }
    });

    return {
      ...toRefs(dataMap),
      editDataRef,
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
  .text-center {
    text-align: center;
  }
}
</style>
