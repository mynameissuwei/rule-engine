<template>
  <div class="vue-form-container">
    <VueForm
      ref="formRefDom"
      v-model="formData"
      :schema="schemaData"
      :formFooter="formFooter"
    >
    </VueForm>
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
import VueForm from "@lljj/vue3-form-element";

const schemaRef = reactive({
  schemaData: {},
  checkBoxData: [],
  formData: {},
});
const testValue = ref("");
const formRefDom = ref("");

const { schemaData, formData, checkBoxData } = toRefs(schemaRef);
const props = defineProps(["checkedForm"]);

defineExpose({
  formRefDom,
  schemaRef,
});

let typeObj = {
  STRING_EQUALS: "string",
  VALUE_CONTAIN: "array",
};

const formFooter = {
  show: false,
};

watch(
  () => props.checkedForm,
  (newVal, oldVal) => {
    checkBoxData.value = newVal;
    changeSchema(newVal);
  },
  {
    deep: true,
  }
);

onMounted(() => {
  changeSchema(props.checkedForm);
});

const changeSchema = (newVal) => {
  let obj = {};
  newVal.forEach((item) => {
    let enmObj = item.fieldEnum
      ? {
          uniqueItems: true,
          items: {
            type: "string",
            enum: item.fieldEnum.split(";"),
            enumNames: item.fieldEnum.split(";"),
          },
          "ui:widget": "SelectWidget",
          type: "array",
        }
      : {};
    obj[item.fieldCode] = {
      type: typeObj[item.calibratorType],
      title: item.fieldName,
      ...enmObj,
    };
  });
  // let mapRequired = newVal.map((item) => item.fieldCode);
  let properties = {
    type: "object",
    required: [],
    properties: obj,
  };

  console.log(properties, "propertiesproperties");
  schemaRef.schemaData = properties;
};
</script>

<style scoped>
.vue-form-container {
  margin-top: 20px;
}
</style>
