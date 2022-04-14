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
          :rules="rules"
      >
        <el-form-item label="规则库名称:" prop="newRuleRepositoryName">
          <el-input
              v-model="newRuleRepositoryForm.form.newRuleRepositoryName"
              placeholder="请输入"
              show-word-limit
              maxlength="20"
              style="width: 800px;margin-left: 20px">
          </el-input>
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
          <el-button @click="gotoRuleRepository">取消</el-button>
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
      }
    })

    //输入框校验规则
    const rules = reactive({
      newRuleRepositoryName: [
        {
          required: true,
          message: 'Please input rule name',
          trigger: 'blur',
        },
        // {
        //   min: 3,
        //   max: 5,
        //   message: 'Length should be 3 to 5',
        //   trigger: 'blur',
        // },
      ],
      /*      code: {
              required: true
            }*/
    })

    //取消新建
    const gotoRuleRepository = () => {
      router.push('/')
    }

    //新增修改规则库
    function addRuleRepositoryBtn() {
      let requestBody = {
        ruleGroupName: newRuleRepositoryForm.form.newRuleRepositoryName,
        ruleGroupDescription: newRuleRepositoryForm.form.newRuleRepositoryDescription
      }
      addRuleRepository(requestBody).then(response => {
            if (response.data.code !== '0') {
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
            getRuleRepository
          }
      )
    }

    return {
      newRuleRepositoryForm,
      addRuleRepositoryBtn,
      rules,
      gotoRuleRepository
    }
  }
}
</script>

<style scoped lang="scss">

</style>