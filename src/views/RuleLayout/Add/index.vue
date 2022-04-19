<template>
  <el-container class="container">
    <el-header>
      <span style="float: left">新建脚本规则编排</span>
    </el-header>
    <el-main>
      <el-form
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
        <el-form-item label="规则编排代码：" prop="code">
          <el-input
            style="width: 400px; height: 30px"
            v-model="ruleLayoutForm.code"
          ></el-input>
          <span
            style="margin-left: 10px; color: #4a9ff9"
            @click="handleRandomRuleLayoutCode"
            >随机生成</span
          >
        </el-form-item>
        <el-form-item label="程序类型：">
          <el-select
            model-value="GROOVY"
            placeholder="请选择"
            :disabled="scene === 'preview'"
          >
            <el-option label="GROOVY" value="GROOVY"> </el-option>
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
    <el-footer>
      <el-button type="primary" size="small" @click="addRuleLayout"
        >保存</el-button
      >
      <el-button type="primary" size="small" plain @click="cancelAddRuleLayout"
        >取消</el-button
      >
    </el-footer>
  </el-container>
</template>

<script>
import { reactive, ref } from "vue";
import RuleGraph from "@/views/RuleGraph/index.vue";
import { useRoute, useRouter } from "vue-router";
import { randomRuleLayoutCode, saveRuleLayout } from "@/api/ruleLayout";
import { ElMessage } from "@enn/element-plus";
import router from "@/router";

export default {
  name: "RuleLayoutAdd",
  components: { RuleGraph },
  setup() {
    const ruleLayoutForm = reactive({
      name: "",
      code: "",
      programType: 0,
      sceneDesc: "",
      list: [],
    });
    const rules = reactive({
      name: [
        {
          required: true,
          message: "Please input rule name",
          trigger: "blur",
        },
        // {
        //   min: 3,
        //   max: 5,
        //   message: 'Length should be 3 to 5',
        //   trigger: 'blur',
        // },
      ],
      code: {
        required: true,
      },
    });

    const cancelAddRuleLayout = () => {
      router.go(-1);
    };

    const route = useRoute();
    const ruleGroupCode = route.query.ruleGroupCode;
    const handleRandomRuleLayoutCode = () => {
      randomRuleLayoutCode(ruleGroupCode).then((res) => {
        ruleLayoutForm.code = res.data.data;
      });
    };

    //校验 不能有多个起始节点 不能有source target为一个节点的
    const checkGraphData = (graphData) => {
      const edges = graphData.edges;
      const nodes = graphData.nodes;
      if (nodes.length == 0) {
        ElMessage.error("没有要保存的节点");
        throw new Error("没有要保存的节点");
      }
      if (nodes.length !== 1 && nodes.length - edges.length > 1) {
        ElMessage.error("节点没有闭合");
        throw new Error("节点没有闭合");
      }
    };

    const sortedRules = [];
    const sortRule = (edges) => {
      if (sortedRules.length == 0 && edges.length > 0) {
        sortedRules.push(edges[0].source.cell, edges[0].target.cell);
      }
      if (edges.length == 1) return sortedRules;
      for (let i = 1; i < edges.length; i++) {
        const source = edges[i].source.cell;
        const target = edges[i].target.cell;
        //该节点为数组中尾节点的target
        if (source == sortedRules[sortedRules.length - 1]) {
          sortedRules.push(target);
        }

        //该节点为数组中首节点的source
        if (target == sortedRules[0]) {
          sortedRules.unshift(source);
        }

        if (i < edges.length - 1) continue;
      }
      //如果遍历完之后 排序好的列表的长度与edges的长度不一致说明仍然有边没有参与，所以需要再遍历一次
      if (sortedRules.length < edges.length + 1) {
        sortRule(edges);
      }
      return sortedRules;
    };

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
            ...route.query,
            message: "four",
          },
        });
      });
    };
    return {
      ruleLayoutForm,
      rules,
      handleRandomRuleLayoutCode,
      addRuleLayout,
      ruleGraph,
      cancelAddRuleLayout,
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
