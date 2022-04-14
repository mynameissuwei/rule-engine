<template>
  <el-dialog
      v-model="dialogVisible"
      title="规则测试"
      width="40%"
      :before-close="handleClose"
  >
    <el-divider/>
    <span>* 请录入json代码进行测试</span>
    <el-input type="textarea" v-model="requestParam" autosize="true"></el-input>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="testScriptRule">确认</el-button>
        <el-button type="primary" @click="dialogVisible = false"
        >取消</el-button
        >
      </span>
    </template>
  </el-dialog>
</template>

<script>
import {watch, ref} from "vue";
import {scriptRuleParam, scriptRuleTest} from "@/api/ruleTest";
import { ElMessage } from '@enn/element-plus';


export default {
  name: "RuleTest",
  props: {
    ruleGroupCode: {
      type: String,
      required: true,
    },
    ruleLayoutCode: {
      type: String,
      required: true
    }
  },
  setup(props){
    let dialogVisible = ref(false);

    watch(() => [props.ruleGroupCode, props.ruleLayoutCode],
        ([newRuleGroupCode, newRuleLayoutCode],
         [oldRuleGroupCode, oldRuleLayoutCode]) => {
      scriptRuleParam({
        // ruleGroupCode: newRuleGroupCode,
        // ruleLayoutCode: newRuleLayoutCode
        ruleGroupCode: "FFyX88RJ",
        ruleLayoutCode: "20220406183002"
      }).then(res => {
        let exampleValue = res.data.data
        requestParam.value = JSON.stringify(JSON.parse(exampleValue), null, "\t");
      })
    })

    let showRuleTest = () => {
      dialogVisible.value = true;
      dialogVisible = ref(dialogVisible)
    }

    let requestParam = ref('');
    let testScriptRule = () => {
      scriptRuleTest(JSON.parse(requestParam.value)).then(res => {
        if(res.data.code === '0'){
          if(res.data.message){
            ElMessage.success(res.data.message);
          }else {
            ElMessage.success('脚本测试成功');
          }
          dialogVisible.value = false;
        }else{
          ElMessage.error(res.data.message);
        }
      });
    }
    return {
      dialogVisible,
      requestParam,
      showRuleTest,
      testScriptRule
    }
  }
}
</script>

<style scoped>

</style>
