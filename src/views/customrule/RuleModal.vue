<template>
  <el-dialog v-model="props.visible" title="添加规则" width="800px">
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
        <formily-form :checkedForm="testCheckListRef" ref="formRef" />
      </div>
    </div>

    <div class="dialog-footer" style="margin-right: 20px">
      <el-button type="primary" @click="onSubmit" size="small">确定</el-button>
      <el-button @click="props.handleCancel" size="small">取 消</el-button>
    </div>
  </el-dialog>
</template>

<script setup>
import { reactive, onMounted, defineProps, ref, defineEmits } from "vue";
import { fetchObjectList, fetchObjectDetail } from "@/api/customrule";
import { Search } from "@element-plus/icons-vue";
import FormilyForm from "./FormilyForm.vue";

//logic
const searchValueRef = ref("");
const currentRowRef = ref(null);
const objectListRef = ref([]);
const objectDetailRef = ref([]);
const checkListRef = ref([]);
const tableLoading = ref(false);
const checkBoxLoading = ref(false);
const formRef = ref("");

const testCheckListRef = ref([]);

const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
  handleCancel: {
    type: Function,
  },
});

const emits = defineEmits(["pushRule"]);

//选择checkBox
const handleCheckBox = (val, row) => {
  let result = val.map((item) => {
    let obj = objectDetailRef.value.find((l) => l.id == item);
    return obj;
  });
  testCheckListRef.value = result;
};

// 点击table每一行高亮
const handleCurrentChange = async (val) => {
  const { id } = val;
  checkBoxLoading.value = true;
  const res = await fetchObjectDetail(id);
  console.log(
    res.data.data.ruleObjectFieldResVoList,
    "ruleObjectFieldResVoList"
  );
  objectDetailRef.value = res.data.data.ruleObjectFieldResVoList;
  currentRowRef.value = val;
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

  objectListRef.value = data.data;
  tableLoading.value = false;
};

// 将formData 进行对应的赋值
const changeRuleObject = (checkBoxData, formData) => {
  console.log(checkBoxData, "checkBoxData");
  let result = checkBoxData.map((item) => {
    if (Object.keys(formData).includes(item.fieldCode)) {
      item["fieldValue"] = formData[item.fieldCode];
    }
    return item;
  });
  return result;
};
// 提交按钮
const onSubmit = async () => {
  const { checkBoxData, formData } = formRef.value.schemaRef;
  let ruleObject = {
    ...currentRowRef.value,
    ruleObjectFieldList: changeRuleObject(checkBoxData, formData),
  };
  props.handleCancel();
  emits("pushRule", ruleObject);

  // await formRef.value.formRefDom.value.$$uiFormRef.validate();
};

onMounted(() => {
  getObjectList();
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
