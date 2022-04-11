<template>
  <el-dialog
    v-model="props.visible"
    title="添加规则"
    width="800px"
    :before-close="props.handleCancel"
  >
    <div class="diag-container">
      <div class="left">
        <el-input
          v-model="searchValueRef"
          class="input-class"
          placeholder="关键字名称"
          :prefix-icon="Search"
        />
        <div class="left-container">
          <el-table
            ref="singleTableRef"
            :data="objectListRef"
            highlight-current-row
            v-loading="tableLoading"
            @current-change="handleCurrentChange"
            height="430px"
            :show-header="false"
          >
            <el-table-column prop="objectName" label="objectName" width="200" />
          </el-table>
        </div>
      </div>
      <div class="center">
        <div class="center-title">客户</div>
        <div class="check-group">
          <el-scrollbar height="420px" v-loading="checkBoxLoading">
            <el-checkbox-group v-model="checkListRef" @change="handleCheckBox">
              <el-checkbox
                :label="item.id"
                v-for="item in objectDetailRef"
                :key="item.id"
                :value="item.id"
                >{{ item.fieldName }}</el-checkbox
              >
            </el-checkbox-group>
          </el-scrollbar>
        </div>
      </div>
      <div class="right">
        <formily-form
          :checkedForm="checkedForm"
          ref="formRef"
          :formData="formData"
        />
      </div>
    </div>

    <div class="dialog-footer" style="margin-right: 20px">
      <el-button type="primary" @click="onSubmit" size="small">确定</el-button>
      <el-button @click="props.handleCancel" size="small">取 消</el-button>
    </div>
  </el-dialog>
</template>

<script setup>
import {
  reactive,
  onMounted,
  defineProps,
  ref,
  defineEmits,
  computed,
  toRef,
  watch,
} from "vue";
import { fetchObjectList, fetchObjectDetail } from "@/api/customrule";
import { Search } from "@element-plus/icons-vue";
import FormilyForm from "./FormilyForm.vue";
import { cloneDeep } from "lodash";

const searchValueRef = ref("");
const currentRowRef = ref(null);
const objectListRef = ref([]);
const objectDetailRef = ref([]);
const tableLoading = ref(false);
const checkBoxLoading = ref(false);
const formRef = ref("");

const singleTableRef = ref();
const checkListRef = ref([]);
const checkedForm = ref([]);
const formData = ref({});

let valueContains = ["INTEGER_RANGE", "DOUBLE_RANGE", "NUMBER_RANGE"];

//修改checkedForm字段
watch(
  () => checkListRef.value,
  () => {
    let result = checkListRef.value.map((item) => {
      let obj = objectDetailRef.value.find((l) => l.id == item);
      return obj;
    });
    checkedForm.value = result;
  },
  {
    deep: true,
  }
);

//增加formData字段
watch(
  formData,
  (newVal) => {
    const { id } = currentRowRef.value;
    let newObjectList = objectListRef.value.map((item) => {
      if (item.id === id) {
        item["formData"] = newVal;
      }
      return item;
    });
    objectListRef.value = newObjectList;
  },
  {
    deep: true,
  }
);

//增加checkList字段
const handleCheckBox = (val, row) => {
  const { id } = currentRowRef.value;
  let newObjectList = objectListRef.value.map((item) => {
    if (item.id === id) {
      item["checkList"] = val;
      item["ruleObjectFieldList"] = checkedForm.value;
    }
    return item;
  });

  objectListRef.value = newObjectList;
};

const props = defineProps([
  "fieldStatus",
  "visible",
  "handleCancel",
  "editData",
]);

const emits = defineEmits(["pushRule"]);

// 点击table每一行高亮
const handleCurrentChange = async (currentRow, oldCurrentRow) => {
  checkBoxLoading.value = true;
  const { id } = currentRow;
  const res = await fetchObjectDetail(id);
  if (currentRow.hasOwnProperty("checkList")) {
    checkListRef.value = currentRow.checkList;
  } else {
    checkListRef.value = [];
  }

  if (currentRow.hasOwnProperty("formData")) {
    formData.value = currentRow.formData;
  } else {
    formData.value = {};
  }

  objectDetailRef.value = res.data.ruleObjectFieldResVoList;
  currentRowRef.value = currentRow;
  checkBoxLoading.value = false;
};

// 获取对象列表
const getObjectList = async () => {
  tableLoading.value = true;
  const { data } = await fetchObjectList({
    pageSize: 10,
    pageNum: 1,
    timeAscOrDesc: "desc",
  });

  objectListRef.value = data;
  tableLoading.value = false;
};

// objectListRef 进行转化
const changeRuleObject = (data) => {
  let filterData = data.filter((item) => item.hasOwnProperty("checkList"));
  let result = filterData.map((item) => {
    return {
      ...item,
      ruleObjectFieldList: item.ruleObjectFieldList.map((single) => {
        let every = cloneDeep(single);
        if (Object.keys(item.formData).includes(every.fieldCode)) {
          every["fieldValue"] = item.formData[every.fieldCode];
          if (valueContains.includes(every.calibratorType)) {
            every["fieldValueSecond"] =
              item.formData[every.fieldCode + "_second"];
          }
        }

        return every;
      }),
    };
  });
  return result;
};
// 提交按钮
const onSubmit = async () => {
  let ruleObject = changeRuleObject(objectListRef.value);

  // const { formRefDom } = formRef.value.schemaRef;
  props.handleCancel();
  if (props.fieldStatus == "edit") {
    emits("pushRule", ruleObject);
  } else {
    emits("pushRule", ruleObject);
  }
};

onMounted(async () => {
  await getObjectList();

  if (props.fieldStatus == "edit") {
    let result = objectListRef.value.map((item) => {
      let isRule = props.editData.find((single) => single.id === item.id);
      return isRule ? isRule : item;
    });
    objectListRef.value = result;
    let currentRow = objectListRef.value.find((item) =>
      item.hasOwnProperty("checkList")
    );
    singleTableRef.value.setCurrentRow(currentRow);
  }
});
</script>

<style scoped lang="scss">
.diag-container {
  display: flex;
  border-top: 1px solid #ebecf0;
  border-bottom: 1px solid #ebecf0;
}
.input-class {
  width: 140px;
  margin-right: 10px;
}
.left {
  width: 164px;
  padding: 16px 0px 0px 16px;
  border-right: 1px solid #ebecf0;
  .left-container {
    margin-top: 9px;
    .item {
      width: 121px;
      height: 32px;
      border-radius: 2px;
      line-height: 32px;
      padding-left: 21px;
    }
    .item:hover {
      background: #eff3ff;
    }
  }
}
.center {
  width: 165px;
  margin: 19px;
  border-right: 1px solid #ebecf0;
  .center-title {
    font-weight: 500;
    font-size: 18px;
    color: #323233;
  }
  .check-group {
    margin-top: 19px;
  }
}
.dialog-footer {
  position: relative;
  top: 15px;
  text-align: right;
}
.el-checkbox {
  display: block;
}
</style>
