<template>
  <div class="container" style="height: 90%">
    <div style="margin: 100px 400px">
      <!--新建规则库表单-->
      <el-form
          :ref="inputScriptRuleForm.ref"
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
        <el-form-item label="规则code:" prop="scriptCode">
          <el-input
              v-model="inputScriptRuleForm.form.scriptCode"
              placeholder="纯英文格式，区分大小写"
              show-word-limit
              maxlength="50"
              style="width: 500px;margin-left: 20px;">
          </el-input>
          <span style="margin-left: 10px;color: #4a9ff9" @click="handleRandomRuleLayoutCode">随机生成</span>
        </el-form-item>
        <el-form-item label="程序类型：" prop="programType">
          <el-select model-value="GROOVY" placeholder="请选择" :disabled="scene === 'preview'"  style="margin-left: 20px">

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
        <el-form-item label="脚本代码:" prop="scriptContent">
          <code-block ref="codeBlock" :script-content="inputScriptRuleForm.form.scriptContent" style="margin-left: 20px"></code-block>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" style="margin: 20px" @click="addScriptRuleBtn">确认</el-button>
          <el-button @click="cancelAddScriptRule">取消</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import {reactive, onMounted, ref} from "vue";
import {useRoute, useRouter} from 'vue-router';
import {addScriptRule} from "../../../api/scriptRule";
import {Base64} from "js-base64";
import {randomRuleLayoutCode} from "@/api/ruleLayout";
import CodeBlock from "views/ScriptRule/CodeBlock/index.vue";
import {useStore} from "vuex";

export default {
  name: "index.vue",
  components: {CodeBlock},
  setup() {
    const store = useStore();
    const router = useRouter();
    const rules = {
      scriptName: [{ required: true, message: "请输入规则名称", trigger: "blur" }],
      ruleGroupCode: [{ required: true, message: "请输入规则库名称", trigger: "blur" }],
      scriptCode: [{ required: true, message: "请输入规则代码", trigger: "blur" }],
    };

    const route = useRoute();
    onMounted(()=>{
      inputScriptRuleForm.form.ruleGroupCode = store.state.rule.ruleData.ruleGroupCode;
    })

    //新建规则库表单对象
    const inputScriptRuleForm = reactive({
      ref: "inputScriptRuleFormRef",
      form: {
        scriptName: '',
        ruleGroupCode: '',
        scriptCode: '',
        programType:'',
        sceneDesc:'',
        scriptContent:''
      }})
    //新增修改规则库
    let codeBlock = ref();
    const addScriptRuleBtn = () => {
      let scriptParam = codeBlock.value.getScriptParam();
      let requestBody = {
        programType: 1,
        ruleGroupCode: inputScriptRuleForm.form.ruleGroupCode,
        sceneDesc: inputScriptRuleForm.form.sceneDesc,
        scriptCode: inputScriptRuleForm.form.scriptCode,
        scriptContent: Base64.encode(inputScriptRuleForm.form.scriptContent),
        scriptName: inputScriptRuleForm.form.scriptName,
        ruleScriptStatus: "UNPUBLISHED",
        exampleValue: JSON.stringify(scriptParam)
      }
      addScriptRule(requestBody).then(res =>{
        router.push({
          path:"home",
          query: {
            ...route.query
          }
        })
      }).catch(

      )
    }

    const ruleGroupCode = route.query.ruleGroupCode
    const handleRandomRuleLayoutCode = () => {
      randomRuleLayoutCode(ruleGroupCode).then(res => {
        inputScriptRuleForm.form.scriptCode = res.data.data
      })
    }

    const cancelAddScriptRule = () => {
      router.push({
        path:"home",
        query: {
          ...route.query
        }
      })
    }

    return {
      inputScriptRuleForm,
      addScriptRuleBtn,
      handleRandomRuleLayoutCode,
      rules,
      cancelAddScriptRule,
      codeBlock
    }
  }
}
</script>

<style scoped>

</style>
