<template>
  <el-card class="box-card" :body-style="{padding: '0px'}">
    <template #header>
      <div class="card-header">
        <el-button @click="openDialogForRuleList" size="small" plain style="background: #F2F3F5;margin-left: auto" :disabled="!editable">添加规则</el-button>
      </div>
    </template>
    <div id="container"></div>
  </el-card>

  <!--新增规则弹框-->
  <el-dialog v-model="dialogTableVisible" title="查询脚本规则">
    <el-form>
      <el-form-item label="规则名称" :label-width="formLabelWidth">
        <el-input  v-model="ruleName" autocomplete="off" style="width: 50%"></el-input>
        <el-button type="primary" size="small" style="margin-left: auto" @click="searchScriptRuleList">查询</el-button>
      </el-form-item>
    </el-form>

    <el-table ref="multipleTable" :data="rulesData" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" :selectable="handleSelectable"/>
      <el-table-column
        property="name"
        label="规则名称"
        width="150"
      ></el-table-column>
      <el-table-column
        property="lastModify"
        label="最后修改人"
        width="200"
      ></el-table-column>
      <el-table-column property="updateTime" label="最后修改时间"></el-table-column>
    </el-table>

    <template #footer>
      <el-pagination
        small
        v-model:currentPage="pagination.currentPage"
        v-model:page-size="pagination.pageSize"
        :page-sizes="[10, 20, 50]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="pagination.total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        style="display:flex;justify-content: flex-end;align-items: center"
      >
      </el-pagination>
      <span class="dialog-footer" style="margin-top: 10px">
        <el-button type="primary" @click="addNodes" size="small">添加</el-button>
        <el-button type="info" @click="dialogTableVisible = false" size="small">取消</el-button>
      </span>
    </template>

  </el-dialog>
</template>

<script>
import {onMounted, reactive, ref, toRefs, inject, watch, computed} from 'vue';
import {useRoute} from 'vue-router';
import {useStore} from "vuex";
import {
  getTextWidth, initGraph,
  OPERATION_TYPE, generateNodePorts, generateNodeRemoveTools, generateEdgeRemoveTools
} from './index'
import {scriptRuleList} from '@/api/scriptRule'
export default {
  name: "RuleGraph",
  props: {
    operationType: {
      type: String,
      required: true,
      default: 'update'
    },
    graphData: {
      type: Object,
      required: true,
    }
  },
  setup(props){

    const getGraphData = () => {
      return {
        nodes: graph.getNodes(),
        edges: graph.getEdges()
      }
    }

    let graph;

    const store = useStore();
    let ruleGroupCode = store.state.rule.ruleData.ruleGroupCode;
    let rulesData = reactive([])
    const ruleName = ref('')
    //获取脚本规则列表
    let searchScriptRuleList = () => {
      const params = {
        pageNum: pagination.currentPage,
        pageSize: pagination.pageSize,
        ruleGroupCode:ruleGroupCode,
        scriptName:ruleName.value,
        ruleScriptStatus: "PUBLISHED"
      }
      let rulesDataMap = {};
      scriptRuleList(params).then(res=>{
        rulesData.length = 0;
        rulesData.push(...res.data.data.map(rule => {
            return {
              id: rule.scriptCode,
              name: rule.scriptName,
              lastModify: rule.updatedByName,
              updateTime: rule.updatedDate
            }
        }))
        rulesData.forEach(rule => {
          rulesDataMap[rule.id] = rule;
        })
        pagination.total = res.data.totalCount;
        //默认选中
        graph.getNodes().forEach((row) => {
          if(rulesDataMap[row.id]){
            multipleTable.value.toggleRowSelection(rulesDataMap[row.id]);
          }
        })
      })
    }

    let editable = computed(() => {
      if(graph){
        graph.interacting = {
          nodeMovable : OPERATION_TYPE.PREVIEW !== props.operationType
        }
      }
      return props.operationType === OPERATION_TYPE.PREVIEW ? false : true;
    });

    watch(
      () => props.graphData,
      (value, preValue) => {
        graph = initGraph("100%", 500, props.operationType);

        if(OPERATION_TYPE.UPDATE === props.operationType ||
          OPERATION_TYPE.PREVIEW === props.operationType){ //当更新或预览的时候才会去获取老数据
          const json = convertExistedNodeAndEdges(props.graphData);
          graph.fromJSON(json);
        }else{
          graph.fromJSON({
            nodes: [],
            edges: []
          })
        }
      }
    )

    onMounted(()=>{
      graph = initGraph("100%", 500, props.operationType);
    })

    const convertExistedNodeAndEdges = (data) => {
      const x = 80;
      let y = 80;
      data.nodes.forEach(node => {
        node.width = getTextWidth(node.label);
        node.x = x;
        node.y = y + 100;
        y = node.y;
        node.attrs = {
          label: {
            text: node.label,
          },
        };
        node.ports = generateNodePorts();
        node.tools = generateNodeRemoveTools(props.operationType);
      })

      data.edges.forEach(edge => {
        edge.tools = generateEdgeRemoveTools(props.operationType);
      })
      return data;
    }

    // dialog相关操作
    const dialogTableVisible = ref(false)
    const formLabelWidth = '100px'
    const openDialogForRuleList = () => {
      dialogTableVisible.value = true;
      searchScriptRuleList();
    }


    // 分页操作
    const pagination = reactive({
      currentPage: 1,
      pageSize: 10,
      total: 100
    })

    const handleSizeChange = (size) => {
      pagination.pageSize = size
      openDialogForRuleList()
    }

    const handleCurrentChange = (page) => {
      pagination.currentPage = page
      openDialogForRuleList()
    }

    //新增节点
    const addNodes = () => {
      graph.addNodes(convertRulesToNodes(selectedRules))
      dialogTableVisible.value = false
    }

    const selectedRules = reactive([])
    const handleSelectionChange = (rules) => {
      selectedRules.length = 0;
      selectedRules.push(...rules);
    }

    const convertRulesToNodes = (rules) => {
      return rules.map(rule => {
        return {
          id: rule.id, // String，可选，节点的唯一标识
          x: 40,       // Number，必选，节点位置的 x 值
          y: 40,       // Number，必选，节点位置的 y 值
          width: getTextWidth(rule.name),   // Number，可选，节点大小的 width 值
          height: 40,  // Number，可选，节点大小的 height 值
          attrs: {
            label: {
              text: rule.name
            }
          },
          ports: generateNodePorts()
        }
      })
    }

    let multipleTable = ref();
    let nodeMap = {};
    let handleSelectable = (row, index) => {
      nodeMap = {};
      graph.getNodes().forEach(node => nodeMap[node.id] = node);
      if(nodeMap[row.id]){
        console.log("row index ========> ", row, index);
        return false;
      }
      return true;
    }
    return {
      handleSelectable,
      multipleTable,
      dialogTableVisible,
      formLabelWidth,
      rulesData,
      ruleName,
      pagination,
      handleSizeChange,
      handleCurrentChange,
      addNodes,
      handleSelectionChange,
      openDialogForRuleList,
      editable,
      searchScriptRuleList,
      getGraphData
    }
  },
}


</script>

<style scoped>
>>> .el-card__header {
  padding: 10px !important;
}
</style>
