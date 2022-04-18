<template>
  <el-dialog
    v-model="props.visible"
    title="测试规则"
    width="1200px"
    :before-close="props.handleCancel"
  >
    <div class="json-editor">
      <el-row :gutter="10">
        <el-col :span="12">
          <textarea ref="myLeftRef" />
        </el-col>
        <el-col :span="12">
          <textarea ref="myRightRef" />
        </el-col>
      </el-row>
    </div>
    <div class="dialog-footer" style="margin-right: 20px">
      <el-button
        type="primary"
        @click="onSubmit"
        v-loading="buttonLoading"
        size="small"
        >测试</el-button
      >
      <el-button @click="reset" size="small">重置</el-button>
      <el-button @click="props.handleCancel" size="small">取消</el-button>
    </div>
  </el-dialog>
</template>

<script setup>
import CodeMirror from "codemirror";
import "codemirror/addon/lint/lint.css";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/idea.css";
import "codemirror/theme/material-palenight.css";
import "codemirror/mode/javascript/javascript";

import {
  defineProps,
  onMounted,
  ref,
  nextTick,
  defineEmits,
  onUnmounted,
  watch,
} from "vue";

const props = defineProps([
  "visible",
  "handleCancel",
  "changeLeftEditor",
  "changeRightEditor",
]);
const emit = defineEmits(["change", "input"]);
const buttonLoading = ref(false);

const myLeftRef = ref(null);
const myRightRef = ref(null);

const leftContentRef = ref("");
const rightContentRef = ref("");

var leftEditor = {};
var rightEditor = {};

const getData = async () => {
  const data = await props.changeLeftEditor();
  leftContentRef.value = data;
};

watch(
  () => rightContentRef.value,
  async (value) => {
    await nextTick();
    const oldValue = rightEditor.getValue();
    if (value !== oldValue) {
      rightEditor.setValue(value ? JSON.stringify(value, null, 2) : "");
    }
  },
  { flush: "post" }
);

watch(
  () => leftContentRef.value,
  async (value) => {
    await nextTick();
    const oldValue = leftEditor.getValue();
    if (value !== oldValue) {
      leftEditor.setValue(value ? JSON.stringify(value, null, 2) : "");
    }
  },
  { flush: "post" }
);

const initEditor = (editor, refDom, contentRef) => {
  if (editor === "left") {
    leftEditor = CodeMirror.fromTextArea(refDom, {
      lineNumbers: true,
      mode: "application/json",
      gutters: ["CodeMirror-lint-markers"],
      theme: "material-palenight",
      lint: true,
    });
    leftEditor.setValue(contentRef.value);
    leftEditor.on("change", () => {
      contentRef.value = leftEditor.getValue();
      emit("change", leftEditor.getValue());
      emit("input", leftEditor.getValue());
    });
  } else {
    rightEditor = CodeMirror.fromTextArea(refDom, {
      lineNumbers: true,
      mode: "application/json",
      gutters: ["CodeMirror-lint-markers"],
      theme: "material-palenight",
      lint: true,
    });
    rightEditor.setValue(contentRef.value);
    rightEditor.on("change", () => {
      contentRef.value = rightEditor.getValue();

      emit("change", rightEditor.getValue());
      emit("input", rightEditor.getValue());
    });
  }
};
const onSubmit = async () => {
  buttonLoading.value = true;
  const data = await props.changeRightEditor(JSON.parse(leftContentRef.value));
  rightContentRef.value = data;
  buttonLoading.value = false;
};

const reset = async () => {
  await getData();
  rightContentRef.value = null;
};

onMounted(async () => {
  await nextTick();
  initEditor("left", myLeftRef.value, leftContentRef);
  initEditor("right", myRightRef.value, rightContentRef);
  await getData();
});

onUnmounted(() => {
  leftEditor = null;
  rightEditor = null;
});
</script>

<style lang="scss" scoped>
.dialog-footer {
  text-align: right;
}
.json-editor {
  height: 600px;
  position: relative;

  ::v-deep {
    .CodeMirror {
      height: auto;
      min-height: 570px;
    }

    .CodeMirror-scroll {
      min-height: 570px;
    }

    .cm-s-rubyblue span.cm-string {
      color: #f08047;
    }
  }
}
</style>
