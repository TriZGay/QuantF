<script setup>
import { useValuationPlateStock } from "./api";
import { provide, ref, watch } from "vue";
import VChart, { THEME_KEY } from "vue-echarts";
import { use } from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import {
  DatasetComponent,
  TransformComponent,
  TitleComponent,
  TooltipComponent,
} from "echarts/components";
import { PieChart } from "echarts/charts";
import { LabelLayout } from "echarts/features";

use([
  DatasetComponent,
  TransformComponent,
  TitleComponent,
  TooltipComponent,
  PieChart,
  CanvasRenderer,
  LabelLayout,
]);

provide(THEME_KEY, "dark");

const { requestValuationPlateStockList, futuValuationPlateStockList } =
  useValuationPlateStock();

const valuations = ref([]);

const valuationOption = ref({
  dataset: {
    dimensions: [
      "name",
      "marketCap",
      "valuationPercentile",
      "valuationVal",
      "forwardValue",
    ],
    source: [],
  },
  title: [
    {
      subtext: "市值",
      left: "24%",
      top: "45%",
      textAlign: "center",
    },
    {
      subtext: "估值",
      left: "74%",
      top: "90%",
      textAlign: "center",
    },
    {
      subtext: "预测估值",
      left: "24%",
      top: "90%",
      textAlign: "center",
    },
    {
      subtext: "估值历史分位",
      left: "75%",
      top: "45%",
      textAlign: "center",
    },
  ],
  series: [
    {
      type: "pie",
      radius: 50,
      center: ["25%", "25%"],
      encode: {
        itemName: "name",
        value: "marketCap",
      },
    },
    {
      type: "pie",
      radius: 50,
      center: ["75%", "25%"],
      encode: {
        itemName: "name",
        value: "valuationPercentile",
      },
    },
    {
      type: "pie",
      radius: 50,
      center: ["75%", "75%"],
      encode: {
        itemName: "name",
        value: "valuationVal",
      },
    },
    {
      type: "pie",
      radius: 50,
      center: ["25%", "75%"],
      encode: {
        itemName: "name",
        value: "forwardValue",
      },
    },
  ],
});

const props = defineProps({
  market: {
    type: String,
    required: true,
  },
  code: {
    type: String,
    required: true,
  },
});

watch(
  () => props.code,
  (newVal) => {
    requestValuationPlateStockList(parseInt(props.market), newVal, 50);
    valuations.value = [];
  }
);

const drawPies = (pieData) => {
  let source = pieData.map((item) => {
    return [
      item.name,
      item.marketCap,
      item.valuationPercentile,
      item.valuationVal,
      item.forwardValue,
    ];
  });
  valuations.value = valuations.value.concat(source);
  valuationOption.value.dataset.source = valuations.value;
};

watch(
  () => futuValuationPlateStockList,
  (newVal) => {
    let nextKey = newVal.value.content.nextKey;
    drawPies(newVal.value.content.stockList);
  },
  {
    deep: true,
  }
);
</script>

<template>
  <div>
    NextKey :{{ futuValuationPlateStockList?.content?.nextKey}}
  </div>
  <div class="grid grid-cols-1 pt-8">
    <v-chart class="h-96" :autoresize="true" :option="valuationOption" />
  </div>
</template>

<style scoped lang="less"></style>
