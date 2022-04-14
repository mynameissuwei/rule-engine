<template>
  <el-container>
    <el-header>
      <span style="float: left">实体对象 - {{ entityObjectForm.form.ObjectName }}</span>
      <el-button v-if="scene==='preview'" type="primary" size="small"
                 class="edit-button" @click="scene = 'update'">编辑
      </el-button>
    </el-header>
    <el-main>
      <el-form :rules="rules" label-position="right" label-width="130px">
        <el-form-item label="对象名称：" prop="ObjectName">
          <el-input v-model="entityObjectForm.form.ObjectName" style="width: 400px;height: 30px"
                    :disabled="scene === 'preview'"></el-input>
        </el-form-item>
        <el-form-item label="对象代码：" prop="ObjectCode">
          <el-input v-model="entityObjectForm.form.ObjectCode" style="width: 400px;height: 30px"
                    :disabled="scene === 'preview'"></el-input>
        </el-form-item>
        <el-form-item label="对象描述：" prop="ObjectDesc">
          <el-input v-model="entityObjectForm.form.ObjectDesc" style="width: 400px;height: 30px"
                    :disabled="scene === 'preview'"></el-input>
        </el-form-item>
      </el-form>
      <el-table
          :data="updateEntityObjectTable.tableData"
          style="width: 100%"
          size="max"
          :header-cell-style="{'text-align': 'center'}"
          height="300px"
      >
        <el-table-column
            prop="fieldName"
            label="字段名称"
            min-width="100%">
          <el-input v-model="updateEntityObjectTable.tableData.fieldName" v-if="scene === 'update'">
          </el-input>
        </el-table-column>
        <el-table-column
            prop="objectFieldCode"
            label="对象字段代码"
            min-width="100%">
          <el-input v-model="updateEntityObjectTable.tableData.fieldCode" v-if="scene === 'update'">
          </el-input>
        </el-table-column>
        <el-table-column
            prop="objectFieldType"
            label="对象字段类型"
            min-width="100%">
          <el-select v-model="updateEntityObjectTable.tableData.fieldType" v-if="scene === 'update'">
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
          </el-select>
        </el-table-column>
        <el-table-column
            prop="objectFieldEnumeration"
            label="对象字段枚举值（用分号隔开）"
            min-width="200%">
          <el-input v-model="updateEntityObjectTable.tableData.fieldEnum" v-if="scene === 'update'">
          </el-input>
        </el-table-column>
        <el-table-column
            fixed="right"
            label="操作"
            width=200%
        >
          <template #default="scope">
            <el-button
                size="mini"
                type="danger"
                v-if="scene === 'update'"
                @click="handleDelete(scope.$index, scope.row)"
            >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-main>
    <el-footer v-if="scene === 'update'">
      <el-button type="primary" size="small" @click="">保存</el-button>
      <el-button type="primary" size="small" plain @click="scene = 'preview'">取消</el-button>
    </el-footer>
  </el-container>
</template>

<script>
import {onMounted, reactive, ref} from "vue";
import {useRoute, useRouter} from "vue-router";
import {queryScriptRuleById} from "@/api/scriptRule";
import {checkEntityObjectDetail} from "@/api/entityObject";

export default {
  name: "index.vue",
  setup() {
    const router = useRouter()
    const route = useRoute()
    const updateEntityObjectTable = reactive({
      tableData: []
    })
    const rules = reactive({
      ObjectName: [
        {
          required: true,
          message: 'Please input rule name',
          trigger: 'blur',
        }
      ],
      ObjectCode: [
        {
          required: true,
          message: 'Please input rule name',
          trigger: 'blur',
        }
      ],
      ObjectDesc: [
        {
          required: true,
          message: 'Please input rule name',
          trigger: 'blur',
        }
      ]
    })
    const entityObjectForm = reactive({
      form:{
        ObjectName:'',
        ObjectCode:'',
        ObjectDesc:''
      }
    })

    const scene = ref('preview');

    const getEntityObjectDataById = () => {
      let id = route.query.entityObjectId
      checkEntityObjectDetail(id).then(response => {
        entityObjectForm.form.ObjectName = response.data.data.objectName
        entityObjectForm.form.ObjectCode = response.data.data.ObjectCode
        entityObjectForm.form.ObjectDesc = response.data.data.ObjectDesc
        updateEntityObjectTable.tableData = response.data.data.ruleObjectFieldList
        console.log(response,11)

      })
    }

    onMounted(() => {
      getEntityObjectDataById()
        }
    )
    return{
      scene,
      entityObjectForm,
      rules,
      updateEntityObjectTable
    }
  }
}
</script>

<style scoped lang="scss">
.mask {
  width: 1045px;
  height: 600px;
  background-size: 100%;
  background: #FFF;
  opacity: 0.5;
}

.el-header,
.el-footer {
  background-color: #FFFFFF;
  color: var(--el-text-color-primary);
  text-align: center;
  line-height: 60px;
}

.el-main {
  background-color: #FFFFFF;
  color: var(--el-text-color-primary);
  margin: 15px;
  height:700px
}

.edit-button {
  float: right;
  margin-top: 15px;
  margin-bottom: 15px;
  border-radius: 2px;
  width: 74px;
  height: 30px;
}

.form-key {
  font-size: 14px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #646566;
  line-height: 22px;
}

.form-value {
  font-size: 14px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #333333;
  line-height: 22px;
  margin-left: 20px;
}
</style>