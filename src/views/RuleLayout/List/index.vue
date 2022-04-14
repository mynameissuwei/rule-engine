<template>
  <el-card class="box-card" :body-style="{padding: '0px', height:'574px'}">
    <template #header>
      <div class="card-header">

        <el-form>
          <el-row :gutter="24">
            <el-col :span="7">
              <el-form-item>
                <el-input placeholder="脚本规则编排名称" v-model="ruleLayoutQueryForm.name"/>
              </el-form-item>
            </el-col>
            <el-col :span="7">
              <el-form-item>
                <el-input placeholder="最后修改人关键词" v-model="ruleLayoutQueryForm.keyword"/>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item>
                <el-select  placeholder="状态" v-model="ruleLayoutQueryForm.status">
                  <el-option value="PUBLISHED" label="发布"></el-option>
                  <el-option value="UNPUBLISHED" label="未发布"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="4" style="margin-left: auto">
              <el-button type="primary" size="small" @click="searchRuleLayout">查询</el-button>
              <el-button type="primary" size="small" plain @click="resetForm">重置</el-button>
            </el-col>
          </el-row>

        </el-form>
      </div>
    </template>
    <el-row style="margin-top:10px">
      <el-col :span="18" style="margin-left:10px">脚本规则编排（{{pagination.currentPage}}/{{pagination.pageCount}}）</el-col>
      <el-col :span="5" style="margin-left: auto">
        <el-button type="primary" size="small" @click="addRuleLayoutDetail">新建</el-button>
        <el-button type="primary" size="small" plain @click="batchDisableRuleLayout"
                   :disabled="selectedRuleLayoutIds.length===0">停用</el-button>
        <el-button type="primary" size="small" plain @click="batchPublishRuleLayout"
                   :disabled="selectedRuleLayoutIds.length===0">发布</el-button>
      </el-col>
    </el-row>
    <el-table :data="ruleLayoutList" style="margin-top: 10px;width: 100%;align:center" @selection-change="handleSelectionChange" height="400px">
      <el-table-column type="selection" width="55" />
      <el-table-column label="规则编排名称" prop="name">
        <template #default="scope">
          <span style="margin-left: 10px;color: #409EFF" @click="previewRuleLayoutDetail(scope.row.id)">{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="规则编排code" prop="code"></el-table-column>
      <el-table-column label="状态" prop="statusName"></el-table-column>
      <el-table-column label="是否正在使用" prop="isUsing"></el-table-column>
      <el-table-column label="最后修改人" prop="lastModify"></el-table-column>
      <el-table-column label="最后修改时间" prop="lastModifyTime"></el-table-column>
      <el-table-column label="操作" prop="operation">
        <template #default="scope">
          <el-button
              type="text"
              size="small"
              @click.prevent="editRuleLayoutDetail(scope.row.id)"
          >
            编辑
          </el-button>
          <el-button type="text" size="small" @click="publishRuleLayout(scope.row.id)" v-if="scope.row.status !== 'PUBLISHED'">发布</el-button>
          <el-button type="text" size="small" @click="disableRuleLayout(scope.row.id)" v-if="scope.row.status !== 'UNPUBLISHED'">停用</el-button>
          <el-button type="text" size="small" @click="deleteRuleLayout(scope.row.id)">删除</el-button>
          <el-button type="text" size="small" @click="testRuleLayout(scope.row.code)">测试</el-button>

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
  </el-card>

  <RuleTest ref="ruleTest"
            :rule-group-code="testRuleGroupCode"
            :rule-layout-code="testRuleLayoutCode"></RuleTest>


</template>

<script>
import {reactive, onMounted, inject, ref} from 'vue';
import {useRouter,useRoute} from 'vue-router';
import {ElMessage} from "@enn/element-plus";
import { pageRuleLayoutList, changeRuleLayoutStatus, removeRuleLayout } from '@/api/ruleLayout'
import RuleTest from "views/RuleTest/index.vue";
export default {
  name: "RuleLayoutList",
  components: {RuleTest},
  setup(){
    let ruleGroupCode = '';
    onMounted( () => {
      //注入规则集code
      ruleGroupCode = inject('ruleGroupCode').value;
      const params = {
        pageNum: pagination.currentPage,
        pageSize: pagination.pageSize,
        ruleGroupCode: ruleGroupCode,
      }
      pageRuleLayoutList(params).then(res => {
        const data = res.data;
        pagination.pageSize = data.pageSize;
        pagination.currentPage = data.pageNum;
        pagination.total = data.totalCount;
        pagination.pageCount = data.totalPages;
        ruleLayoutList.push(...convertToRuleLayoutList(data.data))
      })
    });

    let RULE_LAYOUT_STATUS = {
      'PUBLISHED': '发布',
      'UNPUBLISHED': '未发布',
    }

    const convertToRuleLayoutList = (data) => {
      if(!data){
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
          lastModifyTime: layout.updatedDate
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
      const params = {
        pageNum: pagination.currentPage,
        pageSize: pagination.pageSize,
        ruleLayoutName: ruleLayoutQueryForm.name,
        updatedByName: ruleLayoutQueryForm.keyword,
        ruleLayoutStatus: ruleLayoutQueryForm.status,
        ruleGroupCode: ruleGroupCode
      }
      pageRuleLayoutList(params).then(res => {
        const data = res.data;
        pagination.pageSize = data.pageSize;
        pagination.currentPage = data.pageNum;
        pagination.total = data.totalCount;
        ruleLayoutList.length = 0;
        ruleLayoutList.push(...convertToRuleLayoutList(data.data));
      })
    }
    const resetForm = () => {
      ruleLayoutQueryForm.name = null;
      ruleLayoutQueryForm.keyword = null;
      ruleLayoutQueryForm.status = null;
      searchRuleLayout();
    }

    const batchDisableRuleLayout = () => {
      const params = {
        list: selectedRuleLayoutIds,
        ruleLayoutStatus: "UNPUBLISHED"
      }
      changeRuleLayoutStatus(params);
      searchRuleLayout();
    }

    const batchPublishRuleLayout = () => {
      const params = {
        list: selectedRuleLayoutIds,
        ruleLayoutStatus: "PUBLISHED"
      }
      changeRuleLayoutStatus(params);
      searchRuleLayout();
    }

    const selectedRuleLayoutIds = reactive([])
    const handleSelectionChange = (layouts) => {
      selectedRuleLayoutIds.length = 0;
      selectedRuleLayoutIds.push(...layouts.map(layout=>layout.id))
    }

    const router = useRouter();
    const previewRuleLayoutDetail = (ruleLayoutId) => {
      router.push({
        path: '/rule-layout/detail',// 跳转到规则编排详情页面
        query: {
          ruleLayoutId: ruleLayoutId,
          ruleGroupCode: ruleGroupCode,
          scene: 'preview',
          ...route.query
        }
      })
    }

    const editRuleLayoutDetail = (ruleLayoutId) => {
      router.push({
        path: '/rule-layout/detail',// 跳转到规则编排详情页面
        query: {
          ruleLayoutId: ruleLayoutId,
          ruleGroupCode: ruleGroupCode,
          scene: 'update',
          ...route.query
        }
      })
    }

    const route = useRoute();

    const addRuleLayoutDetail = (ruleLayoutId) => {
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
      changeRuleLayoutStatus(params);
      searchRuleLayout();
    }

    const disableRuleLayout = (id) => {
      const params = {
        list: [id],
        ruleLayoutStatus: "UNPUBLISHED"
      }
      changeRuleLayoutStatus(params);
      searchRuleLayout();
    }

    const deleteRuleLayout = (id) => {
      removeRuleLayout({id}).then(res => {
        if(res.data.code != "0"){
          ElMessage.error(res.data.message)
        }else{
          searchRuleLayout();
        }
      })
    }

    let testRuleGroupCode = ref('');
    let testRuleLayoutCode = ref('');
    let testRuleLayout = (ruleLayoutCode) => {
      ruleTest.value.showRuleTest();
      testRuleGroupCode.value = ruleLayoutCode;
      testRuleLayoutCode.value = ruleLayoutCode;
    }
    let ruleTest = ref();
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
      testRuleGroupCode,
      ruleTest
    }
  }
}
</script>

<style scoped>

.box-card {
  margin-left: 10px;
}

.el-card.is-always-shadow.box-card {
  margin-right: 10px;
}

.el-table thead {
  font-weight: 500;
  background: #5a5e66 !important;
}
</style>
