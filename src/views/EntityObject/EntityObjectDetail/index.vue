<template>
  <div class="container" style="height: 90%">
    <div style="margin: 50px 100px">
      <el-form
          :ref="entityObjectForm.ref"
          :label-position="right"
          label-width="100px"
          :model="entityObjectForm.form"
          :rules="entityObjectForm.rules"
          size="large"
      >
        <el-form-item label="* 对象名称:" prop="ObjectName">
          <el-input
              v-model="entityObjectForm.form.ObjectName"
              placeholder="请输入"
              show-word-limit
              maxlength="20"
              disabled
              style="width: 800px;margin-left: 20px">
          </el-input>
        </el-form-item>
        <el-form-item label="* 对象代码:" prop="ObjectCode">
          <el-input
              v-model="entityObjectForm.form.ObjectCode"
              placeholder="纯英文格式，区分大小写"
              show-word-limit
              maxlength="20"
              disabled
              style="width: 800px;margin-left: 20px;margin-right: 10px">
          </el-input>
        </el-form-item>
        <el-form-item label="对象描述:" prop="ObjectDescription">
          <el-input
              v-model="entityObjectForm.form.ObjectDescription"
              placeholder="请输入"
              show-word-limit
              maxlength="300"
              type="textarea"
              :autosize="{ minRows: 5 }"
              disabled
              style="width: 800px;margin-left: 20px">
          </el-input>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import {reactive} from "vue";

export default {
  name: "index.vue",
  setup() {
    const entityObjectForm = reactive({
      ref: 'entityObjectFormRef',
      form:{
        ObjectName:'',
        ObjectCode:'',
        ObjectDescription:''
      }
    })
    return{
      entityObjectForm
    }
  }
}
</script>

<style scoped>

</style>