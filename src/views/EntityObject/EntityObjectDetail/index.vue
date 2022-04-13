<template>
  <el-container>
    <el-header>
      <span style="float: left">实体对象 - {{ entityObjectForm.form.ObjectName }}</span>
      <el-button v-if="scene==='preview'" type="primary" size="small"
                 class="edit-button" @click="scene = 'update'">编辑
      </el-button>
    </el-header>
    <el-main>
      <el-form :rules="rules" label-position="right" label-width="130px">
        <el-form-item label="对象名称：" prop="name">{{ entityObjectForm.form.ObjectName }}</el-form-item>
        <el-form-item label="对象代码：" prop="name">{{ entityObjectForm.form.ObjectCode }}</el-form-item>
        <el-form-item label="对象描述：" prop="code">{{ entityObjectForm.form.ObjectDescription }}</el-form-item>
      </el-form>
    </el-main>
    <el-footer v-if="scene === 'update'">
      <el-button type="primary" size="small" @click="">保存</el-button>
      <el-button type="primary" size="small" plain @click="scene = 'preview'">取消</el-button>
    </el-footer>
  </el-container>
</template>

<script>
import {onMounted, reactive, ref} from "vue";
import {useRoute, useRouter} from "vue-router";

export default {
  name: "index.vue",
  setup() {
    const router = useRouter()
    const route = useRoute()
    const rules = reactive({
      ObjectName: [
        {
          required: true,
          message: 'Please input rule name',
          trigger: 'blur',
        }
      ],
      ObjectCode: [
        {
          required: true,
          message: 'Please input rule name',
          trigger: 'blur',
        }
      ],
      ObjectDescription: [
        {
          required: true,
          message: 'Please input rule name',
          trigger: 'blur',
        }
      ]
    })
    const entityObjectForm = reactive({
      ref: 'entityObjectFormRef',
      form:{
        ObjectName:'',
        ObjectCode:'',
        ObjectDescription:''
      }
    })

    const scene = ref('preview');


    onMounted(() => {
        }
    )
    return{
      scene,
      entityObjectForm,
      rules
    }
  }
}
</script>

<style scoped>

</style>