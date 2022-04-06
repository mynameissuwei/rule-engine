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
          <el-input
              v-model="scriptRuleForm.ruleScriptStatus"
              placeholder="状态"
              clearable>
          </el-input>
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
              @click="resetInput">
            重置
          </el-button>
        </el-col>
      </el-row>
    </el-form>
    <el-divider></el-divider>
    <el-row class="row-container">
      <el-col :span="12">脚本规则 （5）</el-col>
      <el-col :span="12" class="right">
        <el-button-group>
          <el-button type="primary" size="small" @click="inputScriptRule">新建</el-button>
          <el-button class="stop" size="small">停用</el-button>
          <el-button class="publish" size="small">发布</el-button>
        </el-button-group>
      </el-col>
    </el-row>
    <!--脚本规则表-->
    <el-table
        ref="entityObjectTable"
        :data="scriptRuleTable.tableData"
        style="margin-top: 10px;width: 100%;align:center" height="400px"
        @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55"/>
      <el-table-column property="scriptCode" label="脚本规则代码" min-width="100%"></el-table-column>
      <el-table-column property="scriptName" label="脚本规则名称" min-width="100%"></el-table-column>
      <el-table-column property="ruleScriptStatus" label="发布状态" min-width="100%">
        <template #default="scope">
          <span v-if="scope.row.ruleScriptStatus === 'UNPUBLISHED'">未发布</span>
          <span v-if="scope.row.ruleScriptStatus === 'PUBLISHED'">发布</span>
        </template>
      </el-table-column>
      <el-table-column prop="updatedByName" label="最后修改人" min-width="100%"></el-table-column>
      <el-table-column prop="updatedDate" label="最后修改时间" min-width="100%"></el-table-column>
      <el-table-column label="操作" min-width="100%" align="center">
        <template #default="scope">
          <el-button
              type="text"
              icon="el-icon-edit"
              @click="Edit(scope.$index, scope.row)"
          >编辑
          </el-button>
          <el-button
              type="text"
              icon="el-icon-delete"
              class="red"
              @click="Test(scope.$index, scope.row)"
          >测试
          </el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <div class="demo-pagination-block">
      <div class="entityObject_pagination_box">
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
  </div>
</template>

<script>
import {onMounted, reactive, ref} from "vue";
import {useRoute, useRouter} from "vue-router";
import {pageScriptRule} from "@/api/scriptRule";

export default {
  name: "index.vue",
  setup() {
    const route = useRoute();
    const router = useRouter();
    const scriptRuleForm = reactive({
      scriptName: '',
      updatedByName: '',
      ruleScriptStatus: ''
    })
    const scriptRuleTable = reactive({
      tableData: [],

    })
    //脚本规则分页对象
    let scriptRulePaginationConfig = reactive({
      pageSize: 10,
      total: 0,
      pageSizes: [10, 20, 30, 40],
      current: 1
    })
    //跳转脚本规则录入页面
    const inputScriptRule = () => {
      router.push('inputScriptRule')
    }
    const resetForm = (ruleForm) => {
      ruleForm.resetForm()
    }

    const handleSizeChange = (val) => {
      console.log(`${val} items per page`)
    }
    const handleCurrentChange = (val) => {
      console.log(`current page: ${val}`)
    }
    const handleSelectionChange = () => {
    }

    //分页查询脚本规则
    function getPageScriptRuleData() {
      const params = {
        pageNum: scriptRulePaginationConfig.current,
        pageSize: scriptRulePaginationConfig.pageSize,
        ruleGroupCode: route.query.code,
      }
      pageScriptRule(params).then(response => {
            console.log(response, 11)
            console.log(params, 13)
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
        updatedByName: scriptRuleForm.updatedByName
      }
      pageScriptRule(params).then(response => {
            console.log(response, 11)
            console.log(params, 13)
            scriptRuleTable.tableData = response.data.data
            scriptRulePaginationConfig.current = response.data.pageNum || 1
            scriptRulePaginationConfig.pageSize = response.data.pageSize
            scriptRulePaginationConfig.total = response.data.totalCount
          }
      )
    }


    onMounted(() => {
      getPageScriptRuleData()
    })


    return {
      handleSizeChange,
      handleCurrentChange,
      scriptRuleTable,
      scriptRuleForm,
      resetForm,
      handleSelectionChange,
      inputScriptRule,
      scriptRulePaginationConfig,
      getPageScriptRuleData,
      search
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

.table-title-box {
  margin: 21px 24px 22px 21px;
}

.demo-pagination-block {
  margin-top: 10px;
  float: right;
}
</style>