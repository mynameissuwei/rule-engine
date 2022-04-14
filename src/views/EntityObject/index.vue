<template>
  <div class="container">
    <!-- 实体对象查询输入框-->
    <el-form>
      <el-row class="handle-box" :gutter="40">
        <el-col :span="7">
          <el-input
              v-model="entityObjectForm.objectName"
              placeholder="实体对象名称"
              style="width: 100%;"
              clearable>
          </el-input>
        </el-col>
        <el-col :span="7">
          <el-select placeholder="按时间升序或降序查询"
                     v-model="entityObjectForm.timeAscOrDesc"
                     style="width: 100%;">
            <el-option value="asc" label="升序"></el-option>
            <el-option value="desc" label="降序"></el-option>
          </el-select>
        </el-col>
        <el-col :span="7">
          <el-input
              v-model="entityObjectForm.updatedByName"
              placeholder="最后修改人"
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
      <el-col :span="12"> 实体对象 （{{ entityObjectPaginationConfig.total }}）</el-col>
      <el-col :span="12" class="right">
        <el-button-group>
          <el-button type="primary" size="small" @click="newEntityObject">新建</el-button>
          <el-button class="stop" size="small" @click="batchDisPublishEntityObject">停用</el-button>
          <el-button class="publish" size="small" @click="batchPublishEntityObject">发布</el-button>
          <el-button size="small">从对象管理导入</el-button>
        </el-button-group>
      </el-col>
    </el-row>
    <!--实体对象表-->
    <el-table
        :data="entityObjectTable.tableData"
        :border="entityObjectTable.border"
        :header-cell-style="{'text-align': 'center'}"
        style="width: 100%"
        height="280px"
        @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55"/>
      <el-table-column property="objectName" label="对象名称" min-width="100%">
      </el-table-column>
      <el-table-column property="objectCode" label="对象编码" min-width="100%">
      </el-table-column>
      <el-table-column property="status" label="对象状态" min-width="100%">
        <template #default="scope">
          <span v-if="scope.row.status === 0">未发布</span>
          <span v-if="scope.row.status === 1">发布</span>
        </template>
      </el-table-column>
      <el-table-column property="updatedByName" label="最后修改人" min-width="100%">
      </el-table-column>
      <el-table-column property="updatedDate" label="最后修改时间" min-width="100%">
      </el-table-column>
      <el-table-column label="操作" min-width="100%" align="center">
        <template #default="scope">
          <el-button
              type="text"
              size="medium"
              @click="editEntityObjectBtn(scope.row.id)">
            编辑
          </el-button>
          <el-button
              type="text"
              size="medium"
              @click="deleteEntityObjectBtn(scope.row.id)">
            删除
          </el-button>
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
import {inject, onMounted, reactive} from "vue";
import {deleteEntityObject, getEntityObject, updateEntityObjectStatus} from "../../api/entityObject";
import {ElMessage, ElMessageBox} from "@enn/element-plus";
import {useRouter} from "vue-router";

export default {
  name: "index.vue",
  setup() {
    const router = useRouter()
    const ruleGroupCode = inject("ruleGroupCode").value
    const ruleGroupName = inject("ruleGroupName").value
    const ruleGroupDesc = inject("ruleGroupDesc").value
    //实体对象查询对象
    const entityObjectForm = reactive({
      objectName: "",
      timeAscOrDesc: "",
      updatedByName: ""
    })
    //实体对象表对象
    let entityObjectTable = reactive({
      ref: true,
      tableData: [],
      border: true,
      show: true,
      loading: false,
    })
    //实体对象分页对象
    let entityObjectPaginationConfig = reactive({
      pageSize: 10,
      total: 0,
      pageSizes: [10, 20, 30, 40],
      current: 1
    })
    //实体对象勾选对象、勾选函数
    const selectedRuleLayoutIds = reactive([])
    const handleSelectionChange = (layouts) => {
      selectedRuleLayoutIds.length = 0;
      selectedRuleLayoutIds.push(...layouts.map(layout => (
          parseInt(layout.id)
      )))
    }
    //修改实体对象发布状态
    const batchPublishEntityObject = () => {
      const params = {
        ids: selectedRuleLayoutIds,
        status: 1
      }
      updateEntityObjectStatus(params);
      getEntityObjectData()
    }

    const batchDisPublishEntityObject = () => {
      const params = {
        ids: selectedRuleLayoutIds,
        status: 0
      }
      updateEntityObjectStatus(params);
      getEntityObjectData()
    }
    //实体对象查询
    const entityObjectSearch = () => {
      let requestBody = {
        objectName: entityObjectForm.objectName,
        timeAscOrDesc: entityObjectForm.timeAscOrDesc,
        updatedByName: entityObjectForm.updatedByName,
        ruleGroupCode: ruleGroupCode,
        pageNum: entityObjectPaginationConfig.current,
        pageSize: entityObjectPaginationConfig.pageSize,
      }
      getEntityObject(requestBody).then(response => {
            entityObjectTable.tableData = response.data.data
            entityObjectPaginationConfig.current = response.data.pageNum || 1
            entityObjectPaginationConfig.pageSize = response.data.pageSize
            entityObjectPaginationConfig.total = response.data.totalCount
          }
      )
    }
    //实体对象查询输入框重置
    const resetInput = () => {
      entityObjectForm.objectName = "";
      entityObjectForm.timeAscOrDesc = "";
      entityObjectForm.updatedByName = "";
    }
    //新建实体对象
    const newEntityObject = () => {
      router.push({
        path: 'newEntityObject',
        query: {
          ruleGroupCode: ruleGroupCode,
          ruleGroupName: ruleGroupName,
          ruleGroupDesc: ruleGroupDesc,
        }
      })
    }

    const handleSizeChange = (val) => {
      console.log(`${val} items per page`)
    }
    const handleCurrentChange = (val) => {
      console.log(`current page: ${val}`)
    }

    //分页查询实体对象
    function getEntityObjectData() {
      let requestBody = {
        pageNum: entityObjectPaginationConfig.current,
        pageSize: entityObjectPaginationConfig.pageSize,
        timeAscOrDesc: "asc"
      }
      getEntityObject(requestBody).then(response => {
        entityObjectTable.tableData = response.data.data
        entityObjectPaginationConfig.current = response.data.pageNum || 1
        entityObjectPaginationConfig.pageSize = response.data.pageSize
        entityObjectPaginationConfig.total = response.data.totalCount
      })
    }

    const deleteEntityObjectBtn = (id) => {
      deleteEntityObject(id).then(response => {
        if (response.data.code !== '0') {
          ElMessage.error(response.data.message)
          return;
        }
        ElMessage({
          message: '删除成功',
          type: 'success',
        })
        getEntityObjectData()

      })
    }

    //编辑实体对象
    const editEntityObjectBtn = (id) => {
      router.push({
        path: 'entityObjectDetail',
        query: {
          id:id,
          ruleGroupCode: ruleGroupCode,
          ruleGroupName: ruleGroupName,
          ruleGroupDesc: ruleGroupDesc,
          scene: 'preview'
        }
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
      handleSelectionChange,
      resetInput,
      newEntityObject,
      handleSizeChange,
      handleCurrentChange,
      batchPublishEntityObject,
      batchDisPublishEntityObject,
      deleteEntityObjectBtn,
      editEntityObjectBtn
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
