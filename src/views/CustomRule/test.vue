<template>
  <VueForm v-model="formData" :schema="schema"> </VueForm>
</template>

<script setup>
import VueForm from "@lljj/vue3-form-element";

const formData = {};
const schema = {
  type: "object",
  required: ["userName", "age"],
  properties: {
    userName: {
      type: "string",
      title: "用户名",
      default: "Liu.Jun",
    },
    age: {
      type: "number",
      title: "年龄",
    },
  },
};
</script>
