<template>
  <div class="container" style="height: 90%">
    <div style="margin: 100px 400px">
      <!--新建规则库表单-->
      <el-form
          :ref="newRuleRepositoryForm.ref"
          :label-position="right"
          label-width="100px"
          :model="newRuleRepositoryForm.form"
          size="large"
      >
        <el-form-item label="* 规则库名称:" prop="newRuleRepositoryName">
          <el-input
              v-model="newRuleRepositoryForm.form.newRuleRepositoryName"
              placeholder="请输入"
              show-word-limit
              maxlength="20"
              style="width: 800px;margin-left: 20px">
          </el-input>
        </el-form-item>
        <el-form-item label="* 规则库编码:" prop="newRuleRepositoryCode">
          <div>
            <el-input
                v-model="newRuleRepositoryForm.form.newRuleRepositoryCode"
                placeholder="纯英文格式，区分大小写"
                show-word-limit
                maxlength="20"
                style="width: 800px;margin-left: 20px;margin-right: 10px">
            </el-input>
            <el-button
                type="text"
                @click="randomCode">
              随机生成
            </el-button>
          </div>
        </el-form-item>
        <el-form-item label="规则库描述:" prop="newRuleRepositoryDescription">
          <el-input
              v-model="newRuleRepositoryForm.form.newRuleRepositoryDescription"
              placeholder="请输入"
              show-word-limit
              maxlength="300"
              type="textarea"
              :autosize="{ minRows: 5 }"
              style="width: 800px;margin-left: 20px">
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" style="margin: 20px" @click="addRuleRepositoryBtn">确认</el-button>
          <el-button>取消</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import {reactive} from "vue";
import {addRuleRepository, getRuleRepository} from "../../api/ruleRepository";
import router from "../../router";
import {ElMessage} from "@enn/element-plus";

export default {
  name: "newRuleRepository",
  setup() {
    //新建规则库表单对象
    const newRuleRepositoryForm = reactive({
      ref: "newRuleRepositoryFormRef",
      form: {
        newRuleRepositoryName: '',
        newRuleRepositoryCode: '',
        newRuleRepositoryDescription: ''
      }})
    //随机生成规则库编码
    const randomCode = () => {/*
      let expect=10;
      let str=Math.random().toString(36).substring(2);
      while(str.length<expect){
        str=Math.random().toString(36).substring(2)
      }
      return newRuleRepositoryForm.form.newRuleRepositoryCode = str;*/
    }
    //新增修改规则库
    function addRuleRepositoryBtn() {
      let requestBody = {
        ruleGroupCode:newRuleRepositoryForm.form.newRuleRepositoryCode,
        ruleGroupName:newRuleRepositoryForm.form.newRuleRepositoryName,
        ruleGroupDescription:newRuleRepositoryForm.form.newRuleRepositoryDescription
      }
      addRuleRepository(requestBody).then(response => {
        if(response.data.code !== '0'){
          ElMessage.error(response.data.message)
          return;
        }
        ElMessage({
          message: '新增规则库成功',
          type: 'success',
        })
        router.push({
          path: '/',
        })
            console.log(response,12)
            router.push('/'),
                getRuleRepository
          }
      )

    }
    
    return {
      newRuleRepositoryForm,
      randomCode,
      addRuleRepositoryBtn
    }
  }
}
</script>

<style scoped lang="scss">

</style>