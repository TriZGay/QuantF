import { watch } from "vue";
import { use } from "echarts/core";
import { LineChart } from "echarts/charts";

use([
  LineChart
]);

export function useMa(props, kOptions) {
  watch(() => props.ma, (newVal) => {
    if (typeof kOptions.value.series[1] !== "undefined") {
      kOptions.value.series[1].data = newVal.ma5;
    } else {
      kOptions.value.series[1] = {
        name: "MA5",
        type: "line",
        showSymbol: false,
        smooth: true,
        data: newVal.ma5
      };
    }
    if (typeof kOptions.value.series[2] !== "undefined") {
      kOptions.value.series[2].data = newVal.ma10;
    } else {
      kOptions.value.series[2] = {
        name: "MA10",
        type: "line",
        showSymbol: false,
        smooth: true,
        data: newVal.ma10
      };
    }
    if (typeof kOptions.value.series[3] !== "undefined") {
      kOptions.value.series[3].data = newVal.ma20;
    } else {
      kOptions.value.series[3] = {
        name: "MA20",
        type: "line",
        showSymbol: false,
        smooth: true,
        data: newVal.ma20
      };
    }
    if (typeof kOptions.value.series[4] !== "undefined") {
      kOptions.value.series[4].data = newVal.ma30;
    } else {
      kOptions.value.series[4] = {
        name: "MA30",
        type: "line",
        showSymbol: false,
        smooth: true,
        data: newVal.ma30
      };
    }
    if (typeof kOptions.value.series[5] !== "undefined") {
      kOptions.value.series[5].data = newVal.ma60;
    } else {
      kOptions.value.series[5] = {
        name: "MA60",
        type: "line",
        showSymbol: false,
        smooth: true,
        data: newVal.ma60
      };
    }
    if (typeof kOptions.value.series[6] !== "undefined") {
      kOptions.value.series[6].data = newVal.ma120;
    } else {
      kOptions.value.series[6] = {
        name: "MA120",
        type: "line",
        showSymbol: false,
        smooth: true,
        data: newVal.ma120
      };
    }
  }, { deep: true });
}
