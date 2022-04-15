<template>
  <div class="vue-form-container">
    <el-scrollbar height="450px" style="width: 380px">
      <el-form
        :model="formData"
        label-position="top"
        :rules="rules"
        ref="formRefDom"
      >
        <el-form-item
          :label="item['fieldName']"
          v-for="item in props.checkedForm"
          :prop="item['fieldCode']"
        >
          <el-input
            v-model="formData[item.fieldCode]"
            v-if="item.calibratorType === 'STRING_EQUALS'"
            style="width: 340px"
          />
          <el-select
            v-model="formData[item.fieldCode]"
            multiple
            v-if="item.calibratorType === 'VALUE_CONTAIN'"
            style="width: 340px"
          >
            <el-option
              v-for="every in item.fieldEnum.split(';')"
              :key="every"
              :label="every"
              :value="every"
            />
          </el-select>

          <el-date-picker
            v-model="formData[item.fieldCode]"
            v-if="item.calibratorType === 'DATE_RANGE'"
            type="datetimerange"
            range-separator="To"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
            style="width: 340px"
          />

          <el-row
            style="width: 340px"
            v-if="
              item.calibratorType === 'NUMBER_RANGE' ||
              item.calibratorType === 'DOUBLE_RANGE' ||
              item.calibratorType === 'INTEGER_RANGE'
            "
          >
            <el-col :span="11">
              <el-form-item :prop="item['fieldCode']">
                <el-input v-model.number="formData[item.fieldCode]" />
              </el-form-item>
            </el-col>
            <el-col :span="2" class="text-center">
              <span class="text-gray-500">-</span>
            </el-col>
            <el-col :span="11">
              <el-form-item :prop="item['fieldCode'] + '_second'">
                <el-input
                  v-model.number="formData[item.fieldCode + '_second']"
                />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form-item>
      </el-form>
    </el-scrollbar>
  </div>
</template>

<script setup>
import {
  defineProps,
  reactive,
  watch,
  ref,
  onMounted,
  toRefs,
  defineExpose,
} from "vue";

const formRefDom = ref("");

const props = defineProps(["checkedForm", "formData", "rules"]);
const { formData } = toRefs(props);

defineExpose({
  formRefDom,
});

onMounted(() => {});
</script>

<style scoped>
.vue-form-container {
  margin-top: 20px;
}
.text-gray-500 {
  margin-left: 10px;
}
</style>
