<template>
  <el-container class="container">
    <el-header>
      <span style="float: left">脚本规则 - {{ ScriptRuleFormDetailForm.form.scriptName }}</span>
      <el-button v-if="scene==='preview'" type="primary" size="small"
                 class="edit-button" @click="scene = 'update'">编辑
      </el-button>
    </el-header>
    <el-main>
      <el-form :rules="rules" label-position="right" label-width="130px">
        <el-form-item label="脚本规则名称：" prop="scriptName">
          <el-input v-model="ScriptRuleFormDetailForm.form.scriptName" style="width: 400px;height: 30px"
                    :disabled="scene === 'preview'"></el-input>
        </el-form-item>
        <el-form-item label="规则库名称：" prop="ruleGroupCode">{{ ScriptRuleFormDetailForm.form.ruleGroupCode }}</el-form-item>
        <el-form-item label="脚本规则代码：" prop="scriptCode">{{ ScriptRuleFormDetailForm.form.scriptCode }}</el-form-item>
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
          <code-block ref="codeBlock"
                      :example-value="exampleValue"
                      :script-content="ScriptRuleFormDetailForm.form.scriptContent"
                      :disabled="scene === 'preview'"></code-block>
        </el-form-item>
      </el-form>
    </el-main>
  </el-container>
  <el-footer class="footerContainer" v-if="scene === 'update'">
    <el-button-group>
      <el-button type="primary" size="small" @click="updateScriptRule">保存</el-button>
      <el-button size="small" plain @click="cancel" style="margin: 0px 20px">取消
      </el-button>
    </el-button-group>
  </el-footer>
</template>

<script>
import {onMounted, reactive, ref} from "vue";
import {useRoute, useRouter} from "vue-router";
import {queryScriptRuleById, updateScriptRuleById} from "@/api/scriptRule";
import {ElMessage} from "@enn/element-plus";
import {Base64} from "js-base64";
import CodeBlock from "views/ScriptRule/CodeBlock/index.vue";

export default {
  name: "index.vue",
  components: {CodeBlock},
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
        { required: true, message: "请输入规则名称", trigger: "blur" },
        {
          pattern: /^[a-zA-Z0-9\u4e00-\u9fa5]+$/,
          message: "只能输入中文、数字、英文",
          trigger: "blur",
        },
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

    let exampleValue = reactive({});
    const getScriptRuleDataById = () => {
      let id = route.query.scriptRuleId;
      queryScriptRuleById(id).then(response => {
        let scriptContent = response.data.data.scriptContent;
        exampleValue = response.data.data.exampleValue;
        ScriptRuleFormDetailForm.form.scriptName = response.data.data.scriptName
        ScriptRuleFormDetailForm.form.scriptCode = response.data.data.scriptCode
        ScriptRuleFormDetailForm.form.ruleGroupCode = response.data.data.ruleGroupCode
        ScriptRuleFormDetailForm.form.sceneDesc = response.data.data.sceneDesc
        ScriptRuleFormDetailForm.form.programType = response.data.data.programType
        ScriptRuleFormDetailForm.form.scriptContent = scriptContent && scriptContent.length > 0 ?
            JSON.stringify(JSON.parse(response.data.data.scriptContent))
            .replaceAll("\"","") : scriptContent;
      })
    }

    const scene = ref('preview');

    onMounted(() => {
          getScriptRuleDataById();
          scene.value = route.query.scene;
        }
    )

    let codeBlock = ref();
    const updateScriptRule = () => {
      let scriptParam = codeBlock.value.getScriptParam();
      let scriptContent = JSON.stringify(codeBlock.value.getScriptContent());
      let requestBody = {
        id: parseInt(route.query.scriptRuleId),
        programType: ScriptRuleFormDetailForm.form.programType,
        sceneDesc: ScriptRuleFormDetailForm.form.sceneDesc,
        scriptCode: ScriptRuleFormDetailForm.form.scriptCode,
        scriptContent: Base64.encode(scriptContent),
        scriptName: ScriptRuleFormDetailForm.form.scriptName,
        exampleValue: JSON.stringify(scriptParam)
      }
      updateScriptRuleById(requestBody).then(response => {
        if (response.data.code !== '0') {
          ElMessage.error(response.data.message)
          return;
        }
        ElMessage({
          message: '更新脚本规则成功',
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
        query: {
          tab: 'ScriptRule'
        },
      })
    }

    return {
      rules,
      ScriptRuleFormDetailForm,
      scene,
      updateScriptRule,
      codeBlock,
      exampleValue,
      cancel
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
  height:550px
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
