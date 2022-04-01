<template>
  <div class="container">
    <!-- 实体对象查询输入框-->
    <el-form>
      <el-row class="handle-box" :gutter="40">
        <el-col :span="7">
          <el-input
              v-model="entityObjectForm.name"
              placeholder="实体对象名称"
              style="width: 100%;"
              clearable>
          </el-input>
        </el-col>
        <el-col :span="7">
          <el-input
              v-model="entityObjectForm.lastUser"
              placeholder="最后修改人关键词"
              clearable>
          </el-input>
        </el-col>
        <el-col :span="7">
          <el-input
              v-model="entityObjectForm.state"
              placeholder="状态"
              clearable>
          </el-input>
        </el-col>
        <el-col :span="3" style="text-align: right">
          <el-button
              type="primary"
              size="small"
              @click="entityObjectSearch">
            查询
          </el-button>
          <el-button
              size="small"
              @click="resetInput">
            重置
          </el-button>
        </el-col>
      </el-row>
    </el-form>
    <el-divider></el-divider>
    <el-row class="row-container">
      <el-col :span="12"> 实体对象 （5）</el-col>
      <el-col :span="12" class="right">
        <el-button-group>
          <el-button type="primary" size="small" @click="newEntityObject">新建</el-button>
          <el-button class="stop" size="small">停用</el-button>
          <el-button class="publish" size="small">发布</el-button>
          <el-button size="small">从对象管理导入</el-button>
        </el-button-group>
      </el-col>
    </el-row>
    <!--实体对象表-->
    <el-table
        ref="entityObjectTable"
        :data="entityObjectTable.tableData"
        style="width: 100%"
        @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55"/>
      <el-table-column property="objectName" label="对象名称" min-width="100%">
      </el-table-column>
      <el-table-column property="objectCode" label="对象编码" min-width="100%">
      </el-table-column>
      <el-table-column property="status" label="对象状态" min-width="100%">
      </el-table-column>
      <el-table-column property="updatedByName" label="最后修改人" min-width="100%">
      </el-table-column>
      <el-table-column property="updatedDate" label="最后修改时间" min-width="100%">
      </el-table-column>
      <el-table-column label="操作" min-width="100%" align="center">
        <template #default="scope">
          <el-button
              type="text"
              icon="el-icon-edit"
              @click="handleEdit(scope.$index, scope.row)"
          >编辑
          </el-button>
          <el-button
              type="text"
              icon="el-icon-delete"
              class="red"
              @click="handleDelete(scope.$index, scope.row)"
          >删除
          </el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <!--实体对象分页组件-->
    <div class="entityObject_pagination_box">
      <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="entityObjectPaginationConfig.current"
          :page-sizes="entityObjectPaginationConfig.pageSizes"
          :page-size="entityObjectPaginationConfig.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="entityObjectPaginationConfig.total"
      >
      </el-pagination>
    </div>
  </div>
</template>

<script>
import {onMounted, reactive} from "vue";
import router from "../../router/index.js"
import {getEntityObject} from "../../api/entityObject";

export default {
  name: "index.vue",
  setup() {
    //实体对象查询对象
    const entityObjectForm = reactive({
      name: "",
      lastUser: "",
      state: ""
    })
    //实体对象表对象
    const entityObjectTable = reactive({
      tableData: []
    })
    //实体对象分页对象
    let entityObjectPaginationConfig = reactive({
      pageSize: 10,
      total: 0,
      pageSizes: [10, 20, 30, 40],
      current: 1
    })
    //实体对象查询
    const entityObjectSearch = () => {

    }
    //实体对象查询输入框重置
    const resetInput = () => {
      entityObjectForm.name = "";
      entityObjectForm.lastUser = "";
      entityObjectForm.state = "";
    }
    //新建实体对象
    const newEntityObject = () => {
      router.push('newEntityObject')
    }

    const handleSizeChange = (val) => {
      console.log(`${val} items per page`)
    }
    const handleCurrentChange = (val) => {
      console.log(`current page: ${val}`)
    }

    function getEntityObjectData() {
      let requestBody = {
        pageNum: entityObjectPaginationConfig.current,
        pageSize: entityObjectPaginationConfig.pageSize,
        timeAscOrDesc: "asc"
      }
      getEntityObject(requestBody).then(response => {
        console.log(response, 11)
        entityObjectTable.tableData = response.data.data
        entityObjectPaginationConfig.current = response.data.pageNum || 1
        entityObjectPaginationConfig.pageSize = response.data.pageSize
        entityObjectPaginationConfig.total = response.data.totalCount
      })
    }

    onMounted(() => {
      getEntityObjectData()
    })

    return {
      entityObjectTable,
      entityObjectForm,
      entityObjectPaginationConfig,
      entityObjectSearch,
      resetInput,
      newEntityObject,
      handleSizeChange,
      handleCurrentChange,
    }
  }
}
</script>

<style scoped lang="scss">
.handle-box {
  margin: 21px 24px 22px 21px;
}

.row-container {
  margin-bottom: 19px;

  .right {
    text-align: right;

    .stop {
      margin: 0px 9px;
    }

    .publish {
      margin: 0px 9px;
    }
  }
}

.demo-pagination-block {
  margin-top: 10px;
  float: right;
}

</style>
