<script lang="ts" setup>
import SearchArea from "@/components/SearchArea/SearchArea.vue";
import { storeToRefs } from "pinia";
import { computed, reactive, ref } from "vue";
import { useAnalyzeMeta } from "@/stores/ana-meta";
import { useAnalyzeKline } from "@/stores/ana-k";
import * as dayjs from "dayjs";
import type { KLine, MaLines } from "@/api/analyze";
import { fetchMaData } from "@/api/analyze";
import { isAll200 } from "@/utils/web";
import { MA_TYPE, maTypeToCheckBoxOptions, rehabTypeToRadioOptions } from "@/api/code";

const analyzeMetaStores = useAnalyzeMeta();
const fetchCodes = analyzeMetaStores.requestMetaData;
const { metaCodes } = storeToRefs(analyzeMetaStores);

const analyzeKStores = useAnalyzeKline();
const fetchMethod = analyzeKStores.requestK;
const { kLoading } = storeToRefs(analyzeKStores);
const kLineOptions = ref({});

const fetchMa = fetchMaData;

const metaCodeMap = computed(() => {
  let map = {};
  metaCodes.value.forEach((item) => {
    map[item.code] = item.market + "+" + item.code;
  });
  return map;
});

const formState = reactive({
  code: {
    name: "标的物代码",
    type: "select",
    kv: metaCodeMap,
    bindValue: ""
  },
  rehabType: {
    name: "复权类型",
    type: "radio-group",
    radioOptions: rehabTypeToRadioOptions(),
    bindValue: "1"
  },
  range: {
    name: "时间范围",
    type: "datetime-range",
    bindValue: [dayjs(), dayjs().subtract(1, "minute")],
    ranges: {
      "大A交易时段": [dayjs().hour(9).minute(30).second(0), dayjs().hour(11).minute(30).second(0)]
    }
  },
  range2: {
    name: "时间范围",
    type: "datetime-range",
    bindValue: [dayjs(), dayjs().subtract(1, "minute")],
    ranges: {
      "大A交易时段": [dayjs().hour(13).minute(0).second(0), dayjs().hour(15).minute(0).second(0)]
    }
  },
  span: {
    name: "MA线跨度",
    type: "checkbox-group",
    checkboxOptions: maTypeToCheckBoxOptions(),
    bindValue: ["1"]
  }
});

function drawAnalyzePic(kLines: KLine[], maLines: MaLines[]) {
  let xAxisTime = [];
  let candelstickArray = [];
  let volumes = [];
  kLines.forEach((k, index) => {
    xAxisTime.push(k.datetime);
    candelstickArray.push([k.openPrice, k.closePrice, k.lowPrice, k.highPrice]);
    volumes.push([index, k.volume, k.openPrice > k.closePrice ? 1 : -1]);
  });
  kLineOptions.value = {
    xAxis: [{
      type: "category",
      data: xAxisTime,
      boundaryGap: false,
      axisLine: { onZero: false },
      splitLine: { show: false },
      axisPointer: {
        z: 100
      }
    }, {
      type: "category",
      data: xAxisTime,
      boundaryGap: false,
      gridIndex: 1,
      axisLine: { onZero: false },
      axisTick: { show: false },
      splitLine: { show: false },
      axisLabel: { show: false }
    }],
    yAxis: [{
      scale: true,
      splitArea: {
        show: true
      }
    }, {
      scale: true,
      gridIndex: 1,
      splitNumber: 2,
      axisLabel: { show: false },
      axisLine: { show: false },
      axisTick: { show: false },
      splitLine: { show: false }
    }],
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "cross"
      }
    },
    axisPointer: {
      link: [
        {
          xAxisIndex: "all"
        }
      ]

    },
    visualMap: {
      show: false,
      seriesIndex: 1,
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
    grid: [
      {
        height: "50%"
      },
      {
        top: "65%",
        height: "25%"
      }
    ],
    dataZoom: [
      {
        type: "inside",
        xAxisIndex: [0, 1],
        start: 0,
        end: 100
      },
      {
        show: true,
        type: "slider",
        xAxisIndex: [0, 1],
        top: "90%",
        start: 0,
        end: 100
      }
    ],
    series: [
      {
        name: formState.code.bindValue,
        type: "candlestick",
        data: candelstickArray
      },
      {
        name: "成交量",
        type: "bar",
        xAxisIndex: 1,
        yAxisIndex: 1,
        data: volumes
      },
      ...maLines.map(ma => {
        return {
          name: ma.name,
          type: "line",
          data: ma.data.map(value => value.maValue)
        };
      })
    ]
  };
}

function onFinish(values: any) {
  Promise.all([
    fetchMethod({
      rehabType: values.rehabType,
      granularity: 1,
      code: values.code,
      amStart: dayjs(values.range[0]).format("YYYY-MM-DD HH:mm:ss"),
      amEnd: dayjs(values.range[1]).format("YYYY-MM-DD HH:mm:ss"),
      pmStart: dayjs(values.range2[0]).format("YYYY-MM-DD HH:mm:ss"),
      pmEnd: dayjs(values.range2[1]).format("YYYY-MM-DD HH:mm:ss")
    }), ...formState.span.bindValue.map(s => fetchMa({
      rehabType: values.rehabType,
      granularity: 1,
      span: s,
      code: values.code,
      start: dayjs(values.range[0]).format("YYYY-MM-DD HH:mm:ss"),
      end: dayjs(values.range2[1]).format("YYYY-MM-DD HH:mm:ss")
    }))
  ]).then(allPromises => {
    let kPromises = [];
    let maPromises = [];
    allPromises.forEach(promise => {
      if (promise.config.url.includes("/ana/k/n")) {
        kPromises.push(promise);
      } else if (promise.config.url.includes("/ana/ma/n")) {
        maPromises.push(promise);
      }
    });
    if (isAll200(kPromises) && isAll200(maPromises)) {
      //todo 直接取数组第一个也许不妥当
      let kLines = kPromises[0].data;
      let maLines = maPromises.map(maPromise => {
        let requestJson = JSON.parse(maPromise.config.data);
        return {
          name: MA_TYPE[requestJson.span],
          data: maPromise.data
        };
      });
      drawAnalyzePic(kLines, maLines);
    }
    // if (kData.status === "fulfilled"
    //   && maData.status === "fulfilled") {
    //   let kLines = kData.value.data;
    //   let maLines = maData.value.data;
    //   drawAnalyzePic(kLines, maLines);
    // }
  });
}

fetchCodes({
  granularity: 1
});
</script>
<template>
  <SearchArea :form="formState" @onFinish="onFinish" />
  <v-chart style="height: 400px;" :loading="kLoading" :autoresize="true" :option="kLineOptions"></v-chart>
</template>
<style lang="less" scoped></style>
