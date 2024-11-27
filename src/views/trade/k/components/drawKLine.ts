import type { EChartsOption } from "echarts";
import { reactive, ref } from "vue";
import { parseRehabType } from "@/api/code";

export type RehabTypesWithOptions = {
  rehabType: number,
  options?: EChartsOption
}

export type RehabTypesWithData = {
  rehabType: number,
  updateTime: Set<string>,
  kArray: Array<Array<number>>
}

export function useDrawKLine() {
  const marketAndCodes = ref<{
    title: string,
    key: string,
    rehabTypesWithOptions: Array<RehabTypesWithOptions>, // {rehabType:0,options:{}}
    closable?: boolean
  }[]>([]);

  const dataMap = reactive<{
    key: string,
    rehabTypesWithData: Array<RehabTypesWithData>
  }[]>([]);

  function updateKLineData(key: string, rehabType: number,
                           updateTime: string, kArray: Array<number>) {
    let found = dataMap.find(val => val.key === key);
    if (typeof found !== "undefined") {
      let foundData = found.rehabTypesWithData.find(val => val.rehabType === rehabType);
      if (typeof foundData !== "undefined") {
        foundData.updateTime.add(updateTime);
        //与x轴对应的那一项的y轴值
        foundData.kArray[foundData.updateTime.size - 1] = kArray;
      } else {
        //初始化时把第一个数据放进去
        found.rehabTypesWithData.push({
          rehabType: rehabType,
          updateTime: new Set<string>().add(updateTime),
          kArray: [kArray]
        });
      }
    } else {
      dataMap.push({
        key: key,
        rehabTypesWithData: []
      });
    }
  }

  function updateKLineChart(key: string, rehabType: number,
                            updateTime: Array<string>, kArray: Array<Array<number>>) {
    let found = marketAndCodes.value.find(val => val.key === key);
    if (typeof found !== "undefined") {
      let foundOptions = found.rehabTypesWithOptions.find(val => val.rehabType === rehabType);
      if (typeof foundOptions !== "undefined") {
        foundOptions.options = {
          title: {
            text: key + ":" + parseRehabType(rehabType) + "K线图"
          },
          tooltip: {
            trigger: "axis",
            axisPointer: {
              type: "cross"
            }
          },
          legend: {
            show: false
          },
          xAxis: {
            type: "category",
            data: updateTime,
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
          series: [{
            name: key + ":" + parseRehabType(rehabType) + "K线图",
            type: "candlestick",
            data: kArray
          }]
        };
      } else {
        found.rehabTypesWithOptions.push({ rehabType: rehabType });
      }
    } else {
      marketAndCodes.value.push({
        title: key,
        key: key,
        rehabTypesWithOptions: [],
        closable: false
      });
    }
  }

  function getKLineData(key: string, rehabType: number): RehabTypesWithData | undefined {
    return dataMap.find(val => val.key === key)
      ?.rehabTypesWithData.find(val => val.rehabType === rehabType);
  }

  return {
    marketAndCodes,
    updateKLineChart,
    getKLineData,
    updateKLineData
  };
}
