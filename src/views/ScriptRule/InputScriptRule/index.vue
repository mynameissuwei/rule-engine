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
      >
        <el-form-item label="* 规则名称:" prop="scriptName">
          <el-input
              v-model="inputScriptRuleForm.form.scriptName"
              placeholder="请输入"
              show-word-limit
              maxlength="20"
              style="width: 800px;margin-left: 20px">
          </el-input>
        </el-form-item>
        <el-form-item label="* 规则库代码:" prop="ruleGroupCode">
          <el-input
              v-model="inputScriptRuleForm.form.ruleGroupCode"
              placeholder="请输入"
              show-word-limit
              maxlength="20"
              style="width: 800px;margin-left: 20px">
          </el-input>
        </el-form-item>
        <el-form-item label="* 规则代码:" prop="scriptCode">
          <div>
            <el-input
                v-model="inputScriptRuleForm.form.scriptCode"
                placeholder="纯英文格式，区分大小写"
                show-word-limit
                maxlength="20"
                style="width: 800px;margin-left: 20px;margin-right: 10px">
            </el-input>
            <el-button
                type="text"
                @click="">
              随机生成
            </el-button>
          </div>
        </el-form-item>
          <el-form-item label="程序类型:" prop="programType">
            <el-input
                v-model="inputScriptRuleForm.form.programType"
                placeholder="请输入"
                show-word-limit
                maxlength="20"
                style="width: 800px;margin-left: 20px">
            </el-input>
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
          <el-input
              v-model="inputScriptRuleForm.form.scriptContent"
              placeholder="请输入"
              show-word-limit
              maxlength="300"
              type="textarea"
              :autosize="{ minRows: 5 }"
              style="width: 800px;margin-left: 20px">
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" style="margin: 20px" @click="addScriptRuleBtn">确认</el-button>
          <el-button>取消</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import {reactive} from "vue";
import router from "../../../router";
import {addScriptRule} from "../../../api/scriptRule";
import {Base64} from "js-base64";

export default {
  name: "index.vue",
  setup() {
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
    function addScriptRuleBtn() {
      let requestBody = {
        programType: inputScriptRuleForm.form.programType,
        ruleGroupCode: inputScriptRuleForm.form.ruleGroupCode,
        sceneDesc: inputScriptRuleForm.form.sceneDesc,
        scriptCode: inputScriptRuleForm.form.scriptCode,
        scriptContent: Base64.encode(inputScriptRuleForm.form.scriptContent),
        scriptName: inputScriptRuleForm.form.scriptName
      }
      addScriptRule(requestBody).then(
          router.push('home')
      ).catch(

      )
    }

    return {
      inputScriptRuleForm,
      addScriptRuleBtn
    }
  }
}
</script>

<style scoped>

</style>