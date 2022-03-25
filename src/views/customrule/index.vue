<template>
  <div class="container">
    <el-row class="handle-box" :gutter="20">
      <el-col :span="7">
        <el-input v-model="listQuery.ruleName" placeholder="脚本规则名称" class="handle-input mr10"></el-input>
      </el-col>
      <el-col :span="7">
        <el-input v-model="listQuery.ruleCode" placeholder="规则编码" class="handle-input mr10"></el-input>
      </el-col>
      <el-col :span="7">
        <el-select v-model="listQuery.status" clearable placeholder="请选择">
          <el-option
            v-for="item in [
              { value: 0, label: '未发布' },
              { value: 1, label: '已发布' }
            ]"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-col>
      <el-col :span="3" style="text-align: right">
        <el-button type="primary" size="small" @click="handleSearch">搜索</el-button>
        <el-button size="small" @click="handleReset">重置</el-button>
      </el-col>
    </el-row>
    <el-divider></el-divider>
    <el-row class="row-container">
      <el-col :span="12">自定义规则 (100）</el-col>
      <el-col :span="12" class="right">
        <el-button-group>
          <el-button type="primary" size="small" @click="handleCreate">新建</el-button>
          <el-button class="center" size="small" @click="handleModify(0)" :disabled="!multipleSelection.length">
            批量停用
          </el-button>
          <el-button size="small" @click="handleModify(1)" :disabled="!multipleSelection.length">批量发布</el-button>
        </el-button-group>
      </el-col>
    </el-row>
    <el-table
      :data="tableData"
      highlight-current-row
      ref="multipleTable"
      @selection-change="handleSelectionChange"
      v-loading="listLoading"
    >
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column prop="ruleName" label="规则名字">
        <template #default="scope">
          <span class="actionClass" @click="handleDetail(scope.row)">{{ scope.row.ruleName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="规则编号">
        <template #default="scope">{{ scope.row.ruleCode }}</template>
      </el-table-column>
      <el-table-column label="规则状态">
        <template #default="scope">
          <r-badge :color="scope.row.releaseStatus == 0 ? 'gray' : 'green'" />
          <span>
            {{ scope.row.releaseStatus == 0 ? '未发布' : '已发布' }}
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="callCount" label="被调用次数" sortable></el-table-column>
      <el-table-column label="最后修改人" align="center">
        <template #default="scope">
          {{ scope.row.updatedUserName }}
        </template>
      </el-table-column>
      <el-table-column prop="date" label="最后修改时间" sortable>
        <template #default="scope">{{ scope.row.updatedDate }}</template>
      </el-table-column>
      <el-table-column label="操作" width="180" align="center">
        <template #default="scope">
          <span @click="handleEdit(scope.row)" class="actionClass">编辑</span>
          <span @click="handleDelete(scope.row)" class="actionClass" style="margin: 0px 10px">删除</span>

          <el-dropdown class="dropDown" @command="(e) => handleModify(e, scope.row)">
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
        :current-page="listQuery.pageIndex"
        :page-size="listQuery.pageSize"
        layout=" prev, pager, next,  sizes,jumper"
        :total="pageTotal"
        @size-change="handleSizeChange"
        @current-change="handlePageChange"
      ></el-pagination>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { fetchTableData, deleteList, modifyList } from '@/api/customRule.js'
import { cloneDeep } from 'lodash'
import rBadge from '@/components/rBadge.vue'
import { ElMessageBox, ElMessage } from '@enn/element-plus'
import { MoreFilled } from '@element-plus/icons-vue'

const listQuery = reactive({
  ruleName: '',
  ruleCode: '',
  status: null,
  pageIndex: 1,
  pageSize: 10
})
const tableData = ref([])
const pageTotal = ref(0)
const router = useRouter()
const editVisible = ref(false)
const listLoading = ref(false)
const multipleSelection = ref([])

// 获取表格数据
const getList = () => {
  listLoading.value = false
  // fetchTableData({
  //   ...listQuery
  // }).then((res) => {
  //   const data = {
  //     success: true,
  //     code: '0',
  //     message: '',
  //     pageNum: 0,
  //     pageSize: 10,
  //     totalPages: 1,
  //     totalCount: 9,
  //     data: [
  //       {
  //         ruleId: '1',
  //         ruleName: '测试一条规则',
  //         ruleCode: 'RL0001',
  //         releaseStatus: '1',
  //         callCount: 0,
  //         updatedUserName: '翟某某',
  //         updatedDate: '2022-03-09 14:59:23',
  //         updatedById: '1',
  //         status: 1
  //       }
  //     ]
  //   }
  //   tableData.value = data.data
  //   pageTotal.value = data.totalCount
  // listLoading.value = false
  // })
  const data = {
    success: true,
    code: '0',
    message: '',
    pageNum: 0,
    pageSize: 10,
    totalPages: 1,
    totalCount: 9,
    data: [
      {
        ruleId: '1',
        ruleName: '测试一条规则',
        ruleCode: 'RL0001',
        releaseStatus: '1',
        callCount: 0,
        updatedUserName: '翟某某',
        updatedDate: '2022-03-09 14:59:23',
        updatedById: '1',
        status: 1
      }
    ]
  }
  tableData.value = data.data
}

const handleSelectionChange = (val) => {
  multipleSelection.value = val
}

// 查询操作
const handleSearch = () => {
  getList()
}
// 分页导航
const handlePageChange = (val) => {
  query.pageIndex = val
  getList()
}

const handleSizeChange = (val) => {}

const handleCreate = () => {
  router.push({
    name: 'editCustomRule',
    params: { id: undefined }
  })
}

const handleTest = (value) => {
  console.log(value, 'vali')
}

const handleModify = (status, row) => {
  const ids = row ? [row.ruleId] : multipleSelection.value.map((item) => item.ruleId)
  const res = modifyList({
    ids,
    releaseStatus: status
  })
    .then((res) => {
      getList()
      if (!row) {
        multipleSelection.value = []
      }
      ElMessage({
        type: 'success',
        message: status == 0 ? '停用成功' : '发布成功'
      })
    })
    .catch((erro) => {
      ElMessage({
        type: 'warning',
        message: status == 0 ? '停用失败' : '发布失败'
      })
    })
}

// 删除操作
const handleDelete = (row) => {
  ElMessageBox.confirm('你确定要删除该规则么?', '警告', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning',
    buttonSize: 'small'
  })
    .then(async () => {
      await deleteList(row.ruleId)
      await getList()
      ElMessage({
        type: 'success',
        message: '删除成功'
      })
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: '删除失败'
      })
    })
}

const handleReset = () => {
  const data = {
    ruleName: '',
    ruleCode: '',
    status: null,
    pageIndex: 1,
    pageSize: 10
  }
  Object.assign(listQuery, data)
  multipleSelection.value = []
  getList()
}

const handleEdit = (row) => {
  router.push({
    name: 'editCustomRule',
    params: { id: row.ruleId }
  })
}
const handleDetail = (row) => {
  router.push({
    name: 'editCustomRule',
    params: { id: row.ruleId },
    query: { status: 'detail' }
  })
}

const saveEdit = () => {}

onMounted(() => {
  getList()
})
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
