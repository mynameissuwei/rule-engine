<template>
  <template>
    <!-- <ChildComponent :method="checkRuleRepositoryInfo"/> -->
  </template>
  <div class="container" style="height: 90%">
    <el-row class="handle-box" :gutter="40">
      <el-col
        :span="23"
        style="margin: 20px 0 20px 0; font-size: 14px; line-height: 32px"
      >
        规则库 ({{ ruleRepositoryPaginationConfig.total }})
      </el-col>
      <el-col :span="1">
        <el-button
          type="primary"
          size="small"
          style="float: right; margin: 20px"
          @click="newRuleRepositoryBtn"
        >
          新建
        </el-button>
      </el-col>
    </el-row>
    <!--规则库表-->
    <el-table
      :data="ruleRepositoryTable.tableData"
      :border="ruleRepositoryTable.border"
      :header-cell-style="{ background: '#F6F7FB' }"
      @cell-click="checkRuleRepositoryInfo"
    >
      <el-table-column prop="ruleGroupName" label="规则库名称" min-width="100%">
        <template #default="scope">
          <div style="color: blue; cursor: pointer">
            {{ scope.row.ruleGroupName }}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="ruleGroupCode" label="规则库编号" min-width="100%">
      </el-table-column>
      <el-table-column
        prop="ruleGroupDescription"
        label="规则库描述"
        min-width="200%"
      >
      </el-table-column>
      <el-table-column prop="role" label="角色" min-width="100%" align="center">
      </el-table-column>
      <el-table-column
        fixed="right"
        label="操作"
        min-width="50%"
        align="center"
      >
        <template #default="scope">
          <el-button
            type="text"
            size="medium"
            @click="deleteRuleRepositoryBtn(scope.row.id)"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--规则库分页组件-->
    <div class="pagination">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="ruleRepositoryPaginationConfig.current"
        :page-sizes="ruleRepositoryPaginationConfig.pageSizes"
        :page-size="ruleRepositoryPaginationConfig.pageSize"
        layout=" prev, pager, next,  sizes,jumper"
        :total="ruleRepositoryPaginationConfig.total"
      >
      </el-pagination>
    </div>
  </div>
</template>

<script>
import { onMounted, reactive, ref } from "vue";
import { ElMessage, ElMessageBox } from "@enn/element-plus";
import {
  deleteRuleRepository,
  getRuleRepository,
} from "../../api/ruleRepository";
import { useRouter } from "vue-router";
import { useStore } from "vuex";

export default {
  name: "ruleRepository.vue",
  setup() {
    const router = useRouter();
    const store = useStore();
    //规则库表对象
    let ruleRepositoryTable = reactive({
      ref: true,
      tableData: [],
      border: false,
      show: true,
      loading: false,
    });
    //查看规则库
    let checkRuleRepositoryInfo = (row, column, event, cell) => {
      if (column.label === "规则库名称") {
        let ruleData = {
          id: row.id,
          ruleGroupName: row.ruleGroupName,
          ruleGroupCode: row.ruleGroupCode,
          ruleGroupDesc: row.ruleGroupDescription,
        };
        store.dispatch("rule/setRuleData", ruleData);
        router.push({
          path: "home",
          query: ruleData,
        });
      }
    };
    //规则库分页对象
    let ruleRepositoryPaginationConfig = reactive({
      pageSize: 10,
      total: 0,
      pageSizes: [10, 20, 30, 40],
      current: 1,
    });
    //新建规则库
    const newRuleRepositoryBtn = () => {
      router.push("newRuleRepository");
    };
    //删除规则库、消息弹出框
    const deleteRuleRepositoryBtn = (id) => {
      ElMessageBox.confirm("要删除这条规则么，是否继续？", "Warning", {
        cancelButtonText: "取消",
        confirmButtonText: "删除",
        type: "warning",
      })
        .then(() => {
          ElMessage({
            type: "success",
            message: "Delete completed",
          });
          deleteRuleRepositoryData(id);
          getRuleRepositoryData();
        })
        .catch(() => {
          ElMessage({
            type: "info",
            message: "Delete canceled",
          });
        });
    };

    //分页展示规则库列表
    function getRuleRepositoryData() {
      let { pageNum, pageSize } = {
        pageNum: ruleRepositoryPaginationConfig.current,
        pageSize: ruleRepositoryPaginationConfig.pageSize,
      };
      getRuleRepository(pageNum, pageSize)
        .then((response) => {
          ruleRepositoryTable.tableData = response.data.data;
          ruleRepositoryPaginationConfig.current = response.data.pageNum || 1;
          ruleRepositoryPaginationConfig.pageSize = response.data.pageSize;
          ruleRepositoryPaginationConfig.total = response.data.totalCount;
        })
        .catch((error) => {});
    }

    //删除规则库
    function deleteRuleRepositoryData(id) {
      deleteRuleRepository(id).then((response) => {});
    }

    //规则库分页函数
    function handleSizeChange(pageSize) {
      ruleRepositoryPaginationConfig.pageSize = pageSize;
      getRuleRepositoryData();
    }

    function handleCurrentChange(pageNumber) {
      ruleRepositoryPaginationConfig.current = pageNumber;
      getRuleRepositoryData();
    }

    onMounted(() => {
      getRuleRepositoryData();
    });

    return {
      ruleRepositoryTable,
      ruleRepositoryPaginationConfig,
      deleteRuleRepositoryBtn,
      checkRuleRepositoryInfo,
      newRuleRepositoryBtn,
      handleSizeChange,
      handleCurrentChange,
      name,
    };
  },
};
</script>

<style scoped lang="scss"></style>
