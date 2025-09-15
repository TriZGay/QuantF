<script setup>
import { use, time } from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import { UniversalTransition } from "echarts/features";
import { LineChart, BarChart, CandlestickChart } from "echarts/charts";
import {
  MatrixComponent,
  GridComponent,
  TitleComponent,
  TooltipComponent,
  LegendComponent
} from "echarts/components";
import VChart, { THEME_KEY } from "vue-echarts";
import { ref, provide } from "vue";

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
  CandlestickChart
]);

provide(THEME_KEY, "dark");

let _idBase = 1;
const _mediaDefinitionList = [
  // {
  //   // When the canvas width is less than 500px,
  //   query: { maxWidth: 500 },
  //   matrix: {
  //     // Define column and rows
  //     x: { data: Array(1).fill(null) },
  //     y: { data: Array(10).fill(null) }
  //   },
  //   // Place sections into the matrix cell determined by the coords.
  //   // key: sectionId, value: coord.
  //   sectionCoordMap: {
  //     section_title_1: [0, 0],
  //     section_header_1: [0, [1, 2]],
  //     section_sidebar_1: [0, [3, 4]],
  //     section_main_content_area_1: [0, [5, 7]],
  //     section_footer_1: [0, [8, 9]]
  //   }
  // },
  {
    // The default (with no `query`)
    matrix: {
      // Define column and rows
      x: { data: Array(4).fill(null) },
      y: { data: Array(10).fill(null) }
    },
    sectionCoordMap: {
      order_book_area: [3, [0, 4]],
      depth_area: [3, [5, 9]],
      k_area: [
        [0, 2],
        [0, 5]
      ],
      indies_area: [
        [0, 2],
        [6, 7]
      ],
      volume: [
        [0, 2],
        [8, 9]
      ]
    }
  }
];

const _sectionDefinitionMap = {
  order_book_area: {
    option: {
      title: {
        coordinateSystem: "matrix",
        text: "Sidebar Section",
        textStyle: { fontSize: 14 },
        left: "center",
        top: 15
      },
      xAxis: {
        id: "sidebar_1",
        gridId: "sidebar_1",
        splitLine: { show: false },
        axisLabel: {
          hideOverlap: true
        }
      },
      yAxis: {
        type: "time",
        id: "sidebar_1",
        gridId: "sidebar_1",
        axisLabel: {
          hideOverlap: true
        }
      },
      grid: {
        id: "sidebar_1",
        coordinateSystem: "matrix",
        tooltip: {
          trigger: "axis"
        },
        top: 50,
        bottom: 30,
        left: 40,
        right: 30,
        outerBounds: {
          top: 30,
          left: 20,
          bottom: 20,
          right: 20
        }
      },
      series: {
        type: "bar",
        id: "sidebar_1",
        xAxisId: "sidebar_1",
        yAxisId: "sidebar_1",
        data: generateSingleSeriesData(10, true)
      }
    }
  },
  depth_area: {
    option: {
      title: {
        coordinateSystem: "matrix",
        text: "Sidebar Section",
        textStyle: { fontSize: 14 },
        left: "center",
        top: 15
      },
      xAxis: {
        id: "sidebar_2",
        gridId: "sidebar_2",
        splitLine: { show: false },
        axisLabel: {
          hideOverlap: true
        }
      },
      yAxis: {
        type: "time",
        id: "sidebar_2",
        gridId: "sidebar_2",
        axisLabel: {
          hideOverlap: true
        }
      },
      grid: {
        id: "sidebar_2",
        coordinateSystem: "matrix",
        tooltip: {
          trigger: "axis"
        },
        top: 50,
        bottom: 30,
        left: 40,
        right: 30,
        outerBounds: {
          top: 30,
          left: 20,
          bottom: 20,
          right: 20
        }
      },
      series: {
        type: "bar",
        id: "sidebar_2",
        xAxisId: "sidebar_2",
        yAxisId: "sidebar_2",
        data: generateSingleSeriesData(10, true)
      }
    }
  },
  k_area: {
    option: {
      xAxis: {
        type: "time",
        id: "main_content_area_1",
        gridId: "main_content_area_1"
      },
      yAxis: {
        id: "main_content_area_1",
        gridId: "main_content_area_1"
      },
      grid: {
        id: "main_content_area_1",
        coordinateSystem: "matrix",
        tooltip: {
          trigger: "axis"
        },
        top: 50,
        bottom: 10,
        left: 10,
        right: 10,
        outerBounds: {
          top: 30,
          left: 20,
          bottom: 20,
          right: 20
        }
      },
      series: {
        type: "line",
        id: "main_content_area_1",
        xAxisId: "main_content_area_1",
        yAxisId: "main_content_area_1",
        symbol: "none",
        data: generateSingleSeriesData(100, false)
      }
    }
  },
  indies_area: {
    option: {
      xAxis: {
        type: "time",
        id: "main_content_area_2",
        gridId: "main_content_area_2"
      },
      yAxis: {
        id: "main_content_area_2",
        gridId: "main_content_area_2"
      },
      grid: {
        id: "main_content_area_2",
        coordinateSystem: "matrix",
        tooltip: {
          trigger: "axis"
        },
        top: 50,
        bottom: 10,
        left: 10,
        right: 10,
        outerBounds: {
          top: 30,
          left: 20,
          bottom: 20,
          right: 20
        }
      },
      series: {
        type: "line",
        id: "main_content_area_2",
        xAxisId: "main_content_area_2",
        yAxisId: "main_content_area_2",
        symbol: "none",
        data: generateSingleSeriesData(100, false)
      }
    }
  },
  volume: {
    option: {
      title: {
        coordinateSystem: "matrix",
        text: "成交量(Volume)",
        textStyle: { fontSize: 12 },
        top: 0
      },
      xAxis: {
        type: "time",
        id: "footer_1",
        gridId: "footer_1"
      },
      yAxis: {
        id: "footer_1",
        gridId: "footer_1",
        splitNumber: 2,
        splitLine: { show: false }
      },
      grid: {
        id: "footer_1",
        coordinateSystem: "matrix",
        tooltip: {
          trigger: "axis"
        },
        top: 50,
        bottom: 10,
        left: 20,
        right: 20,
        outerBounds: {
          top: 30,
          left: 20,
          bottom: 20,
          right: 20
        }
      },
      series: {
        type: "bar",
        id: "footer_1",
        xAxisId: "footer_1",
        yAxisId: "footer_1",
        data: generateSingleSeriesData(10, false)
      }
    }
  }
};

