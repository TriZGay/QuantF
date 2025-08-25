<script setup lang="ts">
import LwChartWrapper from "@/components/FinanceChart/LwChartWrapper.vue";
import { ref, defineProps } from "vue";
import { TickMarkType, type Time } from "lightweight-charts";

interface CandleStickItem {
  open: Number,
  close: Number,
  high: Number,
  low: Number,
  time: String
}

const props = defineProps({
  candleStickData: {
    type: Array<CandleStickItem>,
    required: true
  }
});

const chartOptions = ref({
  layout: {
    background: { color: "#222" },
    textColor: "#DDD"
  },
  grid: {
    vertLines: { color: "#444" },
    horzLines: { color: "#444" }
  },
  timeScale: {
    tickMarkFormatter: (time: Time, tickMarkType: TickMarkType, locale: string) => {
      console.log(time, tickMarkType);
      if (tickMarkType === TickMarkType.Month) {
        return new Date(time * 1000).toLocaleString(locale, { month: "short", year: "numeric" });
      } else if (tickMarkType === TickMarkType.Day) {
        return new Date(time * 1000).toLocaleString(locale, { day: "numeric", month: "short" });
      }
      return new Date(time * 1000).toLocaleString(locale);
    }
  }
});

const chartType = ref("candlestick");
const seriesOptions = ref({
  wickUpColor: "rgb(54, 116, 217)",
  upColor: "rgb(54, 116, 217)",
  wickDownColor: "rgb(225, 50, 85)",
  downColor: "rgb(225, 50, 85)",
  borderVisible: false
});
</script>

<template>
  <div class="chart-container">
    <LwChartWrapper
      :type="chartType"
      :data="candleStickData"
      :autosize="true"
      :chart-options="chartOptions"
      :series-options="seriesOptions"
      ref="lwChart"
    />
  </div>
</template>

<style scoped lang="less">
.chart-container {
  height: 100%;
}
</style>
