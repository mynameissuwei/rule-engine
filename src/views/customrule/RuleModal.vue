<template>
  <el-dialog v-model="data.visible" title="添加规则" width="800px">
    <div>this is ok</div>
    <div class="dialog-footer" style="margin-right: 20px">
      <el-button type="primary" @click="onSubmitRule" size="small">确定</el-button>
      <el-button @click="fieldVisible = false" size="small">取 消</el-button>
    </div>
  </el-dialog>
</template>

<script setup>
import { reactive } from 'vue'

const data = reactive({
  input4: '',
  visible: false
})
</script>

<style scoped lang="scss"></style>
