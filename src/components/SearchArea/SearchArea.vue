<script setup lang="ts">
//@ts-nocheck
import { ref } from "vue";
import { type FormInstance } from "ant-design-vue";

const expand = ref<boolean>(false);
const formRef = ref<FormInstance>();

interface FormState {
  [key: string]: FormStateValue;
}

interface FormStateValue {
  name: string,
  type: "select" | "input" | "datetime-range"
    | "radio-group" | "checkbox-group",
  kv?: any,
  bindValue: any
}

const formState = defineProps<{
  form?: FormState
}>();

const finishEmit = defineEmits<{
  (e: "onFinish", formValue: Object): void
}>();

function handleSearchFormState(values: any) {
  let queryForm: Object = {};
  Object.keys(values).forEach(key => {
    queryForm[key] = values[key].bindValue;
  });
  return queryForm;
}

function onFinish(values: any) {
  let queryForm = handleSearchFormState(values);
  finishEmit("onFinish", queryForm);
}
</script>
<template>
  <a-form ref="formRef" :model="formState.form" @finish="onFinish">
    <a-row type="flex" align="middle" justify="start"
           :gutter="24" :wrap="true">
      <template v-for="(value, key, index) in formState.form" :key="key">
        <a-col v-show="expand || index <= 6" :span="8">
          <a-form-item :name="key" :label="value.name">
            <template v-if="value.type === 'select'">
              <a-select v-model:value="value.bindValue">
                <a-select-option v-for="(option, index) in Object.keys(value.kv) " :value="option"
                                 :key="index">
                  {{ value.kv[option] }}
                </a-select-option>
              </a-select>
            </template>
            <template v-if="value.type === 'input'">
              <a-input v-model:value="value.bindValue" placeholder="请输入名称" allow-clear/>
            </template>
            <template v-if="value.type === 'datetime-range'">
              <a-range-picker v-model:value="value.bindValue"
                              :ranges="value.ranges"
                              show-time />
            </template>
            <template v-if="value.type==='radio-group'">
              <a-radio-group v-model:value="value.bindValue" :options="value.radioOptions" />
            </template>
            <template v-if="value.type==='checkbox-group'">
              <a-checkbox-group v-model:value="value.bindValue" :options="value.checkboxOptions" />
            </template>
          </a-form-item>
        </a-col>
      </template>
    </a-row>
    <a-row>
      <a-col :span="24" style="text-align:right">
        <a-button type="primary" html-type="submit">搜索</a-button>
        <a-button style="margin:0 8px" @click="() => formRef.resetFields()">清空</a-button>
        <a style="font-size:12px" @click="expand = !expand">
          <template v-if="expand">
            <UpOutlined />
          </template>
          <template v-else>
            <DownOutlined />
          </template>
          展开
        </a>
      </a-col>
    </a-row>
  </a-form>
</template>
<style lang="less" scoped></style>
