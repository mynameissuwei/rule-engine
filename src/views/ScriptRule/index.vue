<template>
  <div class="container">
    <!-- 脚本规则查询输入框-->
    <el-form>
      <el-row class="handle-box" :gutter="40">
        <el-col :span="7">
          <el-input
              v-model="scriptRuleForm.scriptName"
              placeholder="脚本规则名称"
              style="width: 100%;"
              clearable>
          </el-input>
        </el-col>
        <el-col :span="7">
          <el-input
              v-model="scriptRuleForm.updatedByName"
              placeholder="最后修改人关键词"
              clearable>
          </el-input>
        </el-col>
        <el-col :span="7">
          <el-select placeholder="状态" v-model="scriptRuleForm.ruleScriptStatus">
            <el-option value="PUBLISHED" label="发布"></el-option>
            <el-option value="UNPUBLISHED" label="未发布"></el-option>
          </el-select>
        </el-col>
        <el-col :span="3" style="text-align: right">
          <el-button
              type="primary"
              size="small"
              @click="search">
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
      <el-col :span="12">脚本规则 ({{ scriptRulePaginationConfig.total }})</el-col>
      <el-col :span="12" class="right">
        <el-button-group>
          <el-button type="primary" size="small" @click="inputScriptRule">新建</el-button>
          <el-button class="stop"
                     size="small"
                     @click="batchDisPublishScriptRule"
                     :disabled="selectedRuleLayoutIds.length===0">
            停用
          </el-button>
          <el-button class="publish"
                     size="small"
                     @click="batchPublishScriptRule"
                     :disabled="selectedRuleLayoutIds.length===0">
            发布
          </el-button>
        </el-button-group>
      </el-col>
    </el-row>
    <!--脚本规则表-->
    <el-table
        ref="entityObjectTable"
        :data="scriptRuleTable.tableData"
        style="margin-top: 10px;width: 100%;align:center"
        @selection-change="handleSelectionChange"
        height="280px"
        @cell-click="scriptRuleDetailBtn"
    >
      <el-table-column type="selection" width="55"/>
      <el-table-column property="scriptName" label="脚本规则名称" min-width="100%">
        <template #default="scope">
          <div style="color: blue; cursor: pointer">
            {{ scope.row.scriptName }}
          </div>
        </template>
      </el-table-column>
      <el-table-column property="scriptCode" label="脚本规则代码" min-width="100%"></el-table-column>
      <el-table-column property="ruleScriptStatus" label="发布状态" min-width="100%">
        <template #default="scope">
          <span v-if="scope.row.ruleScriptStatus === 'UNPUBLISHED'">未发布</span>
          <span v-if="scope.row.ruleScriptStatus === 'PUBLISHED'">发布</span>
        </template>
      </el-table-column>
      <el-table-column prop="transferCount" label="被调用次数" min-width="100%"></el-table-column>
      <el-table-column prop="updatedByName" label="最后修改人" min-width="100%"></el-table-column>
      <el-table-column prop="updatedDate" label="最后修改时间" min-width="100%"></el-table-column>
      <el-table-column label="操作" min-width="100%" align="center">
        <template #default="scope">
          <el-button
              type="text"
              icon="el-icon-edit"
              @click="editScriptRule(scope.row.id)"
          >编辑
          </el-button>
          <el-button
              type="text"
              icon="el-icon-delete"
              class="red"
              @click="testScriptRule(scope.row.scriptCode)"
          >测试
          </el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <div class="demo-pagination-block">
        <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="scriptRulePaginationConfig.current"
            :page-sizes="scriptRulePaginationConfig.pageSizes"
            :page-size="scriptRulePaginationConfig.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="scriptRulePaginationConfig.total"
        >
        </el-pagination>
      </div>
  </div>
  <TestModal
      v-if="testVisible"
      :visible="testVisible"
      :handleCancel="handleCancel"
      :changeLeftEditor="getScriptParam"
      :changeRightEditor="testScript"
  ></TestModal>
</template>

<script>
import {onMounted, reactive, ref, inject, provide} from "vue";
import {useRouter} from "vue-router";
import {pageScriptRule, updateScriptRuleStatus} from "@/api/scriptRule";
import TestModal from "views/customrule/TestModal.vue"
import {useStore} from "vuex";
import {scriptRuleParam, scriptRuleTest} from "@/api/ruleTest";
import {ElMessage} from "@enn/element-plus";

