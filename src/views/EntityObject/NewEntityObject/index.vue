<template>
  <div class="container">
    <div style="margin: 50px 100px">
      <el-form
          ref="newEntityObjectFormRef"
          :label-position="right"
          label-width="100px"
          :model="newEntityObjectForm.form"
          :rules="rules"
          size="large"
      >
        <el-form-item label="对象名称:" prop="newObjectName">
          <el-input
              v-model="newEntityObjectForm.form.newObjectName"
              placeholder="请输入"
              show-word-limit
              maxlength="20"
              style="width: 800px;margin-left: 20px">
          </el-input>
        </el-form-item>
        <el-form-item label="对象代码:" prop="newObjectCode">
          <div>
            <el-input
                v-model="newEntityObjectForm.form.newObjectCode"
                placeholder="纯英文格式，区分大小写"
                show-word-limit
                maxlength="20"
                style="width: 800px;margin-left: 20px;margin-right: 10px">
            </el-input>
          </div>
        </el-form-item>
        <el-form-item label="对象描述:" prop="newObjectDescription">
          <el-input
              v-model="newEntityObjectForm.form.newObjectDescription"
              placeholder="请输入"
              show-word-limit
              maxlength="100"
              type="textarea"
              :autosize="{ minRows: 5 }"
              style="width: 800px;margin-left: 20px">
          </el-input>
        </el-form-item>
        <el-form-item label="对象下字段" prop="newEntityObjectTable">
        </el-form-item>
      </el-form>
    </div>
    <div>
      <el-button type="primary" style="float: right;" @click="addNewEntityObjectTable">添加行</el-button>
    </div>

    <el-table
        :data="newEntityObjectTable.tableData"
        style="width: 100%"
        size="max"
        :header-cell-style="{'text-align': 'center'}"
        height="300px"
    >
      <el-table-column
          prop="fieldName"
          label="字段名称"
          min-width="100%">
        <template #default="scope">
          <el-input v-model="newEntityObjectTable.tableData[scope.row.index].fieldName">
          </el-input>
        </template>
      </el-table-column>
      <el-table-column
          prop="fieldCode"
          label="对象字段代码"
          min-width="100%">
        <template #default="scope">
          <el-input v-model="newEntityObjectTable.tableData[scope.row.index].fieldCode">
          </el-input>
        </template>
      </el-table-column>
      <el-table-column
          align="center"
          prop="fieldType"
          label="对象字段类型"
          min-width="100%">
        <template #default="scope">
          <el-select v-model="newEntityObjectTable.tableData[scope.row.index].fieldType">
            <el-option
                label="String"
                value="java.lang.String"
            >
            </el-option>
            <el-option
                label="Integer"
                value="java.lang.Integer"
            >
            </el-option>
            <el-option
                label="Double"
                value="java.lang.Double"
            >
            </el-option>
            <el-option
                label="BigDecimal"
                value="java.lang.BigDecimal"
            >
            </el-option>
            <el-option
                label="Date"
                value="java.lang.Date"
            >
            </el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column
          prop="objectFieldEnumeration"
          label="对象字段枚举值（用分号隔开）"
          min-width="200%">
        <template #default="scope">
          <el-input v-model="newEntityObjectTable.tableData[scope.row.index].fieldEnum">
          </el-input>
        </template>
      </el-table-column>
      <el-table-column
          align="center"
          label="操作"
          width=100%>
        <template #default="scope">
          <el-button
              size="mini"
              type="danger"
              @click="handleDelete(scope.row.index)"
          >删除
          </el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination_box">
      <!--      <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="newEntityObjectPaginationConfig.current"
                :page-sizes="newEntityObjectPaginationConfig.pageSizes"
                :page-size="newEntityObjectPaginationConfig.pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="newEntityObjectPaginationConfig.total"
            >
            </el-pagination>-->
    </div>
  </div>
  <el-footer class="footerContainer">
    <el-button-group>
      <el-button type="primary" size="small" @click="addEntityObjectBtn">保存</el-button>
      <el-button size="small" plain @click="cancelAdd" style="margin: 0px 20px">取消
      </el-button>
    </el-button-group>
  </el-footer>
</template>

