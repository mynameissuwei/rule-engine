<template>
  <div class="container">
    <!-- 实体对象查询输入框-->
    <el-form>
      <el-row class="handle-box" :gutter="20">
        <el-col :span="7">
          <el-input
              v-model="entityObjectForm.objectName"
              placeholder="实体对象名称"
              style="width: 100%;"
              clearable>
          </el-input>
        </el-col>
        <el-col :span="7">
          <el-input
              v-model="entityObjectForm.updatedByName"
              placeholder="最后修改人"
              clearable>
          </el-input>
        </el-col>
        <el-col :span="7">
          <el-select placeholder="状态"
                     v-model="entityObjectForm.status"
                     style="width: 100%;" clearable>
            <el-option value=0 label="未发布"></el-option>
            <el-option value=1 label="已发布"></el-option>
          </el-select>
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
        style="width: 100%"
        max-height="450"
        :header-cell-style="{ background: '#F6F7FB' }"
        highlight-current-row
        @selection-change="handleSelectionChange"
        v-loading="listLoading"
        @cell-click="entityObjectDetailBtn"
    >
      <el-table-column type="selection" width="55"/>
      <el-table-column property="objectName" label="对象名称" min-width="100%">
        <template #default="scope">
          <div style="color: blue; cursor: pointer">
            {{ scope.row.objectName }}
          </div>
        </template>
      </el-table-column>
      <el-table-column property="objectCode" label="对象编码" min-width="100%">
      </el-table-column>
      <el-table-column property="status" label="发布状态" min-width="100%">
        <template #default="scope">
          <r-badge :color="scope.row.status == 0 ? 'gray' : 'green'"/>
          <span>
            {{ scope.row.status == 0 ? "未发布" : "已发布" }}
          </span>
        </template>
      </el-table-column>
      <el-table-column property="updatedByName" label="最后修改人" min-width="100%">
      </el-table-column>
      <el-table-column property="updatedDate" label="最后修改时间" min-width="100%">
      </el-table-column>
      <el-table-column label="操作" min-width="100%" align="center">
        <template #default="scope">
          <span @click="editEntityObjectBtn(scope.row)" class="actionClass">编辑</span>
          <span
              @click="deleteEntityObjectBtn(scope.row)"
              class="actionClass"
              style="margin: 0px 10px"
          >删除</span
          >
          <el-dropdown
              class="dropDown"
              @command="(e) => handleModify(e, scope.row)"
          >
            <el-icon>
              <more-filled/>
            </el-icon>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="1">发布</el-dropdown-item>
                <el-dropdown-item command="0">停用</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>
    <!--实体对象分页组件-->
    <div class="demo-pagination-block">
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
import {inject, onMounted, reactive, ref} from "vue";
import {deleteEntityObject, getEntityObject, updateEntityObjectStatus} from "@/api/entityObject";
import {ElMessage, ElMessageBox} from "@enn/element-plus";
import {useRouter} from "vue-router";
import {Message} from "@element-plus/icons-vue";
import {useStore} from "vuex";
import rBadge from "@/components/rBadge.vue"
import {updateScriptRuleStatus} from "@/api/scriptRule";
import {MoreFilled} from "@element-plus/icons-vue";