export default {
  name: "index.vue",
  components: {TestModal},
  setup() {
    const router = useRouter();
    const store = useStore();
    const scriptRuleForm = reactive({
      scriptName: '',
      updatedByName: '',
      ruleScriptStatus: ''
    })
    const scriptRuleTable = reactive({
      tableData: [],
    })
    //脚本规则详情
    let scriptRuleDetailBtn = (row,column,event,cell) => {
      if (column.label === "脚本规则名称"){
        router.push({
          path: "scriptRuleDetail",
          query: {
            scriptRuleId: row.id,
            scene: 'preview'
          },
        });
      }
    }

    //脚本规则分页对象
    let scriptRulePaginationConfig = reactive({
      pageSize: 10,
      total: 0,
      pageSizes: [10, 20, 50],
      current: 1
    })
    //跳转脚本规则录入页面
    const inputScriptRule = () => {
      router.push({
        path: 'inputScriptRule'
      })
    }

    const resetForm = () => {
      scriptRuleForm.scriptName = ''
      scriptRuleForm.ruleScriptStatus = ''
      scriptRuleForm.updatedByName = ''
      getPageScriptRuleData()
    }

    // 分页函数
    function handleSizeChange(pageSize) {
      scriptRulePaginationConfig.pageSize = pageSize
      getPageScriptRuleData()
    }

    function handleCurrentChange(pageNumber) {
      scriptRulePaginationConfig.current = pageNumber
      getPageScriptRuleData()
    }

    const selectedRuleLayoutIds = reactive([])
    const handleSelectionChange = (layouts) => {
      selectedRuleLayoutIds.length = 0;
      selectedRuleLayoutIds.push(...layouts.map(layout => (
          {
            id: layout.id,
            scriptCode: layout.scriptCode
          }
      )))
    }

    //分页查询脚本规则
    function getPageScriptRuleData() {
      const params = {
        pageNum: scriptRulePaginationConfig.current,
        pageSize: scriptRulePaginationConfig.pageSize,
        ruleGroupCode: store.state.rule.ruleData.ruleGroupCode,
      }
      pageScriptRule(params).then(response => {
        console.log(response,11)
            scriptRuleTable.tableData = response.data.data
            scriptRulePaginationConfig.current = response.data.pageNum || 1
            scriptRulePaginationConfig.pageSize = response.data.pageSize
            scriptRulePaginationConfig.total = response.data.totalCount
          }
      )
    }

    //查询脚本规则
    function search() {
      const params = {
        pageNum: scriptRulePaginationConfig.current,
        pageSize: scriptRulePaginationConfig.pageSize,
        scriptName: scriptRuleForm.scriptName,
        ruleScriptStatus: scriptRuleForm.ruleScriptStatus,
        updatedByName: scriptRuleForm.updatedByName,
        ruleGroupCode: store.state.rule.ruleData.ruleGroupCode
      }
      pageScriptRule(params).then(response => {
            scriptRuleTable.tableData = response.data.data
            scriptRulePaginationConfig.current = response.data.pageNum || 1
            scriptRulePaginationConfig.pageSize = response.data.pageSize
            scriptRulePaginationConfig.total = response.data.totalCount
          }
      )
    }

    //编辑脚本规则
    const editScriptRule = (id) => {
      router.push({
        path: 'scriptRuleDetail',
        query: {
          scriptRuleId: id,
          scene: 'update'
        }
      })
    }


    //修改脚本规则发布状态
    const batchPublishScriptRule = () => {
      const params = {
        list: selectedRuleLayoutIds,
        ruleScriptStatus: "PUBLISHED"
      }
      updateScriptRuleStatus(params);
      getPageScriptRuleData()
    }

    const batchDisPublishScriptRule = () => {
      const params = {
        list: selectedRuleLayoutIds,
        ruleScriptStatus: "UNPUBLISHED"
      }
      updateScriptRuleStatus(params);
      getPageScriptRuleData()
    }

    onMounted(() => {
      getPageScriptRuleData()
    })


    let testVisible = ref(false);
    let scriptCodeRef = ref('');
    let getScriptParam = async () => {
      const res = await scriptRuleParam({
        ruleGroupCode: store.state.rule.ruleData.ruleGroupCode,
        ruleLayoutCode: scriptCodeRef.value,
        // ruleGroupCode: "FFyX88RJ",
        // ruleLayoutCode: "20220406183002"
      });
      if(res.data.code !== '0'){
        ElMessage.error(res.data.message);
        return;
      }
      return JSON.parse(res.data.data);
    }
    let testScript = async (param) => {
      const res = await scriptRuleTest(param);
      if(res.data.code !== '0'){
        return res.data
      }
      return res.data.data;
    }
    let testScriptRule = (scriptCode) => {
      testVisible.value = true;
      scriptCodeRef.value = scriptCode;
    }

    const handleCancel = () => {
      testVisible.value = false;
    };
    return {
      handleCancel,
      handleSizeChange,
      handleCurrentChange,
      scriptRuleTable,
      scriptRuleForm,
      resetForm,
      handleSelectionChange,
      inputScriptRule,
      scriptRulePaginationConfig,
      batchPublishScriptRule,
      search,
      editScriptRule,
      batchDisPublishScriptRule,
      testScriptRule,
      selectedRuleLayoutIds,
      scriptRuleDetailBtn,
      testVisible,
      getScriptParam,
      testScript
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

.table-title-box {
  margin: 21px 24px 22px 21px;
}

.demo-pagination-block {
  margin-top: 10px;
  float: right;
}
</style>
