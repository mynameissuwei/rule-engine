<template>
  <div>
    <rule-header
      :leftText="id ? '编辑校验规则' : '新建校验规则'"
      :showButton="id ? true : false"
    />
    <div class="container">
      <div class="form-box">
        <el-form ref="formRef" :rules="rules" :model="form" label-width="120px">
          <el-form-item label="规则名称:" prop="name">
            <el-input
              v-model="form.name"
              placeholder="可使用中英文、数字组合"
            ></el-input>
            <el-tooltip
              class="item"
              content="支持中英文、数字组合"
              effect="light"
              placement="top"
            >
              <el-icon><question-filled /></el-icon>
            </el-tooltip>
          </el-form-item>
          <el-form-item label="规则代码:" prop="region">
            <el-input
              v-model="form.region"
              placeholder="可使用中英文、数字组合"
            ></el-input>
            <el-tooltip
              class="item"
              effect="light"
              content="支持中英文、数字组合"
              placement="top"
            >
              <el-icon><question-filled /></el-icon>
            </el-tooltip>
            <span style="margin-left: 10px" class="action-class">
              随机生成
            </span>
          </el-form-item>
          <el-form-item label="使用场景描述:" prop="region">
            <el-input v-model="form.region" placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item label="选择字段" prop="region">
            <div>
              <div
                type="primary"
                size="small"
                @click="handleFieldCreate"
                class="gray-button"
              >
                + 添加校验字段
              </div>
              <div class="rule-tag">
                <div v-for="(tag, index) in tags" style="display: inline">
                  <el-tag :key="tag.name" closable v-if="index <= 13">
                    {{ tag.name }}
                  </el-tag>
                  <span
                    v-if="index == 14"
                    class="action-class"
                    style="margin-left: 20px"
                  >
                    <span style="margin-right: 3px">查看全部</span>
                    <span>({{ index }})</span></span
                  >
                </div>
              </div>
            </div>
          </el-form-item>
          <el-form-item label="选择校验规则" prop="region">
            <div
              type="primary"
              size="small"
              @click="handleRuleCreate"
              class="gray-button"
            >
              + 添加校验规则
            </div>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <el-footer class="footerContainer">
      <el-button-group>
        <el-button type="primary" size="small" @click="onSubmit"
          >完成</el-button
        >
        <el-button
          class="center"
          size="small"
          style="margin: 0px 20px"
          @click="onCancel"
          >取消</el-button
        >
        <el-button size="small">测试</el-button>
      </el-button-group>
    </el-footer>
    <el-dialog v-model="fieldVisible" title="添加校验字段" width="800px">
      <div class="container">
        <div class="left-container">
          <el-input v-model="input4" placeholder="关键字搜索">
            <template #prefix>
              <el-icon style="vertical-align: middle">
                <search />
              </el-icon>
            </template>
          </el-input>
          <div style="margin-top: 30px">
            <el-tree
              :data="data"
              :props="defaultProps"
              show-checkbox
              class="field-dialog"
            />
          </div>
        </div>
        <div class="right-container">
          <el-input
            v-model="input4"
            placeholder="关键字搜索"
            style="margin-left: 24px"
          >
            <template #prefix>
              <el-icon class="el-input__icon"><search /></el-icon>
            </template>
          </el-input>
          <div class="checkBox-container">
            <el-checkbox
              v-model="checkAll"
              :indeterminate="isIndeterminate"
              @change="handleCheckAllChange"
              >Check all</el-checkbox
            >
            <el-checkbox-group
              v-model="checkedCities"
              @change="handleCheckedCitiesChange"
            >
              <el-checkbox v-for="city in cities" :key="city" :label="city">{{
                city
              }}</el-checkbox>
            </el-checkbox-group>
          </div>
        </div>
      </div>
      <div class="dialog-footer" style="margin-right: 20px">
        <el-checkbox
          v-model="checked1"
          label="只看已选数据"
          style="float: left; margin-left: 10px"
        ></el-checkbox>

        <el-button type="primary" @click="onSubmitRule" size="small"
          >确定</el-button
        >
        <el-button @click="fieldVisible = false" size="small">取 消</el-button>
      </div>
    </el-dialog>
    <el-dialog
      v-model="ruleVisible"
      title="添加校验规则"
      width="50%"
      :before-close="handleClose"
    >
      <el-checkbox-group
        v-model="checkList"
        style="margin-left: 149px"
        class="rule-dialog"
      >
        <el-checkbox label="字段必填校验" />
        <el-checkbox label="字段长度校验" />
        <el-checkbox label="正则表达式校验" />
        <el-checkbox label="日期时段校验" />
        <el-checkbox label="数字校验" />
      </el-checkbox-group>
      <div class="dialog-footer">
        <el-button type="primary" @click="onSubmitRule" size="small"
          >确定</el-button
        >
        <el-button @click="ruleVisible = false" size="small">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { reactive, ref, toRefs, nextTick, onBeforeMount } from "vue";
import PageHeader from "comps/PageHeader.vue";
import RuleHeader from "./RuleHeader.vue";
import { QuestionFilled } from "@element-plus/icons-vue";
// import { defaultArticleModel } from "apis/checkRule";
import { cloneDeep } from "lodash";
import { useRouter } from "vue-router";

