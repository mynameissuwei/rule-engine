<template>
  <el-container class="container">
    <el-header>
      <span style="float: left">脚本规则编排 - {{ruleLayoutInfo.name}}</span>
      <el-button v-if="scene==='preview'" type="primary" size="small"
                 class="edit-button" @click="scene = 'update'">编辑</el-button>
    </el-header>
    <el-main>
      <el-form :rules="rules" label-position="right" label-width="130px">
        <el-form-item label="规则编排名称：" prop="name">{{ruleLayoutInfo.name}}</el-form-item>
        <el-form-item label="规则编排代码：" prop="code">{{ruleLayoutInfo.code}}</el-form-item>
        <el-form-item label="程序类型：">
          <el-select model-value="GROOVY" placeholder="请选择" :disabled="scene === 'preview'">
            <el-option
                label="GROOVY"
                value="GROOVY"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="使用场景描述：">
          <el-input v-model="ruleLayoutInfo.scene" style="width: 400px;height: 30px" :disabled="scene === 'preview'"></el-input>
        </el-form-item>
        <el-form-item label="规则编排：">

<!--          <div class="mask"></div>-->

          <div style="height: 300px; width: 1045px">
            <rule-graph ref="ruleGraph" :operation-type="scene" :graphData="ruleLayoutInfo.ruleLayout"></rule-graph>
          </div>

        </el-form-item>
      </el-form>
    </el-main>
  </el-container>
  <el-footer class="footerContainer" v-if="scene === 'update'">
    <el-button-group>
      <el-button type="primary" size="small" @click="updateRuleLayout">保存</el-button>
      <el-button size="small" plain @click="cancelEdit" style="margin: 0px 20px">取消
      </el-button>
    </el-button-group>
  </el-footer>
</template>

<script>
import { ref, reactive, onMounted,onBeforeMount,provide,inject,  } from 'vue';
import { useRoute,useRouter } from 'vue-router';
import RuleGraph from "../../RuleGraph/index.vue";
import  {ruleLayoutDetail, saveRuleLayout, editRuleLayout} from '@/api/ruleLayout'
import {ElMessage} from "@enn/element-plus";
import {useStore} from "vuex";
import {checkGraphData, sortRule} from "views/RuleLayout/ruleGraph";
export default {
  name: "RuleLayoutDetail",
  components: {RuleGraph},
  props: {
  },
  setup(props){

    const store = useStore();
    const route = useRoute();
    const ruleLayoutId = route.query.ruleLayoutId

    const ruleLayoutInfo = reactive({
      code: '',
      name:'',
      scriptType: '',
      scene: '',
      ruleLayout: {}
    })

    let ruleLayout = reactive({})

    let rendered = ref(false)
    onMounted(()=>{
      scene.value = route.query.scene
      ruleLayoutDetail({id: ruleLayoutId}).then(res => {
        const data = res.data.data;
        ruleLayoutInfo.code = data.ruleLayoutCode;
        ruleLayoutInfo.name = data.ruleLayoutName;
        ruleLayoutInfo.scene = data.sceneDesc;
        ruleLayoutInfo.ruleLayout = convertToNodeAndEdges(data.list);
      })
    });



    const convertToNodeAndEdges = (rules) => {
      if(rules.length == 0) return reactive({});
      rules = rules.sort((r1, r2)=>{
        return r1.scriptExecutionSort - r2.scriptExecutionSort;
      });
      const nodes = rules.map(rule => {
        return {
          id: rule.scriptCode,
          label: rule.scriptName,
          x: 40,
          y: 40,
          width:80,
          height: 40
        }
      })

      const edges = []

      if(rules.length > 1){
        for (let i = 0; i < rules.length; i++) {
          if(i == rules.length-1) break;
          edges.push({
            source: rules[i].scriptCode,
            target: rules[i+1].scriptCode
          })
        }
      }
      return reactive({
        nodes: nodes,
        edges: edges
      })
    }

    //字段校验规则
    const rules = reactive({
      name: [
        { required: true, message: "请输入规则编排名称", trigger: "blur" },
        {
          pattern: /^[a-zA-Z0-9\u4e00-\u9fa5]+$/,
          message: "只能输入中文、数字、英文",
          trigger: "blur",
        },
      ],
      code: {
        required: true
      }
    })

    const ruleGraph = ref(); //绑定rule-graph组件
    const router = useRouter();
    const updateRuleLayout = () => {
      //调用子组件的方法获取当前的节点
      const graphData = ruleGraph.value.getGraphData();
      console.log(">>>>>>>>>>>>>>>>>>>>", JSON.stringify(graphData))
      checkGraphData(graphData);
      const ruleLayouts = convertToRuleLayouts(graphData)
      const params = {
        list: ruleLayouts,
        ruleGroupCode: store.state.rule.ruleData.ruleGroupCode,
        ruleLayoutCode: ruleLayoutInfo.code,
        ruleLayoutName: ruleLayoutInfo.name,
        sceneDesc: ruleLayoutInfo.scene
      }
      editRuleLayout(params).then(res => {
        if(res.data.code=='0'){
          ElMessage({
            message: '更新脚本规则编排成功',
            type: 'success',
          })
        }else {
          ElMessage.error(res.data.message)
        }
        router.push({
          path: '/home',
          query: {
            message: 'four',
            ...route.query
          }
        })
      })
    }

    //对node进行排序 根据edge的指向
    const convertToRuleLayouts = (graphData) => {
      if(graphData.edges.length == 0){
        return [
          {
            scriptCode: graphData.nodes[0].id,
            scriptExecutionSort: 0
          }
        ]
      }
      return sortRule(graphData.edges).map((item,index) => {
        return {
          scriptCode: item,
          scriptExecutionSort: index
        }
      })
    }

    const scene = ref('preview');
    let cancelEdit = () => {
      router.push({
        path: '/home',
        query: {
          message: 'four',
          ...route.query
        }
      })
    }
    return {
      rules,
      scene,
      updateRuleLayout,
      ruleLayoutInfo,
      ruleLayout,
      rendered,
      ruleGraph,
      cancelEdit
    }
  }
}
</script>

<style scoped>
.container {
  height: calc(100vh - 50px);
}

.mask{
  width:1045px;
  height:600px;
  background-size:100%;
  background:#FFF;
  opacity: 0.5;
}

.el-header,
.el-footer {
  background-color: #FFFFFF ;
  color: var(--el-text-color-primary);
  text-align: center;
  line-height: 60px;
}
.el-main {
  background-color: #FFFFFF ;
  color: var(--el-text-color-primary);
  margin: 15px
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
