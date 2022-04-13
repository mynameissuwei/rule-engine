<template>
  <div class="container" style="height: 90%">
    <div style="margin: 50px 100px">
      <el-form
          :ref="newEntityObjectForm.ref"
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
            <el-button
                type="text"
                @click="randomObjectCode">
              随机生成
            </el-button>
          </div>
        </el-form-item>
        <el-form-item label="对象描述:" prop="newObjectDescription">
          <el-input
              v-model="newEntityObjectForm.form.newObjectDescription"
              placeholder="请输入"
              show-word-limit
              maxlength="300"
              type="textarea"
              :autosize="{ minRows: 5 }"
              style="width: 800px;margin-left: 20px">
          </el-input>
        </el-form-item>
          <el-form-item label="对象下字段" prop="newEntityObjectTable">
            <el-button type="primary" style="float: right">添加行</el-button>
          </el-form-item>
      </el-form>
    </div>

    <el-table
        :ref="newEntityObjectTable.ref"
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
        <el-input v-model="newEntityObjectTable.tableData.fieldName">
        </el-input>
      </el-table-column>
      <el-table-column
          prop="objectFieldCode"
          label="对象字段代码"
          min-width="100%">
      </el-table-column>
      <el-table-column
          prop="objectFieldType"
          label="对象字段类型"
          min-width="100%">
      </el-table-column>
      <el-table-column
          prop="ruleValueType"
          label="规则取值类型"
          min-width="200%">
      </el-table-column>
      <el-table-column
          prop="objectFieldEnumeration"
          label="对象字段枚举值（用分号隔开）"
          min-width="200%">
      </el-table-column>
      <el-table-column
          fixed="right"
          label="操作"
          width=200%>
        <template #default="scope">
          <el-button
              type="text"
              size="medium"
              @click="delete(scope.row.id)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination_box">
      <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="newEntityObjectPaginationConfig.current"
          :page-sizes="newEntityObjectPaginationConfig.pageSizes"
          :page-size="newEntityObjectPaginationConfig.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="newEntityObjectPaginationConfig.total"
      >
      </el-pagination>
    </div>
    <el-button type="primary" size="small" @click="">保存</el-button>
    <el-button type="primary" size="small" plain @click="">取消</el-button>
  </div>
</template>

<script>
import {reactive} from "vue";

export default {
  name: "index.vue",
  setup() {
    //新建实体对象表单对象
    const newEntityObjectForm = reactive({
      ref: "newEntityObjectFormRef",
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
        fieldName: '',
        columnName: '',
      }
      ]
    })
    //新建实体对象分页对象
    let newEntityObjectPaginationConfig = reactive({
      pageSize: 10,
      total: 0,
      pageSizes: [10, 20, 30, 40],
      current: 1
    })
    //实体对象表单校验
    const rules = reactive({
      newObjectName: [
        {
          required: true,
          message: 'Please input Object name',
          trigger: 'blur',
        }
      ],
      newObjectCode: [
        {
          required: true,
          message: 'Please input object code',
          trigger: 'blur',
        }
      ],
      newObjectDescription: [
        {
          required: true,
          message: 'Please input Object description',
          trigger: 'blur',
        }
      ],
      newEntityObjectTable: [
        {
          required: true,
          trigger: 'blur',
        }
      ]
    })
    const randomObjectCode = () => {
      let expect = 10;
      let str = Math.random().toString(36).substring(2);
      while (str.length < expect) {
        str = Math.random().toString(36).substring(2)
      }
      return newEntityObjectForm.form.newObjectCode = str;
    }
    return {
      newEntityObjectForm,
      newEntityObjectTable,
      newEntityObjectPaginationConfig,
      rules,
      randomObjectCode,
    }
  }
}
</script>

<style scoped lang="scss">

</style>