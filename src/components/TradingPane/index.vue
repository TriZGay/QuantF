<script setup>
import { use, connect } from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import { UniversalTransition } from "echarts/features";
import { LineChart, BarChart, CandlestickChart } from "echarts/charts";
import {
  MatrixComponent,
  GridComponent,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  VisualMapComponent
} from "echarts/components";
import VChart, { THEME_KEY } from "vue-echarts";
import { ref, provide, watch, watchEffect } from "vue";

use([
  CanvasRenderer,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  MatrixComponent,
  GridComponent,
  UniversalTransition,
  LineChart,
  BarChart,
  CandlestickChart,
  VisualMapComponent
]);

provide(THEME_KEY, "dark");

const volumeOptions = ref({
  xAxis: {
    type: "category",
    data: [],
    boundaryGap: false,
    axisLine: { onZero: false },
    axisTick: { show: false },
    splitLine: { show: false },
    axisLabel: { show: false }
  },
  yAxis: {
    scale: true,
    splitNumber: 2,
    axisLabel: { show: false },
    axisLine: { show: false },
    axisTick: { show: false },
    splitLine: { show: false }
  },
  grid: {},
  tooltip: {
    trigger: "axis",
    axisPointer: {
      type: "cross"
    }
  },
  visualMap: {
    show: false,
    dimension: 2,
    pieces: [
      {
        value: 1,
        color: "#00da3c"
      },
      {
        value: -1,
        color: "#ec0000"
      }
    ]
  },
  series: {
    name: "成交量",
    type: "bar",
    data: []
  }
});
const kOptions = ref({
  xAxis: {
    type: "category",
    data: [],
    boundaryGap: false,
    axisLine: { onZero: false },
    splitLine: { show: false },
    axisPointer: {
      z: 100
    }
  },
  yAxis: {
    scale: true,
    splitArea: {
      show: true
    }
  },
  tooltip: {
    trigger: "axis",
    axisPointer: {
      type: "cross"
    }
  },
  grid: {},
  series: {
    type: "candlestick",
    data: [],
    markPoint: {
      data: [
        {
          name: "highest value",
          type: "max",
          valueDim: "highest"
        }, {
          name: "lowest value",
          type: "min",
          valueDim: "lowest"
        }
      ]
    },
    markLine: {
      symbol: ["none", "none"],
      data: [
        [
          {
            name: "from lowest to highest",
            type: "min",
            valueDim: "lowest",
            symbol: "circle",
            symbolSize: 10,
            label: {
              show: false
            },
            emphasis: {
              label: {
                show: false
              }
            }
          },
          {
            type: "max",
            valueDim: "highest",
            symbol: "circle",
            symbolSize: 10,
            label: {
              show: false
            },
            emphasis: {
              label: {
                show: false
              }
            }
          }
        ]
      ]
    }
  }
});

const props = defineProps({
  height: {
    type: Number,
    default: 600
  },
  k: {
    type: Array,
    default: []
  },
  volumes: {
    type: Array,
    default: []
  }
});


watch(() => props.volumes, (newVal) => {
  let xAxisTime = [];
  let volumes = [];
  newVal.forEach((k, index) => {
    xAxisTime.push(k.datetime);
    volumes.push([index, k.volume, k.openPrice > k.closePrice ? 1 : -1]);
  });
  volumeOptions.value.xAxis.data = xAxisTime;
  volumeOptions.value.series.data = volumes;
  connect("trading-pane");
});

watch(() => props.k, (newVal) => {
  let xAxisTime = [];
  let candelstickArray = [];
  newVal.forEach((k, index) => {
    xAxisTime.push(k.datetime);
    candelstickArray.push([k.openPrice, k.closePrice, k.lowPrice, k.highPrice]);
  });
  kOptions.value.xAxis.data = xAxisTime;
  kOptions.value.series.data = candelstickArray;
  connect("trading-pane");
});

</script>

<template>
  <div :style="{height:height+'px'}">
    <v-chart :autoresize="true" class="k-area" group="trading-pane" :option="kOptions" />
    <v-chart :autoresize="true" class="volume-area" group="trading-pane" :option="volumeOptions" />
  </div>
</template>

<style scoped lang="less">
.k-area {
  height: 80%;
}

.volume-area {
  height: 20%;
}
</style>
