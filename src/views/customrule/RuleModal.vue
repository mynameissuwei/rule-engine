<template>
  <el-dialog v-model="props.visible" title="添加规则" width="800px">
    <div class="diag-container">
      <div class="left">
        <el-input
          v-model="input3"
          class="input-class"
          placeholder="关键字名称"
          :prefix-icon="Search"
        />
        <div class="left-container">
          <div v-for="o in 10" :key="o" class="item">
            {{ o }}
          </div>
        </div>
      </div>
      <div class="center">
        <div class="center-title">客户</div>
        <div class="check-group">
          <el-checkbox-group v-model="checkList">
            <el-checkbox :label="o" v-for="o in 10" :key="o" />
          </el-checkbox-group>
        </div>
      </div>
      <div class="right">
        <div>this is right</div>
      </div>
    </div>

    <!-- <div class="dialog-footer" style="margin-right: 20px">
      <el-button type="primary" @click="onSubmit" size="small">确定</el-button>
      <el-button @click="props.handleCancel" size="small">取 消</el-button>
    </div> -->
  </el-dialog>
</template>

<script setup>
import { reactive, onMounted, defineProps, ref } from "vue";
import { fetchObjectList } from "@/api/customrule";
import { Search } from "@element-plus/icons-vue";

const objectListRef = ref([]);
const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
  handleCancel: {
    type: Function,
  },
});

const data = reactive({});

// 获取对象列表
const getObjectList = async () => {
  const res = await fetchObjectList();
  let result = [
    {
      id: 0,
      objectCode: "string",
      objectName: "string",
      ruleObjectFieldResVoList: [
        {
          calibratorType: "string",
          fieldCode: "string",
          fieldEnum: "string",
          fieldName: "string",
          fieldType: "string",
          id: 0,
        },
      ],
      status: 0,
      updatedByName: "string",
      updatedDate: "2022-03-30T07:39:10.768Z",
      useStatus: 0,
    },
    {
      id: 23,
      objectCode: "string",
      objectName: "123",
      ruleObjectFieldResVoList: [
        {
          calibratorType: "string",
          fieldCode: "string",
          fieldEnum: "string",
          fieldName: "string",
          fieldType: "string",
          id: 0,
        },
      ],
      status: 0,
      updatedByName: "string",
      updatedDate: "2022-03-30T07:39:10.768Z",
      useStatus: 0,
    },
  ];
  objectListRef.value = result;
};

const onSubmit = () => {
  console.log("onSubmit");
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
  padding: 16px 0px 16px 16px;
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
.right {
}
.el-checkbox {
  display: block;
}
</style>
