<script lang="ts">
import { defineComponent } from "vue";
import { WEEK } from "@/components/CronPicker/constants";
import { formatterWeek, parserWeek } from "@/components/CronPicker/utils";

export default defineComponent({
  name: "InputNumber",
  props: {
    modelValue: [Number, String],
    range: {
      required: true,
      type: Array
    },
    fieldValue: String,
    locale: {
      type: String
    }
  },
  emits: ["update:modelValue", "change"],
  computed: {
    value: {
      get() {
        return this.modelValue;
      },
      set(value) {
        this.$emit("update:modelValue", value);
      }
    },
    formatter() {
      return (this.fieldValue === WEEK) ? ($event) => formatterWeek($event, this.locale) : null;
    },
    parser() {
      return (this.fieldValue === WEEK) ? ($event) => parserWeek($event, this.locale) : null;
    }
  },
  methods: {
    onChange(value) {
      this.$emit("change", value);
    }
  }
});
</script>

<template>
  <a-input-number
    v-model:value="value"
    :min="range[0]"
    :max="range[1]"
    :formatter="formatter"
    :parser="parser"
    size="small"
    @change="onChange"
  />
</template>

<style scoped lang="less">

</style>
