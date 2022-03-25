<template>
  <div class="dotBadge" :style="{ background: props.color }"></div>
</template>

<script setup>
import { defineProps } from 'vue'

const props = defineProps({
  color: {
    type: String,
    default: 'red'
  }
})
</script>

<style lang="scss" scoped>
.dotBadge {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  display: inline-block;
  margin-right: 10px;
}
</style>
