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
        <el-form-item label="对象名称：" prop="name">
          <el-input v-model="entityObjectForm.form.ObjectName" style="width: 400px;height: 30px"
                    :disabled="scene === 'preview'"></el-input>
        </el-form-item>
        <el-form-item label="对象代码：" prop="code">
          <el-input v-model="entityObjectForm.form.ObjectCode" style="width: 400px;height: 30px"
                    :disabled="scene === 'preview'"></el-input>
        </el-form-item>
        <el-form-item label="对象描述：" prop="des">
          <el-input v-model="entityObjectForm.form.ObjectName" style="width: 400px;height: 30px"
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
          <el-input v-model="updateEntityObjectTable.tableData.newObjectCode" v-if="scene === 'update'">
          </el-input>
        </el-table-column>
        <el-table-column
            prop="objectFieldType"
            label="对象字段类型"
            min-width="100%">
          <el-select v-model="updateEntityObjectTable.tableData.objectFieldType" v-if="scene === 'update'">
            <el-option
                label="String"
                value="String"
            >
            </el-option>
            <el-option
                label="Integer"
                value="Integer"
            >
            </el-option>
          </el-select>
        </el-table-column>
        <el-table-column
            prop="ruleValueType"
            label="规则取值类型"
            min-width="100%">
          <el-select v-model="updateEntityObjectTable.tableData.ruleValueType" style="width: 100%;" v-if="scene === 'update'">
            <el-option
                label="枚举型"
                value="枚举型"
            >
            </el-option>
            <el-option
                label="百分比"
                value="百分比"
            >
            </el-option>
            <el-option
                label="数值型"
                value="数值型"
            >
            </el-option>
          </el-select>
        </el-table-column>
        <el-table-column
            prop="objectFieldEnumeration"
            label="对象字段枚举值（用分号隔开）"
            min-width="200%">
          <el-input v-model="updateEntityObjectTable.tableData.objectFieldEnumeration" v-if="scene === 'update'">
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

export default {
  name: "index.vue",
  setup() {
    const router = useRouter()
    const route = useRoute()
    //新建实体对象表格对象
    const updateEntityObjectTable = reactive({
      tableData: [{
        fieldName: '',
        objectFieldCode: '',
        objectFieldType:'',
        ruleValueType:'',
        objectFieldEnumeration:''
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
      ObjectDescription: [
        {
          required: true,
          message: 'Please input rule name',
          trigger: 'blur',
        }
      ]
    })
    const entityObjectForm = reactive({
      ref: 'entityObjectFormRef',
      form:{
        ObjectName:'',
        ObjectCode:'',
        ObjectDescription:''
      }
    })

    const scene = ref('preview');


    onMounted(() => {
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