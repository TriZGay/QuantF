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

const heatmapChartOption = reactive({
  title: {
    text: "",
    left: "left",
    subtext: "",
  },
  series: {
    roam: false,
    name: "涨跌幅",
    gap: 2,
    type: "treemap",
    breadcrumb: {
      show: false
    },
    data: [],
  },
});

watch(heatmapByPlates, (data) => {
  if (props.market === 1) {
    heatmapChartOption.title.text = "港股";
  }
  heatmapChartOption.title.subtext = data[0].updateTime;
  heatmapChartOption.series.data = data.map((plate: any) => {
    return {
      name: plate.name,
      value: plate.priceChange,
      itemStyle: {
        color: plate.priceChange > 0 ? "#ff4d4f" : "#00b42a", // 红 / 绿
      },
    };
  });
});

onMounted(() => {
  requestHeatmapByPlates(props.market);
});
</script>

<template>
  <div>
    <v-chart
      :autoresize="true"
      class="heatmapChart"
      :option="heatmapChartOption"
    />
  </div>
</template>

<style scoped lang="less">
.heatmapChart {
  width: 100%;
  height: 400px;
}
</style>
