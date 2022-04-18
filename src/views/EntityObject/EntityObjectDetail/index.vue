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
        <el-form-item label="对象下字段" prop="newEntityObjectTable" >
        </el-form-item>
      </el-form>
      <div>
        <el-button :disabled="scene === 'preview'" type="primary" style="float: right;" @click="addNewEntityObjectTable">添加行</el-button>
      </div>
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
          <template #default="scope" >
            <el-input :disabled="scene === 'preview'" v-model="updateEntityObjectTable.tableData[scope.row.index].fieldName">
            </el-input>
          </template>
        </el-table-column>
        <el-table-column
            prop="fieldCode"
            label="对象字段代码"
            min-width="100%">
          <template #default="scope" >
            <el-input :disabled="scene === 'preview'" v-model="updateEntityObjectTable.tableData[scope.row.index].fieldCode">
            </el-input>
          </template>
        </el-table-column>
        <el-table-column
            align="center"
            prop="fieldType"
            label="对象字段类型"
            min-width="100%">
          <template #default="scope" >
            <el-select :disabled="scene === 'preview'" v-model="updateEntityObjectTable.tableData[scope.row.index].fieldType">
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
          </template>
        </el-table-column>
        <el-table-column
            prop="objectFieldEnumeration"
            label="对象字段枚举值（用分号隔开）"
            min-width="200%">
          <template #default="scope" >
            <el-input :disabled="scene === 'preview'" v-model="updateEntityObjectTable.tableData[scope.row.index].fieldEnum">
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
                :disabled="scene === 'preview'"
                @click="handleDelete(scope.row.index)"
            >删除
            </el-button
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
import {useStore} from "vuex";

export default {
  name: "index.vue",
  setup() {
    const store = useStore();
    const router = useRouter()
    const route = useRoute()
    const updateEntityObjectTable = reactive({
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
      ],
      newEntityObjectTable: [
        {
          required: true,
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

    const getEntityObjectDataById = (scope) => {
      let id = route.query.entityObjectId
      checkEntityObjectDetail(id).then(response => {
        entityObjectForm.form.ObjectName = response.data.data.objectName
        entityObjectForm.form.ObjectCode = response.data.data.objectCode
        entityObjectForm.form.ObjectDesc = response.data.data.objectDesc

      })
    }
    const handleDelete = (index) => {
      updateEntityObjectTable.tableData.splice(index)
    }

    onMounted(() => {
      getEntityObjectDataById()
        }
    )
    return{
      scene,
      entityObjectForm,
      rules,
      updateEntityObjectTable,
      handleDelete
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