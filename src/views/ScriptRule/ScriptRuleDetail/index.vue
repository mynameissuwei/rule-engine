<!--<template>-->
<!--  <el-container>-->
<!--    <el-main>-->
<!--      <el-form :rules="rules" label-position="right" label-width="130px">-->
<!--        <el-form-item label="规则规则名称：" prop="name">-->
<!--          <el-input v-model="" style="width: 400px;height: 30px" :disabled="scene === 'preview'"></el-input>-->
<!--        </el-form-item>-->
<!--        <el-form-item label="规则规则代码：" prop="code">-->
<!--          <el-input v-model="" style="width: 400px;height: 30px" :disabled="scene === 'preview'"></el-input>-->
<!--        </el-form-item>-->
<!--        <el-form-item label="程序类型：" prop="type">-->
<!--          <el-select model-value="GROOVY" placeholder="请选择" :disabled="scene === 'preview'">-->
<!--            <el-option-->
<!--                label="GROOVY"-->
<!--                value="GROOVY"-->
<!--            >-->
<!--            </el-option>-->
<!--          </el-select>-->
<!--        </el-form-item>-->
<!--        <el-form-item label="场景描述：">-->
<!--          <el-input v-model="" style="width: 400px;height: 30px" :disabled="scene === 'preview'"></el-input>-->
<!--        </el-form-item>-->
<!--        <el-form-item label="代码片段">-->
<!--          <el-input v-model="" style="width: 400px;height: 30px" :disabled="scene === 'preview'"></el-input>-->
<!--        </el-form-item>-->
<!--      </el-form>-->
<!--    </el-main>-->
<!--    <el-footer v-if="scene === 'update'">-->
<!--      <el-button type="primary" size="small" @click="">保存</el-button>-->
<!--      <el-button type="primary" size="small" plain @click="scene = 'preview'">取消</el-button>-->
<!--    </el-footer>-->
<!--  </el-container>-->
<!--</template>-->

<!--<script>-->
<!--import {reactive} from "vue";-->

<!--export default {-->
<!--  name: "index.vue",-->
<!--  setup(){-->
<!--      const rules = reactive({-->
<!--        scriptName: [-->
<!--          {-->
<!--            required: true,-->
<!--            message: 'Please input rule name',-->
<!--            trigger: 'blur',-->
<!--          }-->
<!--        ],-->
<!--        ruleGroupCode: [-->
<!--          {-->
<!--            required: true,-->
<!--            message: 'Please input rule name',-->
<!--            trigger: 'blur',-->
<!--          }-->
<!--        ],-->
<!--        scriptCode: [-->
<!--          {-->
<!--            required: true,-->
<!--            message: 'Please input rule name',-->
<!--            trigger: 'blur',-->
<!--          }-->
<!--        ]-->
<!--    })-->

<!--    return{-->
<!--      rules-->
<!--    }-->
<!--  }-->
<!--}-->
<!--</script>-->

<!--<style scoped lang="scss">-->

<!--</style>-->
