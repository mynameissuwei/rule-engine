<template>
  <div class="container" style="height: 90%">
    <div style="margin: 50px 100px">
      <el-form
          :ref="newEntityObjectForm.ref"
          :label-position="right"
          label-width="100px"
          :model="newEntityObjectForm.form"
          :rules="newEntityObjectForm.rules"
          size="large"
      >
        <el-form-item label="* 对象名称:" prop="newObjectName">
          <el-input
              v-model="newEntityObjectForm.form.newObjectName"
              placeholder="请输入"
              show-word-limit
              maxlength="20"
              style="width: 800px;margin-left: 20px">
          </el-input>
        </el-form-item>
        <el-form-item label="* 对象代码:" prop="newObjectCode">
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
      </el-form>
    </div>
    <div>* 对象下字段
    <el-button type="primary" style="float: right">添加行</el-button>
    </div>

    <el-table
        :ref="newEntityObjectTable.ref"
        :data="newEntityObjectTable.tableData"
        style="width: 100%"
        size="max"
        :header-cell-style="{'text-align': 'center'}"
    >
      <el-table-column
          prop="fieldName"
          label="* 字段名称"
          min-width="100%">
        <el-input v-model="newEntityObjectTable.tableData.fieldName">
        </el-input>
      </el-table-column>
      <el-table-column
          prop="objectFieldCode"
          label="* 对象字段代码"
          min-width="100%">
      </el-table-column>
      <el-table-column
          prop="objectFieldType"
          label="* 对象字段类型"
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
        <template slot-scope="scope">
          <el-button
              class="addBtn"

              type="text"
              size="mini">
            投入资源池
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import {reactive} from "vue";

export default {
  name: "index.vue",
  setup() {
    const newEntityObjectForm = reactive({
      ref: "newEntityObjectFormRef",
      form: {
        newObjectName: '',
        newObjectCode: '',
        newObjectDescription: ''
      }
    })
    const newEntityObjectTable = reactive({
      ref:"newEntityObjectTableRef",
      tableData:[{
        fieldName:'',
        columnName:'',
      }
      ]
    })
    const randomObjectCode = () => {
      let expect=10;
      let str=Math.random().toString(36).substring(2);
      while(str.length<expect){
        str=Math.random().toString(36).substring(2)
      }
      return newEntityObjectForm.form.newObjectCode = str;
    }
    return {
      newEntityObjectForm,
      newEntityObjectTable,
      randomObjectCode
    }
  }
}
</script>

<style scoped lang="scss">

</style>