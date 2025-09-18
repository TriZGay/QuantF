import { ref, watch } from "vue";
import { connect, use } from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import { UniversalTransition } from "echarts/features";
import { BarChart } from "echarts/charts";
import {
  DataZoomComponent,
  GridComponent,
  TooltipComponent,
  VisualMapComponent
} from "echarts/components";

use([
  CanvasRenderer,
  TooltipComponent,
  GridComponent,
  UniversalTransition,
  BarChart,
  DataZoomComponent,
  VisualMapComponent
]);

export function useVolumes(props) {
  const volumeOptions = ref({
    xAxis: {
      type: "category",
      data: [],
      boundaryGap: false,
      axisLine: { onZero: false },
      axisTick: { show: false },
      splitLine: { show: true },
      axisLabel: { show: false }
    },
    yAxis: {
      scale: true,
      axisLabel: { show: false },
      axisLine: { show: false },
      axisTick: { show: false },
      splitLine: { show: true }
    },
    grid: {
      top: 0,
      left: 30,
      bottom: 10,
      right: 30
    },
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "cross"
      }
    },
    dataZoom: [
      {
        type: "inside",
        start: 95,
        end: 100
      }
    ],
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

  watch(() => props.volumes, (newVal) => {
    volumeOptions.value.xAxis.data = newVal.datetime;
    volumeOptions.value.series.data = newVal.value;
    connect("trading-pane");
  });
  return {
    volumeOptions
  };
}
