<template>
  <div class="container">
    <div style="margin: 50px 200px">
      <!--新建规则库表单-->
      <el-form
          ref="inputScriptRuleFormRef"
          :label-position="right"
          label-width="100px"
          :model="inputScriptRuleForm.form"
          size="large"
          :rules="rules"
      >
        <el-form-item label="规则名称:" prop="scriptName">
          <el-input
              v-model="inputScriptRuleForm.form.scriptName"
              placeholder="请输入"
              show-word-limit
              maxlength="20"
              style="width: 800px;margin-left: 20px">
          </el-input>
        </el-form-item>
        <!--        <el-form-item label="规则库代码:" prop="ruleGroupCode">-->
        <!--          <el-input-->
        <!--              v-model="inputScriptRuleForm.form.ruleGroupCode"-->
        <!--              placeholder="请输入"-->
        <!--              show-word-limit-->
        <!--              maxlength="20"-->
        <!--              style="width: 800px;margin-left: 20px">-->
        <!--          </el-input>-->
        <!--        </el-form-item>-->
        <!--        <el-form-item label="规则code:" prop="scriptCode">
                  <el-input
                      v-model="inputScriptRuleForm.form.scriptCode"
                      placeholder="纯英文格式，区分大小写"
                      show-word-limit
                      maxlength="50"
                      style="width: 500px;margin-left: 20px;">
                  </el-input>
                  <span style="margin-left: 10px;color: #4a9ff9" @click="handleRandomRuleLayoutCode">随机生成</span>
                </el-form-item>-->
        <el-form-item label="程序类型：" prop="programType">
          <el-select model-value="GROOVY" placeholder="请选择" :disabled="scene === 'preview'" style="margin-left: 20px">

            <el-option
                label="GROOVY"
                value="GROOVY"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="使用场景描述:" prop="sceneDesc">
          <el-input
              v-model="inputScriptRuleForm.form.sceneDesc"
              placeholder="请输入"
              show-word-limit
              maxlength="20"
              style="width: 800px;margin-left: 20px">
          </el-input>
        </el-form-item>
        <el-form-item label="代码片段:" prop="scriptContent">
          <code-block ref="codeBlock" :script-content="inputScriptRuleForm.form.scriptContent"
                      style="margin-left: 20px"></code-block>
        </el-form-item>
      </el-form>
    </div>
  </div>
  <el-footer class="footerContainer">
    <el-button-group>
      <el-button type="primary" size="small" @click="addScriptRuleBtn()">确认</el-button>
      <el-button size="small" plain @click="cancelAddScriptRule" style="margin: 0px 20px">取消
      </el-button>
    </el-button-group>
  </el-footer>
</template>

<script>
import {reactive, onMounted, ref} from "vue";
import {useRoute, useRouter} from 'vue-router';
import {addScriptRule} from "@/api/scriptRule";
import {Base64} from "js-base64";
import {randomRuleLayoutCode} from "@/api/ruleLayout";
import CodeBlock from "views/ScriptRule/CodeBlock/index.vue";
import {useStore} from "vuex";
import {ElMessage} from "@enn/element-plus";

export default {
  name: "index.vue",
  components: {CodeBlock},
  setup() {
    const inputScriptRuleFormRef = ref("")
    const store = useStore();
    const router = useRouter();
    const rules = {
      scriptName: [
        {required: true, message: "请输入规则名称", trigger: "blur"},
        {
          pattern: /^[a-zA-Z0-9\u4e00-\u9fa5]+$/,
          message: "只能输入中文、数字、英文",
          trigger: "blur",
        },
      ],
      ruleGroupCode: [{required: true, message: "请输入规则库名称", trigger: "blur"}],
    };

    const route = useRoute();
    onMounted(() => {
      inputScriptRuleForm.form.ruleGroupCode = store.state.rule.ruleData.ruleGroupCode;
    })

    //新建规则库表单对象
    const inputScriptRuleForm = reactive({
      form: {
        scriptName: '',
        ruleGroupCode: '',
        scriptCode: '',
        programType: '',
        sceneDesc: '',
        scriptContent: ''
      }
    })
    //新增修改脚本规则
    let codeBlock = ref();
    function addScriptRuleBtn () {
          let scriptParam = codeBlock.value.getScriptParam();
          let scriptContent = codeBlock.value.getScriptContent();
          let requestBody = {
            programType: 1,
            ruleGroupCode: inputScriptRuleForm.form.ruleGroupCode,
            sceneDesc: inputScriptRuleForm.form.sceneDesc,
            scriptCode: inputScriptRuleForm.form.scriptCode,
            scriptContent: Base64.encode(scriptContent),
            scriptName: inputScriptRuleForm.form.scriptName,
            ruleScriptStatus: "UNPUBLISHED",
            exampleValue: JSON.stringify(scriptParam)
          }
          if (requestBody.scriptName === "") {
            ElMessage.info("脚本规则名不能为空");
            return
          }
          if (requestBody.scriptContent === "") {
            ElMessage.info("脚本规则代码片段不能为空");
            return
          }
          addScriptRule(requestBody).then(res => {
            if (res.data.code !== '0') {
              ElMessage({
                type: 'warning',
                message: res.data.message
              });
              return
            }
            ElMessage({
              type: "success",
              message: "新建脚本规则成功",
            });
            router.push({
              path: "home",
              query: {
                tab: "scriptRule"
              }
            })
          })
    }

    const ruleGroupCode = store.state.rule.ruleData.ruleGroupCode
    /*    const handleRandomRuleLayoutCode = () => {
          randomRuleLayoutCode(ruleGroupCode).then(res => {
            inputScriptRuleForm.form.scriptCode = res.data.data
          })
        }*/

    const cancelAddScriptRule = () => {
      router.push({
        path: "home",
        query: {
          tab:"scriptRule"
        }
      })
    }

    return {
      inputScriptRuleForm,
      addScriptRuleBtn,
      //handleRandomRuleLayoutCode,
      rules,
      cancelAddScriptRule,
      codeBlock,
      inputScriptRuleFormRef
    }
  }
}
</script>

<style scoped lang="scss">
.container {
  height: calc(100vh - 100px);
}

.el-header,
.el-footer {
  background-color: #FFFFFF;
  color: var(--el-text-color-primary);
  text-align: center;
  line-height: 60px;
}
</style>
