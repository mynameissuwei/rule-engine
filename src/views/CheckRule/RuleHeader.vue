<template>
  <div class="page-header">
    <div class="top-container">
      <div class="left">{{ leftText }}</div>
      <div class="right" v-if="showButton">
        <el-button type="primary" size="small">编辑</el-button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["leftText", "showButton"],
};
</script>

<style lang="scss" scoped>
.page-header {
  background: #fff;
  padding: 20px;
  .top-container {
    display: flex;
    justify-content: space-between;
    .left {
      font-size: 18px;
      font-weight: 500;
      color: #323233;
    }
  }
}
</style>
