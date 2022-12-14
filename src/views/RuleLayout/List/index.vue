<template>
  <div class="container">
    <el-form>
      <el-row class="handle-box" :gutter="20">
        <el-col :span="7">
          <el-input
              v-model="ruleLayoutQueryForm.name"
              placeholder="脚本规则编排名称"
              style="width: 100%;"
              clearable>
          </el-input>
        </el-col>
        <el-col :span="7">
          <el-input
              v-model="ruleLayoutQueryForm.keyword"
              placeholder="最后修改人"
              clearable>
          </el-input>
        </el-col>
        <el-col :span="7">
          <el-select placeholder="状态" v-model="ruleLayoutQueryForm.status" clearable>
            <el-option value="PUBLISHED" label="发布"></el-option>
            <el-option value="UNPUBLISHED" label="未发布"></el-option>
          </el-select>
        </el-col>
        <el-col :span="3" style="text-align: right">
          <el-button
              type="primary"
              size="small"
              @click="searchRuleLayout">
            查询
          </el-button>
          <el-button
              size="small"
              @click="resetForm">
            重置
          </el-button>
        </el-col>
      </el-row>
    </el-form>
    <el-divider></el-divider>
    <el-row class="row-container">
      <el-col :span="12">脚本规则编排（{{ pagination.total }}）</el-col>
      <el-col :span="12" class="right">
        <el-button-group>
          <el-button type="primary" size="small" @click="addRuleLayoutDetail">新建</el-button>
          <el-button class="stop"
                     size="small"
                     @click="batchDisableRuleLayout"
                     :disabled="selectedRuleLayoutIds.length===0">
            批量停用
          </el-button>
          <el-button class="publish"
                     size="small"
                     @click="batchPublishRuleLayout"
                     :disabled="selectedRuleLayoutIds.length===0">
            批量发布
          </el-button>
        </el-button-group>
      </el-col>
    </el-row>
    <el-table :data="ruleLayoutList" style="margin-top: 10px;width: 100%;align:center"
              @selection-change="handleSelectionChange" max-height="450"
              v-loading="listLoading">
      <el-table-column type="selection" width="55"/>
      <el-table-column label="规则编排名称" prop="name">
        <template #default="scope">
          <span style="margin-left: 10px;color: #409EFF"
                @click="previewRuleLayoutDetail(scope.row.id)">{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="规则编排code" prop="code"></el-table-column>
      <el-table-column label="状态" prop="statusName">
        <template #default="scope">
          <r-badge :color="scope.row.status == 'UNPUBLISHED' ? 'gray' : 'green'"/>
          <span>
            {{ scope.row.status == 'UNPUBLISHED' ? "未发布" : "已发布" }}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="被调用次数" prop="transferCount" :formatter="countFormatter" sortable>
      </el-table-column>
      <el-table-column label="最后修改人" prop="lastModify"></el-table-column>
      <el-table-column label="最后修改时间" prop="lastModifyTime" sortable></el-table-column>
      <el-table-column label="操作" min-width="100%" align="center">
        <template #default="scope">
          <span @click="editRuleLayoutDetail(scope.row)" class="actionClass">编辑</span>
          <span
              @click="deleteRuleLayout(scope.row)"
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
                <el-dropdown-item command="2">测试</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
        small
        v-model:currentPage="pagination.currentPage"
        v-model:page-size="pagination.pageSize"
        :page-sizes="[10, 20, 50]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="pagination.total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        style="display:flex;justify-content: flex-end;align-items: center; margin-top: 10px"
    >
    </el-pagination>
    <TestModal
        v-if="testVisible"
        :visible="testVisible"
        :handleCancel="handleCancel"
        :changeLeftEditor="getRuleLayoutParam"
        :changeRightEditor="testLayout"
    ></TestModal>
  </div>
</template>

<script>
import {reactive, onMounted, inject, ref} from 'vue';
import {useRouter, useRoute} from 'vue-router';
import {ElMessage, ElMessageBox} from "@enn/element-plus";
import {pageRuleLayoutList, changeRuleLayoutStatus, removeRuleLayout} from '@/api/ruleLayout'
import {useStore} from "vuex";
import TestModal from "views/CustomRule/TestModal.vue"
import {scriptRuleParam, scriptRuleTest} from "@/api/ruleTest";
import rBadge from "@/components/rBadge.vue"
import {updateEntityObjectStatus} from "@/api/entityObject";
import {MoreFilled} from "@element-plus/icons-vue";
import {updateScriptRuleStatus} from "@/api/scriptRule";

export default {
  name: "RuleLayoutList",
  components: {TestModal, rBadge, MoreFilled},
  setup() {
    const listLoading = ref(false);
    const store = useStore()
    onMounted(() => {
      listLoading.value = true;
      const params = {
        pageNum: pagination.currentPage,
        pageSize: pagination.pageSize,
        ruleGroupCode: store.state.rule.ruleData.ruleGroupCode,
      }
      pageRuleLayoutList(params).then(res => {
        const data = res.data;
        pagination.pageSize = data.pageSize;
        pagination.currentPage = data.pageNum;
        pagination.total = data.totalCount;
        pagination.pageCount = data.totalPages;
        ruleLayoutList.push(...convertToRuleLayoutList(data.data))
        listLoading.value = false;
      })
    });

    let RULE_LAYOUT_STATUS = {
      'PUBLISHED': '发布',
      'UNPUBLISHED': '未发布',
    }

    const convertToRuleLayoutList = (data) => {
      if (!data) {
        return []
      }
      return data.map(layout => {
        return {
          id: layout.id,
          name: layout.ruleLayoutName,
          code: layout.ruleLayoutCode,
          status: layout.ruleLayoutStatus,
          statusName: RULE_LAYOUT_STATUS[layout.ruleLayoutStatus],
          isUsing: "否",
          lastModify: layout.updatedByName,
          lastModifyTime: layout.updatedDate,
          transferCount:layout.transferCount
        }
      })
    }
    const ruleLayoutQueryForm = reactive({
      name: '',
      keyword: '',
      status: ''
    });
    let ruleLayoutList = reactive([])

    // 分页操作
    const pagination = reactive({
      currentPage: 1,
      pageSize: 10,
      total: 100,
      pageCount: 0
    })

    const handleSizeChange = (size) => {
      pagination.pageSize = size
      searchRuleLayout()
    }

    const handleCurrentChange = (page) => {
      pagination.currentPage = page
      searchRuleLayout()
    }

    const searchRuleLayout = () => {
      listLoading.value = true;
      const params = {
        pageNum: pagination.currentPage,
        pageSize: pagination.pageSize,
        ruleLayoutName: ruleLayoutQueryForm.name,
        updatedByName: ruleLayoutQueryForm.keyword,
        ruleLayoutStatus: ruleLayoutQueryForm.status,
        ruleGroupCode: store.state.rule.ruleData.ruleGroupCode
      }
      pageRuleLayoutList(params).then(res => {
        const data = res.data;
        pagination.pageSize = data.pageSize;
        pagination.currentPage = data.pageNum;
        pagination.total = data.totalCount;
        ruleLayoutList.length = 0;
        ruleLayoutList.push(...convertToRuleLayoutList(data.data));
        listLoading.value = false;
      })
    }
    const resetForm = () => {
      ruleLayoutQueryForm.name = null;
      ruleLayoutQueryForm.keyword = null;
      ruleLayoutQueryForm.status = null;
      pagination.currentPage = 1
      pagination.pageSize = 10
      searchRuleLayout();
    }

    const batchDisableRuleLayout = () => {
      const params = {
        list: selectedRuleLayoutIds,
        ruleLayoutStatus: "UNPUBLISHED"
      }
      changeRuleLayoutStatus(params).then((res) => {
            if (res.data.code === '0') {
              searchRuleLayout();
            }
          }
      )
    }

    const batchPublishRuleLayout = () => {
      const params = {
        list: selectedRuleLayoutIds,
        ruleLayoutStatus: "PUBLISHED"
      }
      changeRuleLayoutStatus(params).then((res) => {
            if (res.data.code === '0') {
              searchRuleLayout();
            }
          }
      )
    }

    const selectedRuleLayoutIds = reactive([])
    const handleSelectionChange = (layouts) => {
      selectedRuleLayoutIds.length = 0;
      selectedRuleLayoutIds.push(...layouts.map(layout => layout.id))
    }

    const router = useRouter();
    const previewRuleLayoutDetail = (ruleLayoutId) => {
      router.push({
        path: '/rule-layout/detail',// 跳转到规则编排详情页面
        query: {
          ...route.query,
          ruleLayoutId: ruleLayoutId,
          scene: 'preview',
        }
      })
    }

    const editRuleLayoutDetail = (row) => {
      if (row.status === "PUBLISHED") {
        ElMessage.info("已发布的脚本规则编排不能编辑");
        return
      }
      router.push({
        path: '/rule-layout/detail',// 跳转到规则编排详情页面
        query: {
          ...route.query,
          ruleLayoutId: row.id,
          scene: 'update',
        }
      })
    }

    const route = useRoute();

    const addRuleLayoutDetail = () => {
      router.push({
        path: '/rule-layout/add',// 跳转到规则编排详情页面
        query: {
          ...route.query
        }
      })
    }

    const publishRuleLayout = (id) => {
      const params = {
        list: [id],
        ruleLayoutStatus: "PUBLISHED"
      }
      changeRuleLayoutStatus(params).then((res) => {
            if (res.data.code === '0') {
              searchRuleLayout();
              ElMessage.success(res.data.data);
            } else {
              ElMessage.error(res.data.message);
            }
          }
      )
    }

    //按钮组
    const handleModify = (status, row) => {
      const params = {
        list: [row.id],
        ruleLayoutStatus: "PUBLISHED"
      }
      const param = {
        list: [row.id],
        ruleLayoutStatus: "UNPUBLISHED"
      }
      if (status === "2") {
        testRuleLayout(row.code);
      } else {
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
            changeRuleLayoutStatus(params).then((response) => {
              if (response.data.code !== '0') {
                ElMessage.error(response.data.message)
                return;
              }
              ElMessage({
                type: "success",
                message: "发布成功",
              })
              searchRuleLayout();
            })
          })
        } else {
          ElMessageBox.confirm(
              `你确定要停用该规则么?`,
              "警告",
              {
                confirmButtonText: "确认",
                cancelButtonText: "取消",
                type: "warning",
                buttonSize: "small",
              }).then(() => {
            changeRuleLayoutStatus(param).then((response) => {
                  if (response.data.code !== '0') {
                    ElMessage.error(response.data.message)
                    return;
                  }
                  ElMessage({
                    type: "success",
                    message: "停用成功",
                  })
                  searchRuleLayout();
                }
            )
          })
        }
      }
    }

    const disableRuleLayout = (id) => {
      const params = {
        list: [id],
        ruleLayoutStatus: "UNPUBLISHED"
      }
      changeRuleLayoutStatus(params).then((res) => {
            if (res.data.code === '0') {
              searchRuleLayout();
              ElMessage.success(res.data.data);
            } else {
              ElMessage.error(res.data.message);
            }
          }
      )
    }

    const deleteRuleLayout = (row) => {
      let id = row.id;
      ElMessageBox.confirm(
          '确认删除该规则编排?',
          'Warning',
          {
            confirmButtonText: '确认',
            cancelButtonText: '取消',
            type: 'warning',
          }
      )
          .then(() => {
            removeRuleLayout({id}).then(res => {
              if (res.data.code != "0") {
                ElMessage.error(res.data.message)
              } else {
                ElMessage({
                  type: 'success',
                  message: '该规则编排删除成功',
                })
                searchRuleLayout();
              }
            })
          })
          .catch(() => {
          })

    }


    let testVisible = ref(false);
    let scriptCodeRef = ref('');
    let getRuleLayoutParam = async () => {
      const res = await scriptRuleParam({
        ruleGroupCode: store.state.rule.ruleData.ruleGroupCode,
        ruleLayoutCode: scriptCodeRef.value,
        // ruleGroupCode: "FFyX88RJ",
        // ruleLayoutCode: "20220406183002"
      });
      if (res.data.code !== '0') {
        ElMessage.error(res.data.message);
        return;
      }
      return JSON.parse(res.data.data);
    }
    let testLayout = async (param) => {
      const res = await scriptRuleTest(param);
      if (res.data.code !== '0') {
        return res.data
      }
      return res.data.data;
    }
    let testRuleLayout = (ruleLayoutCode) => {
      testVisible.value = true;
      scriptCodeRef.value = ruleLayoutCode;
    }

    const handleCancel = () => {
      testVisible.value = false;
    };
    const countFormatter = (row, column) => {
      console.log("row",row)
      console.log("row.id",row.transferCount)
      return row.transferCount == null ? "0次" : row.transferCount + "次";
    };

    return {
      ruleLayoutQueryForm,
      ruleLayoutList,
      pagination,
      handleCurrentChange,
      handleSizeChange,
      previewRuleLayoutDetail,
      searchRuleLayout,
      resetForm,
      handleSelectionChange,
      selectedRuleLayoutIds,
      batchDisableRuleLayout,
      batchPublishRuleLayout,
      publishRuleLayout,
      disableRuleLayout,
      deleteRuleLayout,
      editRuleLayoutDetail,
      addRuleLayoutDetail,
      testRuleLayout,
      handleCancel,
      getRuleLayoutParam,
      testLayout,
      testVisible,
      countFormatter,
      listLoading,
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

.el-table thead {
  font-weight: 500;
  background: #5a5e66 !important;
}

.dropDown {
  margin-left: 20px;
  margin-top: 4px;
}
</style>