export default {
  name: "index.vue",
  components:{rBadge,MoreFilled},
  setup() {
    const listLoading = ref(false)
    const store = useStore();
    const router = useRouter()
    //实体对象查询对象
    const entityObjectForm = reactive({
      objectName: "",
      status: "",
      updatedByName: ""
    })
    //实体对象表对象
    let entityObjectTable = reactive({
      ref: true,
      tableData: [],
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

    //规则库分页函数
    function handleSizeChange(pageSize) {
      entityObjectPaginationConfig.pageSize = pageSize;
      getEntityObjectData();
    }

    function handleCurrentChange(pageNumber) {
      entityObjectPaginationConfig.current = pageNumber;
      getEntityObjectData();
    }

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
      updateEntityObjectStatus(params).then((response) => {
            getEntityObjectData()
            if (response.data.code !== '0') {
              ElMessage.error(response.data.message)
              return;
            }
            ElMessage({
              type: 'success',
              message: '发布成功'
            })
            console.log(entityObjectTable.tableData, 1010)
          }
      )
    }

    const batchDisPublishEntityObject = () => {
      const params = {
        ids: selectedRuleLayoutIds,
        status: 0
      }
      updateEntityObjectStatus(params).then((response) => {
            getEntityObjectData()
            if (response.data.code !== '0') {
              ElMessage.error(response.data.message)
              return;
            }
            ElMessage({
              type: 'success',
              message: '停用成功'
            })
          }
      )
    }
    //实体对象查询
    const entityObjectSearch = () => {
      listLoading.value = true;
      let requestBody = {
        objectName: entityObjectForm.objectName,
        status: entityObjectForm.status,
        timeAscOrDesc: "desc",
        updatedByName: entityObjectForm.updatedByName,
        ruleGroupCode: store.state.rule.ruleData.ruleGroupCode,
        pageNum: entityObjectPaginationConfig.current,
        pageSize: entityObjectPaginationConfig.pageSize,
      }
      getEntityObject(requestBody).then(response => {
            entityObjectTable.tableData = response.data.data
            entityObjectPaginationConfig.current = response.data.pageNum || 1
            entityObjectPaginationConfig.pageSize = response.data.pageSize
            entityObjectPaginationConfig.total = response.data.totalCount
            listLoading.value = false;
          }
      )
    }
    //实体对象查询输入框重置
    const resetInput = () => {
      entityObjectForm.objectName = "";
      entityObjectForm.status = "";
      entityObjectForm.updatedByName = "";
      getEntityObjectData()
    }
    //新建实体对象
    const newEntityObject = () => {
      router.push({
        path: 'newEntityObject'
      })
    }

    let entityObjectDetailBtn = (row, column, event, cell) => {
      if (column.label === "对象名称") {
        router.push({
          path: "entityObjectDetail",
          query: {
            entityObjectId: row.id,
            scene: 'preview'
          },
        });
      }
    }

    //分页查询实体对象
    function getEntityObjectData() {
      listLoading.value = true;
      let requestBody = {
        pageNum: entityObjectPaginationConfig.current,
        pageSize: entityObjectPaginationConfig.pageSize,
        ruleGroupCode: store.state.rule.ruleData.ruleGroupCode,
        timeAscOrDesc: "desc"
      }
      getEntityObject(requestBody).then(response => {
        entityObjectTable.tableData = response.data.data
        entityObjectPaginationConfig.current = response.data.pageNum || 1
        entityObjectPaginationConfig.pageSize = response.data.pageSize
        entityObjectPaginationConfig.total = response.data.totalCount
        listLoading.value = false;
      })
    }

    const deleteEntityObjectBtn = (row) => {
      ElMessageBox.confirm(
          '要删除这个实体么，是否继续？',
          'Warning',
          {
            cancelButtonText: '取消',
            confirmButtonText: '删除',
            type: 'warning',
          }
      ).then(() => {
        deleteEntityObject(row.id).then((response) => {
          getEntityObjectData()
          if (response.data.code !== '0') {
            ElMessage.error(response.data.message)
            return;
          }
          ElMessage({
            type: 'success',
            message: 'Delete completed'
          })
        })
      }).catch(

      )
    }

    //编辑实体对象
    const editEntityObjectBtn = (row) => {
      if (row.status === 1) {
        ElMessage.info("已发布的脚本规则编排不能编辑");
        return
      }
      router.push({
        path: 'entityObjectDetail',
        query: {
          entityObjectId: row.id,
          scene: 'update'
        }
      })
    }
    //按钮组
    const handleModify = (status, row) => {
      const params = {
        ids: [parseInt(row.id)],
        status: 0
      }
      const param = {
        ids: [parseInt(row.id)],
        status: 1
      }

        if (status === "1") {
          ElMessageBox.confirm(
              `你确定要发布该规则么?`,
              "警告",
              {
                confirmButtonText: "确认",
                cancelButtonText: "取消",
                type: "warning",
                buttonSize: "small",
              }).then(() => {
            updateEntityObjectStatus(param).then((response) => {
              if (response.data.code !== '0') {
                ElMessage.error(response.data.message)
                return;
              }
              ElMessage({
                type: "success",
                message: "发布成功",
              })
              getEntityObjectData();
            })
          })
        }else{
          ElMessageBox.confirm(
              `你确定要停用该规则么?`,
              "警告",
              {
                confirmButtonText: "确认",
                cancelButtonText: "取消",
                type: "warning",
                buttonSize: "small",
              }).then(() => {
            updateEntityObjectStatus(params).then((response) => {
                  if (response.data.code !== '0') {
                    ElMessage.error(response.data.message)
                    return;
                  }
                  ElMessage({
                    type: "success",
                    message: "停用成功",
                  })
              getEntityObjectData();
                }
            )
          })
        }
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
      editEntityObjectBtn,
      listLoading,
      entityObjectDetailBtn,
      handleModify
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

.dropDown {
  margin-left: 20px;
  margin-top: 4px;
}
</style>
