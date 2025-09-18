import { ref, watch } from "vue";
import { connect, use } from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import { UniversalTransition } from "echarts/features";
import { CandlestickChart } from "echarts/charts";
import { DataZoomComponent, GridComponent, TooltipComponent } from "echarts/components";

use([
  CanvasRenderer,
  TooltipComponent,
  GridComponent,
  UniversalTransition,
  CandlestickChart,
  DataZoomComponent
]);

export function useK(props) {
  const kOptions = ref({
    xAxis: {
      type: "category",
      data: [],
      boundaryGap: false,
      axisLine: { onZero: false },
      splitLine: { show: true },
      axisPointer: {
        z: 100
      }
    },
    yAxis: {
      scale: true,
      splitArea: {
        show: true
      },
      axisLabel: {
        show: true
      }
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
    grid: {
      top: 30,
      left: 30,
      bottom: 20,
      right: 30
    },
    series: [{
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
    }]
  });

  watch(() => props.k, (newVal) => {
    kOptions.value.xAxis.data = newVal.datetime;
    kOptions.value.series[0].data = newVal.value;
    connect("trading-pane");
  });
  return { kOptions };
}
