<template>
  <div>
    <el-input
        id="script"
        v-model="script"
        :disabled="allowedInput"
        placeholder="请输入"
        show-word-limit
        maxlength="300000"
        type="textarea"
        :autosize="{ minRows: 5 }"
        style="width: 800px;">
    </el-input>

    <br/>

    <el-button @click="showAllObjects"
               style="margin-top: 10px"
               :disabled="allowedInput">插入对象属性</el-button>

    <el-dialog v-model="showObject">
      <el-input v-model="filterText" placeholder="Filter keyword" />

      <el-tree
          ref="tree"
          class="filter-tree"
          :data="objects"
          :props="defaultProps"
          default-expand-all
          :filter-node-method="filterNode"
          :current-node-key="currentNode"
          @node-click="nodeClick"
      />
    </el-dialog>
  </div>
</template>

<script>
import {onMounted, ref, watch, reactive} from 'vue';
import {useRoute} from 'vue-router';
import {getEntityObject} from "@/api/entityObject";
import {useStore} from "vuex";
export default {
  name: "CodeBlock",
  props: {
    scriptContent: {
      type: String,
      required: true,
    },
    disabled: {
      type: Boolean,
      required: false
    },
    exampleValue: {
      type: String,
      required: true,
    }
  },
  setup(props){
    let script = ref('');
    let allowedInput = ref(true);

    watch(
        () => props.exampleValue,
        (value, preValue) => {
          variables = JSON.parse(value);
        }
    )

    watch(
        () => props.disabled,
        (value, preValue) => {
          allowedInput.value = value;
        }
    )

    watch(
        () => props.scriptContent,
        (value, preValue) => {
          script.value = value;
        }
    )

    const store = useStore();
    let ruleGroupCode = store.state.rule.ruleData.ruleGroupCode;

    onMounted(()=>{
      allowedInput.value = props.disabled;
    })

    let closeObjectDialog = () => {
      showObject.value = false;
    }

    let showObject = ref(false);
    let filterText = ref('');
    const tree = ref();
    watch(filterText, (newValue, oldValue) => { //直接监听
      tree.value.filter(newValue)
    });

    let objects = reactive([]);
    let defaultProps = reactive({
      children: 'children',
      label: 'label',
    })
    let filterNode = (value, data) => {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    };

    let currentNode = reactive({});
    let nodeClick = (nodeObject,node,c) => {
      console.log(">>>>>>>>>>>>>>>>> tree node parent ",node.parent)
      if(node.parent.parent === null) return;
      let parentNode = node.parent.data;
      console.log(">>>>>>>>>>>>>>>>> tree node parent data",parentNode)

      currentNode = nodeObject;
      showObject.value = false;
      let scriptInput = document.getElementById("script");
      let startPos = scriptInput.selectionStart;
      let endPos = scriptInput.selectionEnd;
      if(startPos == undefined || endPos == undefined) return;
      script.value = script.value.substring(0, startPos) +
          " context.requestParams."+parentNode.id+"."+currentNode.id + " " +
          script.value.substring(endPos);
      if(variables[parentNode.id] == undefined){
        variables[parentNode.id] = {};
      }
      variables[parentNode.id][currentNode.id] = currentNode.type;
    }

    let showAllObjects = () => {
      showObject.value = true;
      let param = {
        pageNum: 1,
        pageSize: 10,
        ruleGroupCode: ruleGroupCode,
        timeAscOrDesc: "desc"
      }
      getEntityObject(param).then(res => {
        let totalCount = res.data.totalCount;
        param.pageSize = totalCount;
        getEntityObject(param).then(res => {
          let objectsData = res.data.data;
          objects.length = 0;
          objects.push(...convertToObjectTreeData(objectsData));
          console.log("getEntityObject ", objects)
        })
      })
    }
    let convertToObjectTreeData = (objectsData)=> {
      if(!objectsData || objectsData.length === 0) return [];
      return objectsData.map(objectData => {
        let children = null;
        if(objectData.ruleObjectFieldResVoList){
          children = objectData.ruleObjectFieldResVoList.map(field => {
            return {
              id: field.fieldCode,
              label: field.fieldName,
              type: field.fieldType
            }
          })
        }
        return {
          id: objectData.objectCode,
          label: objectData.objectName,
          children: children
        }
      })
    }

    let variables = reactive({});

    let getScriptParam = () => {
      return variables;
    }

    let getScriptContent = () => {
      return script.value;
    }
    return {
      getScriptContent,
      script,
      allowedInput,
      showObject,
      closeObjectDialog,
      filterText,
      objects,
      defaultProps,
      filterNode,
      tree,
      currentNode,
      nodeClick,
      showAllObjects,
      getScriptParam
    }

  }
}
</script>

<style scoped>

</style>