export default {
  components: { PageHeader, QuestionFilled, RuleHeader },
  setup() {
    const router = useRouter();
    const rules = {
      name: [{ required: true, message: "请输入规则名称", trigger: "blur" }],
      region: [{ required: true, message: "请输入规则名称", trigger: "blur" }],
    };
    const formFieldRef = ref(null);
    const formRuleRef = ref(null);
    const dataMap = reactive({
      name: "",
      region: "",
      checkList: ["selected and disabled", "Option A"],
      form: [],
      id: router.currentRoute.value.params.id,
      ruleVisible: false,
      fieldVisible: false,
      fieldStatus: "",
      textMap: {
        update: "Edit",
        create: "Create",
      },
      cities: ["Shanghai", "Beijing", "Guangzhou", "Shenzhen"],
      checkAll: false,
      checkedCities: ["Shanghai", "Beijing"],
      isIndeterminate: true,
      handleCheckAllChange(val) {
        dataMap.checkedCities = val ? cities : [];
        dataMap.isIndeterminate = false;
      },
      handleCheckedCitiesChange(value) {
        const checkedCount = value.length;
        dataMap.checkAll = checkedCount === dataMap.cities.length;
        dataMap.isIndeterminate =
          checkedCount > 0 && checkedCount < dataMap.cities.length;
      },
      tags: [
        { name: "Tag 1", type: "" },
        { name: "Tag 2", type: "success" },
        { name: "Tag 3", type: "info" },
        { name: "Tag 4", type: "warning" },
        { name: "Tag 5", type: "danger" },
        { name: "Tag 5", type: "danger" },
        { name: "Tag 5", type: "danger" },
        { name: "Tag 5", type: "danger" },
        { name: "Tag 5", type: "danger" },
        { name: "Tag 5", type: "danger" },
        { name: "Tag 5", type: "danger" },
        { name: "Tag 5", type: "danger" },
        { name: "Tag 5", type: "danger" },
        { name: "Tag 5", type: "danger" },
        { name: "Tag 5", type: "danger" },
        { name: "Tag 5", type: "danger" },
        { name: "Tag 5", type: "danger" },
      ],
      data: [
        {
          id: 1,
          label: "Level one 1",
          children: [
            {
              id: 3,
              label: "Level two 2-1",
              children: [
                {
                  id: 4,
                  label: "Level three 3-1-1",
                },
                {
                  id: 5,
                  label: "Level three 3-1-2",
                  disabled: true,
                },
              ],
            },
            {
              id: 2,
              label: "Level two 2-2",
              disabled: true,
              children: [
                {
                  id: 6,
                  label: "Level three 3-2-1",
                },
                {
                  id: 7,
                  label: "Level three 3-2-2",
                  disabled: true,
                },
              ],
            },
          ],
        },
      ],
      defaultProps: {
        children: "children",
        label: "label",
        disabled: "disabled",
      },
      resetForm() {
        dataMap.form = cloneDeep([]);
      },
      handleFieldCreate() {
        console.log("添加了");
        dataMap.resetForm();
        dataMap.fieldStatus = "create";
        dataMap.fieldVisible = true;
        nextTick(() => {
          formFieldRef.value.clearValidate();
        });
      },
      handleRuleCreate() {
        dataMap.resetForm();
        dataMap.ruleVisible = true;
        nextTick(() => {
          formRuleRef.value.clearValidate();
        });
      },
      onSubmitRule() {
        console.log("onSubmitRule");
      },
      onCancel() {
        router.push({
          name: "home",
          params: { id: undefined },
        });
      },
    });
    onBeforeMount(() => {
      if (dataMap.id) {
        console.log("hasId");
      } else {
        console.log("nodeITd");
      }
    });

    return {
      ...toRefs(dataMap),
      formFieldRef,
    };
  },
};
</script>

<style lang="scss" scoped>
.container {
  display: flex;
  .el-input {
    width: 320px;
  }
  .left-container {
    flex: 1;
    border-right: 1px solid #ebecf0;
  }
  .right-container {
    flex: 1;
    .checkBox-container {
      margin-left: 34px;
      margin-top: 34px;
    }
    ::v-deep {
      .el-checkbox {
        display: block !important;
      }
    }
  }
}
.form-box {
  padding: 10px;
  .el-input {
    width: 400px;
    margin-right: 10px;
  }
}
.dialog-footer {
  text-align: right;
}
.rule-dialog {
  ::v-deep {
    .el-checkbox {
      display: block !important;
    }
  }
}
.field-dialog {
  ::v-deep {
    .el-checkbox {
      margin-bottom: 0px;
    }
  }
}
::v-deep {
  .el-form-item__label {
    margin-right: 20px;
  }
  .el-tag {
    width: 161px;
    background: #f2f3f5;
    border-radius: 2px;
    border: 1px solid rgba(200, 201, 204, 0.4);
    margin-left: 9px;
    margin-top: 12px;
  }
}
.rule-tag {
  width: 873px;
  height: 140px;
  background: #fbfbfc;
  border-radius: 2px;
  border: 1px solid #c8c9cc;
  margin-top: 9px;
}
</style>
