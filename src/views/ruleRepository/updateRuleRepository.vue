<template>
  <div class="container" style="height: 90%">
    <div style="margin: 100px 400px">
      <!--新建规则库表单-->
      <el-form
          :ref="updateRuleRepositoryForm.ref"
          :label-position="right"
          label-width="100px"
          :model="updateRuleRepositoryForm.form"
          size="large"
          :rules="rules"
      >
        <el-form-item label="规则库名称:" prop="RuleRepositoryName">
          <el-input
              v-model="updateRuleRepositoryForm.form.RuleRepositoryName"
              placeholder="请输入"
              show-word-limit
              maxlength="20"
              style="width: 800px;margin-left: 20px">
          </el-input>
        </el-form-item>
        <el-form-item label="规则库编码:" prop="RuleRepositoryCode">
          <el-input
              v-model="updateRuleRepositoryForm.form.RuleRepositoryCode"
              placeholder="请输入"
              show-word-limit
              maxlength="20"
              style="width: 800px;margin-left: 20px"
              disabled>
          </el-input>
        </el-form-item>
        <el-form-item label="规则库描述:" prop="RuleRepositoryDescription">
          <el-input
              v-model="updateRuleRepositoryForm.form.RuleRepositoryDescription"
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
          <el-button @click="cancel">取消</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import {onMounted, reactive} from "vue";
import {addRuleRepository, getRuleRepository} from "../../api/ruleRepository";
import router from "../../router";
import {ElMessage} from "@enn/element-plus";
import {useRoute} from "vue-router";

export default {
  name: "updateRuleRepository.vue",
  setup() {
    const ruleGroupCode = route.query.ruleGroupCode
    const ruleGroupName = route.query.ruleGroupName
    const ruleGroupDesc = route.query.ruleGroupDesc
    const route = useRoute();
    //新建规则库表单对象
    const updateRuleRepositoryForm = reactive({
      ref: "newRuleRepositoryFormRef",
      form: {
        RuleRepositoryName: '',
        RuleRepositoryCode: '',
        RuleRepositoryDescription: ''
      }
    })

    //新增修改规则库
    function addRuleRepositoryBtn() {
      let requestBody = {
        id: route.query.id,
        ruleGroupName: updateRuleRepositoryForm.form.RuleRepositoryName,
        ruleRepositoryCode: updateRuleRepositoryForm.form.RuleRepositoryCode,
        ruleGroupDescription: updateRuleRepositoryForm.form.RuleRepositoryDescription
      }
      console.log(requestBody.id,10)
      addRuleRepository(requestBody).then(response => {
            if (response.data.code !== '0') {
              ElMessage.error(response.data.message)
              return;
            }
            ElMessage({
              message: '修改规则库成功',
              type: 'success',
            })
            router.push({
              path: 'home',
              query: {
                name: updateRuleRepositoryForm.form.RuleRepositoryName,
                code: updateRuleRepositoryForm.form.RuleRepositoryCode,
                description: updateRuleRepositoryForm.form.RuleRepositoryDescription
              }
            })
          }
      )

    }

    //输入框校验规则
    const rules = reactive({
      RuleRepositoryName: [
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
      RuleRepositoryCode: {
              required: true
            }
    })

    const cancel = () => {
      router.push({
        path: 'home',
        query: {
          ...route.query
        }
      })
    }

    onMounted(() => {
      updateRuleRepositoryForm.form.RuleRepositoryName = route.query.name
      updateRuleRepositoryForm.form.RuleRepositoryCode = route.query.code
      updateRuleRepositoryForm.form.RuleRepositoryDescription = route.query.description

    })

    return {
      updateRuleRepositoryForm,
      addRuleRepositoryBtn,
      rules,
      cancel
    }
  }
}
</script>

<style scoped lang="scss">

</style>