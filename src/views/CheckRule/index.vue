<template>
  <div class="container">
    <el-row class="handle-box" :gutter="20">
      <el-col :span="7">
        <el-select
          v-model="query.address"
          placeholder="脚本规则名称"
          class="handle-select"
        >
          <el-option key="1" label="广东省" value="广东省"></el-option>
          <el-option key="2" label="湖南省" value="湖南省"></el-option>
        </el-select>
      </el-col>
      <el-col :span="7">
        <el-input
          v-model="query.name"
          placeholder="最后修改人关键词"
          class="handle-input mr10"
        ></el-input
      ></el-col>
      <el-col :span="7">
        <el-input
          v-model="query.name"
          placeholder="状态"
          class="handle-input mr10"
        ></el-input>
      </el-col>
      <el-col :span="3" style="text-align: right">
        <el-button type="primary" size="small" @click="handleSearch"
          >搜索</el-button
        >
        <el-button size="small" @click="handleSearch">重置</el-button></el-col
      >
    </el-row>
    <el-divider></el-divider>
    <el-row class="row-container">
      <el-col :span="12"> 自定义规则 (100） </el-col>
      <el-col :span="12" class="right">
        <el-button-group>
          <el-button type="primary" size="small" @click="handleCreate"
            >新建</el-button
          >
          <el-button class="center" size="small">批量停用</el-button>
          <el-button size="small">批量发布</el-button>
        </el-button-group>
      </el-col>
    </el-row>
    <el-table
      :data="tableData"
      class="table"
      ref="multipleTable"
      header-cell-class-name="table-header"
    >
      <el-table-column
        prop="id"
        label="ID"
        width="55"
        align="center"
      ></el-table-column>
      <el-table-column prop="name" label="用户名"></el-table-column>
      <el-table-column label="账户余额">
        <template #default="scope">￥{{ scope.row.money }}</template>
      </el-table-column>
      <el-table-column label="头像(查看大图)" align="center">
        <template #default="scope">
          <el-image
            class="table-td-thumb"
            :src="scope.row.thumb"
            :preview-src-list="[scope.row.thumb]"
          >
          </el-image>
        </template>
      </el-table-column>
      <el-table-column prop="address" label="地址"></el-table-column>
      <el-table-column label="状态" align="center">
        <template #default="scope">
          <el-tag
            :type="
              scope.row.state === '成功'
                ? 'success'
                : scope.row.state === '失败'
                ? 'danger'
                : ''
            "
            >{{ scope.row.state }}</el-tag
          >
        </template>
      </el-table-column>

      <el-table-column prop="date" label="注册时间"></el-table-column>
      <el-table-column label="操作" width="180" align="center">
        <template #default="scope">
          <el-button type="text" icon="el-icon-edit" @click="handleEdit()"
            >编辑
          </el-button>
          <el-button
            type="text"
            icon="el-icon-delete"
            class="red"
            @click="handleDelete(scope.$index, scope.row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination">
      <el-pagination
        :current-page="query.pageIndex"
        :page-size="query.pageSize"
        layout=" prev, pager, next,  sizes,jumper"
        :total="pageTotal"
        @size-change="handleSizeChange"
        @current-change="handlePageChange"
      >
      </el-pagination>
    </div>
  </div>
</template>

<script>
import { ref, reactive } from "vue";
import { useRouter } from "vue-router";

export default {
  name: "basetable",
  setup() {
    const query = reactive({
      address: "",
      name: "",
      pageIndex: 1,
      pageSize: 10,
    });
    const tableData = ref([]);
    const pageTotal = ref(0);
    const router = useRouter();

    // 获取表格数据
    const getData = () => {
      // fetchData(query).then((res) => {
      //   tableData.value = res.list;
      //   pageTotal.value = res.pageTotal || 50;
      // });
      tableData.value = [
        {
          id: "132",
        },
      ];
      pageTotal.value = 50;
    };
    getData();

    // 查询操作
    const handleSearch = () => {
      console.log("search");
      query.pageIndex = 1;
      getData();
    };
    // 分页导航
    const handlePageChange = (val) => {
      query.pageIndex = val;
      getData();
    };

    const handleSizeChange = (val) => {
      console.log(val, "val");
    };

    const handleCreate = () => {
      console.log(123, "123");
      router.push({
        name: "createRule",
        params: { id: undefined },
      });
    };

    // 删除操作
    const handleDelete = (index) => {
      // 二次确认删除
      ElMessageBox.confirm("确定要删除吗？", "提示", {
        type: "warning",
      })
        .then(() => {
          ElMessage.success("删除成功");
          tableData.value.splice(index, 1);
        })
        .catch(() => {});
    };

    // 表格编辑时弹窗和保存
    const editVisible = ref(false);
    let form = reactive({
      name: "",
      address: "",
    });
    let idx = -1;

    const handleEdit = () => {
      router.push({
        name: "createRule",
        params: { id: "123" },
      });
    };

    return {
      query,
      tableData,
      pageTotal,
      editVisible,
      form,
      handleSearch,
      handlePageChange,
      handleDelete,
      handleEdit,
      handleCreate,
    };
  },
};
</script>

<style scoped lang="scss">
.handle-box {
  margin: 21px 24px 22px 21px;
}

.handle-select {
  width: 100%;
}

.table {
  width: 100%;
  font-size: 14px;
}
.red {
  color: #ff0000;
}
.mr10 {
  margin-right: 10px;
}
.table-td-thumb {
  display: block;
  margin: auto;
  width: 40px;
  height: 40px;
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
</style>
