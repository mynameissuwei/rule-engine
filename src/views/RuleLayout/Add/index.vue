<template>
  <el-container class="container">
    <el-header>
      <span style="float: left">新建脚本规则编排</span>
    </el-header>
    <el-main>
      <el-form
          ref="ruleLayoutFormRef"
          :rules="rules"
          label-position="right"
          label-width="130px"
          :model="ruleLayoutForm"
      >
        <el-form-item label="规则编排名称：" prop="name">
          <el-input
              style="width: 400px; height: 30px"
              v-model="ruleLayoutForm.name"
          ></el-input>
        </el-form-item>
<!--        <el-form-item label="规则编排代码：" prop="code">
          <el-input
              style="width: 400px; height: 30px"
              v-model="ruleLayoutForm.code"
          ></el-input>
          <span
              style="margin-left: 10px; color: #4a9ff9"
              @click="handleRandomRuleLayoutCode"
          >随机生成</span
          >
        </el-form-item>-->
        <el-form-item label="程序类型：">
          <el-select
              model-value="GROOVY"
              placeholder="请选择"
              :disabled="scene === 'preview'"
          >
            <el-option label="GROOVY" value="GROOVY"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="使用场景描述：">
          <el-input
              v-model="ruleLayoutForm.sceneDesc"
              style="width: 400px; height: 30px"
              :disabled="scene === 'preview'"
          ></el-input>
        </el-form-item>
        <el-form-item label="规则编排：">
          <div style="height: 300px; width: 1045px">
            <rule-graph ref="ruleGraph" operation-type="add"></rule-graph>
          </div>
        </el-form-item>
      </el-form>
    </el-main>
  </el-container>
  <el-footer class="footerContainer">
    <el-button-group>
      <el-button type="primary" size="small" @click="addRuleLayout">保存</el-button>
      <el-button size="small" plain @click="cancelAddRuleLayout" style="margin: 0px 20px">取消
      </el-button>
    </el-button-group>
  </el-footer>
</template>

<script>
import {reactive, ref} from "vue";
import RuleGraph from "@/views/RuleGraph/index.vue";
import {useRoute, useRouter} from "vue-router";
import {randomRuleLayoutCode, saveRuleLayout} from "@/api/ruleLayout";
import {ElMessage} from "@enn/element-plus";
import {checkGraphData} from "../ruleGraph"
import {sortRule} from "views/RuleLayout/ruleGraph";
import {useStore} from "vuex";

export default {
  name: "RuleLayoutAdd",
  components: {RuleGraph},
  setup() {
    const ruleLayoutFormRef = ref("")
    const store = useStore();
    const ruleLayoutForm = reactive({
      name: "",
      code: "",
      programType: 0,
      sceneDesc: "",
      list: [],
    });
    const rules = reactive({
      name: [
        {required: true, message: "请输入规则编排名称", trigger: "blur"},
        {
          pattern: /^[a-zA-Z0-9\u4e00-\u9fa5]+$/,
          message: "只能输入中文、数字、英文",
          trigger: "blur",
        },
      ],
      code: {
        required: true,
      },

    });

    const cancelAddRuleLayout = () => {
      router.go(-1);
    };

    const route = useRoute();
    const ruleGroupCode = store.state.rule.ruleData.ruleGroupCode;
/*    const handleRandomRuleLayoutCode = () => {
      randomRuleLayoutCode(ruleGroupCode).then((res) => {
        ruleLayoutForm.code = res.data.data;
      });
    };*/

    //对node进行排序 根据edge的指向
    const convertToRuleLayouts = (graphData) => {
      if (graphData.edges.length == 0) {
        return [
          {
            scriptCode: graphData.nodes[0].id,
            scriptExecutionSort: 0,
          },
        ];
      }
      return sortRule(graphData.edges).map((item, index) => {
        return {
          scriptCode: item,
          scriptExecutionSort: index,
        };
      });
    };

    const ruleGraph = ref(); //绑定rule-graph组件
    const router = useRouter();
    const addRuleLayout = () => {
      ruleLayoutFormRef.value.validate((valid) => {
        if (valid) {
          const graphData = ruleGraph.value.getGraphData();
          checkGraphData(graphData);
          const ruleLayouts = convertToRuleLayouts(graphData);
          const params = {
            ruleGroupCode: ruleGroupCode,
            ruleLayoutCode: ruleLayoutForm.code,
            ruleLayoutName: ruleLayoutForm.name,
            sceneDesc: ruleLayoutForm.sceneDesc,
            list: ruleLayouts,
          };
          saveRuleLayout(params).then((res) => {
            if (res.data.code !== "0") {
              ElMessage.error(res.data.message);
              return;
            }
            ElMessage({
              message: "新增脚本规则编排成功",
              type: "success",
            });
            router.push({
              path: "/home",
              query: {
                tab: "four",
              },
            });
          });
        }
      })
    };
    return {
      ruleLayoutForm,
      rules,
     // handleRandomRuleLayoutCode,
      addRuleLayout,
      ruleGraph,
      cancelAddRuleLayout,
      ruleLayoutFormRef
    };
  },
};
</script>

<style scoped>
.container {
  height: calc(100vh - 50px);
}

.el-header,
.el-footer {
  background-color: #ffffff;
  color: var(--el-text-color-primary);
  text-align: center;
  line-height: 60px;
}

.el-main {
  background-color: #ffffff;
  color: var(--el-text-color-primary);
  margin: 15px;
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
