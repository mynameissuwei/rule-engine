<template>
  <el-container class="container">
    <el-header>
      <span style="float: left">实体对象 - {{ entityObjectForm.form.ObjectName }}</span>
      <el-button v-if="scene==='preview'" type="primary" size="small"
                 class="edit-button" @click="scene = 'update'">编辑
      </el-button>
    </el-header>
    <el-main>
      <el-form :rules="rules" label-position="right" label-width="130px" :model="entityObjectForm.form">
        <el-form-item label="对象名称：" prop="objectName">
          <el-input v-model="entityObjectForm.form.objectName" style="width: 400px;height: 30px"
                    maxlength="50"
                    show-word-limit
                    :disabled="scene === 'preview'"></el-input>
        </el-form-item>
        <el-form-item label="对象代码：" prop="objectCode">
          <el-input v-model="entityObjectForm.form.objectCode" style="width: 400px;height: 30px"
                    maxlength="50"
                    show-word-limit
                    :disabled="scene === 'preview'"></el-input>
        </el-form-item>
        <el-form-item label="对象描述：" prop="objectDesc">
          <el-input v-model="entityObjectForm.form.objectDesc" style="width: 400px;height: 30px"
                    maxlength="50"
                    show-word-limit
                    :disabled="scene === 'preview'"></el-input>
        </el-form-item>
        <el-form-item label="对象下字段" prop="newEntityObjectTable">
        </el-form-item>
      </el-form>
      <div>
        <el-button :disabled="scene === 'preview'" type="primary" style="float: right;"
                   @click="addEntityObjectTable">添加行
        </el-button>
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
          <template #default="scope">
            <el-input :disabled="scene === 'preview'"
                      v-model="updateEntityObjectTable.tableData[scope.row.index].fieldName">
            </el-input>
          </template>
        </el-table-column>
        <el-table-column
            prop="fieldCode"
            label="对象字段代码"
            min-width="100%">
          <template #default="scope">
            <el-input :disabled="scene === 'preview'"
                      v-model="updateEntityObjectTable.tableData[scope.row.index].fieldCode">
            </el-input>
          </template>
        </el-table-column>
        <el-table-column
            align="center"
            prop="fieldType"
            label="对象字段类型"
            min-width="100%">
          <template #default="scope">
            <el-select :disabled="scene === 'preview'"
                       v-model="updateEntityObjectTable.tableData[scope.row.index].fieldType">
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
            <el-input :disabled="scene === 'preview'"
                      v-model="updateEntityObjectTable.tableData[scope.row.index].fieldEnum">
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
  </el-container>
  <el-footer class="footerContainer" v-if="scene === 'update'">
    <el-button-group>
      <el-button type="primary" size="small" @click="addOrUpdateEntityObjectBtn">保存</el-button>
      <el-button size="small" plain @click="cancel" style="margin: 0px 20px">取消
      </el-button>
    </el-button-group>
  </el-footer>
</template>

<script>
import {onMounted, reactive, ref} from "vue";
import {useRoute, useRouter} from "vue-router";
import {addOrUpdateEntityObject, checkEntityObjectDetail} from "@/api/entityObject";
import {useStore} from "vuex";
import {ElMessage} from "@enn/element-plus";

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
      objectName: [
        {required: true, message: "请输入实体对象名称", trigger: "blur"},
        {
          pattern: /^[a-zA-Z0-9\u4e00-\u9fa5]+$/,
          message: "只能输入中文、数字、英文",
          trigger: "blur",
        },
      ],
      objectCode: [
        {
          required: true,
          message: 'Please input rule name',
          trigger: 'blur',
        }, {
          pattern: /^[a-zA-Z0-9\u4e00-\u9fa5]+$/,
          message: "只能输入中文、数字、英文",
          trigger: "blur",
        },
      ],
      newEntityObjectTable: [
        {
          required: true,
          trigger: 'blur',
        }
      ]
    })
    const entityObjectForm = reactive({
      form: {
        objectName: '',
        objectCode: '',
        objectDesc: ''
      }
    })

    //添加行
    function addEntityObjectTable() {
      updateEntityObjectTable.tableData.push({
        index: updateEntityObjectTable.tableData.length,
        fieldName: '',
        fieldCode: '',
        fieldType: '',
        fieldEnum: ''
      })
    }

    const scene = ref('preview');

    const getEntityObjectDataById = () => {
      let scene = route.query.scene
      let count = 0;
      let id = route.query.entityObjectId
      checkEntityObjectDetail(id).then(response => {
        entityObjectForm.form.objectName = response.data.data.objectName
        entityObjectForm.form.objectCode = response.data.data.objectCode
        entityObjectForm.form.objectDesc = response.data.data.objectDesc
        updateEntityObjectTable.tableData = response.data.data.ruleObjectFieldResVoList.map(field => {
          field.index = count++;
          return field
        })
      })
    }
    const handleDelete = (index) => {
      updateEntityObjectTable.tableData.splice(index, 1)
    }

    const addOrUpdateEntityObjectBtn = () => {
      let requestBody = {
        id: route.query.entityObjectId,
        objectCode: entityObjectForm.form.objectCode,
        objectDesc: entityObjectForm.form.objectDesc,
        objectName: entityObjectForm.form.objectName,
        ruleGroupCode: store.state.rule.ruleData.ruleGroupCode,
        ruleObjectFieldReqVoList: updateEntityObjectTable.tableData
      }
      addOrUpdateEntityObject(requestBody).then((response) => {
        if (response.data.code !== '0') {
          ElMessage.error(response.data.message)
          return;
        }
        ElMessage({
          message: '更新实体对象成功',
          type: 'success',
        })
        router.push({
          path: 'home'
        })
      })
    }

    const cancel = () => {
      router.push({
        path: 'home',
      })
    }

    onMounted(() => {
          getEntityObjectDataById()
          scene.value = route.query.scene;
        }
    )
    return {
      scene,
      entityObjectForm,
      rules,
      updateEntityObjectTable,
      handleDelete,
      addOrUpdateEntityObjectBtn,
      cancel,
      addEntityObjectTable
    }
  }
}
</script>

<style scoped lang="scss">
.container {
  height: calc(100vh - 50px);
}

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
  height: 700px
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