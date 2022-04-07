<template>
  <el-container>
    <el-header>
      <span style="float: left">脚本规则 - {{ ScriptRuleFormDetailForm.form.scriptName }}</span>
      <el-button v-if="scene==='preview'" type="primary" size="small"
                 class="edit-button" @click="scene = 'update'">编辑
      </el-button>
    </el-header>
    <el-main>
      <el-form :rules="rules" label-position="right" label-width="130px">
        <el-form-item label="脚本规则名称：" prop="name">{{ ScriptRuleFormDetailForm.form.scriptName }}</el-form-item>
        <el-form-item label="规则库名称：" prop="name">{{ ScriptRuleFormDetailForm.form.ruleGroupCode }}</el-form-item>
        <el-form-item label="脚本规则代码：" prop="code">{{ ScriptRuleFormDetailForm.form.scriptCode }}</el-form-item>
        <el-form-item label="程序类型：">
          <el-select model-value="GROOVY" placeholder="请选择" :disabled="scene === 'preview'">
            <el-option
                label="GROOVY"
                value="GROOVY"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="使用场景描述：">
          <el-input v-model="ScriptRuleFormDetailForm.form.sceneDesc" style="width: 400px;height: 30px"
                    :disabled="scene === 'preview'"></el-input>
        </el-form-item>
        <el-form-item label="代码片段：">
          <el-input v-model="ScriptRuleFormDetailForm.form.scriptContent" style="width: 400px;height: 30px"
                    :disabled="scene === 'preview'"
                    show-word-limit
                    maxlength="300000"
                    type="textarea"
          ></el-input>
        </el-form-item>
      </el-form>
    </el-main>
    <el-footer v-if="scene === 'update'">
      <el-button type="primary" size="small" @click="updateScriptRule">保存</el-button>
      <el-button type="primary" size="small" plain @click="scene = 'preview'">取消</el-button>
    </el-footer>
  </el-container>
</template>

<script>
import {onMounted, reactive, ref} from "vue";
import {useRoute, useRouter} from "vue-router";
import {queryScriptRuleById, updateScriptRuleById} from "@/api/scriptRule";
import {ElMessage} from "@enn/element-plus";
import router from "@/router";
import {Base64} from "js-base64";

export default {
  name: "index.vue",
  setup() {
    const router = useRouter()
    const route = useRoute()
    const ScriptRuleFormDetailForm = reactive({
          form: {
            scriptName: '',
            ruleGroupCode: '',
            scriptCode: '',
            programType: '',
            sceneDesc: '',
            scriptContent: ''
          }
        }
    )
    const rules = reactive({
      scriptName: [
        {
          required: true,
          message: 'Please input rule name',
          trigger: 'blur',
        }
      ],
      ruleGroupCode: [
        {
          required: true,
          message: 'Please input rule name',
          trigger: 'blur',
        }
      ],
      scriptCode: [
        {
          required: true,
          message: 'Please input rule name',
          trigger: 'blur',
        }
      ]
    })

    const getScriptRuleDataById = () => {
      let id = route.query.scriptRuleId
      queryScriptRuleById(id).then(response => {
        ScriptRuleFormDetailForm.form.scriptName = response.data.data.scriptName
        ScriptRuleFormDetailForm.form.scriptCode = response.data.data.scriptCode
        ScriptRuleFormDetailForm.form.ruleGroupCode = response.data.data.ruleGroupCode
        ScriptRuleFormDetailForm.form.sceneDesc = response.data.data.sceneDesc
        ScriptRuleFormDetailForm.form.programType = response.data.data.programType
        ScriptRuleFormDetailForm.form.scriptContent = response.data.data.scriptContent
      })
    }

    const scene = ref('preview');

    const ruleGroupCode = route.query.ruleGroupCode
    const ruleGroupName = route.query.ruleGroupName
    const ruleGroupDesc = route.query.ruleGroupDesc

    onMounted(() => {
          getScriptRuleDataById()
        }
    )

    const updateScriptRule = () => {
      let requestBody = {
        id:route.query.scriptRuleId,
        programType: ScriptRuleFormDetailForm.form.programType,
        sceneDesc: ScriptRuleFormDetailForm.form.sceneDesc,
        scriptCode: ScriptRuleFormDetailForm.form.scriptCode,
        scriptContent: Base64.encode(ScriptRuleFormDetailForm.form.scriptContent),
        scriptName: ScriptRuleFormDetailForm.form.scriptName
      }
      updateScriptRuleById(requestBody).then(response => {
        console.log(response,30)
        if (response.data.code !== '0') {
          ElMessage.error(response.data.message)
          return;
        }
          ElMessage({
            message: '更新脚本规则成功',
            type: 'success',
          })
        router.push({
          path: 'home',
          query: {
            ruleGroupCode: ruleGroupCode,
            ruleGroupName: ruleGroupName,
            ruleGroupDesc: ruleGroupDesc
          }
        })

    })}

    return {
      rules,
      ScriptRuleFormDetailForm,
      scene,
      updateScriptRule
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
  margin: 15px
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
