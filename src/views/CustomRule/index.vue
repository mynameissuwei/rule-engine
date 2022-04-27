<template>
  <div class="container">
    <el-row class="handle-box" :gutter="20">
      <el-col :span="7">
        <el-input
          v-model="listQuery.ruleName"
          placeholder="自定义规则名称"
          clearable
          class="handle-input mr10"
        ></el-input>
      </el-col>
      <el-col :span="7">
        <el-input
          v-model="listQuery.updatedByName"
          placeholder="最后修改人"
          clearable
          class="handle-input mr10"
        ></el-input>
      </el-col>
      <el-col :span="7">
        <el-select
          v-model="listQuery.releaseStatus"
          clearable
          placeholder="状态"
        >
          <el-option
            v-for="item in [
              { value: 0, label: '未发布' },
              { value: 1, label: '已发布' },
            ]"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-col>
      <el-col :span="3" style="text-align: right">
        <el-button type="primary" size="small" @click="handleSearch"
          >搜索</el-button
        >
        <el-button size="small" @click="handleReset" color="#F2F3F5"
          >重置</el-button
        >
      </el-col>
    </el-row>
    <el-divider></el-divider>
    <el-row class="row-container">
      <el-col :span="12">自定义规则 ({{ pageTotal }})</el-col>
      <el-col :span="12" class="right">
        <el-button-group>
          <el-button type="primary" size="small" @click="handleCreate"
            >新建</el-button
          >
          <el-button
            class="center"
            size="small"
            @click="handleModify(0)"
            :disabled="!multipleSelection.length"
            color="#F2F3F5"
          >
            批量停用
          </el-button>
          <el-button
            size="small"
            @click="handleModify(1)"
            :disabled="!multipleSelection.length"
            color="#F2F3F5"
            >批量发布</el-button
          >
        </el-button-group>
      </el-col>
    </el-row>
    <el-table
      :header-cell-style="{ background: '#F6F7FB' }"
      :data="tableData"
      highlight-current-row
      ref="multipleTable"
      @selection-change="handleSelectionChange"
      v-loading="listLoading"
      max-height="450"
    >
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column prop="ruleName" label="规则名称">
        <template #default="scope">
          <span class="actionClass" @click="handleDetail(scope.row)">{{
            scope.row.ruleName
          }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="ruleCode" label="规则编号" />
      <el-table-column label="规则状态">
        <template #default="scope">
          <r-badge :color="scope.row.releaseStatus == 0 ? 'gray' : 'green'" />
          <span>
            {{ scope.row.releaseStatus == 0 ? "未发布" : "已发布" }}
          </span>
        </template>
      </el-table-column>
      <el-table-column
        label="被调用次数"
        sortable
        prop="callCount"
        :formatter="callCountFormatter"
      />
      <el-table-column
        label="最后修改人"
        prop="updatedUserName"
        align="center"
      />
      <el-table-column prop="updatedDate" label="最后修改时间" sortable />
      <el-table-column label="操作" width="180" align="center">
        <template #default="scope">
          <span @click="handleEdit(scope.row)" class="actionClass">编辑</span>
          <span
            @click="handleDelete(scope.row)"
            class="actionClass"
            style="margin: 0px 10px"
            >删除</span
          >
          <el-dropdown
            class="dropDown"
            @command="(e) => handleModify(e, scope.row)"
          >
            <el-icon><more-filled /></el-icon>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="1">发布</el-dropdown-item>
                <el-dropdown-item command="0">停用</el-dropdown-item>
                <el-dropdown-item command="2">测试</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination">
      <el-pagination
        v-model:currentPage="listQuery.pageNum"
        v-model:page-size="listQuery.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="pageTotal"
        @size-change="handleSizeChange"
        @current-change="handlePageChange"
      ></el-pagination>
    </div>
    <test-modal
      v-if="testVisible"
      :visible="testVisible"
      :handleCancel="handleCancel"
      :changeLeftEditor="changeLeftEditor"
      :changeRightEditor="changeRightEditor"
    ></test-modal>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
import { useRouter } from "vue-router";
import { fetchTableData, deleteList, modifyList } from "@/api/customrule";
import rBadge from "@/components/rBadge.vue";
import { ElMessageBox, ElMessage } from "@enn/element-plus";
import { MoreFilled } from "@element-plus/icons-vue";
import TestModal from "./TestModal.vue";
import { useStore } from "vuex";
import { fetchTestData, upDateTestData } from "@/api/customrule";

const listQuery = reactive({
  ruleName: "",
  updatedByName: "",
  releaseStatus: null,
  pageNum: 1,
  pageSize: 10,
});
const tableData = ref([]);
const pageTotal = ref(0);
const router = useRouter();
const listLoading = ref(false);
const multipleSelection = ref([]);
const ruleIdRef = ref("");

const store = useStore();

const testVisible = ref(false);

const changeLeftEditor = async () => {
  const res = await fetchTestData(ruleIdRef.value);
  const data = {
    authorization: res.data.authorization,
    ruleCode: res.data.ruleCode,
    content: JSON.parse(res.data.content),
  };
  return data;
};

const changeRightEditor = async (leftEditValue) => {
  const res = await upDateTestData({
    ...leftEditValue,
    content: JSON.stringify(leftEditValue.content),
  });
  return res.data;
};

const handleCancel = () => {
  testVisible.value = false;
};

const callCountFormatter = (row, column) => {
  return row.callCount == null ? "0" + "次" : row.callCount + "次";
};
const sortChange = ({ column, prop, order }) => {
  console.log(column, prop, order);
};
// 获取表格数据
const getList = () => {
  listLoading.value = true;

  //
  fetchTableData({
    ...listQuery,
    ruleName: listQuery.ruleName.trim(),
    updatedUserName: listQuery.updatedByName.trim(),
    groupId: store.state.rule.ruleData.id,
  }).then((res) => {
    tableData.value = res.data;
    pageTotal.value = res.totalCount;
    listLoading.value = false;
  });
};

const testFuc = () => {
  testVisible.value = true;
};

const handleSelectionChange = (val) => {
  multipleSelection.value = val;
};

// 查询操作
const handleSearch = () => {
  getList();
};
// 分页导航
const handlePageChange = (val) => {
  listQuery.pageNum = val;
  getList();
};

const handleSizeChange = (val) => {
  listQuery.pageSize = val;
  getList();
};

const handleCreate = () => {
  router.push({
    name: "editCustomRule",
    params: { id: undefined },
    query: {
      status: "create",
    },
  });
};

const handleModify = (status, row) => {
  if (row) ruleIdRef.value = row.ruleId;

  if (status == "2") {
    testFuc();
  } else {
    const ids = row
      ? [row.ruleId]
      : multipleSelection.value.map((item) => item.ruleId);

    ElMessageBox.confirm(
      `你确定要${status == 0 ? "停用" : "发布"}该规则么?`,
      "警告",
      {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning",
        buttonSize: "small",
      }
    ).then(() => {
      modifyList({
        ids,
        releaseStatus: status,
      }).then(() => {
        getList();
        if (!row) {
          multipleSelection.value = [];
        }
        ElMessage({
          type: "success",
          message: status == 0 ? "停用成功" : "发布成功",
        });
      });
    });
  }
};

// 删除操作
const handleDelete = (row) => {
  ElMessageBox.confirm("你确定要删除该规则么?", "警告", {
    confirmButtonText: "确认",
    cancelButtonText: "取消",
    type: "warning",
    buttonSize: "small",
  }).then(async () => {
    const { success, message } = await deleteList(row.ruleId);
    if (success) {
      await getList();
      ElMessage({
        type: "success",
        message: message,
      });
    }
  });
};

const handleReset = () => {
  const data = {
    ruleName: "",
    updatedByName: "",
    releaseStatus: null,
    pageNum: 1,
    pageSize: 10,
  };
  Object.assign(listQuery, data);
  multipleSelection.value = [];
  getList();
};

const handleEdit = (row) => {
  if (row.releaseStatus === "1") {
    ElMessage.info("已发布的规则不可以编辑");
    return;
  }
  router.push({
    name: "editCustomRule",
    params: { id: row.ruleId },
    query: { status: "edit" },
  });
};
const handleDetail = (row) => {
  router.push({
    name: "editCustomRule",
    params: { id: row.ruleId },
    query: { status: "detail" },
  });
};

const saveEdit = () => {};

onMounted(() => {
  getList();
});
</script>

<style scoped lang="scss">
.handle-box {
  margin: 21px 24px 22px 21px;
}

.mr10 {
  margin-right: 10px;
}

.row-container {
  margin-bottom: 19px;
  .right {
    text-align: right;
    .center {
      margin: 0px 9px;
    }
  }
}
.dropDown {
  margin-left: 20px;
  margin-top: 4px;
}
</style>
