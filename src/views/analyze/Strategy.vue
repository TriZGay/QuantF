<script setup lang="ts">
import SearchArea from "@/components/SearchArea/SearchArea.vue";
import { computed, onMounted, reactive, ref } from "vue";
import { klTypeToSelectOptions, rehabTypeToRadioOptions } from "@/api/code";
import dayjs from "dayjs";
import { useAnalyzeMeta } from "@/stores/ana-meta";
import { storeToRefs } from "pinia";
import type { SelectProps } from "ant-design-vue";
import { useAnalyzeStrategy } from "@/stores/ana-strategy";

const analyzeMetaStores = useAnalyzeMeta();
const fetchCodes = analyzeMetaStores.requestMetaData;
const { metaCodes } = storeToRefs(analyzeMetaStores);

const analyzeStrategyStores = useAnalyzeStrategy();
const fetchBackTest = analyzeStrategyStores.addBackTest;

const metaCodeSelectOptions = computed(() => {
  let options: Array<SelectProps["options"]> = [];
  metaCodes.value.forEach((item) => {
    options.push({
      label: item.market + "+" + item.code,
      value: item.code
    });
  });
  return options;
});

const formState = reactive({
  code: {
    name: "标的物代码",
    type: "select",
    selectOptions: metaCodeSelectOptions,
    bindValue: ""
  },
  granularity: {
    name: "K线类型",
    type: "select",
    selectOptions: klTypeToSelectOptions(),
    bindValue: "1"
  },
  rehabType: {
    name: "复权类型",
    type: "radio-group",
    radioOptions: rehabTypeToRadioOptions(),
    bindValue: "1"
  },
  range: {
    name: "时间范围",
    type: "datetime-range",
    bindValue: [dayjs(), dayjs().subtract(1, "minute")],
    ranges: {
      "大A交易时段": [dayjs().hour(9).minute(30).second(0), dayjs().hour(15).minute(30).second(0)],
      "港股交易时段": [dayjs().hour(9).minute(30).second(0), dayjs().hour(16).minute(0).second(0)]
    }
  }
});

function onFinish(values: any) {
  fetchBackTest({
    rehabType: values.rehabType,
    granularity: values.granularity,
    code: values.code,
    start: dayjs(values.range[0]).format("YYYY-MM-DD HH:mm:ss"),
    end: dayjs(values.range[1]).format("YYYY-MM-DD HH:mm:ss")
  });
}

onMounted(() => {
  fetchCodes({
    granularity: 1
  });
});
</script>

<template>
  <SearchArea :form="formState" @onFinish="onFinish" />
</template>

<style scoped lang="less">

</style>
