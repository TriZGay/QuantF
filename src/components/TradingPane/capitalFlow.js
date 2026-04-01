import { ref, watch } from "vue";
import { use } from "echarts/core";
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
} from "echarts/components";
import { BarChart } from "echarts/charts";
import { LabelLayout } from "echarts/features";
import { CanvasRenderer } from "echarts/renderers";

use([
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  BarChart,
  CanvasRenderer,
  LabelLayout,
]);
export function useCapitalFlow(props) {
  const capitalFlowOptions = ref({
    title: {
      text: "资金流向",
      subtext: "",
      left: "center",
    },
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "shadow",
      },
    },
    grid: {
      left: "3%",
      right: "4%",
      bottom: "3%",
      containLabel: true,
    },
    xAxis: {
      type: "category",
      data: [],
      axisTick: {
        alignWithLabel: true,
      },
    },
    yAxis: {
      type: "value",
    },
    series: [],
  });
  watch(
    () => props.capitalFlow,
    (newVal) => {
      capitalFlowOptions.value.xAxis.data = newVal.map((v) => v.time);
      let series = [];
      series.push({
        name: "整体净流入",
        type: "bar",
        barWidth: "60%",
        stack: "total",
        itemStyle: {
          color: (p) => {
            let { data } = p;
            return data > 0 ? "red" : "green";
          },
        },
        data: newVal.map((v) => v.inFlow),
      });
      series.push({
        name: "主力大单净流入",
        type: "bar",
        barWidth: "60%",
        stack: "total",
        itemStyle: {
          color: (p) => {
            let { data } = p;
            return data > 0 ? "#C41E3A" : "#1B5E20";
          },
        },
        data: newVal.map((v) => v.mainInFlow),
      });
      series.push({
        name: "特大单净流入",
        type: "bar",
        barWidth: "60%",
        stack: "total",
        itemStyle: {
          color: (p) => {
            let { data } = p;
            return data > 0 ? "#D32F2F" : "#2E7D32";
          },
        },
        data: newVal.map((v) => v.superInFlow),
      });
      series.push({
        name: "大单净流入",
        type: "bar",
        barWidth: "60%",
        stack: "total",
        itemStyle: {
          color: (p) => {
            let { data } = p;
            return data > 0 ? "#E53935" : "#388E3C";
          },
        },
        data: newVal.map((v) => v.bigInFlow),
      });
      series.push({
        name: "中单净流入",
        type: "bar",
        barWidth: "60%",
        stack: "total",
        itemStyle: {
          color: (p) => {
            let { data } = p;
            return data > 0 ? "#EF5350" : "#4CAF50";
          },
        },
        data: newVal.map((v) => v.midInFlow),
      });
      series.push({
        name: "小单净流入",
        type: "bar",
        barWidth: "60%",
        stack: "total",
        itemStyle: {
          color: (p) => {
            let { data } = p;
            return data > 0 ? "#F48FB1" : "#81C784";
          },
        },
        data: newVal.map((v) => v.smlInFlow),
      });
      capitalFlowOptions.value.series = series;
    }
  );
  return {
    capitalFlowOptions,
  };
}
