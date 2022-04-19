<template>
  <div class="container">
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
import {useStore} from "vuex";

export default {
  name: "updateRuleRepository.vue",
  setup() {
    const store = useStore();
    const route = useRoute()
    //新建规则库表单对象
    const updateRuleRepositoryForm = reactive({
      ref: "newRuleRepositoryFormRef",
      form: {
        id:'',
        RuleRepositoryName: '',
        RuleRepositoryCode: '',
        RuleRepositoryDescription: ''
      }
    })

    //新增修改规则库
    function addRuleRepositoryBtn() {
      let requestBody = {
        id: store.state.rule.ruleData.id,
        ruleGroupName: updateRuleRepositoryForm.form.RuleRepositoryName,
        ruleGroupCode: updateRuleRepositoryForm.form.RuleRepositoryCode,
        ruleRepositoryCode: updateRuleRepositoryForm.form.RuleRepositoryCode,
        ruleGroupDescription: updateRuleRepositoryForm.form.RuleRepositoryDescription
      }
      addRuleRepository(requestBody).then(response => {
            if (response.data.code !== '0') {
              ElMessage.error(response.data.message)
              return;
            }
            let ruleData = {
              id:requestBody.id,
              ruleGroupCode:requestBody.ruleGroupCode,
              ruleGroupName: requestBody.ruleGroupName,
              ruleGroupDesc: requestBody.ruleGroupDescription,
            };
            console.log(ruleData,11)
            store.dispatch("rule/setRuleData", ruleData);
            ElMessage({
              message: '修改规则库成功',
              type: 'success',
            })
            router.push({
              path: 'home'
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
      updateRuleRepositoryForm.form.id = store.state.rule.ruleData.id
      updateRuleRepositoryForm.form.RuleRepositoryName = store.state.rule.ruleData.ruleGroupName
      updateRuleRepositoryForm.form.RuleRepositoryCode = store.state.rule.ruleData.ruleGroupCode
      updateRuleRepositoryForm.form.RuleRepositoryDescription = store.state.rule.ruleData.ruleGroupDesc

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
.container{
  height: calc(100vh - 100px);
}
</style>