const option = ref({
  // Use the matrix coordinate system to layout the charts and components.
  matrix: {
    x: { show: false, data: [] },
    y: { show: false, data: [] },
    body: {
      itemStyle: { borderColor: "red" }
    },
    backgroundStyle: { borderColor: "none" },
    top: 0,
    bottom: 0,
    left: 0,
    right: 0
  },
  tooltip: {}
});
assembleIntoEChartsOption(option.value, _sectionDefinitionMap, _mediaDefinitionList);

function assembleIntoEChartsOption(
  option,
  sectionDefinitionMap,
  mediaDefinitionList
) {
  option.media = mediaDefinitionList.map(({ query, matrix }) => {
    return { query, option: { matrix } };
  });
  Object.keys(sectionDefinitionMap).forEach((sectionId) => {
    const section = sectionDefinitionMap[sectionId];
    const optionIdMapWillSetCoord = {};
    Object.keys(section.option).forEach((componentMainType) => {
      option[componentMainType] = normalizeToArray(option[componentMainType]);
      normalizeToArray(section.option[componentMainType]).forEach(
        (component) => {
          component = ensureComponentId(
            component,
            sectionId,
            componentMainType
          );
          option[componentMainType].push(component);
          if (component.coordinateSystem === "matrix") {
            optionIdMapWillSetCoord[componentMainType] = normalizeToArray(
              optionIdMapWillSetCoord[componentMainType]
            );
            optionIdMapWillSetCoord[componentMainType].push(component.id);
          }
        }
      );
    });
    mediaDefinitionList.forEach(
      ({ query, matrix, sectionCoordMap }, mediaIdx) => {
        const optionInMedia = option.media[mediaIdx].option;
        const coord = sectionCoordMap[sectionId];
        if (!coord) {
          throw new Error(
            `Section with id "${sectionId}" not found in media definition index ${mediaIdx}.`
          );
        }
        Object.keys(optionIdMapWillSetCoord).forEach((componentMainType) => {
          optionIdMapWillSetCoord[componentMainType].forEach((id) => {
            optionInMedia[componentMainType] = normalizeToArray(
              optionInMedia[componentMainType]
            );
            optionInMedia[componentMainType].push({
              id: id,
              coord: coord
            });
          });
        });
      }
    );
  });
}

function ensureComponentId(component, sectionId, componentMainType) {
  if (component.id != null) {
    return component;
  }
  component = Object.assign({}, component);
  component.id = sectionId + "_" + componentMainType + "_" + _idBase++;
  return component;
}

function normalizeToArray(value) {
  return Array.isArray(value) ? value : value != null ? [value] : [];
}

function generateSingleSeriesData(dayCount, inverseXY) {
  const dayStart = new Date("2025-05-05T00:00:00.000Z"); // Monday
  const timeStart = dayStart.getTime();
  const sevenDay = 7 * 1000 * 3600 * 24;
  const seriesData = [];
  let lastVal = +(Math.random() * 300).toFixed(0);
  let turnCount = null;
  let sign = -1;
  for (let idx = 0; idx < dayCount; idx++) {
    if (turnCount == null || idx >= turnCount) {
      turnCount =
        idx + Math.round((dayCount / 4) * ((Math.random() - 0.5) * 0.1));
      sign = -sign;
    }
    const deltaMag = 50;
    const delta = +(
      Math.random() * deltaMag -
      deltaMag / 2 +
      (sign * deltaMag) / 3
    ).toFixed(0);
    const val = Math.max(0, (lastVal += delta));
    const xTime = timeStart + idx * sevenDay;
    const dataXVal = time.format(xTime, "{yyyy}-{MM}-{dd}");
    const item = [dataXVal, val];
    if (inverseXY) {
      item.reverse();
    }
    seriesData.push(item);
  }
  return seriesData;
}

const kdjToggle = ref(false);

function toggleKdj(checked) {
  if (checked) {
    option.value.matrix.body.itemStyle = { borderColor: "none" };
  } else {
    option.value.matrix.body.itemStyle = { borderColor: "red" };
  }

  // {
  //   matrix: {
  //     x: { show: false, data: [] },
  //     y: { show: false, data: [] },
  //     body: {
  //       itemStyle: { borderColor: "none" }
  //     },
  //     backgroundStyle: { borderColor: "none" },
  //     top: 0,
  //     bottom: 0,
  //     left: 0,
  //     right: 0
  //   },
  //   tooltip: {}
  // };
}

const props = defineProps({
  height: {
    type: Number,
    default: 600
  }
});


console.log(option.value);
</script>

<template>
  <div>
    <a-switch v-model:checked="kdjToggle" @change="toggleKdj" size="small" />
    <v-chart :autoresize="true" class="chart" :style="{height:height+'px'}" :option="option" />
  </div>
</template>

<style scoped lang="less">
.chart {
  width: 100%;
}
</style>
