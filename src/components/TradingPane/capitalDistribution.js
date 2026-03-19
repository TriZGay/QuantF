import { ref, watch } from "vue";
import { use } from "echarts/core";
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
} from "echarts/components";
import { PieChart } from "echarts/charts";
import { LabelLayout } from "echarts/features";
import { CanvasRenderer } from "echarts/renderers";

use([
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  PieChart,
  CanvasRenderer,
  LabelLayout,
]);

export function useCapitalDistribution(props) {
  const capitalDistributionOptions = ref({
    title: {
      text: "资金分布",
      subtext: "",
      left: "center",
    },
    tooltip: {
      trigger: "item",
    },
    series: [
      {
        name: "资金分布",
        type: "pie",
        radius: "50%",
        data: [],
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: "rgba(0, 0, 0, 0.5)",
          },
        },
      },
    ],
  });
  watch(
    () => props.capitalDistribution,
    (newVal) => {
      capitalDistributionOptions.value.title.subtext = newVal.updateTime;
      let pieData = [];
      pieData.push({
        name: "特大单流入",
        value: newVal.capitalInSuper,
        itemStyle: { color: "#D32F2F" },
      });
      pieData.push({
        name: "大单流入",
        value: newVal.capitalInBig,
        itemStyle: { color: "#E53935" },
      });
      pieData.push({
        name: "中单流入",
        value: newVal.capitalInMid,
        itemStyle: { color: "#EF5350" },
      });
      pieData.push({
        name: "小单流入",
        value: newVal.capitalInSmall,
        itemStyle: { color: "#F48FB1" },
      });
      pieData.push({
        name: "特大单流出",
        value: newVal.capitalOutSuper,
        itemStyle: { color: "#2E7D32" },
      });
      pieData.push({
        name: "大单流出",
        value: newVal.capitalOutBig,
        itemStyle: { color: "#388E3C" },
      });
      pieData.push({
        name: "中单流出",
        value: newVal.capitalOutMid,
        itemStyle: { color: "#4CAF50" },
      });
      pieData.push({
        name: "小单流出",
        value: newVal.capitalOutSmall,
        itemStyle: { color: "#81C784" },
      });
      capitalDistributionOptions.value.series[0].data = pieData;
    }
  );
  return {
    capitalDistributionOptions,
  };
}
