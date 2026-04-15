<script setup lang="ts">
import { useAnalyzeStatistics } from "@/stores/ana-statistics";
import { storeToRefs } from "pinia";
import { onMounted, reactive, watch } from "vue";
import VChart from "vue-echarts";

import { use } from "echarts/core";
import { TitleComponent, VisualMapComponent } from "echarts/components";
import { TreemapChart } from "echarts/charts";
import { CanvasRenderer } from "echarts/renderers";

use([TitleComponent, TreemapChart, CanvasRenderer, VisualMapComponent]);

const { requestHeatmapByPlates } = useAnalyzeStatistics();
const { heatmapByPlates } = storeToRefs(useAnalyzeStatistics());
const props = defineProps({
  market: {
    type: Number,
    required: true,
  },
});

const raiseChartOption = reactive({
  title: {
    text: "",
    left: "left",
  },
  series: {
    roam: false,
    name: "涨幅",
    gap: 2,
    type: "treemap",
    breadcrumb: {
      show: false,
    },
    label: {
      show: true,
      formatter:"{b} +{c}%"
    },
    data: [],
    levels: [
      {
        colorMappingBy: "value",
        color: [
          "#FFEDE6",
          "#FFDBD0",
          "#FFC8B8",
          "#FFB4A0",
          "#FF9F88",
          "#FF8870",
          "#F86F59",
          "#F05640",
          "#E53E26",
          "#D81E06",
        ],
      },
    ],
  },
});

const reduceChartOption = reactive({
  title: {
    text: "",
    left: "left",
  },
  grid: {
    top: "20%",
  },
  label: {
    show: true,
    formatter:"{b} -{c}%"
  },
  series: {
    roam: false,
    name: "跌幅",
    gap: 2,
    type: "treemap",
    breadcrumb: {
      show: false,
    },
    data: [],
    levels: [
      {
        colorMappingBy: "value",
        color: [
          "#B4F8EE",
          "#A0F1DD",
          "#8CE9CC",
          "#78E0BB",
          "#64D6AA",
          "#50CB99",
          "#3CBF88",
          "#28B377",
          "#14A666",
          "#009955",
        ],
      },
    ],
  },
});

const drawRaisesChart = (raises: Array) => {
  if (props.market === 1) {
    raiseChartOption.title.text = "港股-涨幅TOP10-" + raises[0].updateTime;
  }
  raiseChartOption.series.data = raises.map((plate: any) => {
    return {
      name: plate.name,
      value: plate.priceChange,
    };
  });
};

const drawReduceChart = (reduces: Array) => {
  if (props.market === 1) {
    reduceChartOption.title.text = "港股-跌幅TOP10-" + reduces[0].updateTime;
  }
  reduceChartOption.series.data = reduces.map((plate: any) => {
    return {
      name: plate.name,
      value: Math.abs(plate.priceChange),
    };
  });
};

watch(heatmapByPlates, (data) => {
  drawRaisesChart(data.raises);
  drawReduceChart(data.reduces);
});

onMounted(() => {
  requestHeatmapByPlates(props.market);
});
</script>

<template>
  <a-row :gutter="32">
    <a-col :span="12">
      <v-chart
        :autoresize="true"
        class="heatmapChart"
        :option="raiseChartOption"
      />
    </a-col>
    <a-col :span="12">
      <v-chart
        :autoresize="true"
        class="heatmapChart"
        :option="reduceChartOption"
      />
    </a-col>
  </a-row>
</template>

<style scoped lang="less">
.heatmapChart {
  width: 100%;
  height: 400px;
}
</style>