<script>
import {reactive, ref} from "vue";
import {addOrUpdateEntityObject} from "@/api/entityObject";
import {useRoute, useRouter} from "vue-router";
import {ElMessage} from "@enn/element-plus";
import {useStore} from "vuex";

export default {
  name: "index.vue",
  setup() {
    const newEntityObjectFormRef = ref("")
    const store = useStore();
    const router = useRouter()
    const route = useRoute()
    //新建实体对象表单对象
    const newEntityObjectForm = reactive({
      form: {
        newObjectName: '',
        newObjectCode: '',
        newObjectDescription: '',
        newEntityObjectTable: ''
      }
    })
    //新建实体对象表格对象
    const newEntityObjectTable = reactive({
      ref: "newEntityObjectTableRef",
      tableData: [{
        index: 0,
        fieldName: '',
        fieldCode: '',
        fieldType: '',
        fieldEnum: '',
      }
      ]
    })

    //添加行
    function addNewEntityObjectTable() {
      newEntityObjectTable.tableData.push({
        index: newEntityObjectTable.tableData.length,
        fieldName: '',
        fieldCode: '',
        fieldType: '',
        fieldEnum: ''
      })
    }

    /*    //新建实体对象分页对象
        let newEntityObjectPaginationConfig = reactive({
          pageSize: 10,
          total: newEntityObjectTable.tableData.length,
          pageSizes: [10, 20, 30, 40],
          current: 1
        })
        // 分页函数
        function handleSizeChange(pageSize) {
          newEntityObjectPaginationConfig.pageSize = pageSize
        }

        function handleCurrentChange(pageNumber) {
          newEntityObjectPaginationConfig.current = pageNumber
        }*/
    //实体对象表单校验
    const rules = reactive({
      newObjectName: [
        {required: true, message: "请输入实体对象名称", trigger: "blur"},
        {
          pattern: /^[a-zA-Z0-9\u4e00-\u9fa5]+$/,
          message: "只能输入中文、数字、英文",
          trigger: "blur",
        },
      ],
      newObjectCode: [
        {
          required: true,
          message: '请输入实体对象编码',
          trigger: 'blur',
        },
        {
          pattern: /^[a-zA-Z0-9\u4e00-\u9fa5]+$/,
          message: "只能输入中文、数字、英文",
          trigger: "blur",
        },
      ],
      newEntityObjectTable: [
        {
          required: true,
          message: "请填写实体对象字段表",
          trigger: 'blur',
        }
      ]
    })

    function addEntityObjectBtn() {
          let requestBody = {
            objectCode: newEntityObjectForm.form.newObjectCode,
            objectDesc: newEntityObjectForm.form.newObjectDescription,
            objectName: newEntityObjectForm.form.newObjectName,
            ruleGroupCode: store.state.rule.ruleData.ruleGroupCode,
            ruleObjectFieldReqVoList: newEntityObjectTable.tableData
          }
      if (requestBody.objectName === "") {
        ElMessage.info("实体对象名不能为空");
        return
      }
      if (requestBody.objectCode === "") {
        ElMessage.info("实体对象编码");
        return
      }
          addOrUpdateEntityObject(requestBody).then(response => {
            if (response.data.code !== '0') {
              ElMessage.error(response.data.message)
              return;
            }
            ElMessage({
              message: '新建实体对象成功',
              type: 'success',
            })
            router.push({
              path: 'home',
              query:{
              }
            })

          })
    }

    const cancelAdd = () => {
      router.push({
        path: "home",
        query: {
          ...route.query
        }
      })
    }

    const handleDelete = (index) => {
      newEntityObjectTable.tableData.splice(index, 1)
    }
    return {
      newEntityObjectForm,
      newEntityObjectTable,
      //newEntityObjectPaginationConfig,
      rules,
      addNewEntityObjectTable,
      handleDelete,
      addEntityObjectBtn,
      //handleSizeChange,
      //handleCurrentChange,
      cancelAdd,
      newEntityObjectFormRef
    }
  }
}
</script>

<style scoped lang="scss">
.container {
  height: calc(100vh - 100px);
}

.pagination_box {
  margin-top: 10px;
  float: right;
}

.el-header,
.el-footer {
  background-color: #FFFFFF;
  color: var(--el-text-color-primary);
  text-align: center;
  line-height: 60px;
}
</style>