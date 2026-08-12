<script setup>
import VChart, { THEME_KEY } from "vue-echarts";
import { provide } from "vue";

import { useK } from "./k";
import { useVolumes } from "./volumes";
import { useMa } from "./ma";
import { useCapitalDistribution } from "@/components/TradingPane/capitalDistribution";
import { useCapitalFlow } from "@/components/TradingPane/capitalFlow";

provide(THEME_KEY, "dark");

const props = defineProps({
  height: {
    type: Number,
    default: 600,
  },
  k: {
    type: Object,
    default: {
      datetime: [],
      value: [],
    },
  },
  volumes: {
    type: Object,
    default: {
      datetime: [],
      value: [],
    },
  },
  capitalFlow: {
    type: Object,
    default: {
      updateTime: "",
      contentList: [],
    },
  },
  capitalDistribution: {
    type: Object,
    default: {
      capitalInSuper: 0,
      capitalInBig: 0,
      capitalInMid: 0,
      capitalInSmall: 0,
      capitalOutSuper: 0,
      capitalOutBig: 0,
      capitalOutMid: 0,
      capitalOutSmall: 0,
      updateTime: "",
    },
  },
});

const { kOptions } = useK(props);
const { volumeOptions } = useVolumes(props);
const { capitalDistributionOptions } = useCapitalDistribution(props);
const { capitalFlowOptions } = useCapitalFlow(props);

useMa(props, kOptions);
</script>

<template>
  <div :style="{ height: height + 'px' }" class="trading-pane">
    <v-chart
      :autoresize="true"
      class="k-area"
      group="trading-pane"
      :option="kOptions"
    />
    <v-chart
      :autoresize="true"
      class="cap-flow-area"
      :option="capitalFlowOptions"
    />
    <v-chart
      :autoresize="true"
      class="volume-area"
      group="trading-pane"
      :option="volumeOptions"
    />
    <v-chart
      :autoresize="true"
      class="cap-distr-area"
      :option="capitalDistributionOptions"
    />
  </div>
</template>

<style scoped>
.trading-pane {
  @apply grid grid-cols-4 grid-rows-6;
}

.cap-flow-area {
  @apply col-span-2 row-span-3;
  background-color: #000c17;
}

.cap-distr-area {
  @apply col-start-4 col-end-6 row-start-4 row-end-7;
  background-color: #000c17;
}

.k-area {
  @apply col-span-3 row-span-4;
}

.volume-area {
  @apply col-span-3 row-span-2;
}
</style>
<style scoped lang="less"></style>
